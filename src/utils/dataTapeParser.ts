import * as XLSX from 'xlsx';

export interface DataTapeRow {
  fullPropertyAddress?: string;
  countyName?: string;
  structureType?: string;
  condo?: string;
  legalNonConforming?: string;
  borrowersCreditScore?: number;
  purposeOfLoan?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  rehabCosts?: number;
  currentMarketValue?: number;
  existingMortgageBalance?: number;
  currentMortgageRate?: number;
  currentOccupancyStatus?: string;
  marketRent?: string;
  currentLeaseAmount?: string;
  annualPropertyTaxes?: number;
  annualHazardInsurance?: number;
  annualFloodInsurance?: number;
  annualHOAFees?: number;
  annualHomeOwnersAssociation?: number;
  currentCondition?: string;
  strategyForProperty?: string;
  entityName?: string;
  notes?: string;
}

export interface ParsedDataTape {
  loanPurpose: string;
  creditScore: number;
  numberOfProperties: number;
  properties: any[];
}

// Column mapping for different possible header names
const columnMappings: Record<string, string[]> = {
  fullPropertyAddress: ['Full Property Address', 'Address', 'Property Address'],
  countyName: ['County Name', 'County'],
  structureType: ['Structure Type', 'Property Type', 'Type'],
  condo: ['Condo'],
  legalNonConforming: ['Legal Non-Conforming?', 'Legal Non-Conforming', 'Non-Conforming'],
  borrowersCreditScore: ["Borrower's Credit Score", 'Credit Score', 'FICO Score', 'FICO'],
  purposeOfLoan: ['Purpose of the Loan', 'Loan Purpose', 'Purpose', 'Purpose of Loan'],
  purchaseDate: ['Purchase Date', 'Date Purchased', 'Purchase_Date'],
  purchasePrice: ['Purchase Price'],
  rehabCosts: ['Rehab Costs'],
  currentMarketValue: ['Current Market Value', 'Market Value', 'Current Value'],
  existingMortgageBalance: ['Existing Mortgage Balance', 'Mortgage Balance'],
  currentMortgageRate: ['Current Mortgage Rate', 'Mortgage Rate'],
  currentOccupancyStatus: ['Current Occupancy Status', 'Occupancy Status', 'Occupancy'],
  marketRent: ['Market Rent'],
  currentLeaseAmount: ['Current Lease Amount', 'Lease Amount'],
  annualPropertyTaxes: ['Annual Property Taxes', 'Property Taxes'],
  annualHazardInsurance: ['Annual Hazard Insurance Premium', 'Annual Hazard  Insurance Premium', 'Hazard Insurance', 'Insurance', 'Annual Insurance'],
  annualFloodInsurance: ['Annual Flood Insurance Premium', 'Flood Insurance', 'Annual Flood'],
  annualHOAFees: [
    'Annual Home Owner\'s Association Fees', 
    "Annual Home Owner's Association Fees",
    'Annual Home Owners Association Fees',
      'annual home owners association fees',
    'Annual Homeowners Association Fees',
    'Annual HOA Fees',
    'Home Owner\'s Association Fees',
    "Home Owner's Association Fees",
    'Homeowners Association Fees',
    'HOA Fees', 
    'HOA', 
    'Association Fees',
    'Home Owners Association'
  ],
  currentCondition: ['Current Condition', 'Condition'],
  strategyForProperty: ['Strategy for Property', 'Strategy'],
  entityName: ['Entity Name', 'Entity'],
  notes: ['Notes']
};

function normalizeHeaderName(s: any): string {
  if (s === null || s === undefined) return '';
  return s
    .toString()
    .replace(/\u00A0/g, ' ') // replace non-breaking spaces
    .toLowerCase()
    .replace(/'/g, '') // remove apostrophes
    .replace(/'/g, '') // remove curly apostrophes  
    .replace(/['']/g, '') // remove various apostrophe types
    .replace(/\s+/g, ' ') // collapse multiple spaces
    .replace(/[^a-z0-9 ]+/g, ' ') // normalize punctuation
    .replace(/\s+/g, ' ')
    .trim();
}

function findColumnIndex(headers: string[], fieldMappings: string[]): number {
  console.log('Finding column for mappings:', fieldMappings);
  console.log('Available headers:', headers);
  
  const normalizedHeaders = headers.map(h => normalizeHeaderName(h));
  console.log('Normalized headers:', normalizedHeaders);
  
  for (const mapping of fieldMappings) {
    const nm = normalizeHeaderName(mapping);
    console.log('Trying to match:', mapping, '→', nm);
    
    // exact match first
    let index = normalizedHeaders.findIndex(h => h === nm);
    if (index !== -1) {
      console.log('Exact match found at index', index, 'for', mapping);
      return index;
    }
    
    // more flexible contains match - try both directions
    index = normalizedHeaders.findIndex(h => {
      const containsMatch = h.includes(nm) || nm.includes(h);
      if (containsMatch) {
        console.log('Contains match found:', h, 'contains/contained by', nm);
      }
      return containsMatch;
    });
    if (index !== -1) {
      console.log('Contains match found at index', index, 'for', mapping);
      return index;
    }
  }
  console.log('No match found for mappings:', fieldMappings);
  return -1;
}

function cleanNumericValue(value: any): number | undefined {
  if (value === null || value === undefined || value === '') return undefined;
  
  // Convert to string and clean
  const cleanValue = value.toString()
    .replace(/[$,]/g, '') // Remove dollar signs and commas
    .replace(/%/g, '') // Remove percentage signs
    .trim();
  
  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? undefined : parsed;
}

function cleanStringValue(value: any): string {
  if (value === null || value === undefined) return '';
  return value.toString().trim();
}

function excelSerialToISODate(serial: number): string {
  if (typeof serial !== 'number' || !isFinite(serial)) return '';
  const ms = Math.round((serial - 25569) * 86400 * 1000); // Excel epoch offset
  const date = new Date(ms);
  if (isNaN(date.getTime())) return '';
  // Normalize to UTC date-only string
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
    .toISOString()
    .split('T')[0];
}

function formatDateForInput(value: any): string {
  if (value === null || value === undefined || value === '') return '';

  // Handle Date objects directly
  if (value instanceof Date && !isNaN(value.getTime())) {
    return value.toISOString().split('T')[0];
  }

  // Handle Excel serial numbers
  if (typeof value === 'number') {
    return excelSerialToISODate(value);
  }

  const raw = value.toString().trim();

  // If it's a numeric string, try as Excel serial
  if (/^-?\d+(?:\.\d+)?$/.test(raw)) {
    const num = parseFloat(raw);
    const iso = excelSerialToISODate(num);
    if (iso) return iso;
  }

  // Handle formats like "1/1/14", "5/15/13", "12/31/2019"
  const slashMatch = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (slashMatch) {
    const [, m, d, y] = slashMatch;
    const yy = y.length === 2 ? (parseInt(y) <= 30 ? `20${y}` : `19${y}`) : y;
    const mm = m.padStart(2, '0');
    const dd = d.padStart(2, '0');
    return `${yy}-${mm}-${dd}`;
  }

  // Fallback: let Date try to parse
  const d2 = new Date(raw);
  if (!isNaN(d2.getTime())) {
    return d2.toISOString().split('T')[0];
  }

  return '';
}

function mapYesNoValue(value: any): string {
  if (value === null || value === undefined || value === '') return '';
  const str = value.toString().toLowerCase().trim();
  if (str === 'yes' || str === 'true' || str === '1') return 'Yes';
  if (str === 'no' || str === 'false' || str === '0') return 'No';
  return '';
}

function mapCondoValue(value: any): string {
  if (value === null || value === undefined || value === '') return '';
  const str = value.toString().toLowerCase().trim();
  if (str === 'yes' || str === 'true' || str === '1' || str === 'warrantable') return 'Yes';
  if (str === 'no' || str === 'false' || str === '0' || str === 'non-warrantable') return 'No';
  return '';
}

function mapLoanPurposeValue(value: any): string {
  if (value === null || value === undefined || value === '') return '';
  const str = value.toString().toLowerCase().trim();
  if (str.includes('purchase')) return 'Purchase';
  if (str.includes('refinance') || str.includes('refi')) return 'Refinance';
  if (str.includes('cash-out') || str.includes('cashout')) return 'Cash-Out';
  return str; // Return as-is if no clear mapping
}

export function parseDataTapeFile(file: File): Promise<ParsedDataTape> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        let workbook: XLSX.WorkBook;
        
        // Determine file type and parse accordingly
        if (file.name.endsWith('.csv')) {
          const text = new TextDecoder().decode(data);
          workbook = XLSX.read(text, { type: 'string' });
        } else {
          workbook = XLSX.read(data, { type: 'array' });
        }
        
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length === 0) {
          throw new Error('File appears to be empty');
        }
        
        // First row should be headers
        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1);
        
        console.log('📋 Raw Headers from Data Tape:', headers);
        console.log('🔍 Looking for HOA-related headers:', headers.filter(h => 
          h && h.toString().toLowerCase().includes('hoa') || 
          h && h.toString().toLowerCase().includes('association') ||
          h && h.toString().toLowerCase().includes('owner')
        ));
        
        // Map columns to our fields
        const fieldIndices: Record<string, number> = {};
        Object.entries(columnMappings).forEach(([field, mappings]) => {
          fieldIndices[field] = findColumnIndex(headers, mappings);
          
          // Special logging for HOA field
          if (field === 'annualHOAFees') {
            console.log('🏠 HOA Field Mapping Result:', {
              field,
              mappings,
              foundIndex: fieldIndices[field],
              headers: headers,
              normalizedHeaders: headers.map(h => normalizeHeaderName(h))
            });
          }
        });
        
        // Parse rows into properties
        const properties: any[] = [];
        let commonLoanPurpose = '';
        let commonCreditScore = 0;
        
        rows.forEach((row: any[], index) => {
          // Skip empty rows and the first row (example data)
          if (!row || row.every(cell => !cell) || index === 0) return;
          
          const property: any = {
            id: `datatape-${index}`,
            fullPropertyAddress: cleanStringValue(row[fieldIndices.fullPropertyAddress]),
            countyName: cleanStringValue(row[fieldIndices.countyName]),
            structureType: cleanStringValue(row[fieldIndices.structureType]),
            condo: mapCondoValue(row[fieldIndices.condo]),
            legalNonConforming: mapYesNoValue(row[fieldIndices.legalNonConforming]),
            borrowersCreditScore: cleanNumericValue(row[fieldIndices.borrowersCreditScore]),
            purposeOfLoan: mapLoanPurposeValue(row[fieldIndices.purposeOfLoan]),
            purchaseDate: formatDateForInput(row[fieldIndices.purchaseDate]),
            purchasePrice: cleanNumericValue(row[fieldIndices.purchasePrice]),
            rehabCosts: cleanNumericValue(row[fieldIndices.rehabCosts]) || 0,
            currentMarketValue: cleanNumericValue(row[fieldIndices.currentMarketValue]),
            existingMortgageBalance: cleanNumericValue(row[fieldIndices.existingMortgageBalance]) || 0,
            currentMortgageRate: cleanNumericValue(row[fieldIndices.currentMortgageRate]),
            currentOccupancyStatus: cleanStringValue(row[fieldIndices.currentOccupancyStatus]),
            marketRent: cleanStringValue(row[fieldIndices.marketRent]),
            currentLeaseAmount: cleanStringValue(row[fieldIndices.currentLeaseAmount]),
            annualPropertyTaxes: cleanNumericValue(row[fieldIndices.annualPropertyTaxes]) || 0,
            annualHazardInsurance: cleanNumericValue(row[fieldIndices.annualHazardInsurance]) || 0,
            annualFloodInsurance: cleanNumericValue(row[fieldIndices.annualFloodInsurance]) || 0,
            annualHOAFees: cleanNumericValue(row[fieldIndices.annualHOAFees]) || 0,
            annualHomeOwnersAssociation: cleanNumericValue(row[fieldIndices.annualHOAFees]) || 0, // Map to both field names
            currentCondition: cleanStringValue(row[fieldIndices.currentCondition]),
            strategyForProperty: cleanStringValue(row[fieldIndices.strategyForProperty]),
            entityName: cleanStringValue(row[fieldIndices.entityName]),
            notes: cleanStringValue(row[fieldIndices.notes])
          };
          
          // Set common values from first property
          if (properties.length === 0) {
            commonLoanPurpose = property.purposeOfLoan;
            commonCreditScore = property.borrowersCreditScore || 0;
          }
          
          properties.push(property);
        });
        
        resolve({
          loanPurpose: commonLoanPurpose,
          creditScore: commonCreditScore,
          numberOfProperties: properties.length,
          properties
        });
        
      } catch (error) {
        reject(new Error(`Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}
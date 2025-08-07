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
  borrowersCreditScore: ['Borrower\'s Credit Score', 'Credit Score', 'FICO Score'],
  purposeOfLoan: ['Purpose of the Loan', 'Loan Purpose', 'Purpose'],
  purchaseDate: ['Purchase Date'],
  purchasePrice: ['Purchase Price'],
  rehabCosts: ['Rehab Costs'],
  currentMarketValue: ['Current Market Value', 'Market Value', 'Current Value'],
  existingMortgageBalance: ['Existing Mortgage Balance', 'Mortgage Balance'],
  currentMortgageRate: ['Current Mortgage Rate', 'Mortgage Rate'],
  currentOccupancyStatus: ['Current Occupancy Status', 'Occupancy Status', 'Occupancy'],
  marketRent: ['Market Rent'],
  currentLeaseAmount: ['Current Lease Amount', 'Lease Amount'],
  annualPropertyTaxes: ['Annual Property Taxes', 'Property Taxes'],
  annualHazardInsurance: ['Annual Hazard Insurance Premium', 'Hazard Insurance', 'Insurance'],
  annualFloodInsurance: ['Annual Flood Insurance Premium', 'Flood Insurance'],
  annualHOAFees: ['Annual Home Owner\'s Association Fees', 'HOA Fees', 'HOA'],
  currentCondition: ['Current Condition', 'Condition'],
  strategyForProperty: ['Strategy for Property', 'Strategy'],
  entityName: ['Entity Name', 'Entity'],
  notes: ['Notes']
};

function findColumnIndex(headers: string[], fieldMappings: string[]): number {
  for (const mapping of fieldMappings) {
    const index = headers.findIndex(header => 
      header?.toString().toLowerCase().trim() === mapping.toLowerCase().trim()
    );
    if (index !== -1) return index;
  }
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

function parseBooleanValue(value: any): boolean {
  if (value === null || value === undefined || value === '') return false;
  const str = value.toString().toLowerCase().trim();
  return str === 'yes' || str === 'true' || str === '1';
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
        
        // Map columns to our fields
        const fieldIndices: Record<string, number> = {};
        Object.entries(columnMappings).forEach(([field, mappings]) => {
          fieldIndices[field] = findColumnIndex(headers, mappings);
        });
        
        // Parse rows into properties
        const properties: any[] = [];
        let commonLoanPurpose = '';
        let commonCreditScore = 0;
        
        rows.forEach((row: any[], index) => {
          // Skip empty rows
          if (!row || row.every(cell => !cell)) return;
          
          const property: any = {
            id: `datatape-${index}`,
            fullPropertyAddress: cleanStringValue(row[fieldIndices.fullPropertyAddress]),
            countyName: cleanStringValue(row[fieldIndices.countyName]),
            structureType: cleanStringValue(row[fieldIndices.structureType]),
            condo: parseBooleanValue(row[fieldIndices.condo]),
            legalNonConforming: parseBooleanValue(row[fieldIndices.legalNonConforming]),
            borrowersCreditScore: cleanNumericValue(row[fieldIndices.borrowersCreditScore]),
            purposeOfLoan: cleanStringValue(row[fieldIndices.purposeOfLoan]),
            purchaseDate: cleanStringValue(row[fieldIndices.purchaseDate]),
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
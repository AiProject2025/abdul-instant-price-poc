import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Plus, Trash2, Eye, X, Check, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

interface Property {
  id: string;
  fullPropertyAddress: string;
  countyName: string;
  structureType: string;
  numberOfUnits?: number;
  squareFootage?: number;
  sqfType?: string;
  condo: string;
  legalNonConforming?: string;
  isRural?: string;
  borrowersCreditScore: string;
  purposeOfLoan: string;
  purchaseDate: string;
  purchasePrice: number;
  rehabCosts: number;
  currentMarketValue: number;
  existingMortgageBalance: number;
  currentMortgageRate: number;
  currentOccupancyStatus: string;
  marketRent: string;
  currentLeaseAmount: string;
  annualPropertyTaxes: number;
  annualHazardInsurance: number;
  annualFloodInsurance: number;
  annualHomeOwnersAssociation: number;
  currentCondition: string;
  strategyForProperty: string;
  entityName: string;
  notes: string;
  dscr?: number;
  ltv?: number;
}

interface PackageSplit {
  id: string;
  name: string;
  properties: Property[];
  reason: string;
  color: string;
}

interface PropertyTableRowProps {
  property: Property;
  index: number;
  onUpdate: (updatedProperties: Property[]) => void;
  properties: Property[];
}

const PropertyTableRow = ({ property, index, onUpdate, properties }: PropertyTableRowProps) => {
  const updateProperty = (field: keyof Property, value: any) => {
    const updatedProperties = properties.map(p => 
      p.id === property.id ? { ...p, [field]: value } : p
    );
    onUpdate(updatedProperties);
  };

  const removeProperty = () => {
    const updatedProperties = properties.filter(p => p.id !== property.id);
    onUpdate(updatedProperties);
  };

  return (
    <tr className="hover:bg-muted/50 border-b border-border">
      {/* Sticky Address Column */}
      <td className="sticky left-0 bg-background border-r border-border p-2 max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap font-medium z-10 shadow-md">
        <Input
          value={property.fullPropertyAddress}
          onChange={(e) => updateProperty('fullPropertyAddress', e.target.value)}
          placeholder="Enter property address"
          className="min-w-[220px] h-8 text-sm"
        />
      </td>
      
      {/* County Name */}
      <td className="p-2">
        <Input
          value={property.countyName}
          onChange={(e) => updateProperty('countyName', e.target.value)}
          placeholder="County"
          className="min-w-[120px] h-8 text-sm"
        />
      </td>
      
      {/* Structure Type */}
      <td className="p-2">
        <Select value={property.structureType} onValueChange={(value) => updateProperty('structureType', value)}>
          <SelectTrigger className="min-w-[120px] h-8 text-sm">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Single Family">Single Family</SelectItem>
            <SelectItem value="Townhome">Townhome</SelectItem>
            <SelectItem value="Condo">Condo</SelectItem>
              <SelectItem value="Multi-Family">Multi-Family</SelectItem>
              <SelectItem value="Duplex">Duplex</SelectItem>
          </SelectContent>
        </Select>
      </td>
      
      {/* Condo */}
      <td className="p-2">
        <Select value={property.condo} onValueChange={(value) => updateProperty('condo', value)}>
          <SelectTrigger className="min-w-[80px] h-8 text-sm">
            <SelectValue placeholder="Condo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
            <SelectItem value="Non-Warrantable">Non-Warrantable</SelectItem>
          </SelectContent>
        </Select>
      </td>
      
      {/* Purchase Price */}
      <td className="p-2">
        <Input
          type="number"
          value={property.purchasePrice || ''}
          onChange={(e) => updateProperty('purchasePrice', parseFloat(e.target.value) || 0)}
          placeholder="0"
          className="min-w-[120px] h-8 text-sm"
        />
      </td>
      
      {/* Current Market Value */}
      <td className="p-2">
        <Input
          type="number"
          value={property.currentMarketValue || ''}
          onChange={(e) => updateProperty('currentMarketValue', parseFloat(e.target.value) || 0)}
          placeholder="0"
          className="min-w-[120px] h-8 text-sm"
        />
      </td>
      
      {/* Market Rent */}
      <td className="p-2">
        <Input
          value={property.marketRent}
          onChange={(e) => updateProperty('marketRent', e.target.value)}
          placeholder="$0/mo"
          className="min-w-[100px] h-8 text-sm"
        />
      </td>
      
      {/* Current Occupancy Status */}
      <td className="p-2">
        <Select value={property.currentOccupancyStatus} onValueChange={(value) => updateProperty('currentOccupancyStatus', value)}>
          <SelectTrigger className="min-w-[100px] h-8 text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Leased">Leased</SelectItem>
            <SelectItem value="Vacant">Vacant</SelectItem>
            <SelectItem value="Owner Occupied">Owner Occupied</SelectItem>
          </SelectContent>
        </Select>
      </td>
      
      {/* Remove Button */}
      <td className="p-2 text-center">
        <Button
          variant="outline"
          size="sm"
          onClick={removeProperty}
          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
};

interface PackageLoanFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

const PackageLoanForm = ({ onSubmit, isLoading }: PackageLoanFormProps) => {
  const [loanPurpose, setLoanPurpose] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [numberOfProperties, setNumberOfProperties] = useState("");
  const [creditScore, setCreditScore] = useState("");
  const [showPropertyGrid, setShowPropertyGrid] = useState(false);
  const [packageSplits, setPackageSplits] = useState<PackageSplit[]>([]);
  const [showPackageSplitter, setShowPackageSplitter] = useState(false);
  const [selectedPackageIds, setSelectedPackageIds] = useState<string[]>([]);
  const [displayedProperties, setDisplayedProperties] = useState<Property[]>([]);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedData = localStorage.getItem('dominionDataTape');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        console.log("Restored from localStorage:", parsed);
        
        setLoanPurpose(parsed.loanPurpose || "");
        setCreditScore(parsed.creditScore || "");
        setNumberOfProperties((parsed.numberOfProperties || 0).toString());
        setProperties(parsed.properties || []);
        
        if (parsed.properties && parsed.properties.length > 0) {
          setShowPropertyGrid(true);
        }
      } catch (error) {
        console.error('Error parsing saved data:', error);
      }
    }
  }, []);

  const parseMoney = (value: string): number => {
    if (!value) return 0;
    return parseFloat(value.replace(/[$,]/g, '')) || 0;
  };

  const getAddress = (fullAddress: string) => {
    if (!fullAddress) return { address: '', city: '', state: '', zipCode: '' };
    const parts = fullAddress.split(',').map(p => p.trim());
    
    if (parts.length >= 3) {
      const address = parts[0];
      const city = parts[1];
      const stateZip = parts[2].split(' ');
      const state = stateZip[0] || '';
      const zipCode = stateZip[1] || '';
      
      return { address, city, state, zipCode };
    } else if (parts.length === 2) {
      const address = parts[0];
      const stateZip = parts[1].split(' ');
      const state = stateZip[0] || '';
      const zipCode = stateZip.slice(1).join(' ') || '';
      
      return { address, city: '', state, zipCode };
    } else {
      return { address: fullAddress, city: '', state: '', zipCode: '' };
    }
  };

  const getPrimaryProperty = (props: Property[]) => {
    if (props.length === 0) return null;
    return props.reduce((highest, current) => 
      (current.currentMarketValue || 0) > (highest.currentMarketValue || 0) ? current : highest
    );
  };

  const getMostCommonString = (values: string[]): string => {
    const frequency: Record<string, number> = {};
    values.filter(v => v && v.trim()).forEach(value => {
      frequency[value] = (frequency[value] || 0) + 1;
    });
    
    return Object.keys(frequency).reduce((a, b) => 
      frequency[a] > frequency[b] ? a : b, ''
    );
  };

  const mapPropertyType = (structureType: string): string => {
    const mapping: Record<string, string> = {
      'Single Family': 'SFR',
      'Townhome': 'Townhouse',
      'Condo': 'Condo',
      'Multi-Family': 'Multi-Family',
      'Duplex': 'Duplex'
    };
    return mapping[structureType] || structureType;
  };

  const dollars = (num: any) => {
    if (num === null || num === undefined || num === '') return '';
    const n = parseFloat(num.toString().replace(/[^0-9.-]+/g, ''));
    return isNaN(n) ? '' : `$${Math.round(n).toLocaleString()}`;
  };

  const mapOccupancy = (status: string) => {
    const mapping: Record<string, string> = {
      'Leased': 'Tenant Occupied',
      'Vacant': 'Vacant',
      'Owner Occupied': 'Owner Occupied'
    };
    return mapping[status] || status;
  };

  const mapStructureType = (type: string) => {
    if (!type) return '';
    return type;
  };

  const mapN8nOutputToProperty = (item: any, idx: number): Property => {
    console.log(`Processing item ${idx}:`, item);

    return {
      id: `property-${Date.now()}-${idx}`,
      fullPropertyAddress: item.full_property_address || '',
      countyName: item.county_name || item.propertyCounty || '',
      structureType: mapStructureType(item.structure_type),
      numberOfUnits: undefined,
      squareFootage: 0,
      sqfType: '',
      condo: item.condo ? 'Yes' : 'No',
      legalNonConforming: 'No',
      isRural: 'no',
      borrowersCreditScore: (item.borrower_credit_score ?? '').toString(),
      purposeOfLoan: (item.purpose_of_loan || '').includes('Refinance') ? (item.purpose_of_loan?.includes('Cash-Out') ? 'Cash-Out' : 'Refinance') : 'Purchase',
      purchaseDate: item.purchase_date || '',
      purchasePrice: Number(item.purchase_price) || 0,
      rehabCosts: Number(item.rehab_costs) || 0,
      currentMarketValue: Number(item.current_market_value) || 0,
      existingMortgageBalance: Number(item.existing_mortgage_balance) || 0,
      currentMortgageRate: Number(item.current_mortgage_rate) || 0,
      currentOccupancyStatus: mapOccupancy(item.current_occupancy_status),
      marketRent: dollars(item.market_rent),
      currentLeaseAmount: dollars(item.current_lease_amount),
      annualPropertyTaxes: Number(item.annual_property_taxes) || 0,
      annualHazardInsurance: Number(item.annual_hazard_insurance_premium) || 0,
      annualFloodInsurance: Number(item.annual_flood_insurance_premium) || 0,
      annualHomeOwnersAssociation: Number(item.annual_home_owner_association_fees) || 0,
      currentCondition: item.current_condition || '',
      strategyForProperty: item.strategy_for_property || '',
      entityName: item.entity_name || '',
      notes: item.notes || '',
    };
  };

  const deriveLoanPurposeFromOutput = (list: any[]) => {
    const hasRefi = list.some(i => (i.purpose_of_loan || '').toLowerCase().includes('refinance'));
    return hasRefi ? 'refinance' : 'purchase';
  };

  const mapN8nResponseToState = (payload: any) => {
    const output: any[] = payload?.output || payload || [];
    const mapped = output.map(mapN8nOutputToProperty);
    const inferredPurpose = deriveLoanPurposeFromOutput(output);
    const inferredScore = (output[0]?.borrower_credit_score ?? '').toString();

    setLoanPurpose(inferredPurpose);
    setCreditScore(inferredScore);
    setNumberOfProperties(mapped.length.toString());
    setProperties(mapped);
    setShowPropertyGrid(true);

    const persisted = {
      loanPurpose: inferredPurpose,
      creditScore: inferredScore,
      numberOfProperties: mapped.length,
      properties: mapped,
    };
    localStorage.setItem('dominionDataTape', JSON.stringify(persisted));
  };

  const initializeEmptyProperties = () => {
    const count = parseInt(numberOfProperties);
    console.log("Initializing properties, count:", count, "numberOfProperties:", numberOfProperties);
    if (count > 0) {
      const emptyProperties: Property[] = Array.from({ length: count }, (_, index) => ({
        id: `property-${Date.now()}-${index}`,
        fullPropertyAddress: "",
        countyName: "",
        structureType: "",
        numberOfUnits: 1,
        squareFootage: 0,
        sqfType: "",
        condo: "",
        legalNonConforming: "",
        isRural: "no",
        borrowersCreditScore: "",
        purposeOfLoan: loanPurpose,
        purchaseDate: "",
        purchasePrice: 0,
        rehabCosts: 0,
        currentMarketValue: 0,
        existingMortgageBalance: 0,
        currentMortgageRate: 0,
        currentOccupancyStatus: "",
        marketRent: "",
        currentLeaseAmount: "",
        annualPropertyTaxes: 0,
        annualHazardInsurance: 0,
        annualFloodInsurance: 0,
        annualHomeOwnersAssociation: 0,
        currentCondition: "",
        strategyForProperty: "",
        entityName: "",
        notes: "",
      }));
      console.log("Created properties:", emptyProperties.length, emptyProperties);
      setProperties(emptyProperties);
      setShowPropertyGrid(true);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      console.log("Parsed Excel data:", jsonData);
      
      if (jsonData.length < 2) {
        throw new Error("File must contain at least a header row and one data row");
      }

      const headers = jsonData[0] as string[];
      const rows = jsonData.slice(1);

      const mappedProperties = rows.map((row: any[], index) => {
        const rowObject: any = {};
        headers.forEach((header, i) => {
          rowObject[header] = row[i];
        });
        return mapN8nOutputToProperty(rowObject, index);
      });

      const inferredPurpose = deriveLoanPurposeFromOutput(rows.map(row => ({ purpose_of_loan: row[headers.indexOf('purpose_of_loan')] || '' })));
      const inferredScore = (rows[0]?.[headers.indexOf('borrower_credit_score')] ?? '').toString();

      setLoanPurpose(inferredPurpose);
      setCreditScore(inferredScore);
      setNumberOfProperties(mappedProperties.length.toString());
      setProperties(mappedProperties);
      setShowPropertyGrid(true);

      const persisted = {
        loanPurpose: inferredPurpose,
        creditScore: inferredScore,
        numberOfProperties: mappedProperties.length,
        properties: mappedProperties,
      };
      localStorage.setItem('dominionDataTape', JSON.stringify(persisted));

      toast({
        title: "File Uploaded Successfully",
        description: `Loaded ${mappedProperties.length} properties from Excel file`,
      });

    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Upload Error", 
        description: error instanceof Error ? error.message : "Failed to process the uploaded file",
        variant: "destructive",
      });
    } finally {
      setIsProcessingFile(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const addEmptyProperty = () => {
    const newProperty: Property = {
      id: `property-${Date.now()}`,
      fullPropertyAddress: "",
      countyName: "",
      structureType: "",
      numberOfUnits: 1,
      squareFootage: 0,
      sqfType: "",
      condo: "",
      legalNonConforming: "",
      isRural: "no",
      borrowersCreditScore: "",
      purposeOfLoan: loanPurpose,
      purchaseDate: "",
      purchasePrice: 0,
      rehabCosts: 0,
      currentMarketValue: 0,
      existingMortgageBalance: 0,
      currentMortgageRate: 0,
      currentOccupancyStatus: "",
      marketRent: "",
      currentLeaseAmount: "",
      annualPropertyTaxes: 0,
      annualHazardInsurance: 0,
      annualFloodInsurance: 0,
      annualHomeOwnersAssociation: 0,
      currentCondition: "",
      strategyForProperty: "",
      entityName: "",
      notes: "",
    };
    setProperties([...properties, newProperty]);
  };

  const analyzeProperties = (): PackageSplit[] => {
    if (properties.length === 0) return [];
    
    const splits: PackageSplit[] = [];
    const usedPropertyIds = new Set<string>();

    const rules = [
      // Rule 1: Properties with over 5 units cannot be packaged
      {
        name: "High Unit Count Properties (5+ Units)",
        filter: (p: Property) => (p.numberOfUnits || 0) > 5,
        reason: "Properties with more than 5 units cannot be included in package loans",
        color: "bg-red-100 border-red-300",
        priority: 1
      },
      // Rule 2: Rural properties need separate packaging
      {
        name: "Rural Properties",
        filter: (p: Property) => p.isRural === "yes",
        reason: "Rural properties require separate packaging due to note buyer restrictions",
        color: "bg-orange-100 border-orange-300",
        priority: 2
      },
      // Rule 3: Short-term rentals need specialized programs
      {
        name: "Short-Term Rentals",
        filter: (p: Property) => 
          p.strategyForProperty.toLowerCase().includes('airbnb') || 
          p.strategyForProperty.toLowerCase().includes('short') ||
          p.strategyForProperty.toLowerCase().includes('str'),
        reason: "Short-term rental properties need specialized loan programs",
        color: "bg-blue-100 border-blue-300",
        priority: 3
      }
    ];

    // Apply rules in priority order
    rules.forEach((rule, index) => {
      const matchingProperties = properties.filter(p => 
        !usedPropertyIds.has(p.id) && rule.filter(p)
      );

      if (matchingProperties.length > 0) {
        splits.push({
          id: `split-${index}`,
          name: rule.name,
          properties: matchingProperties,
          reason: rule.reason,
          color: rule.color
        });

        matchingProperties.forEach(p => usedPropertyIds.add(p.id));
      }
    });

    // Handle remaining properties with condo warrantability rules
    const remainingProperties = properties.filter(p => !usedPropertyIds.has(p.id));
    
    if (remainingProperties.length > 0) {
      // Separate warrantable and non-warrantable condos
      const warrantableCondos = remainingProperties.filter(p => 
        p.structureType === "Condo" && p.condo !== "Non-Warrantable"
      );
      
      const nonWarrantableCondos = remainingProperties.filter(p => 
        p.structureType === "Condo" && p.condo === "Non-Warrantable"
      );
      
      const nonCondoProperties = remainingProperties.filter(p => 
        p.structureType !== "Condo"
      );

      // If there are non-warrantable condos, they need their own package
      if (nonWarrantableCondos.length > 0) {
        splits.push({
          id: 'split-non-warrantable-condos',
          name: 'Non-Warrantable Condos Package',
          properties: nonWarrantableCondos,
          reason: 'Non-warrantable condos must be packaged separately unless all properties in the package are non-warrantable condos',
          color: 'bg-yellow-100 border-yellow-300'
        });
      }

      // Standard package for warrantable condos and non-condo properties
      const standardPackageProperties = [...warrantableCondos, ...nonCondoProperties];
      
      if (standardPackageProperties.length > 0) {
        splits.push({
          id: 'split-standard',
          name: 'Standard Package',
          properties: standardPackageProperties,
          reason: 'Standard investment properties that can be packaged together',
          color: 'bg-gray-100 border-gray-300'
        });
      }
    }

    return splits;
  };

  const runPackageAnalysis = () => {
    // First validate the properties
    const invalidProperties = properties.filter(p => 
      !p.fullPropertyAddress || 
      !p.structureType || 
      !p.currentMarketValue ||
      p.currentMarketValue === 0
    );

    if (invalidProperties.length > 0) {
      toast({
        title: "Incomplete Property Data",
        description: `Please complete all required fields for ${invalidProperties.length} properties before analysis`,
        variant: "destructive",
      });
      return;
    }

    const analysis = analyzeProperties();
    setPackageSplits(analysis);
    setShowPackageSplitter(true);
    setSelectedPackageIds([]);

    toast({
      title: "Package Analysis Complete",
      description: `Found ${analysis.length} optimal package groupings based on loan program requirements`,
    });
  };

  const deletePackage = (packageId: string) => {
    setPackageSplits(prev => prev.filter(p => p.id !== packageId));
    setSelectedPackageIds(prev => prev.filter(id => id !== packageId));
    
    toast({
      title: "Package Deleted",
      description: "Package removed from analysis results",
    });
  };

  const togglePackageSelection = (packageId: string) => {
    setSelectedPackageIds(prev => {
      if (prev.includes(packageId)) {
        return prev.filter(id => id !== packageId);
      } else {
        return [...prev, packageId];
      }
    });
  };

  const getSelectedProperties = () => {
    if (selectedPackageIds.length === 0) return [];
    return packageSplits
      .filter(split => selectedPackageIds.includes(split.id))
      .flatMap(split => split.properties);
  };

  const clearAllData = () => {
    localStorage.removeItem('dominionDataTape');
    setProperties([]);
    setLoanPurpose("");
    setCreditScore("");
    setNumberOfProperties("");
    setShowPropertyGrid(false);
    setPackageSplits([]);
    setShowPackageSplitter(false);
    setSelectedPackageIds([]);
    setDisplayedProperties([]);
    
    toast({
      title: "Data Cleared",
      description: "All property data has been cleared",
    });
  };

  const handleSubmit = async () => {
    if (!loanPurpose) {
      toast({
        title: 'Missing Information',
        description: 'Please select loan purpose',
        variant: 'destructive',
      });
      return;
    }

    if (selectedPackageIds.length === 0) {
      toast({
        title: 'No Package Selected',
        description: 'Please select at least one package to submit',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedProperties = getSelectedProperties();
      const selectedSplits = packageSplits.filter(split => selectedPackageIds.includes(split.id));

      // Call webhook for each selected package
      const webhookResults = await Promise.all(
        selectedSplits.map(async (split) => {
          const res = await fetch('https://covenantcapitalgroup.n8n.cloud/webhook/package-loan-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              properties: split.properties,
              loanPurpose,
              creditScore 
            }),
          });

          if (!res.ok) {
            throw new Error(`Failed to fetch data for ${split.name}`);
          }

          const webhookOutput = await res.json();
          return { split, webhookOutput };
        })
      );

      // Pass to parent so it can merge and navigate to /quote with prefill
      onSubmit({
        loanPurpose,
        creditScore,
        packageType: 'multi-package',
        selectedPackages: selectedSplits,
        properties: selectedProperties,
        webhookResults,
      });
    } catch (error) {
      console.error('Error calling package loan data webhook:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch package loan data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePropertiesChange = (updatedProperties: Property[]) => {
    setProperties(updatedProperties);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
      {/* Clean Data Tape Upload Section */}
      {properties.length === 0 && (
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Upload className="h-5 w-5 text-dominion-blue" />
              Data Tape Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">
                Upload an Excel or CSV file containing your property data to automatically populate the form.
              </p>
              <div className="flex items-center gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessingFile}
                  className="bg-dominion-blue hover:bg-blue-700 text-white"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isProcessingFile ? "Processing..." : "Upload Data Tape"}
                </Button>
                <span className="text-sm text-gray-600">
                  Supports .xlsx, .xls, and .csv files
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Clean Data Loaded Status */}
      {properties.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-lg text-gray-900">{properties.length} Properties Loaded</span>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-dominion-blue border-dominion-blue hover:bg-blue-50"
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Upload New
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearAllData}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>
      )}

      {/* Loan Purpose and Credit Score */}
      {properties.length > 0 && (
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>Loan Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Loan Purpose</Label>
                <RadioGroup value={loanPurpose} onValueChange={setLoanPurpose}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="purchase" id="purchase" />
                    <Label htmlFor="purchase">Purchase</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="refinance" id="refinance" />
                    <Label htmlFor="refinance">Refinance</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="creditScore">Credit Score</Label>
                <Input
                  id="creditScore"
                  value={creditScore}
                  onChange={(e) => setCreditScore(e.target.value)}
                  placeholder="Enter credit score"
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Portfolio Summary */}
      {showPropertyGrid && properties.length > 0 && (
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>Portfolio Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{properties.length}</div>
                <div className="text-sm text-muted-foreground">Properties</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${properties.reduce((sum, p) => sum + (p.currentMarketValue || 0), 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Value</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  ${properties.reduce((sum, p) => sum + (p.existingMortgageBalance || 0), 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Mortgage Balance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  ${properties.reduce((sum, p) => sum + (p.annualPropertyTaxes || 0), 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Annual Taxes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Package Analysis */}
      {showPropertyGrid && properties.length > 0 && !showPackageSplitter && (
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Smart Package Analysis</span>
              <Button onClick={runPackageAnalysis} variant="outline">
                Analyze Package Compatibility
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Our AI will analyze your properties and suggest optimal package groupings based on loan program requirements and note buyer preferences.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Package Split Results */}
      {showPackageSplitter && packageSplits.length > 0 && (
        <>
          <Card className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Package Analysis Results</span>
                <div className="flex gap-2">
                  <Button
                    onClick={runPackageAnalysis}
                    variant="outline"
                    size="sm"
                    className="border-gray-300 text-gray-700"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reanalyze
                  </Button>
                  <Button
                    onClick={() => setShowPackageSplitter(false)}
                    variant="outline"
                    size="sm"
                    className="border-gray-300 text-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Package Cards - Column Layout */}
          <div className="space-y-6">
            {packageSplits.map((split, index) => {
              const isSelected = selectedPackageIds.includes(split.id);
              return (
                <Card
                  key={split.id}
                  className={`transition-all duration-300 cursor-pointer animate-fade-in ${split.color} ${
                    isSelected
                      ? 'ring-4 ring-primary/30 shadow-lg border-2 transform -translate-y-1' 
                      : 'hover:shadow-md border-2 hover:transform hover:-translate-y-0.5'
                  }`}
                  onClick={() => togglePackageSelection(split.id)}
                  style={{
                    animationDelay: `${index * 150}ms`,
                  }}
                >
                  {/* Package Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => togglePackageSelection(split.id)}
                            className="w-5 h-5"
                          />
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="font-semibold text-gray-700">{index + 1}</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{split.name}</h3>
                          <p className="text-sm text-gray-600 leading-relaxed">{split.reason}</p>
                          <div className="mt-3">
                            <span className="text-sm font-medium text-gray-700">
                              {split.properties.length} Properties
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add view functionality if needed
                          }}
                          variant="outline"
                          size="sm"
                          className="border-gray-300 text-gray-700"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePackage(split.id);
                          }}
                          variant="outline"
                          size="sm"
                          className="border-gray-300 text-gray-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Financial Summary */}
                  <div className="p-6">
                    <h4 className="text-base font-semibold text-gray-900 mb-4">Financial Overview</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Total Portfolio Value */}
                      <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-200/60">
                        <div className="text-lg font-semibold text-gray-900 mb-1">
                          ${split.properties.reduce((sum, p) => sum + (p.currentMarketValue || 0), 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-blue-600">Portfolio Value</div>
                      </div>

                      {/* Mortgage Balance */}
                      <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-200/60">
                        <div className="text-lg font-semibold text-gray-900 mb-1">
                          ${split.properties.reduce((sum, p) => sum + (p.existingMortgageBalance || 0), 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-blue-600">Mortgage Balance</div>
                      </div>

                      {/* LTV Calculation */}
                      <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-200/60">
                        <div className="text-lg font-semibold text-gray-900 mb-1">
                          {split.properties.reduce((sum, p) => sum + (p.currentMarketValue || 0), 0) > 0
                            ? Math.round((split.properties.reduce((sum, p) => sum + (p.existingMortgageBalance || 0), 0) / split.properties.reduce((sum, p) => sum + (p.currentMarketValue || 0), 0)) * 100)
                            : 0}%
                        </div>
                        <div className="text-sm text-blue-600">Loan-to-Value</div>
                      </div>

                      {/* Annual Expenses */}
                      <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-200/60">
                        <div className="text-lg font-semibold text-gray-900 mb-1">
                          ${Math.round(split.properties.reduce((sum, p) => sum + (p.annualPropertyTaxes || 0) + (p.annualHazardInsurance || 0) + (p.annualFloodInsurance || 0) + (p.annualHomeOwnersAssociation || 0), 0) / 12).toLocaleString()}/mo
                        </div>
                        <div className="text-sm text-blue-600">
                          ${split.properties.reduce((sum, p) => sum + (p.annualPropertyTaxes || 0) + (p.annualHazardInsurance || 0) + (p.annualFloodInsurance || 0) + (p.annualHomeOwnersAssociation || 0), 0).toLocaleString()}/yr total
                        </div>
                      </div>
                    </div>

                    {/* Property List */}
                    <div className="mt-6">
                      <h5 className="text-sm font-semibold text-gray-900 mb-3">Properties in this Package</h5>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {split.properties.map((property, propIndex) => (
                          <div key={property.id} className="bg-white p-3 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="font-medium text-gray-900 text-sm">
                                  {property.fullPropertyAddress || `Property ${propIndex + 1} - Address not entered`}
                                </div>
                                <div className="text-xs text-gray-600 mt-1">
                                  {property.structureType && property.countyName
                                    ? `${property.structureType} • ${property.countyName}`
                                    : property.structureType || property.countyName || 'Details not entered'
                                  }
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-semibold text-gray-900">
                                  ${(property.currentMarketValue || 0).toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-500">Market Value</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* Combined Selected Packages Table */}
      {selectedPackageIds.length > 0 && (
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Selected Packages Properties ({getSelectedProperties().length} properties)</span>
              <div className="flex gap-2">
                <Button
                  onClick={runPackageAnalysis}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reanalyze
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="sticky left-0 bg-muted p-3 text-left font-medium border-b border-border z-10">
                      Property Address
                    </th>
                    <th className="p-3 text-left font-medium border-b border-border min-w-[120px]">Package</th>
                    <th className="p-3 text-left font-medium border-b border-border min-w-[120px]">County</th>
                    <th className="p-3 text-left font-medium border-b border-border min-w-[120px]">Type</th>
                    <th className="p-3 text-left font-medium border-b border-border min-w-[120px]">Purchase Price</th>
                    <th className="p-3 text-left font-medium border-b border-border min-w-[120px]">Market Value</th>
                    <th className="p-3 text-left font-medium border-b border-border min-w-[100px]">Market Rent</th>
                    <th className="p-3 text-left font-medium border-b border-border min-w-[100px]">Occupancy</th>
                  </tr>
                </thead>
                <tbody>
                  {getSelectedProperties().map((property, index) => {
                    const packageSplit = packageSplits.find(split => 
                      selectedPackageIds.includes(split.id) && split.properties.some(p => p.id === property.id)
                    );
                    return (
                      <tr key={property.id} className="hover:bg-muted/50 border-b border-border">
                        <td className="sticky left-0 bg-background border-r border-border p-2 max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap font-medium z-10 shadow-md">
                          {property.fullPropertyAddress || `Property ${index + 1}`}
                        </td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${packageSplit?.color || 'bg-gray-100'}`}>
                            {packageSplit?.name || 'Unknown'}
                          </span>
                        </td>
                        <td className="p-2">{property.countyName}</td>
                        <td className="p-2">{property.structureType}</td>
                        <td className="p-2">${(property.purchasePrice || 0).toLocaleString()}</td>
                        <td className="p-2">${(property.currentMarketValue || 0).toLocaleString()}</td>
                        <td className="p-2">{property.marketRent}</td>
                        <td className="p-2">{property.currentOccupancyStatus}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      {showPackageSplitter && packageSplits.length > 0 && (
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="pt-6">
            <Button 
              onClick={handleSubmit} 
              className="w-full" 
              size="lg"
              disabled={isLoading || isSubmitting || selectedPackageIds.length === 0}
            >
              {isSubmitting ? "Processing..." : selectedPackageIds.length > 0 ? `Submit ${selectedPackageIds.length} Package${selectedPackageIds.length > 1 ? 's' : ''} for Quote` : "Select Package(s) to Submit"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Property Data Table */}
      {showPropertyGrid && properties.length > 0 && (
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>All Properties ({properties.length})</span>
              <div className="flex space-x-2">
                <Button onClick={addEmptyProperty} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Property
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="sticky left-0 bg-muted p-3 text-left font-medium border-b border-border z-10">
                      Property Address
                    </th>
                    <th className="p-3 text-left font-medium border-b border-border min-w-[120px]">County</th>
                    <th className="p-3 text-left font-medium border-b border-border min-w-[120px]">Type</th>
                    <th className="p-3 text-left font-medium border-b border-border min-w-[80px]">Condo</th>
                    <th className="p-3 text-left font-medium border-b border-border min-w-[120px]">Purchase Price</th>
                    <th className="p-3 text-left font-medium border-b border-border min-w-[120px]">Market Value</th>
                    <th className="p-3 text-left font-medium border-b border-border min-w-[100px]">Market Rent</th>
                    <th className="p-3 text-left font-medium border-b border-border min-w-[100px]">Occupancy</th>
                    <th className="p-3 text-center font-medium border-b border-border">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((property, index) => (
                    <PropertyTableRow
                      key={property.id}
                      property={property}
                      index={index}
                      onUpdate={handlePropertiesChange}
                      properties={properties}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PackageLoanForm;

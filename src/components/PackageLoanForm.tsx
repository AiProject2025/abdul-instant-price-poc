import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Plus, Trash2, Eye, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { parseDataTapeFile } from "@/utils/dataTapeParser";

interface Property {
  id: string;
  fullPropertyAddress: string;
  countyName: string;
  structureType: string;
  numberOfUnits?: number;
  squareFootage?: number;
  sqfType?: string;
  condo: string;
  legalNonConforming: string;
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
          </SelectContent>
        </Select>
      </td>
      
      {/* Legal Non-Conforming */}
      <td className="p-2">
        <Select value={property.legalNonConforming} onValueChange={(value) => updateProperty('legalNonConforming', value)}>
          <SelectTrigger className="min-w-[80px] h-8 text-sm">
            <SelectValue placeholder="Legal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
          </SelectContent>
        </Select>
      </td>
      
      {/* Borrower's Credit Score */}
      <td className="p-2">
        <Input
          type="number"
          value={property.borrowersCreditScore}
          onChange={(e) => updateProperty('borrowersCreditScore', e.target.value)}
          placeholder="Credit"
          className="min-w-[80px] h-8 text-sm"
        />
      </td>
      
      {/* Purpose of Loan */}
      <td className="p-2">
        <Select value={property.purposeOfLoan} onValueChange={(value) => updateProperty('purposeOfLoan', value)}>
          <SelectTrigger className="min-w-[100px] h-8 text-sm">
            <SelectValue placeholder="Purpose" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Purchase">Purchase</SelectItem>
            <SelectItem value="Refinance">Refinance</SelectItem>
            <SelectItem value="Cash-Out">Cash-Out</SelectItem>
          </SelectContent>
        </Select>
      </td>
      
      {/* Purchase Date */}
      <td className="p-2">
        <Input
          type="date"
          value={property.purchaseDate}
          onChange={(e) => updateProperty('purchaseDate', e.target.value)}
          className="min-w-[120px] h-8 text-sm"
        />
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
      
      {/* Rehab Costs */}
      <td className="p-2">
        <Input
          type="number"
          value={property.rehabCosts || ''}
          onChange={(e) => updateProperty('rehabCosts', parseFloat(e.target.value) || 0)}
          placeholder="0"
          className="min-w-[100px] h-8 text-sm"
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
      
      {/* Existing Mortgage Balance */}
      <td className="p-2">
        <Input
          type="number"
          value={property.existingMortgageBalance || ''}
          onChange={(e) => updateProperty('existingMortgageBalance', parseFloat(e.target.value) || 0)}
          placeholder="0"
          className="min-w-[120px] h-8 text-sm"
        />
      </td>
      
      {/* Current Mortgage Rate */}
      <td className="p-2">
        <Input
          type="number"
          step="0.01"
          value={property.currentMortgageRate || ''}
          onChange={(e) => updateProperty('currentMortgageRate', parseFloat(e.target.value) || 0)}
          placeholder="0.00%"
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
            <SelectItem value="MTM">MTM</SelectItem>
            <SelectItem value="Owner Occupied">Owner Occupied</SelectItem>
          </SelectContent>
        </Select>
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
      
      {/* Current Lease Amount */}
      <td className="p-2">
        <Input
          value={property.currentLeaseAmount}
          onChange={(e) => updateProperty('currentLeaseAmount', e.target.value)}
          placeholder="$0/mo"
          className="min-w-[100px] h-8 text-sm"
        />
      </td>
      
      {/* Annual Property Taxes */}
      <td className="p-2">
        <Input
          type="number"
          value={property.annualPropertyTaxes || ''}
          onChange={(e) => updateProperty('annualPropertyTaxes', parseFloat(e.target.value) || 0)}
          placeholder="0"
          className="min-w-[100px] h-8 text-sm"
        />
      </td>
      
      {/* Annual Hazard Insurance */}
      <td className="p-2">
        <Input
          type="number"
          value={property.annualHazardInsurance || ''}
          onChange={(e) => updateProperty('annualHazardInsurance', parseFloat(e.target.value) || 0)}
          placeholder="0"
          className="min-w-[100px] h-8 text-sm"
        />
      </td>
      
      {/* Annual Flood Insurance */}
      <td className="p-2">
        <Input
          type="number"
          value={property.annualFloodInsurance || ''}
          onChange={(e) => updateProperty('annualFloodInsurance', parseFloat(e.target.value) || 0)}
          placeholder="0"
          className="min-w-[100px] h-8 text-sm"
        />
      </td>
      
      {/* Annual HOA Fees */}
      <td className="p-2">
        <Input
          type="number"
          value={property.annualHomeOwnersAssociation || ''}
          onChange={(e) => updateProperty('annualHomeOwnersAssociation', parseFloat(e.target.value) || 0)}
          placeholder="0"
          className="min-w-[100px] h-8 text-sm"
        />
      </td>
      
      {/* Current Condition */}
      <td className="p-2">
        <Select value={property.currentCondition} onValueChange={(value) => updateProperty('currentCondition', value)}>
          <SelectTrigger className="min-w-[100px] h-8 text-sm">
            <SelectValue placeholder="Condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="Excellent">Excellent</SelectItem>
            <SelectItem value="Good">Good</SelectItem>
            <SelectItem value="Average">Average</SelectItem>
            <SelectItem value="Fair">Fair</SelectItem>
            <SelectItem value="Poor">Poor</SelectItem>
          </SelectContent>
        </Select>
      </td>
      
      {/* Strategy for Property */}
      <td className="p-2">
        <Select value={property.strategyForProperty} onValueChange={(value) => updateProperty('strategyForProperty', value)}>
          <SelectTrigger className="min-w-[120px] h-8 text-sm">
            <SelectValue placeholder="Strategy" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Rent and Hold">Rent and Hold</SelectItem>
            <SelectItem value="Rent and hold">Rent and hold</SelectItem>
            <SelectItem value="Fix and Flip">Fix and Flip</SelectItem>
            <SelectItem value="Buy and Hold">Buy and Hold</SelectItem>
            <SelectItem value="Short-term Rental">Short-term Rental</SelectItem>
          </SelectContent>
        </Select>
      </td>
      
      {/* Entity Name */}
      <td className="p-2">
        <Input
          value={property.entityName}
          onChange={(e) => updateProperty('entityName', e.target.value)}
          placeholder="Entity"
          className="min-w-[120px] h-8 text-sm"
        />
      </td>
      
      {/* Notes */}
      <td className="p-2">
        <Input
          value={property.notes}
          onChange={(e) => updateProperty('notes', e.target.value)}
          placeholder="Notes"
          className="min-w-[150px] h-8 text-sm"
        />
      </td>
      
      {/* Actions */}
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
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [displayedProperties, setDisplayedProperties] = useState<Property[]>([]);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

  const generateTestData = () => {
    const testProperties: Property[] = [
      {
        id: "test-1",
        fullPropertyAddress: "123 Oak Street, Houston, TX 77001",
        countyName: "Harris County",
        structureType: "Single Family",
        numberOfUnits: 1,
        squareFootage: 2000,
        sqfType: "Heated",
        condo: "No",
        legalNonConforming: "No",
        isRural: "no",
        borrowersCreditScore: "740",
        purposeOfLoan: "Purchase",
        purchaseDate: "2024-01-15",
        purchasePrice: 300000,
        rehabCosts: 15000,
        currentMarketValue: 350000,
        existingMortgageBalance: 280000,
        currentMortgageRate: 7.5,
        currentOccupancyStatus: "Leased",
        marketRent: "$2800",
        currentLeaseAmount: "$2750",
        annualPropertyTaxes: 4200,
        annualHazardInsurance: 1800,
        annualFloodInsurance: 0,
        annualHomeOwnersAssociation: 0,
        currentCondition: "Good",
        strategyForProperty: "Buy and Hold",
        entityName: "Investment LLC",
        notes: "Standard rental property"
      },
      {
        id: "test-2",
        fullPropertyAddress: "456 Pine Avenue, Dallas, TX 75201",
        countyName: "Dallas County",
        structureType: "Townhome",
        numberOfUnits: 1,
        squareFootage: 1800,
        sqfType: "Heated",
        condo: "No",
        legalNonConforming: "No",
        isRural: "no",
        borrowersCreditScore: "720",
        purposeOfLoan: "Refinance",
        purchaseDate: "2023-08-10",
        purchasePrice: 275000,
        rehabCosts: 8000,
        currentMarketValue: 320000,
        existingMortgageBalance: 240000,
        currentMortgageRate: 6.8,
        currentOccupancyStatus: "Leased",
        marketRent: "$2600",
        currentLeaseAmount: "$2550",
        annualPropertyTaxes: 3800,
        annualHazardInsurance: 1600,
        annualFloodInsurance: 0,
        annualHomeOwnersAssociation: 1200,
        currentCondition: "Excellent",
        strategyForProperty: "Long-term rental",
        entityName: "Investment LLC",
        notes: "Recently renovated"
      },
      {
        id: "test-3",
        fullPropertyAddress: "789 Elm Street, Austin, TX 78701",
        countyName: "Travis County",
        structureType: "Condo",
        numberOfUnits: 1,
        squareFootage: 1200,
        sqfType: "Heated",
        condo: "Yes",
        legalNonConforming: "No",
        isRural: "no",
        borrowersCreditScore: "760",
        purposeOfLoan: "Purchase",
        purchaseDate: "2024-02-20",
        purchasePrice: 400000,
        rehabCosts: 5000,
        currentMarketValue: 420000,
        existingMortgageBalance: 350000,
        currentMortgageRate: 7.2,
        currentOccupancyStatus: "Leased",
        marketRent: "$3200",
        currentLeaseAmount: "$3100",
        annualPropertyTaxes: 5200,
        annualHazardInsurance: 2000,
        annualFloodInsurance: 500,
        annualHomeOwnersAssociation: 2400,
        currentCondition: "Good",
        strategyForProperty: "Short-term Rental",
        entityName: "Investment LLC",
        notes: "Downtown condo with STR potential"
      },
      {
        id: "test-4",
        fullPropertyAddress: "321 Rural Road, Fredericksburg, TX 78624",
        countyName: "Gillespie County",
        structureType: "Single Family",
        numberOfUnits: 1,
        squareFootage: 1600,
        sqfType: "Heated",
        condo: "No",
        legalNonConforming: "No",
        isRural: "yes",
        borrowersCreditScore: "700",
        purposeOfLoan: "Purchase",
        purchaseDate: "2024-03-15",
        purchasePrice: 250000,
        rehabCosts: 20000,
        currentMarketValue: 280000,
        existingMortgageBalance: 200000,
        currentMortgageRate: 8.0,
        currentOccupancyStatus: "Vacant",
        marketRent: "$2200",
        currentLeaseAmount: "",
        annualPropertyTaxes: 3200,
        annualHazardInsurance: 1400,
        annualFloodInsurance: 0,
        annualHomeOwnersAssociation: 0,
        currentCondition: "Fair",
        strategyForProperty: "Buy and Hold",
        entityName: "Rural Properties LLC",
        notes: "Rural property requiring separate package"
      },
      {
        id: "test-5",
        fullPropertyAddress: "654 Multi Street, San Antonio, TX 78201",
        countyName: "Bexar County",
        structureType: "Multi-Family",
        numberOfUnits: 8,
        squareFootage: 6000,
        sqfType: "Heated",
        condo: "No",
        legalNonConforming: "No",
        isRural: "no",
        borrowersCreditScore: "780",
        purposeOfLoan: "Refinance",
        purchaseDate: "2023-05-10",
        purchasePrice: 800000,
        rehabCosts: 50000,
        currentMarketValue: 900000,
        existingMortgageBalance: 650000,
        currentMortgageRate: 6.5,
        currentOccupancyStatus: "Leased",
        marketRent: "$8000",
        currentLeaseAmount: "$7800",
        annualPropertyTaxes: 12000,
        annualHazardInsurance: 4000,
        annualFloodInsurance: 0,
        annualHomeOwnersAssociation: 0,
        currentCondition: "Good",
        strategyForProperty: "Buy and Hold",
        entityName: "Multi Family Holdings LLC",
        notes: "8-unit property - exceeds 5 unit limit"
      }
    ];
    
    console.log("Generated test data with", testProperties.length, "properties");
    setProperties(testProperties);
    toast({
      title: "Test Data Generated",
      description: `Created ${testProperties.length} test properties with different package requirements`,
    });
  };

  const validatePackageEligibility = (properties: Property[]): { isValid: boolean; issues: string[] } => {
    const issues: string[] = [];
    
    // Check for properties with over 5 units
    const highUnitProperties = properties.filter(p => (p.numberOfUnits || 0) > 5);
    if (highUnitProperties.length > 0) {
      issues.push(`${highUnitProperties.length} properties have more than 5 units and cannot be packaged`);
    }

    // Check for mixed warrantability in condos
    const condos = properties.filter(p => p.structureType === "Condo");
    if (condos.length > 1) {
      const warrantable = condos.filter(p => p.condo !== "Non-Warrantable");
      const nonWarrantable = condos.filter(p => p.condo === "Non-Warrantable");
      
      if (warrantable.length > 0 && nonWarrantable.length > 0) {
        issues.push("Cannot mix warrantable and non-warrantable condos in the same package");
      }
    }

    return {
      isValid: issues.length === 0,
      issues
    };
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
    const validation = validatePackageEligibility(properties);
    
    if (!validation.isValid) {
      toast({
        title: "Package Analysis Issues",
        description: validation.issues.join(". "),
        variant: "destructive"
      });
    }
    
    // Run the analysis regardless to show how properties would be split
    const analysis = analyzeProperties();
    setPackageSplits(analysis);
    setShowPackageSplitter(true);
    
    // Show success message if valid
    if (validation.isValid) {
      toast({
        title: "Package Analysis Complete",
        description: `Properties split into ${analysis.length} compatible packages`,
      });
    }
  };

  const deletePackage = (packageId: string) => {
    setPackageSplits(packageSplits.filter(split => split.id !== packageId));
    if (selectedPackageId === packageId) {
      setSelectedPackageId(null);
      setDisplayedProperties([]);
    }
    toast({
      title: "Package Deleted",
      description: "Package removed from analysis results",
    });
  };

  const viewPackage = (packageId: string) => {
    const selectedPackage = packageSplits.find(split => split.id === packageId);
    if (selectedPackage) {
      setSelectedPackageId(packageId);
      setDisplayedProperties(selectedPackage.properties);
      toast({
        title: "Package Selected",
        description: `Viewing ${selectedPackage.properties.length} properties in data tape`,
      });
    }
  };

  const submitPackage = (packageId: string) => {
    const selectedPackage = packageSplits.find(split => split.id === packageId);
    if (selectedPackage) {
      const packageData = {
        loanPurpose,
        properties: selectedPackage.properties,
        packageType: "package-split",
        packageName: selectedPackage.name,
        creditScore
      };
      onSubmit(packageData);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!validExtensions.includes(fileExtension)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an Excel (.xlsx, .xls) or CSV (.csv) file.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessingFile(true);

    try {
      const parsedData = await parseDataTapeFile(file);
      
      // Auto-populate form fields
      setLoanPurpose(parsedData.loanPurpose);
      setCreditScore(parsedData.creditScore.toString());
      setNumberOfProperties(parsedData.numberOfProperties.toString());
      setProperties(parsedData.properties);
      setShowPropertyGrid(true);
      
      toast({
        title: "Data Tape Processed Successfully",
        description: `Imported ${parsedData.numberOfProperties} properties from ${file.name}`,
      });
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error) {
      toast({
        title: "Processing Error",
        description: error instanceof Error ? error.message : "Failed to process data tape file.",
        variant: "destructive"
      });
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleSubmit = () => {
    // Validate required fields
    const missingFields: string[] = [];
    
    if (!loanPurpose) {
      missingFields.push("Loan Purpose");
    }
    
    if (!creditScore) {
      missingFields.push("Credit Score");
    }

    if (properties.length === 0) {
      missingFields.push("At least one property");
    }

    // Check for empty property fields
    const incompleteProperties: string[] = [];
    properties.forEach((property, index) => {
      const emptyFields: string[] = [];
      
      if (!property.fullPropertyAddress) emptyFields.push("Address");
      if (!property.countyName) emptyFields.push("County");
      if (!property.structureType) emptyFields.push("Structure Type");
      if (!property.condo) emptyFields.push("Condo");
      if (!property.currentMarketValue) emptyFields.push("Current Market Value");
      
      if (emptyFields.length > 0) {
        incompleteProperties.push(`Property ${index + 1}: ${emptyFields.join(", ")}`);
      }
    });

    if (missingFields.length > 0 || incompleteProperties.length > 0) {
      const allMissing = [...missingFields];
      if (incompleteProperties.length > 0) {
        allMissing.push(...incompleteProperties);
      }
      
      toast({
        title: "Missing Required Fields",
        description: `Please fill in: ${allMissing.join("; ")}`,
        variant: "destructive"
      });
      return;
    }

    const packageData = {
      loanPurpose,
      properties,
      packageType: "multi-property",
      creditScore
    };

    onSubmit(packageData);
  };

  const handlePropertiesChange = (updatedProperties: Property[]) => {
    setProperties(updatedProperties);
  };

  return (
    <div className="max-w-full mx-auto space-y-6">
      {/* Data Tape Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Data Tape Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Upload an Excel or CSV file containing your property data tape to automatically populate the form.
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
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessingFile}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {isProcessingFile ? "Processing..." : "Upload Data Tape"}
              </Button>
              <span className="text-sm text-muted-foreground">
                Supports .xlsx, .xls, and .csv files
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loan Purpose Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Package Loan Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
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
                className="w-48"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfProperties">Number of Properties</Label>
              <Select value={numberOfProperties} onValueChange={setNumberOfProperties}>
                <SelectTrigger>
                  <SelectValue placeholder="Select number of properties" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 20 }, (_, i) => i + 2).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} Properties
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Entry */}
      {loanPurpose && numberOfProperties && !showPropertyGrid && (
        <Card>
          <CardHeader>
            <CardTitle>Property Data Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              onClick={initializeEmptyProperties}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Start Manual Entry ({numberOfProperties} properties)
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Portfolio Summary */}
      {showPropertyGrid && properties.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Overall Portfolio Stats */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Overall Portfolio</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{properties.length}</div>
                  <div className="text-sm text-muted-foreground">Total Properties</div>
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
                  <div className="space-y-1">
                    <div className="text-lg font-bold text-purple-600">
                      ${properties.reduce((sum, p) => sum + (p.annualPropertyTaxes || 0) + (p.annualHazardInsurance || 0) + (p.annualFloodInsurance || 0) + (p.annualHomeOwnersAssociation || 0), 0).toLocaleString()}/yr
                    </div>
                    <div className="text-sm font-semibold text-purple-500">
                      ${Math.round(properties.reduce((sum, p) => sum + (p.annualPropertyTaxes || 0) + (p.annualHazardInsurance || 0) + (p.annualFloodInsurance || 0) + (p.annualHomeOwnersAssociation || 0), 0) / 12).toLocaleString()}/mo
                    </div>
                    <div className="text-xs space-y-0.5 border-t pt-1">
                      <div className="flex justify-between">
                        <span>Taxes:</span>
                        <span>${properties.reduce((sum, p) => sum + (p.annualPropertyTaxes || 0), 0).toLocaleString()}/yr (${Math.round(properties.reduce((sum, p) => sum + (p.annualPropertyTaxes || 0), 0) / 12).toLocaleString()}/mo)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hazard:</span>
                        <span>${properties.reduce((sum, p) => sum + (p.annualHazardInsurance || 0), 0).toLocaleString()}/yr (${Math.round(properties.reduce((sum, p) => sum + (p.annualHazardInsurance || 0), 0) / 12).toLocaleString()}/mo)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Flood:</span>
                        <span>${properties.reduce((sum, p) => sum + (p.annualFloodInsurance || 0), 0).toLocaleString()}/yr (${Math.round(properties.reduce((sum, p) => sum + (p.annualFloodInsurance || 0), 0) / 12).toLocaleString()}/mo)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>HOA:</span>
                        <span>${properties.reduce((sum, p) => sum + (p.annualHomeOwnersAssociation || 0), 0).toLocaleString()}/yr (${Math.round(properties.reduce((sum, p) => sum + (p.annualHomeOwnersAssociation || 0), 0) / 12).toLocaleString()}/mo)</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">Annual Expenses</div>
                </div>
              </div>
            </div>

            {/* Package Breakdown (if packages exist) */}
            {packageSplits.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Package Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {packageSplits.map((split, index) => (
                    <div key={split.id} className={`p-4 rounded-lg border-2 ${split.color}`}>
                      <div className="text-center mb-3">
                        <h4 className="font-semibold text-sm">Package {index + 1}</h4>
                        <p className="text-xs text-muted-foreground truncate">{split.name}</p>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span>Properties:</span>
                          <span className="font-semibold">{split.properties.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Value:</span>
                          <span className="font-semibold text-green-600">
                            ${split.properties.reduce((sum, p) => sum + (p.currentMarketValue || 0), 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mortgage:</span>
                          <span className="font-semibold text-blue-600">
                            ${split.properties.reduce((sum, p) => sum + (p.existingMortgageBalance || 0), 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>Total Expenses:</span>
                            <div className="text-right">
                              <div className="font-semibold text-purple-600">
                                ${split.properties.reduce((sum, p) => sum + (p.annualPropertyTaxes || 0) + (p.annualHazardInsurance || 0) + (p.annualFloodInsurance || 0) + (p.annualHomeOwnersAssociation || 0), 0).toLocaleString()}/yr
                              </div>
                              <div className="text-xs text-purple-500">
                                ${Math.round(split.properties.reduce((sum, p) => sum + (p.annualPropertyTaxes || 0) + (p.annualHazardInsurance || 0) + (p.annualFloodInsurance || 0) + (p.annualHomeOwnersAssociation || 0), 0) / 12).toLocaleString()}/mo
                              </div>
                            </div>
                          </div>
                          <div className="text-xs space-y-0.5 ml-2 border-t pt-1">
                            <div className="flex justify-between">
                              <span>• Taxes:</span>
                              <span>${split.properties.reduce((sum, p) => sum + (p.annualPropertyTaxes || 0), 0).toLocaleString()}/yr (${Math.round(split.properties.reduce((sum, p) => sum + (p.annualPropertyTaxes || 0), 0) / 12).toLocaleString()}/mo)</span>
                            </div>
                            <div className="flex justify-between">
                              <span>• Hazard:</span>
                              <span>${split.properties.reduce((sum, p) => sum + (p.annualHazardInsurance || 0), 0).toLocaleString()}/yr (${Math.round(split.properties.reduce((sum, p) => sum + (p.annualHazardInsurance || 0), 0) / 12).toLocaleString()}/mo)</span>
                            </div>
                            <div className="flex justify-between">
                              <span>• Flood:</span>
                              <span>${split.properties.reduce((sum, p) => sum + (p.annualFloodInsurance || 0), 0).toLocaleString()}/yr (${Math.round(split.properties.reduce((sum, p) => sum + (p.annualFloodInsurance || 0), 0) / 12).toLocaleString()}/mo)</span>
                            </div>
                            <div className="flex justify-between">
                              <span>• HOA:</span>
                              <span>${split.properties.reduce((sum, p) => sum + (p.annualHomeOwnersAssociation || 0), 0).toLocaleString()}/yr (${Math.round(split.properties.reduce((sum, p) => sum + (p.annualHomeOwnersAssociation || 0), 0) / 12).toLocaleString()}/mo)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Package Analysis */}
      {showPropertyGrid && properties.length > 0 && !showPackageSplitter && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Smart Package Analysis</span>
              <Button onClick={runPackageAnalysis} variant="outline">
                Analyze Package Compatibility
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Automatically analyze your properties for incompatible combinations that could impact loan approval.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Package Results */}
      {showPackageSplitter && packageSplits.length > 0 && (
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center justify-between">
               <span>Recommended Package Splits</span>
               <div className="flex space-x-2">
                 <Button onClick={runPackageAnalysis} variant="outline" size="sm">
                   Reanalyze Package
                 </Button>
                 <Button onClick={() => setShowPackageSplitter(false)} variant="outline" size="sm">
                   <X className="w-4 h-4" />
                 </Button>
               </div>
             </CardTitle>
           </CardHeader>
          <CardContent>
             <div className="space-y-4">
               {packageSplits.map((split, index) => (
                 <div key={split.id} className={`p-4 rounded-lg border-2 ${split.color} ${selectedPackageId === split.id ? 'ring-2 ring-primary' : ''}`}>
                   <div className="flex justify-between items-start mb-3">
                     <div className="flex items-center space-x-3">
                       <Checkbox 
                         checked={selectedPackageId === split.id}
                         onCheckedChange={() => selectedPackageId === split.id ? setSelectedPackageId(null) : viewPackage(split.id)}
                       />
                       <div>
                         <h3 className="font-semibold text-lg">Package {index + 1}: {split.name}</h3>
                         <p className="text-sm text-muted-foreground">{split.reason}</p>
                       </div>
                     </div>
                     <div className="flex items-center space-x-2">
                       <div className="text-right mr-4">
                         <div className="text-2xl font-bold">{split.properties.length}</div>
                         <div className="text-xs text-muted-foreground">Properties</div>
                       </div>
                       <Button
                         onClick={() => viewPackage(split.id)}
                         variant="outline"
                         size="sm"
                         className="bg-white hover:bg-gray-50"
                       >
                         <Eye className="w-4 h-4 mr-1" />
                         View
                       </Button>
                       <Button
                         onClick={() => deletePackage(split.id)}
                         variant="outline"
                         size="sm"
                         className="bg-white hover:bg-red-50 text-red-600 border-red-200 hover:border-red-300"
                       >
                         <Trash2 className="w-4 h-4" />
                       </Button>
                     </div>
                   </div>
                   
                   {/* Package Summary Statistics */}
                   <div className="grid grid-cols-3 gap-4 mb-3 p-3 bg-white/70 rounded">
                     <div className="text-center">
                       <div className="text-lg font-bold text-green-600">
                         ${split.properties.reduce((sum, p) => sum + (p.currentMarketValue || 0), 0).toLocaleString()}
                       </div>
                       <div className="text-xs text-muted-foreground">Total Value</div>
                     </div>
                     <div className="text-center">
                       <div className="text-lg font-bold text-blue-600">
                         ${split.properties.reduce((sum, p) => sum + (p.existingMortgageBalance || 0), 0).toLocaleString()}
                       </div>
                       <div className="text-xs text-muted-foreground">Mortgage Balance</div>
                     </div>
                       <div className="text-center">
                         <div className="space-y-1">
                           <div className="text-lg font-bold text-purple-600">
                             ${split.properties.reduce((sum, p) => sum + (p.annualPropertyTaxes || 0) + (p.annualHazardInsurance || 0) + (p.annualFloodInsurance || 0) + (p.annualHomeOwnersAssociation || 0), 0).toLocaleString()}/yr
                           </div>
                           <div className="text-sm font-semibold text-purple-500">
                             ${Math.round(split.properties.reduce((sum, p) => sum + (p.annualPropertyTaxes || 0) + (p.annualHazardInsurance || 0) + (p.annualFloodInsurance || 0) + (p.annualHomeOwnersAssociation || 0), 0) / 12).toLocaleString()}/mo
                           </div>
                           <div className="text-xs space-y-0.5 border-t pt-1">
                             <div>Taxes: ${split.properties.reduce((sum, p) => sum + (p.annualPropertyTaxes || 0), 0).toLocaleString()}/yr (${Math.round(split.properties.reduce((sum, p) => sum + (p.annualPropertyTaxes || 0), 0) / 12).toLocaleString()}/mo)</div>
                             <div>Hazard: ${split.properties.reduce((sum, p) => sum + (p.annualHazardInsurance || 0), 0).toLocaleString()}/yr (${Math.round(split.properties.reduce((sum, p) => sum + (p.annualHazardInsurance || 0), 0) / 12).toLocaleString()}/mo)</div>
                             <div>Flood: ${split.properties.reduce((sum, p) => sum + (p.annualFloodInsurance || 0), 0).toLocaleString()}/yr (${Math.round(split.properties.reduce((sum, p) => sum + (p.annualFloodInsurance || 0), 0) / 12).toLocaleString()}/mo)</div>
                             <div>HOA: ${split.properties.reduce((sum, p) => sum + (p.annualHomeOwnersAssociation || 0), 0).toLocaleString()}/yr (${Math.round(split.properties.reduce((sum, p) => sum + (p.annualHomeOwnersAssociation || 0), 0) / 12).toLocaleString()}/mo)</div>
                           </div>
                         </div>
                         <div className="text-xs text-muted-foreground">Annual Expenses</div>
                       </div>
                   </div>
                   
                   <div className="space-y-2 mb-3">
                     {split.properties.map((property) => (
                       <div key={property.id} className="text-sm bg-white/50 p-2 rounded border">
                         <div className="font-medium">{property.fullPropertyAddress || "Address not entered"}</div>
                         <div className="text-xs text-muted-foreground">
                           {property.structureType} • {property.countyName}
                         </div>
                       </div>
                     ))}
                   </div>
                   
                   <div className="flex justify-end">
                     <Button
                       onClick={() => submitPackage(split.id)}
                       className="bg-primary hover:bg-primary/90"
                       disabled={isLoading}
                     >
                       Submit for Pricing
                     </Button>
                   </div>
                 </div>
               ))}
             </div>
          </CardContent>
        </Card>
      )}

      {/* Property Grid */}
      {showPropertyGrid && (selectedPackageId ? displayedProperties.length > 0 : properties.length > 0) && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="bg-primary text-primary-foreground p-6 text-center">
            <h2 className="text-2xl font-semibold mb-2">
              {selectedPackageId 
                ? `${packageSplits.find(p => p.id === selectedPackageId)?.name || 'Package'} Properties` 
                : 'Property Portfolio Overview'
              }
            </h2>
            <p className="opacity-90">
              {selectedPackageId 
                ? `Viewing ${displayedProperties.length} properties in selected package`
                : `Manage all ${properties.length} properties`
              }
            </p>
          </div>
          
          <div className="overflow-auto max-h-[600px]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px] border-collapse">
                <thead className="bg-muted sticky top-0 z-10">
                  <tr>
                    <th className="sticky left-0 bg-muted border-r border-border p-3 text-left font-medium z-20 shadow-md">Address</th>
                    <th className="p-3 text-left font-medium">County</th>
                    <th className="p-3 text-left font-medium">Structure Type</th>
                    <th className="p-3 text-left font-medium">Condo</th>
                    <th className="p-3 text-left font-medium">Legal Non-Conforming</th>
                    <th className="p-3 text-left font-medium">Credit Score</th>
                    <th className="p-3 text-left font-medium">Purpose</th>
                    <th className="p-3 text-left font-medium">Purchase Date</th>
                    <th className="p-3 text-left font-medium">Purchase Price</th>
                    <th className="p-3 text-left font-medium">Rehab Costs</th>
                    <th className="p-3 text-left font-medium">Current Value</th>
                    <th className="p-3 text-left font-medium">Mortgage Balance</th>
                    <th className="p-3 text-left font-medium">Mortgage Rate</th>
                    <th className="p-3 text-left font-medium">Occupancy</th>
                    <th className="p-3 text-left font-medium">Market Rent</th>
                    <th className="p-3 text-left font-medium">Lease Amount</th>
                    <th className="p-3 text-left font-medium">Property Taxes</th>
                    <th className="p-3 text-left font-medium">Hazard Insurance</th>
                    <th className="p-3 text-left font-medium">Flood Insurance</th>
                    <th className="p-3 text-left font-medium">HOA Fees</th>
                    <th className="p-3 text-left font-medium">Condition</th>
                    <th className="p-3 text-left font-medium">Strategy</th>
                    <th className="p-3 text-left font-medium">Entity Name</th>
                    <th className="p-3 text-left font-medium">Notes</th>
                    <th className="p-3 text-center font-medium">Actions</th>
                  </tr>
                </thead>
                 <tbody>
                   {(selectedPackageId ? displayedProperties : properties).map((property, index) => (
                     <PropertyTableRow 
                       key={property.id} 
                       property={property} 
                       index={index} 
                       onUpdate={selectedPackageId ? (updatedProps) => {
                         // When viewing a package, update both displayedProperties and the main properties array
                         setDisplayedProperties(updatedProps);
                         const updatedMainProperties = properties.map(p => {
                           const updatedProp = updatedProps.find(up => up.id === p.id);
                           return updatedProp || p;
                         });
                         setProperties(updatedMainProperties);
                       } : handlePropertiesChange} 
                       properties={selectedPackageId ? displayedProperties : properties} 
                     />
                   ))}
                 </tbody>
              </table>
            </div>
          </div>
          
           <div className="flex justify-between items-center p-6 border-t bg-gray-50">
             <div className="flex gap-4">
               <Button variant="outline" onClick={addEmptyProperty}>
                 <Plus className="w-4 h-4 mr-2" />
                 Add Property
               </Button>
               <Button variant="secondary" onClick={generateTestData}>
                 Generate Test Data
               </Button>
               {selectedPackageId && (
                 <Button 
                   variant="outline" 
                   onClick={() => {
                     setSelectedPackageId(null);
                     setDisplayedProperties([]);
                   }}
                 >
                   Show All Properties
                 </Button>
               )}
               <div className="text-sm text-muted-foreground flex items-center">
                 Total Properties: <span className="font-semibold ml-1">
                   {selectedPackageId ? displayedProperties.length : properties.length}
                 </span>
               </div>
             </div>
            
            <Button onClick={handleSubmit} disabled={isLoading} className="bg-primary hover:bg-primary/90">
              {isLoading ? "Processing..." : "Get Package Loan Quote"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageLoanForm;
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
  const [uploadedDataTapeFile, setUploadedDataTapeFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Check for persisted data on component mount
  useEffect(() => {
    const storedData = localStorage.getItem('dominionDataTape');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (parsedData.loanPurpose) {
          setLoanPurpose(parsedData.loanPurpose);
        }
        if (parsedData.creditScore) {
          setCreditScore(parsedData.creditScore.toString());
        }
        setNumberOfProperties(parsedData.numberOfProperties.toString());
        setProperties(parsedData.properties);
        setShowPropertyGrid(true);
        
        toast({
          title: "Data Restored",
          description: `Restored ${parsedData.numberOfProperties} properties from previous upload`,
        });
      } catch (error) {
        console.error('Error restoring data tape:', error);
        localStorage.removeItem('dominionDataTape');
      }
    }
  }, [toast]);

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
        creditScore,
        dataTapeFile: uploadedDataTapeFile,
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
    setUploadedDataTapeFile(file);

    try {
      const parsedData = await parseDataTapeFile(file);
      
      // Auto-populate form fields with proper mapping
      if (parsedData.loanPurpose) {
        setLoanPurpose(parsedData.loanPurpose);
      }
      if (parsedData.creditScore) {
        setCreditScore(parsedData.creditScore.toString());
      }
      setNumberOfProperties(parsedData.numberOfProperties.toString());
      setProperties(parsedData.properties);
      
      // Store parsed data in localStorage for persistence between routes
      localStorage.setItem('dominionDataTape', JSON.stringify(parsedData));
      
      // Store parsed data in localStorage for persistence between routes
      localStorage.setItem('dominionDataTape', JSON.stringify(parsedData));
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

  const handleSubmit = async () => {
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

    // Require uploaded data tape file for webhook processing
    if (!uploadedDataTapeFile) {
      toast({
        title: "Data Tape Required",
        description: "Please upload your Excel/CSV data tape before requesting a quote.",
        variant: "destructive",
      });
      return;
    }

    // Call webhook with the uploaded file; block submission on failure
    try {
      const fd = new FormData();
      fd.append('file', uploadedDataTapeFile);
      const res = await fetch('https://n8n-prod.onrender.com/webhook/b86054ef-0fd4-43b2-8099-1f2269c7946a', {
        method: 'POST',
        body: fd,
      });

      if (!res.ok) {
        toast({
          title: 'Analysis Failed',
          description: `Webhook error: ${res.status}`,
          variant: 'destructive',
        });
        return; // Block navigation
      }

      const payload = await res.json();
      const webhookOutput = payload?.output || payload || {};

      const packageData = {
        loanPurpose,
        properties,
        packageType: "multi-property",
        creditScore,
        webhookOutput,
      };

      onSubmit(packageData);
    } catch (err) {
      console.error('Webhook error:', err);
      toast({
        title: 'Analysis Failed',
        description: 'Could not analyze the uploaded file. Please try again.',
        variant: 'destructive',
      });
      return; // Block navigation
    }
  };

  const handlePropertiesChange = (updatedProperties: Property[]) => {
    setProperties(updatedProperties);
  };

  return (
    <div className="max-w-full mx-auto space-y-8">
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
                  onClick={() => {
                    localStorage.removeItem('dominionDataTape');
                    setProperties([]);
                    setLoanPurpose("");
                    setCreditScore("");
                    setNumberOfProperties("");
                    setShowPropertyGrid(false);
                    setPackageSplits([]);
                    setShowPackageSplitter(false);
                    setSelectedPackageId(null);
                    setUploadedDataTapeFile(null);
                    toast({
                      title: "Data Cleared",
                      description: "Upload a new data tape file to start over",
                    });
                  }}
                  className="text-gray-600 border-gray-300 hover:bg-gray-50"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>
      )}

      {/* Enhanced Package Loan Details */}
      <Card className="bg-gradient-to-br from-white to-indigo-50/30 border-indigo-200/50 shadow-xl backdrop-blur-sm">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-xl text-dominion-blue">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            Package Loan Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-semibold">Loan Purpose</Label>
              <RadioGroup value={loanPurpose} onValueChange={setLoanPurpose} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-blue-300 hover:bg-blue-50 ${loanPurpose === 'purchase' ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200'}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="purchase" id="purchase" className="w-5 h-5" />
                    <div className="flex-1">
                      <Label htmlFor="purchase" className="font-semibold text-base cursor-pointer">Purchase</Label>
                      <p className="text-sm text-gray-600 mt-1">Financing for property acquisition</p>
                    </div>
                  </div>
                </div>
                <div className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-green-300 hover:bg-green-50 ${loanPurpose === 'refinance' ? 'border-green-500 bg-green-50 ring-2 ring-green-200' : 'border-gray-200'}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="refinance" id="refinance" className="w-5 h-5" />
                    <div className="flex-1">
                      <Label htmlFor="refinance" className="font-semibold text-base cursor-pointer">Refinance</Label>
                      <p className="text-sm text-gray-600 mt-1">Replacing existing mortgage</p>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="creditScore">Credit Score</Label>
                <Input
                  id="creditScore"
                  value={creditScore}
                  onChange={(e) => setCreditScore(e.target.value)}
                  placeholder="Enter credit score"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numberOfProperties">Number of Properties</Label>
                <Select value={numberOfProperties} onValueChange={setNumberOfProperties}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select number" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 20 }, (_, i) => i + 2).map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-6 text-gray-800">Portfolio Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Properties Count Card */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-blue-700">{properties.length}</div>
                      <div className="text-sm font-medium text-blue-600 mt-1">Total Properties</div>
                    </div>
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m8 7V3a2 2 0 012-2h4a2 2 0 012 2v4" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Total Value Card */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-green-700">
                        ${properties.reduce((sum, p) => sum + (p.currentMarketValue || 0), 0).toLocaleString()}
                      </div>
                      <div className="text-sm font-medium text-green-600 mt-1">Portfolio Value</div>
                    </div>
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Mortgage Balance Card */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-orange-700">
                        ${properties.reduce((sum, p) => sum + (p.existingMortgageBalance || 0), 0).toLocaleString()}
                      </div>
                      <div className="text-sm font-medium text-orange-600 mt-1">Mortgage Balance</div>
                    </div>
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Annual Expenses Section - Enhanced */}
              <div className="mt-6">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-purple-800">Annual Expenses Breakdown</h4>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-700">
                        ${properties.reduce((sum, p) => sum + (p.annualPropertyTaxes || 0) + (p.annualHazardInsurance || 0) + (p.annualFloodInsurance || 0) + (p.annualHomeOwnersAssociation || 0), 0).toLocaleString()}/yr
                      </div>
                      <div className="text-sm font-medium text-purple-600">
                        ${Math.round(properties.reduce((sum, p) => sum + (p.annualPropertyTaxes || 0) + (p.annualHazardInsurance || 0) + (p.annualFloodInsurance || 0) + (p.annualHomeOwnersAssociation || 0), 0) / 12).toLocaleString()}/mo
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/70 p-4 rounded-lg border border-purple-200/50">
                      <div className="text-xs text-purple-600 font-medium mb-1">Property Taxes</div>
                      <div className="text-lg font-bold text-purple-800">
                        ${properties.reduce((sum, p) => sum + (p.annualPropertyTaxes || 0), 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-purple-600">
                        ${Math.round(properties.reduce((sum, p) => sum + (p.annualPropertyTaxes || 0), 0) / 12).toLocaleString()}/mo
                      </div>
                    </div>
                    
                    <div className="bg-white/70 p-4 rounded-lg border border-purple-200/50">
                      <div className="text-xs text-purple-600 font-medium mb-1">Hazard Insurance</div>
                      <div className="text-lg font-bold text-purple-800">
                        ${properties.reduce((sum, p) => sum + (p.annualHazardInsurance || 0), 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-purple-600">
                        ${Math.round(properties.reduce((sum, p) => sum + (p.annualHazardInsurance || 0), 0) / 12).toLocaleString()}/mo
                      </div>
                    </div>
                    
                    <div className="bg-white/70 p-4 rounded-lg border border-purple-200/50">
                      <div className="text-xs text-purple-600 font-medium mb-1">Flood Insurance</div>
                      <div className="text-lg font-bold text-purple-800">
                        ${properties.reduce((sum, p) => sum + (p.annualFloodInsurance || 0), 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-purple-600">
                        ${Math.round(properties.reduce((sum, p) => sum + (p.annualFloodInsurance || 0), 0) / 12).toLocaleString()}/mo
                      </div>
                    </div>
                    
                    <div className="bg-white/70 p-4 rounded-lg border border-purple-200/50">
                      <div className="text-xs text-purple-600 font-medium mb-1">HOA Fees</div>
                      <div className="text-lg font-bold text-purple-800">
                        ${properties.reduce((sum, p) => sum + (p.annualHomeOwnersAssociation || 0), 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-purple-600">
                        ${Math.round(properties.reduce((sum, p) => sum + (p.annualHomeOwnersAssociation || 0), 0) / 12).toLocaleString()}/mo
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Package Breakdown (if packages exist) */}
            {packageSplits.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Package Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {packageSplits.map((split, index) => (
                    <div key={split.id} className="p-4 rounded-lg border border-gray-200 bg-white">
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-sm text-gray-900">Package {index + 1}</h4>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                            {split.properties.length} properties
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">{split.name}</p>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Value:</span>
                          <span className="font-semibold text-gray-900">
                            ${split.properties.reduce((sum, p) => sum + (p.currentMarketValue || 0), 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Mortgage:</span>
                          <span className="font-semibold text-gray-900">
                            ${split.properties.reduce((sum, p) => sum + (p.existingMortgageBalance || 0), 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="space-y-1">
                        <div className="flex justify-between pt-2 border-t border-gray-100">
                          <span className="text-gray-600">Annual Expenses:</span>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">
                              ${split.properties.reduce((sum, p) => sum + (p.annualPropertyTaxes || 0) + (p.annualHazardInsurance || 0) + (p.annualFloodInsurance || 0) + (p.annualHomeOwnersAssociation || 0), 0).toLocaleString()}/yr
                            </div>
                            <div className="text-xs text-gray-500">
                              ${Math.round(split.properties.reduce((sum, p) => sum + (p.annualPropertyTaxes || 0) + (p.annualHazardInsurance || 0) + (p.annualFloodInsurance || 0) + (p.annualHomeOwnersAssociation || 0), 0) / 12).toLocaleString()}/mo
                            </div>
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

      {/* Enhanced Smart Package Analysis */}
      {showPropertyGrid && properties.length > 0 && !showPackageSplitter && (
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50/30 border-amber-200/50 shadow-xl backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xl text-amber-800">Smart Package Analysis</div>
                  <div className="text-sm text-amber-600">AI-Powered Compatibility Detection</div>
                </div>
              </div>
              <Button 
                onClick={runPackageAnalysis}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-500 text-white px-6 py-3 shadow-lg hover:shadow-amber-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Analyze Compatibility
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-6 bg-white/70 rounded-xl border border-amber-100">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
                  <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-800 mb-2">Intelligent Portfolio Analysis</h4>
                  <p className="text-amber-700 leading-relaxed">
                    Our advanced algorithm automatically analyzes your properties for incompatible combinations, 
                    geographic restrictions, and lending guidelines that could impact loan approval. Get optimized 
                    package recommendations in seconds.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}


        {/* Package Results */}
        {showPackageSplitter && packageSplits.length > 0 && (
            <div className="space-y-6">
                {/* Header Section */}
                <Card className="border border-gray-200">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">Package Analysis Results</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    {packageSplits.length} packages identified
                                </p>
                            </div>
                            <div className="flex space-x-2">
                                <Button
                                    onClick={runPackageAnalysis}
                                    variant="outline"
                                    size="sm"
                                    className="border-gray-300 text-gray-700"
                                >
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

                {/* Package Grid */}
                <div className="grid gap-4">
                    {packageSplits.map((split, index) => {
                        return (
                            <Card
                                key={split.id}
                                className={`border ${selectedPackageId === split.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}
                            >

                                {/* Package Header */}
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="flex items-center gap-3">
                                                <Checkbox
                                                    checked={selectedPackageId === split.id}
                                                    onCheckedChange={() => selectedPackageId === split.id ? setSelectedPackageId(null) : viewPackage(split.id)}
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
                                                onClick={() => viewPackage(split.id)}
                                                variant="outline"
                                                size="sm"
                                                className="border-gray-300 text-gray-700"
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                View
                                            </Button>
                                            <Button
                                                onClick={() => deletePackage(split.id)}
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
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <div className="text-lg font-semibold text-gray-900 mb-1">
                                                ${split.properties.reduce((sum, p) => sum + (p.currentMarketValue || 0), 0).toLocaleString()}
                                            </div>
                                            <div className="text-sm text-gray-600">Portfolio Value</div>
                                        </div>

                                        {/* Mortgage Balance */}
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <div className="text-lg font-semibold text-gray-900 mb-1">
                                                ${split.properties.reduce((sum, p) => sum + (p.existingMortgageBalance || 0), 0).toLocaleString()}
                                            </div>
                                            <div className="text-sm text-gray-600">Mortgage Balance</div>
                                        </div>

                                        {/* LTV Calculation */}
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <div className="text-lg font-semibold text-gray-900 mb-1">
                                                {split.properties.reduce((sum, p) => sum + (p.currentMarketValue || 0), 0) > 0
                                                    ? Math.round((split.properties.reduce((sum, p) => sum + (p.existingMortgageBalance || 0), 0) / split.properties.reduce((sum, p) => sum + (p.currentMarketValue || 0), 0)) * 100)
                                                    : 0}%
                                            </div>
                                            <div className="text-sm text-gray-600">Loan-to-Value</div>
                                        </div>

                                        {/* Annual Expenses */}
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <div className="text-lg font-semibold text-gray-900 mb-1">
                                                ${Math.round(split.properties.reduce((sum, p) => sum + (p.annualPropertyTaxes || 0) + (p.annualHazardInsurance || 0) + (p.annualFloodInsurance || 0) + (p.annualHomeOwnersAssociation || 0), 0) / 12).toLocaleString()}/mo
                                            </div>
                                            <div className="text-sm text-gray-600">
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

                                    {/* Action Button */}
                                    <div className="mt-6 flex justify-end">
                                        <Button
                                            onClick={() => submitPackage(split.id)}
                                            className="bg-dominion-blue hover:bg-blue-700 text-white"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Processing...' : 'Submit Package for Pricing'}
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
        )}

      {/* Property Grid */}
      {showPropertyGrid && (selectedPackageId ? displayedProperties.length > 0 : properties.length > 0) && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="bg-dominion-blue text-white p-6 text-center">
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
            
            <Button onClick={handleSubmit} disabled={isLoading} className="bg-dominion-blue hover:bg-blue-700 text-white">
              {isLoading ? "Processing..." : "Get Package Loan Quote"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageLoanForm;
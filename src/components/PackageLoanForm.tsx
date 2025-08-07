import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Plus, Trash2, Eye, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Property {
  id: string;
  fullPropertyAddress: string;
  countyName: string;
  structureType: string;
  numberOfUnits?: number;
  squareFootage?: number;
  sqfType?: string;
  condo: string;
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
      <td className="sticky left-0 bg-background shadow-r p-2 max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap font-medium z-1">
        <Input
          value={property.fullPropertyAddress}
          onChange={(e) => updateProperty('fullPropertyAddress', e.target.value)}
          placeholder="Enter property address"
          className="min-w-[200px] h-8 text-sm"
        />
      </td>
      <td className="p-2">
        <Input
          value={property.countyName}
          onChange={(e) => updateProperty('countyName', e.target.value)}
          placeholder="County"
          className="min-w-[120px] h-8 text-sm"
        />
      </td>
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
      <td className="p-2">
        <Input
          type="number"
          value={property.purchasePrice || ''}
          onChange={(e) => updateProperty('purchasePrice', parseFloat(e.target.value) || 0)}
          placeholder="0"
          className="min-w-[120px] h-8 text-sm"
        />
      </td>
      <td className="p-2">
        <Input
          type="number"
          value={property.currentMarketValue || ''}
          onChange={(e) => updateProperty('currentMarketValue', parseFloat(e.target.value) || 0)}
          placeholder="0"
          className="min-w-[120px] h-8 text-sm"
        />
      </td>
      <td className="p-2">
        <Input
          value={property.marketRent}
          onChange={(e) => updateProperty('marketRent', e.target.value)}
          placeholder="$0/mo"
          className="min-w-[100px] h-8 text-sm"
        />
      </td>
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
  const { toast } = useToast();

  const initializeEmptyProperties = () => {
    const count = parseInt(numberOfProperties);
    if (count > 0) {
      const emptyProperties: Property[] = Array.from({ length: count }, (_, index) => ({
        id: `property-${Date.now()}-${index}`,
        fullPropertyAddress: "",
        countyName: "",
        structureType: "",
        condo: "",
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
      condo: "",
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
        condo: "No",
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
        condo: "No",
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
      }
    ];
    
    setProperties(testProperties);
    toast({
      title: "Test Data Generated",
      description: `Created ${testProperties.length} test properties`,
    });
  };

  const analyzeProperties = (): PackageSplit[] => {
    if (properties.length === 0) return [];
    
    const splits: PackageSplit[] = [];
    const usedPropertyIds = new Set<string>();

    const rules = [
      {
        name: "Rural Properties",
        filter: (p: Property) => p.isRural === "yes",
        reason: "Rural properties require separate packaging due to note buyer restrictions",
        color: "bg-orange-100 border-orange-300"
      },
      {
        name: "Short-Term Rentals",
        filter: (p: Property) => p.strategyForProperty.toLowerCase().includes('airbnb') || p.strategyForProperty.toLowerCase().includes('short'),
        reason: "Short-term rental properties need specialized loan programs",
        color: "bg-blue-100 border-blue-300"
      }
    ];

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

    const remainingProperties = properties.filter(p => !usedPropertyIds.has(p.id));
    if (remainingProperties.length > 0) {
      splits.push({
        id: 'split-standard',
        name: 'Standard Package',
        properties: remainingProperties,
        reason: 'Standard investment properties that can be packaged together',
        color: 'bg-gray-100 border-gray-300'
      });
    }

    return splits;
  };

  const runPackageAnalysis = () => {
    const analysis = analyzeProperties();
    setPackageSplits(analysis);
    setShowPackageSplitter(true);
  };

  const handleSubmit = () => {
    if (!loanPurpose) {
      alert("Please select loan purpose");
      return;
    }

    if (properties.length === 0) {
      alert("Please add at least one property");
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
            <CardTitle>Recommended Package Splits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {packageSplits.map((split, index) => (
                <div key={split.id} className={`p-4 rounded-lg border-2 ${split.color}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">Package {index + 1}: {split.name}</h3>
                      <p className="text-sm text-muted-foreground">{split.reason}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{split.properties.length}</div>
                      <div className="text-xs text-muted-foreground">Properties</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {split.properties.map((property) => (
                      <div key={property.id} className="text-sm bg-white/50 p-2 rounded border">
                        <div className="font-medium">{property.fullPropertyAddress || "Address not entered"}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Property Grid */}
      {showPropertyGrid && properties.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="bg-primary text-primary-foreground p-6 text-center">
            <h2 className="text-2xl font-semibold mb-2">Property Portfolio Overview</h2>
            <p className="opacity-90">Manage all {properties.length} properties</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] border-collapse">
              <thead className="bg-muted">
                <tr>
                  <th className="sticky left-0 bg-muted p-3 text-left font-medium">Address</th>
                  <th className="p-3 text-left font-medium">County</th>
                  <th className="p-3 text-left font-medium">Type</th>
                  <th className="p-3 text-left font-medium">Purchase Price</th>
                  <th className="p-3 text-left font-medium">Current Value</th>
                  <th className="p-3 text-left font-medium">Market Rent</th>
                  <th className="p-3 text-left font-medium">Occupancy</th>
                  <th className="p-3 text-center font-medium">Actions</th>
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
          
          <div className="flex justify-between items-center p-6 border-t">
            <div className="flex gap-4">
              <Button variant="outline" onClick={addEmptyProperty}>
                <Plus className="w-4 h-4 mr-2" />
                Add Property
              </Button>
              <Button variant="secondary" onClick={generateTestData}>
                Generate Test Data
              </Button>
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
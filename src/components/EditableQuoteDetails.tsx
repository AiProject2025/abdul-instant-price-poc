import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Save } from "lucide-react";
import { useScenarios } from "@/hooks/useScenarios";
import { useToast } from "@/hooks/use-toast";

interface EditableQuoteDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    borrowerName: string;
    propertyAddress: string;
    loanAmount: number;
    interestRate: number;
    monthlyPayment: number;
    loanTerm: number;
    ltv: number;
    dscr: number;
    propertyType: string;
    loanPurpose: string;
    refinanceType?: string;
    points: number;
    noteBuyer: string;
    loanOfficer: string;
    phoneNumber: string;
    date: string;
    // Additional fields for comprehensive quote
    propertiesQuoted?: number;
    appraised_value?: number;
    interestOnly?: string;
    interestReserve?: number;
    escrowForTaxes?: string;
    floodCertification?: string;
    processingFee?: string;
    rateLockFee?: string;
    legalFees?: string;
    payoffAmount?: number;
    datePurchased?: string;
    purchasePrice?: number;
    rentalStatus?: string;
    rehabCosts?: number;
    totalMonthlyRent?: number;
    annualTaxAmount?: number;
    totalMarketRent?: number;
    annualInsuranceCost?: number;
    creditScore?: number;
    annualAssociationFees?: number;
    propertyCondition?: string;
  };
  onSave: (data: any) => void;
  onReQuote?: (data: any) => void;
  currentPricingResults?: any[];
}

const EditableQuoteDetails = ({ isOpen, onClose, initialData, onSave, onReQuote, currentPricingResults }: EditableQuoteDetailsProps) => {
  const [editData, setEditData] = useState({
    ...initialData,
    // Set defaults for new fields
    propertiesQuoted: initialData.propertiesQuoted || 1,
    appraised_value: initialData.appraised_value || Math.round(initialData.loanAmount / (initialData.ltv / 100)),
    interestOnly: initialData.interestOnly || "No",
    interestReserve: initialData.interestReserve || 0,
    escrowForTaxes: initialData.escrowForTaxes || "Required",
    floodCertification: initialData.floodCertification || "$120 reimbursement",
    processingFee: initialData.processingFee || "$350 loan processing fee for title company coordination",
    rateLockFee: initialData.rateLockFee || "Upfront Cost of 0.35% of Proposed Loan Amount",
    legalFees: initialData.legalFees || "$500 loan doc prep to Dominion Financial Services LLC",
    payoffAmount: initialData.payoffAmount || 0,
    datePurchased: initialData.datePurchased || "",
    purchasePrice: initialData.purchasePrice || 0,
    rentalStatus: initialData.rentalStatus || "Leased",
    rehabCosts: initialData.rehabCosts || 0,
    totalMonthlyRent: initialData.totalMonthlyRent || 0,
    annualTaxAmount: initialData.annualTaxAmount || 0,
    totalMarketRent: initialData.totalMarketRent || 0,
    annualInsuranceCost: initialData.annualInsuranceCost || 0,
    creditScore: initialData.creditScore || 750,
    annualAssociationFees: initialData.annualAssociationFees || 0,
    propertyCondition: initialData.propertyCondition || "C4 or better"
  });
  const [scenarioName, setScenarioName] = useState("");
  const [isRequoting, setIsRequoting] = useState(false);
  
  const { saveScenario, saveScenarioResults } = useScenarios();
  const { toast } = useToast();

  // Auto-generate scenario name based on edit data
  const generateScenarioName = () => {
    const ltv = editData.ltv || "N/A";
    const noteBuyer = editData.noteBuyer || "N/A";
    const loanAmount = editData.loanAmount || 0;
    const rate = editData.interestRate ? editData.interestRate.toFixed(3) : "N/A";
    const points = editData.points || 0;
    const interestOnly = editData.interestOnly === "Yes" ? "IO" : "";
    
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(loanAmount);
    
    return `${noteBuyer} ${ltv}%LTV ${formattedAmount} ${rate}% ${points}pts ${interestOnly}`.trim();
  };

  // Auto-populate scenario name when data changes or dialog opens
  useEffect(() => {
    if (isOpen && editData.loanAmount) {
      const autoName = generateScenarioName();
      if (autoName && autoName !== scenarioName) {
        setScenarioName(autoName);
      }
    }
  }, [isOpen, editData.loanAmount, editData.ltv, editData.noteBuyer, editData.interestRate, editData.points, editData.interestOnly]);

  const handleInputChange = (field: string, value: any) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(editData);
    onClose();
  };

  const handleReQuote = async () => {
    if (!onReQuote) return;
    
    setIsRequoting(true);
    try {
      await onReQuote(editData);
    } catch (error) {
      console.error('Error re-quoting:', error);
      toast({
        title: "Error",
        description: "Failed to re-quote with updated data",
        variant: "destructive"
      });
    } finally {
      setIsRequoting(false);
    }
  };

  const handleSaveScenario = async () => {
    if (!scenarioName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a scenario name",
        variant: "destructive"
      });
      return;
    }

    const scenarioId = await saveScenario(scenarioName, editData);
    if (scenarioId && currentPricingResults && currentPricingResults.length > 0) {
      // Also save the current pricing results with this scenario
      await saveScenarioResults(scenarioId, currentPricingResults);
      setScenarioName(generateScenarioName()); // Reset to new auto-generated name for next save
      toast({
        title: "Success",
        description: "Scenario and pricing results saved successfully"
      });
    } else if (scenarioId) {
      setScenarioName(generateScenarioName()); // Reset to new auto-generated name for next save
      toast({
        title: "Success", 
        description: "Scenario saved successfully"
      });
    }
    
    // Force a small delay to ensure the UI updates
    setTimeout(() => {
      // This ensures any parent components re-render
      window.dispatchEvent(new CustomEvent('scenarioSaved', { detail: { scenarioId } }));
    }, 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Quote Details</DialogTitle>
        </DialogHeader>

        {/* Action Buttons at Top */}
        <div className="flex flex-wrap gap-2 p-4 bg-muted/50 rounded-lg">
          {onReQuote && (
            <Button 
              onClick={handleReQuote} 
              disabled={isRequoting}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRequoting ? 'animate-spin' : ''}`} />
              {isRequoting ? 'Re-quoting...' : 'Re-Quote with Updated Numbers'}
            </Button>
          )}
          
          <div className="flex items-center gap-2">
            <Input
              placeholder="Scenario name will auto-populate..."
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              className="w-40"
            />
            <Button 
              onClick={handleSaveScenario}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Scenario
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="borrowerName">Borrower Name</Label>
            <Input
              id="borrowerName"
              value={editData.borrowerName}
              onChange={(e) => handleInputChange('borrowerName', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="propertyAddress">Property Address</Label>
            <Input
              id="propertyAddress"
              value={editData.propertyAddress}
              onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="loanAmount">Loan Amount</Label>
            <Input
              id="loanAmount"
              type="number"
              value={editData.loanAmount}
              onChange={(e) => handleInputChange('loanAmount', parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interestRate">Interest Rate (%)</Label>
            <Input
              id="interestRate"
              type="number"
              step="0.001"
              value={editData.interestRate}
              onChange={(e) => handleInputChange('interestRate', parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyPayment">Monthly Payment</Label>
            <Input
              id="monthlyPayment"
              type="number"
              value={editData.monthlyPayment}
              onChange={(e) => handleInputChange('monthlyPayment', parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="loanTerm">Loan Term (months)</Label>
            <Input
              id="loanTerm"
              type="number"
              value={editData.loanTerm}
              onChange={(e) => handleInputChange('loanTerm', parseInt(e.target.value) || 360)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ltv">LTV (%)</Label>
            <Input
              id="ltv"
              type="number"
              value={editData.ltv}
              onChange={(e) => handleInputChange('ltv', parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dscr">DSCR</Label>
            <Input
              id="dscr"
              type="number"
              step="0.001"
              value={editData.dscr}
              onChange={(e) => handleInputChange('dscr', parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="propertyType">Property Type</Label>
            <Select
              value={editData.propertyType}
              onValueChange={(value) => handleInputChange('propertyType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Single Family">Single Family</SelectItem>
                <SelectItem value="Townhouse">Townhouse</SelectItem>
                <SelectItem value="Condominium">Condominium</SelectItem>
                <SelectItem value="2-4 Unit">2-4 Unit</SelectItem>
                <SelectItem value="5+ Unit">5+ Unit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="loanPurpose">Loan Purpose</Label>
            <Select
              value={editData.loanPurpose}
              onValueChange={(value) => handleInputChange('loanPurpose', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Purchase">Purchase</SelectItem>
                <SelectItem value="Refinance">Refinance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {editData.loanPurpose === 'Refinance' && (
            <div className="space-y-2">
              <Label htmlFor="refinanceType">Refinance Type</Label>
              <Select
                value={editData.refinanceType || ''}
                onValueChange={(value) => handleInputChange('refinanceType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select refinance type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash Out">Cash Out</SelectItem>
                  <SelectItem value="Rate/Term">Rate/Term</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="points">Points (%)</Label>
            <Input
              id="points"
              type="number"
              step="0.001"
              value={editData.points}
              onChange={(e) => handleInputChange('points', parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="noteBuyer">Note Buyer</Label>
            <Input
              id="noteBuyer"
              value={editData.noteBuyer}
              onChange={(e) => handleInputChange('noteBuyer', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="loanOfficer">Loan Officer</Label>
            <Input
              id="loanOfficer"
              value={editData.loanOfficer}
              onChange={(e) => handleInputChange('loanOfficer', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={editData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              value={editData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
            />
          </div>

          {/* Additional Quote Details */}
          <div className="col-span-full">
            <h3 className="text-lg font-semibold mb-4 text-dominion-blue">Additional Quote Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="space-y-2">
                <Label htmlFor="propertiesQuoted"># of Properties Quoted</Label>
                <Input
                  id="propertiesQuoted"
                  type="number"
                  value={editData.propertiesQuoted}
                  onChange={(e) => handleInputChange('propertiesQuoted', parseInt(e.target.value) || 1)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="appraised_value">Appraised Value</Label>
                <Input
                  id="appraised_value"
                  type="number"
                  value={editData.appraised_value}
                  onChange={(e) => handleInputChange('appraised_value', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interestOnly">Interest Only</Label>
                <Select
                  value={editData.interestOnly}
                  onValueChange={(value) => handleInputChange('interestOnly', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interestReserve">Interest Reserve</Label>
                <Input
                  id="interestReserve"
                  type="number"
                  value={editData.interestReserve}
                  onChange={(e) => handleInputChange('interestReserve', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="escrowForTaxes">Escrow For Taxes & Insurance</Label>
                <Select
                  value={editData.escrowForTaxes}
                  onValueChange={(value) => handleInputChange('escrowForTaxes', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Required">Required</SelectItem>
                    <SelectItem value="Not Required">Not Required</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="floodCertification">Flood Certification</Label>
                <Input
                  id="floodCertification"
                  value={editData.floodCertification}
                  onChange={(e) => handleInputChange('floodCertification', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="processingFee">Processing Fee</Label>
                <Input
                  id="processingFee"
                  value={editData.processingFee}
                  onChange={(e) => handleInputChange('processingFee', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rateLockFee">Optional Rate Lock Fee</Label>
                <Input
                  id="rateLockFee"
                  value={editData.rateLockFee}
                  onChange={(e) => handleInputChange('rateLockFee', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="legalFees">Legal</Label>
                <Input
                  id="legalFees"
                  value={editData.legalFees}
                  onChange={(e) => handleInputChange('legalFees', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Property Details Section */}
          <div className="col-span-full">
            <h3 className="text-lg font-semibold mb-4 text-dominion-blue">Property Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="space-y-2">
                <Label htmlFor="payoffAmount">Payoff to Current Lender</Label>
                <Input
                  id="payoffAmount"
                  type="number"
                  value={editData.payoffAmount}
                  onChange={(e) => handleInputChange('payoffAmount', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchasePrice">Purchase Price</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  value={editData.purchasePrice}
                  onChange={(e) => handleInputChange('purchasePrice', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="datePurchased">Date Purchased</Label>
                <Input
                  id="datePurchased"
                  value={editData.datePurchased}
                  onChange={(e) => handleInputChange('datePurchased', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rehabCosts">Rehab Costs Already Spent</Label>
                <Input
                  id="rehabCosts"
                  type="number"
                  value={editData.rehabCosts}
                  onChange={(e) => handleInputChange('rehabCosts', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rentalStatus">Rental Status</Label>
                <Select
                  value={editData.rentalStatus}
                  onValueChange={(value) => handleInputChange('rentalStatus', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Leased">Leased</SelectItem>
                    <SelectItem value="Vacant">Vacant</SelectItem>
                    <SelectItem value="Owner Occupied">Owner Occupied</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="annualTaxAmount">Annual Tax Amount</Label>
                <Input
                  id="annualTaxAmount"
                  type="number"
                  value={editData.annualTaxAmount}
                  onChange={(e) => handleInputChange('annualTaxAmount', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalMonthlyRent">Total Monthly Rent</Label>
                <Input
                  id="totalMonthlyRent"
                  type="number"
                  value={editData.totalMonthlyRent}
                  onChange={(e) => handleInputChange('totalMonthlyRent', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="annualInsuranceCost">Annual Insurance Cost</Label>
                <Input
                  id="annualInsuranceCost"
                  type="number"
                  value={editData.annualInsuranceCost}
                  onChange={(e) => handleInputChange('annualInsuranceCost', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalMarketRent">Total Market Rent</Label>
                <Input
                  id="totalMarketRent"
                  type="number"
                  value={editData.totalMarketRent}
                  onChange={(e) => handleInputChange('totalMarketRent', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="annualAssociationFees">Annual Association Fees</Label>
                <Input
                  id="annualAssociationFees"
                  type="number"
                  value={editData.annualAssociationFees}
                  onChange={(e) => handleInputChange('annualAssociationFees', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="creditScore">Credit Score</Label>
                <Input
                  id="creditScore"
                  type="number"
                  value={editData.creditScore}
                  onChange={(e) => handleInputChange('creditScore', parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="propertyCondition">Property Condition</Label>
                <Input
                  id="propertyCondition"
                  value={editData.propertyCondition}
                  onChange={(e) => handleInputChange('propertyCondition', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-dominion-blue hover:bg-dominion-blue/90">
            Save & Generate Quote
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditableQuoteDetails;
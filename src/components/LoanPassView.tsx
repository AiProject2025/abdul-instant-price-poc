import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft } from "lucide-react";

interface LoanPassViewProps {
  onBack: () => void;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

const LoanPassView = ({ onBack, onSubmit, isLoading }: LoanPassViewProps) => {
  const [formData, setFormData] = useState({
    loanStatus: "",
    borrowerEmail: "",
    entityOrPersonal: "Entity",
    firstTimeInvestor: "No",
    citizenType: "",
    desiredLoanTerm: "360 month(s)",
    creditEvent: "No",
    creditEventType: "",
    mortgageLatePayments: "No",
    mortgageLateType: "",
    state: "",
    propertyType: "",
    condoApprovalType: "",
    propertyCondition: "",
    vacant: "No",
    nonconformingUse: "No",
    canRebuild: "",
    shortTermRental: "No",
    m2mLease: "No",
    section8: "No",
    ruralProperty: "No",
    decliningMarkets: "No",
    existingDebt: "No",
    crossCollateralized: "No",
    interestOnly: "No",
    loanPurpose: "",
    delayedPurchase: "No",
    thirdPartyValuationStatus: "Pending",
    interestReserves: "No",
    prepaymentPenaltyTerm: "",
    prepaymentPenaltyStructure: "",
    isProductAApproved: "No",
    generateLoanQuote: "No",
    loanOfficerName: "",
    exceptionRequest: "No",
    managerException: "No",
    pricingException: "No"
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-dominion-blue">Loan Pass View</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="loanStatus">Loan Status</Label>
              <Select value={formData.loanStatus} onValueChange={(value) => handleInputChange('loanStatus', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select loan status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Initial Loan Quote">Initial Loan Quote</SelectItem>
                  <SelectItem value="In-Processing">In-Processing</SelectItem>
                  <SelectItem value="Final Loan Quote Received">Final Loan Quote Received</SelectItem>
                  <SelectItem value="In-QC">In-QC</SelectItem>
                  <SelectItem value="Cleared to Close (CTC)">Cleared to Close (CTC)</SelectItem>
                  <SelectItem value="Funded">Funded</SelectItem>
                  <SelectItem value="Denied">Denied</SelectItem>
                  <SelectItem value="Withdrawn">Withdrawn</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="borrowerEmail">Borrower Email Address</Label>
              <Input
                id="borrowerEmail"
                type="email"
                value={formData.borrowerEmail}
                onChange={(e) => handleInputChange('borrowerEmail', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Borrower Information */}
        <Card>
          <CardHeader>
            <CardTitle>Borrower Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Is Bwr closing under an entity or personal name?</Label>
              <RadioGroup
                value={formData.entityOrPersonal}
                onValueChange={(value) => handleInputChange('entityOrPersonal', value)}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Entity" id="entity" />
                  <Label htmlFor="entity">Entity</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Personal" id="personal" />
                  <Label htmlFor="personal">Personal</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label>First Time Investor</Label>
              <RadioGroup
                value={formData.firstTimeInvestor}
                onValueChange={(value) => handleInputChange('firstTimeInvestor', value)}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="firstTimeYes" />
                  <Label htmlFor="firstTimeYes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="firstTimeNo" />
                  <Label htmlFor="firstTimeNo">No</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label htmlFor="citizenType">Citizen Type</Label>
              <Select value={formData.citizenType} onValueChange={(value) => handleInputChange('citizenType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select citizen type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US Citizen">US Citizen</SelectItem>
                  <SelectItem value="Foreign National">Foreign National</SelectItem>
                  <SelectItem value="Non-Permanent Resident Alien">Non-Permanent Resident Alien</SelectItem>
                  <SelectItem value="Permanent Resident Alien">Permanent Resident Alien</SelectItem>
                  <SelectItem value="ITIN">ITIN</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="desiredLoanTerm">Desired Loan Term</Label>
              <Select value={formData.desiredLoanTerm} onValueChange={(value) => handleInputChange('desiredLoanTerm', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="360 month(s)">360 month(s)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Credit Event</Label>
              <div className="space-y-2">
                <RadioGroup
                  value={formData.creditEvent}
                  onValueChange={(value) => handleInputChange('creditEvent', value)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id="creditEventYes" />
                    <Label htmlFor="creditEventYes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id="creditEventNo" />
                    <Label htmlFor="creditEventNo">No</Label>
                  </div>
                </RadioGroup>
                
                {formData.creditEvent === "Yes" && (
                  <Select value={formData.creditEventType} onValueChange={(value) => handleInputChange('creditEventType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select credit event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Chapter 7 Bankruptcy">Chapter 7 Bankruptcy</SelectItem>
                      <SelectItem value="Chapter 11 Bankruptcy">Chapter 11 Bankruptcy</SelectItem>
                      <SelectItem value="Chapter 13 Bankruptcy">Chapter 13 Bankruptcy</SelectItem>
                      <SelectItem value="Deed-In-Lieu">Deed-In-Lieu</SelectItem>
                      <SelectItem value="Forbearance">Forbearance</SelectItem>
                      <SelectItem value="Foreclosure">Foreclosure</SelectItem>
                      <SelectItem value="Short Sale">Short Sale</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
            
            <div>
              <Label>Mortgage Late Payments</Label>
              <div className="space-y-2">
                <RadioGroup
                  value={formData.mortgageLatePayments}
                  onValueChange={(value) => handleInputChange('mortgageLatePayments', value)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id="latePaymentsYes" />
                    <Label htmlFor="latePaymentsYes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id="latePaymentsNo" />
                    <Label htmlFor="latePaymentsNo">No</Label>
                  </div>
                </RadioGroup>
                
                {formData.mortgageLatePayments === "Yes" && (
                  <Select value={formData.mortgageLateType} onValueChange={(value) => handleInputChange('mortgageLateType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select late payment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="x30x6">x30x6</SelectItem>
                      <SelectItem value="x30x12">x30x12</SelectItem>
                      <SelectItem value="x30x24">x30x24</SelectItem>
                      <SelectItem value="x60x12">x60x12</SelectItem>
                      <SelectItem value="x60x24">x60x24</SelectItem>
                      <SelectItem value="x90x12">x90x12</SelectItem>
                      <SelectItem value="x90x24">x90x24</SelectItem>
                      <SelectItem value="x120x12">x120x12</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Information */}
        <Card>
          <CardHeader>
            <CardTitle>Property Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="state">State</Label>
              <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Maryland (MD)">Maryland (MD)</SelectItem>
                  <SelectItem value="California (CA)">California (CA)</SelectItem>
                  <SelectItem value="New York (NY)">New York (NY)</SelectItem>
                  <SelectItem value="Texas (TX)">Texas (TX)</SelectItem>
                  <SelectItem value="Florida (FL)">Florida (FL)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="propertyType">Property Type</Label>
              <Select value={formData.propertyType} onValueChange={(value) => handleInputChange('propertyType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Single Family">Single Family</SelectItem>
                  <SelectItem value="Condominium">Condominium</SelectItem>
                  <SelectItem value="Two to Four Family">Two to Four Family</SelectItem>
                  <SelectItem value="Mixed-Use">Mixed-Use</SelectItem>
                  <SelectItem value="Modular Home">Modular Home</SelectItem>
                  <SelectItem value="Manufactured Home">Manufactured Home</SelectItem>
                  <SelectItem value="Multi Family (5-10)">Multi Family (5-10)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {formData.propertyType === "Condominium" && (
              <div>
                <Label htmlFor="condoApprovalType">Condo Approval Type</Label>
                <Select value={formData.condoApprovalType} onValueChange={(value) => handleInputChange('condoApprovalType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condo approval type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Warrantable">Warrantable</SelectItem>
                    <SelectItem value="Non-Warrantable">Non-Warrantable</SelectItem>
                    <SelectItem value="Condotel">Condotel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div>
              <Label htmlFor="propertyCondition">Property Condition</Label>
              <Select value={formData.propertyCondition} onValueChange={(value) => handleInputChange('propertyCondition', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="C1">C1</SelectItem>
                  <SelectItem value="C2">C2</SelectItem>
                  <SelectItem value="C3">C3</SelectItem>
                  <SelectItem value="C4">C4</SelectItem>
                  <SelectItem value="C5">C5</SelectItem>
                  <SelectItem value="C6">C6</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Vacant</Label>
              <RadioGroup
                value={formData.vacant}
                onValueChange={(value) => handleInputChange('vacant', value)}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="vacantYes" />
                  <Label htmlFor="vacantYes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="vacantNo" />
                  <Label htmlFor="vacantNo">No</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label>Nonconforming/Grandfathered Use?</Label>
              <div className="space-y-2">
                <RadioGroup
                  value={formData.nonconformingUse}
                  onValueChange={(value) => handleInputChange('nonconformingUse', value)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id="nonconformingYes" />
                    <Label htmlFor="nonconformingYes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id="nonconformingNo" />
                    <Label htmlFor="nonconformingNo">No</Label>
                  </div>
                </RadioGroup>
                
                {formData.nonconformingUse === "Yes" && (
                  <div>
                    <Label>Can the property be legally rebuilt if destroyed?</Label>
                    <RadioGroup
                      value={formData.canRebuild}
                      onValueChange={(value) => handleInputChange('canRebuild', value)}
                      className="flex gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="canRebuildYes" />
                        <Label htmlFor="canRebuildYes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="canRebuildNo" />
                        <Label htmlFor="canRebuildNo">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <Label>Short Term Rental</Label>
              <RadioGroup
                value={formData.shortTermRental}
                onValueChange={(value) => handleInputChange('shortTermRental', value)}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="shortTermRentalYes" />
                  <Label htmlFor="shortTermRentalYes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="shortTermRentalNo" />
                  <Label htmlFor="shortTermRentalNo">No</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label>MTM Lease</Label>
              <RadioGroup
                value={formData.m2mLease}
                onValueChange={(value) => handleInputChange('m2mLease', value)}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="m2mLeaseYes" />
                  <Label htmlFor="m2mLeaseYes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="m2mLeaseNo" />
                  <Label htmlFor="m2mLeaseNo">No</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label>Section 8</Label>
              <RadioGroup
                value={formData.section8}
                onValueChange={(value) => handleInputChange('section8', value)}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="section8Yes" />
                  <Label htmlFor="section8Yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="section8No" />
                  <Label htmlFor="section8No">No</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label>Rural Property</Label>
              <RadioGroup
                value={formData.ruralProperty}
                onValueChange={(value) => handleInputChange('ruralProperty', value)}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="ruralYes" />
                  <Label htmlFor="ruralYes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="ruralNo" />
                  <Label htmlFor="ruralNo">No</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label>Declining Markets</Label>
              <RadioGroup
                value={formData.decliningMarkets}
                onValueChange={(value) => handleInputChange('decliningMarkets', value)}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="decliningMarketsYes" />
                  <Label htmlFor="decliningMarketsYes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="decliningMarketsNo" />
                  <Label htmlFor="decliningMarketsNo">No</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label>Existing Debt</Label>
              <RadioGroup
                value={formData.existingDebt}
                onValueChange={(value) => handleInputChange('existingDebt', value)}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="existingDebtYes" />
                  <Label htmlFor="existingDebtYes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="existingDebtNo" />
                  <Label htmlFor="existingDebtNo">No</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Loan Details */}
        <Card>
          <CardHeader>
            <CardTitle>Loan Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Cross Collateralized</Label>
              <RadioGroup
                value={formData.crossCollateralized}
                onValueChange={(value) => handleInputChange('crossCollateralized', value)}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="crossCollateralizedYes" />
                  <Label htmlFor="crossCollateralizedYes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="crossCollateralizedNo" />
                  <Label htmlFor="crossCollateralizedNo">No</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label>Interest Only</Label>
              <RadioGroup
                value={formData.interestOnly}
                onValueChange={(value) => handleInputChange('interestOnly', value)}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="interestOnlyYes" />
                  <Label htmlFor="interestOnlyYes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="interestOnlyNo" />
                  <Label htmlFor="interestOnlyNo">No</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label htmlFor="loanPurpose">Loan Purpose</Label>
              <Select value={formData.loanPurpose} onValueChange={(value) => handleInputChange('loanPurpose', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select loan purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Refinance">Refinance</SelectItem>
                  <SelectItem value="Purchase">Purchase</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Delayed Purchase</Label>
              <RadioGroup
                value={formData.delayedPurchase}
                onValueChange={(value) => handleInputChange('delayedPurchase', value)}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="delayedPurchaseYes" />
                  <Label htmlFor="delayedPurchaseYes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="delayedPurchaseNo" />
                  <Label htmlFor="delayedPurchaseNo">No</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label htmlFor="thirdPartyValuationStatus">Third Party Valuation Status</Label>
              <Select value={formData.thirdPartyValuationStatus} onValueChange={(value) => handleInputChange('thirdPartyValuationStatus', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Complete">Complete</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Interest Reserves</Label>
              <RadioGroup
                value={formData.interestReserves}
                onValueChange={(value) => handleInputChange('interestReserves', value)}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="interestReservesYes" />
                  <Label htmlFor="interestReservesYes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="interestReservesNo" />
                  <Label htmlFor="interestReservesNo">No</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label htmlFor="prepaymentPenaltyTerm">Prepayment Penalty Term</Label>
              <Select value={formData.prepaymentPenaltyTerm} onValueChange={(value) => handleInputChange('prepaymentPenaltyTerm', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select prepayment penalty term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No Prepay">No Prepay</SelectItem>
                  <SelectItem value="1 Year">1 Year</SelectItem>
                  <SelectItem value="2 Year">2 Year</SelectItem>
                  <SelectItem value="3 Year">3 Year</SelectItem>
                  <SelectItem value="4 Year">4 Year</SelectItem>
                  <SelectItem value="5 Year">5 Year</SelectItem>
                  <SelectItem value="7 Year">7 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="prepaymentPenaltyStructure">Prepayment Penalty Structure</Label>
              <Select value={formData.prepaymentPenaltyStructure} onValueChange={(value) => handleInputChange('prepaymentPenaltyStructure', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select prepayment penalty structure" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Step-Down">Step-Down</SelectItem>
                  <SelectItem value="Fixed 5%">Fixed 5%</SelectItem>
                  <SelectItem value="Fixed 4%">Fixed 4%</SelectItem>
                  <SelectItem value="Fixed 3%">Fixed 3%</SelectItem>
                  <SelectItem value="Fixed 2%">Fixed 2%</SelectItem>
                  <SelectItem value="Fixed 1%">Fixed 1%</SelectItem>
                  <SelectItem value="6 Months Interest">6 Months Interest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Is Product A Approved?</Label>
              <RadioGroup
                value={formData.isProductAApproved}
                onValueChange={(value) => handleInputChange('isProductAApproved', value)}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="productAYes" />
                  <Label htmlFor="productAYes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="productANo" />
                  <Label htmlFor="productANo">No</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Export PDF Options */}
        <Card>
          <CardHeader>
            <CardTitle>Export PDF Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="generateLoanQuote">Generate Loan Quote</Label>
              <Select value={formData.generateLoanQuote} onValueChange={(value) => handleInputChange('generateLoanQuote', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select quote type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Initial Loan Quote">Initial Loan Quote</SelectItem>
                  <SelectItem value="Final Loan Quote">Final Loan Quote</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="loanOfficerName">Loan Officer Name</Label>
              <Select value={formData.loanOfficerName} onValueChange={(value) => handleInputChange('loanOfficerName', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select loan officer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="John McClelland">John McClelland</SelectItem>
                  <SelectItem value="Wade Susini">Wade Susini</SelectItem>
                  <SelectItem value="Ethan Alioto">Ethan Alioto</SelectItem>
                  <SelectItem value="Brendan Corcoran">Brendan Corcoran</SelectItem>
                  <SelectItem value="Peter Yecco">Peter Yecco</SelectItem>
                  <SelectItem value="Travis Beach">Travis Beach</SelectItem>
                  <SelectItem value="Geary Springham">Geary Springham</SelectItem>
                  <SelectItem value="Christopher Bozel">Christopher Bozel</SelectItem>
                  <SelectItem value="Taylor Jones">Taylor Jones</SelectItem>
                  <SelectItem value="Craig Fuhr">Craig Fuhr</SelectItem>
                  <SelectItem value="Robert Wooldridge">Robert Wooldridge</SelectItem>
                  <SelectItem value="Morgan Pritchett">Morgan Pritchett</SelectItem>
                  <SelectItem value="Colin Faux">Colin Faux</SelectItem>
                  <SelectItem value="Taylor Trantham">Taylor Trantham</SelectItem>
                  <SelectItem value="Sean Barre">Sean Barre</SelectItem>
                  <SelectItem value="Gregory Clarke">Gregory Clarke</SelectItem>
                  <SelectItem value="Steven Milovich">Steven Milovich</SelectItem>
                  <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                  <SelectItem value="Kyle Deutschman">Kyle Deutschman</SelectItem>
                  <SelectItem value="Noah Barros">Noah Barros</SelectItem>
                  <SelectItem value="Corey Warren">Corey Warren</SelectItem>
                  <SelectItem value="Blake Cunningham">Blake Cunningham</SelectItem>
                  <SelectItem value="Jeffrey Sosnicki">Jeffrey Sosnicki</SelectItem>
                  <SelectItem value="Keith LaSheir">Keith LaSheir</SelectItem>
                  <SelectItem value="Paul Richter">Paul Richter</SelectItem>
                  <SelectItem value="Danni Boord">Danni Boord</SelectItem>
                  <SelectItem value="Jose Arrapalo">Jose Arrapalo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Exception Request */}
        <Card>
          <CardHeader>
            <CardTitle>Exception Request</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Exception Request</Label>
              <RadioGroup
                value={formData.exceptionRequest}
                onValueChange={(value) => handleInputChange('exceptionRequest', value)}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="exceptionRequestYes" />
                  <Label htmlFor="exceptionRequestYes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="exceptionRequestNo" />
                  <Label htmlFor="exceptionRequestNo">No</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label>Manager Exception</Label>
              <RadioGroup
                value={formData.managerException}
                onValueChange={(value) => handleInputChange('managerException', value)}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="managerExceptionYes" />
                  <Label htmlFor="managerExceptionYes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="managerExceptionNo" />
                  <Label htmlFor="managerExceptionNo">No</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label>Pricing Exception</Label>
              <RadioGroup
                value={formData.pricingException}
                onValueChange={(value) => handleInputChange('pricingException', value)}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="pricingExceptionYes" />
                  <Label htmlFor="pricingExceptionYes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="pricingExceptionNo" />
                  <Label htmlFor="pricingExceptionNo">No</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="bg-dominion-blue hover:bg-dominion-blue/90">
            {isLoading ? "Processing..." : "Submit Loan Pass"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoanPassView;
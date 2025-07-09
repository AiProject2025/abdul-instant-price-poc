import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CalendarIcon } from "lucide-react";
import { statesWithAbbreviations } from "@/utils/locationData";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface LoanPassViewProps {
  onBack: () => void;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  initialData?: any; // For auto-populating from DSCR Questionnaire
}

const LoanPassView = ({ onBack, onSubmit, isLoading, initialData }: LoanPassViewProps) => {
  const [formData, setFormData] = useState({
    // LOAN STATUS
    loanStatus: initialData?.loanStatus || "Initial Loan Quote",
    
    // BORROWER INFORMATION
    borrowerEmail: initialData?.borrowerEmail || "",
    businessName: initialData?.businessName || "",
    borrowerPhone: initialData?.borrowerPhone || "",
    entityOrPersonal: initialData?.entityOrPersonal || "Entity",
    firstTimeInvestor: initialData?.firstTimeInvestor || "No",
    citizenshipType: initialData?.citizenshipType || "US Citizen",
    decisionCreditScore: initialData?.decisionCreditScore || "",
    monthsOfReserves: initialData?.monthsOfReserves || "12",
    desiredLoanTerm: initialData?.desiredLoanTerm || "360",
    
    // BROKER INFORMATION
    brokerCompanyName: initialData?.brokerCompanyName || "",
    brokerLastName: initialData?.brokerLastName || "",
    brokerFirstName: initialData?.brokerFirstName || "",
    brokerPhoneNumber: initialData?.brokerPhoneNumber || "",
    brokerEmail: initialData?.brokerEmail || "",
    
    // PROPERTY INFORMATION
    numberOfPropertiesOnLoan: initialData?.numberOfPropertiesOnLoan || "1",
    creditEvent: initialData?.creditEvent || "No",
    mortgageLatePayments: initialData?.mortgageLatePayments || "No",
    
    // PROPERTY DETAILS
    state: initialData?.state || "",
    county: initialData?.county || "",
    zipCode: initialData?.zipCode || "",
    streetAddress: initialData?.streetAddress || "",
    city: initialData?.city || "",
    propertyType: initialData?.propertyType || "",
    numberOfUnits: initialData?.numberOfUnits || "",
    propertyCondition: initialData?.propertyCondition || "C1",
    vacant: initialData?.vacant || "No",
    numberOfLeasedUnits: initialData?.numberOfLeasedUnits || "",
    nonconformingUse: initialData?.nonconformingUse || "No",
    shortTermRental: initialData?.shortTermRental || "No",
    m2mLease: initialData?.m2mLease || "No",
    section8: initialData?.section8 || "No",
    ruralProperty: initialData?.ruralProperty || "No",
    decliningMarkets: initialData?.decliningMarkets || "No",
    propertySquareFootage: initialData?.propertySquareFootage || "",
    
    // CONDITIONAL FIELDS
    condoApprovalType: initialData?.condoApprovalType || "",
    monthlyNOI: initialData?.monthlyNOI || "",
    hasPurchaseContract: initialData?.hasPurchaseContract || "No",
    purchaseContractCloseDate: initialData?.purchaseContractCloseDate || null,
    datePurchased: initialData?.datePurchased || null,
    hasMortgage: initialData?.hasMortgage || "No",
    mortgagePayoff: initialData?.mortgagePayoff || "",
    
    // DATES
    acquisitionDate: initialData?.acquisitionDate || null,
    expectedClosingDate: initialData?.expectedClosingDate || null,
    
    // FINANCIAL INFORMATION
    existingDebt: initialData?.existingDebt || "No",
    marketRent: initialData?.marketRent || "",
    inPlaceLease: initialData?.inPlaceLease || "",
    monthlyTaxes: initialData?.monthlyTaxes || "",
    monthlyInsurance: initialData?.monthlyInsurance || "",
    monthlyHOASpecialAssess: initialData?.monthlyHOASpecialAssess || "0.00",
    monthlyFloodInsurance: initialData?.monthlyFloodInsurance || "0.00",
    
    // LOAN DETAILS
    crossCollateralized: initialData?.crossCollateralized || "No",
    interestOnly: initialData?.interestOnly || "No",
    loanPurpose: initialData?.loanPurpose || "",
    refinanceType: initialData?.refinanceType || "",
    cashOutAmount: initialData?.cashOutAmount || "",
    delayedPurchase: initialData?.delayedPurchase || "No",
    appraisedValue: initialData?.appraisedValue || "",
    thirdPartyValuationStatus: initialData?.thirdPartyValuationStatus || "Pending",
    purchasePrice: initialData?.purchasePrice || "",
    rehabCost: initialData?.rehabCost || "",
    baseLoanAmount: initialData?.baseLoanAmount || "",
    interestReserves: initialData?.interestReserves || "No",
    originationPoints: initialData?.originationPoints || "",
    prepaymentPenaltyTerm: initialData?.prepaymentPenaltyTerm || "5 Year",
    prepaymentPenaltyStructure: initialData?.prepaymentPenaltyStructure || "Step-Down",
    isProductAApproved: initialData?.isProductAApproved || "Yes",
    
    // BROKER FEES
    brokerPointsOrFee: initialData?.brokerPointsOrFee || "",
    brokerProcessingFee: initialData?.brokerProcessingFee || "",
    
    // EXPORT/SUBMISSION OPTIONS
    generateLoanQuote: initialData?.generateLoanQuote || "No",
    loanOfficerName: initialData?.loanOfficerName || "",
    exceptionRequest: initialData?.exceptionRequest || "",
    managerException: initialData?.managerException || "",
    pricingException: initialData?.pricingException || "",
    brokerSubmission: initialData?.brokerSubmission || ""
  });

  const handleInputChange = (field: string, value: string | Date | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Calculate NOI if needed
  const shouldShowMonthlyNOI = formData.numberOfUnits && parseInt(formData.numberOfUnits) >= 5;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Loan Pass View</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* LOAN STATUS SECTION */}
        <Card>
          <CardHeader>
            <CardTitle>Loan Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="loanStatus">Loan Status</Label>
              <Select value={formData.loanStatus} onValueChange={(value) => handleInputChange('loanStatus', value)}>
                <SelectTrigger>
                  <SelectValue />
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
          </CardContent>
        </Card>

        {/* BORROWER INFORMATION */}
        <Card>
          <CardHeader>
            <CardTitle>Borrower Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="borrowerEmail">Borrower Email Address</Label>
              <Input
                id="borrowerEmail"
                type="email"
                value={formData.borrowerEmail}
                onChange={(e) => handleInputChange('borrowerEmail', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="borrowerPhone">Borrower Phone #</Label>
              <Input
                id="borrowerPhone"
                type="tel"
                value={formData.borrowerPhone}
                onChange={(e) => handleInputChange('borrowerPhone', e.target.value)}
              />
            </div>
            
            <div>
              <Label>Is borrower closing under an entity or personal name?</Label>
              <Select value={formData.entityOrPersonal} onValueChange={(value) => handleInputChange('entityOrPersonal', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Entity">Entity</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>First Time Investor</Label>
              <Select value={formData.firstTimeInvestor} onValueChange={(value) => handleInputChange('firstTimeInvestor', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Citizenship Type</Label>
              <Select value={formData.citizenshipType} onValueChange={(value) => handleInputChange('citizenshipType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US Citizen">US Citizen</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="decisionCreditScore">Decision Credit Score</Label>
              <Input
                id="decisionCreditScore"
                type="number"
                value={formData.decisionCreditScore}
                onChange={(e) => handleInputChange('decisionCreditScore', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="monthsOfReserves">Months of Reserves</Label>
              <Input
                id="monthsOfReserves"
                type="number"
                value={formData.monthsOfReserves}
                onChange={(e) => handleInputChange('monthsOfReserves', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="desiredLoanTerm">Desired Loan Term</Label>
              <div className="flex">
                <Input
                  id="desiredLoanTerm"
                  type="number"
                  value={formData.desiredLoanTerm}
                  onChange={(e) => handleInputChange('desiredLoanTerm', e.target.value)}
                  className="rounded-r-none"
                />
                <div className="flex items-center px-3 bg-muted border border-l-0 rounded-r-md text-sm">
                  months
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* BROKER INFORMATION */}
        <Card>
          <CardHeader>
            <CardTitle>Broker Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="brokerCompanyName">Broker Company Name</Label>
              <Input
                id="brokerCompanyName"
                value={formData.brokerCompanyName}
                onChange={(e) => handleInputChange('brokerCompanyName', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="brokerLastName">Broker Last Name</Label>
              <Input
                id="brokerLastName"
                value={formData.brokerLastName}
                onChange={(e) => handleInputChange('brokerLastName', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="brokerFirstName">Broker First Name</Label>
              <Input
                id="brokerFirstName"
                value={formData.brokerFirstName}
                onChange={(e) => handleInputChange('brokerFirstName', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="brokerPhoneNumber">Broker Phone Number</Label>
              <Input
                id="brokerPhoneNumber"
                type="tel"
                value={formData.brokerPhoneNumber}
                onChange={(e) => handleInputChange('brokerPhoneNumber', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="brokerEmail">Broker Email</Label>
              <Input
                id="brokerEmail"
                type="email"
                value={formData.brokerEmail}
                onChange={(e) => handleInputChange('brokerEmail', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* PROPERTY INFORMATION */}
        <Card>
          <CardHeader>
            <CardTitle>Property Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="numberOfPropertiesOnLoan">Number of Properties on Loan</Label>
              <Input
                id="numberOfPropertiesOnLoan"
                type="number"
                value={formData.numberOfPropertiesOnLoan}
                onChange={(e) => handleInputChange('numberOfPropertiesOnLoan', e.target.value)}
              />
            </div>
            
            <div>
              <Label>Credit Event</Label>
              <Select value={formData.creditEvent} onValueChange={(value) => handleInputChange('creditEvent', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Mortgage Late Payments</Label>
              <Select value={formData.mortgageLatePayments} onValueChange={(value) => handleInputChange('mortgageLatePayments', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* PROPERTY DETAILS */}
        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="state">State</Label>
              <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {statesWithAbbreviations.map((state) => (
                    <SelectItem key={state.abbreviation} value={state.displayName}>
                      {state.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="county">County</Label>
              <Input
                id="county"
                value={formData.county}
                onChange={(e) => handleInputChange('county', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="streetAddress">Street Address</Label>
              <Input
                id="streetAddress"
                value={formData.streetAddress}
                onChange={(e) => handleInputChange('streetAddress', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />
            </div>
            
            <div>
              <Label>Property Type</Label>
              <Select value={formData.propertyType} onValueChange={(value) => handleInputChange('propertyType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Single Family">Single Family</SelectItem>
                  <SelectItem value="Two to Four Family">Two to Four Family</SelectItem>
                  <SelectItem value="Multi-Family">Multi-Family</SelectItem>
                  <SelectItem value="Mixed Use">Mixed Use</SelectItem>
                  <SelectItem value="Condominium">Condominium</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {formData.propertyType === "Condominium" && (
              <div>
                <Label>Condo Approval Type</Label>
                <Select value={formData.condoApprovalType} onValueChange={(value) => handleInputChange('condoApprovalType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select approval type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Warrantable">Warrantable</SelectItem>
                    <SelectItem value="Non-Warrantable">Non-Warrantable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div>
              <Label htmlFor="numberOfUnits">Number of Units</Label>
              <Input
                id="numberOfUnits"
                type="number"
                value={formData.numberOfUnits}
                onChange={(e) => handleInputChange('numberOfUnits', e.target.value)}
              />
            </div>
            
            {shouldShowMonthlyNOI && (
              <div>
                <Label htmlFor="monthlyNOI">Monthly NOI</Label>
                <Input
                  id="monthlyNOI"
                  type="number"
                  step="0.01"
                  value={formData.monthlyNOI}
                  onChange={(e) => handleInputChange('monthlyNOI', e.target.value)}
                />
              </div>
            )}
            
            <div>
              <Label>Property Condition</Label>
              <Select value={formData.propertyCondition} onValueChange={(value) => handleInputChange('propertyCondition', value)}>
                <SelectTrigger>
                  <SelectValue />
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
              <Select value={formData.vacant} onValueChange={(value) => handleInputChange('vacant', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="numberOfLeasedUnits">Number of Leased Units</Label>
              <Input
                id="numberOfLeasedUnits"
                type="number"
                value={formData.numberOfLeasedUnits}
                onChange={(e) => handleInputChange('numberOfLeasedUnits', e.target.value)}
              />
            </div>
            
            <div>
              <Label>Nonconforming/Grandfathered use?</Label>
              <Select value={formData.nonconformingUse} onValueChange={(value) => handleInputChange('nonconformingUse', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Short Term Rental</Label>
              <Select value={formData.shortTermRental} onValueChange={(value) => handleInputChange('shortTermRental', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>M2M Lease</Label>
              <Select value={formData.m2mLease} onValueChange={(value) => handleInputChange('m2mLease', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Section 8?</Label>
              <Select value={formData.section8} onValueChange={(value) => handleInputChange('section8', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Rural Property</Label>
              <Select value={formData.ruralProperty} onValueChange={(value) => handleInputChange('ruralProperty', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Declining Markets</Label>
              <Select value={formData.decliningMarkets} onValueChange={(value) => handleInputChange('decliningMarkets', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="propertySquareFootage">Property Square Footage</Label>
              <Input
                id="propertySquareFootage"
                type="number"
                value={formData.propertySquareFootage}
                onChange={(e) => handleInputChange('propertySquareFootage', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* CONDITIONAL FIELDS FOR PURCHASE */}
        {formData.loanPurpose === "Purchase" && (
          <Card>
            <CardHeader>
              <CardTitle>Purchase Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Has Purchase Contract</Label>
                <Select value={formData.hasPurchaseContract} onValueChange={(value) => handleInputChange('hasPurchaseContract', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {formData.hasPurchaseContract === "Yes" && (
                <div>
                  <Label>Purchase Contract Close Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.purchaseContractCloseDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.purchaseContractCloseDate ? (
                          format(formData.purchaseContractCloseDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.purchaseContractCloseDate}
                        onSelect={(date) => handleInputChange('purchaseContractCloseDate', date)}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* CONDITIONAL FIELDS FOR REFINANCE */}
        {formData.loanPurpose === "Refinance" && (
          <Card>
            <CardHeader>
              <CardTitle>Refinance Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Date Purchased</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.datePurchased && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.datePurchased ? (
                        format(formData.datePurchased, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.datePurchased}
                      onSelect={(date) => handleInputChange('datePurchased', date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label>Has Mortgage</Label>
                <Select value={formData.hasMortgage} onValueChange={(value) => handleInputChange('hasMortgage', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {formData.hasMortgage === "Yes" && (
                <div>
                  <Label htmlFor="mortgagePayoff">Mortgage Payoff</Label>
                  <Input
                    id="mortgagePayoff"
                    type="number"
                    step="0.01"
                    value={formData.mortgagePayoff}
                    onChange={(e) => handleInputChange('mortgagePayoff', e.target.value)}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* DATES */}
        <Card>
          <CardHeader>
            <CardTitle>Dates</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Acquisition Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.acquisitionDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.acquisitionDate ? (
                      format(formData.acquisitionDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.acquisitionDate}
                    onSelect={(date) => handleInputChange('acquisitionDate', date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label>Expected Closing Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.expectedClosingDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.expectedClosingDate ? (
                      format(formData.expectedClosingDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.expectedClosingDate}
                    onSelect={(date) => handleInputChange('expectedClosingDate', date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        {/* FINANCIAL INFORMATION */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Existing Debt</Label>
              <Select value={formData.existingDebt} onValueChange={(value) => handleInputChange('existingDebt', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="marketRent">Market Rent</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="marketRent"
                  type="number"
                  step="0.01"
                  value={formData.marketRent}
                  onChange={(e) => handleInputChange('marketRent', e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="inPlaceLease">In-Place Lease</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="inPlaceLease"
                  type="number"
                  step="0.01"
                  value={formData.inPlaceLease}
                  onChange={(e) => handleInputChange('inPlaceLease', e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="monthlyTaxes">Monthly Taxes</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="monthlyTaxes"
                  type="number"
                  step="0.01"
                  value={formData.monthlyTaxes}
                  onChange={(e) => handleInputChange('monthlyTaxes', e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="monthlyInsurance">Monthly Insurance</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="monthlyInsurance"
                  type="number"
                  step="0.01"
                  value={formData.monthlyInsurance}
                  onChange={(e) => handleInputChange('monthlyInsurance', e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="monthlyHOASpecialAssess">Monthly HOA/Special Assess</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="monthlyHOASpecialAssess"
                  type="number"
                  step="0.01"
                  value={formData.monthlyHOASpecialAssess}
                  onChange={(e) => handleInputChange('monthlyHOASpecialAssess', e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="monthlyFloodInsurance">Monthly Flood Insurance</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="monthlyFloodInsurance"
                  type="number"
                  step="0.01"
                  value={formData.monthlyFloodInsurance}
                  onChange={(e) => handleInputChange('monthlyFloodInsurance', e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* LOAN DETAILS */}
        <Card>
          <CardHeader>
            <CardTitle>Loan Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Cross Collateralized</Label>
              <Select value={formData.crossCollateralized} onValueChange={(value) => handleInputChange('crossCollateralized', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Interest Only</Label>
              <Select value={formData.interestOnly} onValueChange={(value) => handleInputChange('interestOnly', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Loan Purpose</Label>
              <Select value={formData.loanPurpose} onValueChange={(value) => handleInputChange('loanPurpose', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select loan purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Purchase">Purchase</SelectItem>
                  <SelectItem value="Refinance">Refinance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {formData.loanPurpose === "Refinance" && (
              <div>
                <Label>Refinance Type</Label>
                <Select value={formData.refinanceType} onValueChange={(value) => handleInputChange('refinanceType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select refinance type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash Out">Cash Out</SelectItem>
                    <SelectItem value="Rate & Term">Rate & Term</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {formData.refinanceType === "Cash Out" && (
              <div>
                <Label htmlFor="cashOutAmount">Cash-Out Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="cashOutAmount"
                    type="number"
                    step="0.01"
                    value={formData.cashOutAmount}
                    onChange={(e) => handleInputChange('cashOutAmount', e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            )}
            
            <div>
              <Label>Delayed Purchase</Label>
              <Select value={formData.delayedPurchase} onValueChange={(value) => handleInputChange('delayedPurchase', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="appraisedValue">Appraised Value</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="appraisedValue"
                  type="number"
                  step="0.01"
                  value={formData.appraisedValue}
                  onChange={(e) => handleInputChange('appraisedValue', e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div>
              <Label>Third Party Valuation Status</Label>
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
              <Label htmlFor="purchasePrice">Purchase Price</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="purchasePrice"
                  type="number"
                  step="0.01"
                  value={formData.purchasePrice}
                  onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="rehabCost">Rehab Cost</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="rehabCost"
                  type="number"
                  step="0.01"
                  value={formData.rehabCost}
                  onChange={(e) => handleInputChange('rehabCost', e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="baseLoanAmount">Base Loan Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="baseLoanAmount"
                  type="number"
                  step="0.01"
                  value={formData.baseLoanAmount}
                  onChange={(e) => handleInputChange('baseLoanAmount', e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div>
              <Label>Interest Reserves</Label>
              <Select value={formData.interestReserves} onValueChange={(value) => handleInputChange('interestReserves', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="originationPoints">Origination Points</Label>
              <Input
                id="originationPoints"
                type="number"
                step="0.001"
                value={formData.originationPoints}
                onChange={(e) => handleInputChange('originationPoints', e.target.value)}
              />
            </div>
            
            <div>
              <Label>Prepayment Penalty Term</Label>
              <Select value={formData.prepaymentPenaltyTerm} onValueChange={(value) => handleInputChange('prepaymentPenaltyTerm', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No Prepay">No Prepay</SelectItem>
                  <SelectItem value="1 Year">1 Year</SelectItem>
                  <SelectItem value="2 Year">2 Year</SelectItem>
                  <SelectItem value="3 Year">3 Year</SelectItem>
                  <SelectItem value="4 Year">4 Year</SelectItem>
                  <SelectItem value="5 Year">5 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Prepayment Penalty Structure</Label>
              <Select value={formData.prepaymentPenaltyStructure} onValueChange={(value) => handleInputChange('prepaymentPenaltyStructure', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Step-Down">Step-Down</SelectItem>
                  <SelectItem value="Flat">Flat</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Is Product A Approved?</Label>
              <Select value={formData.isProductAApproved} onValueChange={(value) => handleInputChange('isProductAApproved', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* BROKER FEES */}
        <Card>
          <CardHeader>
            <CardTitle>Broker Fees</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="brokerPointsOrFee">Broker Points or Fee</Label>
              <Input
                id="brokerPointsOrFee"
                value={formData.brokerPointsOrFee}
                onChange={(e) => handleInputChange('brokerPointsOrFee', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="brokerProcessingFee">Broker Processing Fee</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="brokerProcessingFee"
                  type="number"
                  step="0.01"
                  value={formData.brokerProcessingFee}
                  onChange={(e) => handleInputChange('brokerProcessingFee', e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* EXPORT PDF OPTIONS */}
        <Card>
          <CardHeader>
            <CardTitle>Export PDF Options</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Generate Loan Quote</Label>
              <Select value={formData.generateLoanQuote} onValueChange={(value) => handleInputChange('generateLoanQuote', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="loanOfficerName">Loan Officer Name</Label>
              <Input
                id="loanOfficerName"
                value={formData.loanOfficerName}
                onChange={(e) => handleInputChange('loanOfficerName', e.target.value)}
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="exceptionRequest">Exception Request</Label>
              <Textarea
                id="exceptionRequest"
                value={formData.exceptionRequest}
                onChange={(e) => handleInputChange('exceptionRequest', e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="managerException">Manager Exception</Label>
              <Textarea
                id="managerException"
                value={formData.managerException}
                onChange={(e) => handleInputChange('managerException', e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="pricingException">Pricing Exception</Label>
              <Textarea
                id="pricingException"
                value={formData.pricingException}
                onChange={(e) => handleInputChange('pricingException', e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* BROKER SUBMISSION SECTION */}
        <Card>
          <CardHeader>
            <CardTitle>Broker Submission Section</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="brokerSubmission">Broker Submission</Label>
              <Textarea
                id="brokerSubmission"
                value={formData.brokerSubmission}
                onChange={(e) => handleInputChange('brokerSubmission', e.target.value)}
                rows={4}
                placeholder="Enter broker submission details or upload document..."
              />
            </div>
          </CardContent>
        </Card>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Processing..." : "Submit Loan Pass"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoanPassView;
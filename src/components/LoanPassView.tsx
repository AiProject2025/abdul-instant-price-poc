
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
    businessName: "",
    borrowerPhone: "",
    
    // Broker Information
    brokerCompanyName: "",
    brokerLastName: "",
    brokerFirstName: "",
    brokerPhoneNumber: "",
    brokerEmail: "",
    
    // Borrower Information
    entityOrPersonal: "Entity",
    firstTimeInvestor: "No",
    citizenshipType: "",
    decisionCreditScore: "",
    monthsOfReserves: "",
    desiredLoanTerm: "",
    numberOfPropertiesOnLoan: "1",
    creditEvent: "No",
    mortgageLatePayments: "No",
    
    // Property Information
    state: "",
    zipCode: "",
    streetAddress: "",
    city: "",
    propertyType: "",
    numberOfUnits: "",
    propertyCondition: "",
    vacant: "",
    numberOfLeasedUnits: "",
    nonconformingUse: "No",
    shortTermRental: "",
    m2mLease: "",
    section8: "No",
    ruralProperty: "No",
    decliningMarkets: "",
    propertySquareFootage: "",
    acquisitionDate: "",
    expectedClosingDate: "",
    existingDebt: "",
    marketRent: "",
    inPlaceLease: "",
    monthlyTaxes: "",
    monthlyInsurance: "",
    monthlyHOA: "",
    monthlyFloodInsurance: "",
    
    // Loan Details
    crossCollateralized: "No",
    interestOnly: "",
    loanPurpose: "",
    delayedPurchase: "",
    appraisedValue: "",
    thirdPartyValuationStatus: "Pending",
    purchasePrice: "",
    rehabCost: "",
    baseLoanAmount: "",
    originationPoints: "0.000",
    prepaymentPenaltyTerm: "",
    isProductAApproved: "No",
    brokerPointsOrFee: "",
    brokerProcessingFee: "",
    
    // Export PDF Options
    generateLoanQuote: "No",
    loanOfficerName: "",
    
    // Exception Request
    exceptionRequest: "No",
    managerException: "No",
    pricingException: "No",
    
    // Broker Submission Section
    brokerSubmission: "Not Applicable"
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
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="loanStatus">Loan Status</Label>
              <Input
                id="loanStatus"
                value={formData.loanStatus}
                onChange={(e) => handleInputChange('loanStatus', e.target.value)}
              />
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
                value={formData.borrowerPhone}
                onChange={(e) => handleInputChange('borrowerPhone', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Broker Information */}
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

        {/* Borrower Information */}
        <Card>
          <CardHeader>
            <CardTitle>Borrower Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Is borrower closing under an entity or personal name?</Label>
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
              <Label htmlFor="citizenshipType">Citizenship Type</Label>
              <Input
                id="citizenshipType"
                value={formData.citizenshipType}
                onChange={(e) => handleInputChange('citizenshipType', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="decisionCreditScore">Decision Credit Score</Label>
              <Input
                id="decisionCreditScore"
                value={formData.decisionCreditScore}
                onChange={(e) => handleInputChange('decisionCreditScore', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="monthsOfReserves">Months of Reserves</Label>
              <Input
                id="monthsOfReserves"
                value={formData.monthsOfReserves}
                onChange={(e) => handleInputChange('monthsOfReserves', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="desiredLoanTerm">Desired Loan Term (months)</Label>
              <Input
                id="desiredLoanTerm"
                value={formData.desiredLoanTerm}
                onChange={(e) => handleInputChange('desiredLoanTerm', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="numberOfPropertiesOnLoan">Number of Properties on Loan</Label>
              <Input
                id="numberOfPropertiesOnLoan"
                value={formData.numberOfPropertiesOnLoan}
                onChange={(e) => handleInputChange('numberOfPropertiesOnLoan', e.target.value)}
              />
            </div>
            <div>
              <Label>Credit Event</Label>
              <RadioGroup
                value={formData.creditEvent}
                onValueChange={(value) => handleInputChange('creditEvent', value)}
                className="flex gap-4 mt-2"
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
            </div>
            <div>
              <Label>Mortgage Late Payments</Label>
              <RadioGroup
                value={formData.mortgageLatePayments}
                onValueChange={(value) => handleInputChange('mortgageLatePayments', value)}
                className="flex gap-4 mt-2"
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
            </div>
          </CardContent>
        </Card>

        {/* Property Information */}
        <Card>
          <CardHeader>
            <CardTitle>Property Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
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
              <Label htmlFor="propertyType">Property Type</Label>
              <Input
                id="propertyType"
                value={formData.propertyType}
                onChange={(e) => handleInputChange('propertyType', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="numberOfUnits">Number of Units</Label>
              <Input
                id="numberOfUnits"
                value={formData.numberOfUnits}
                onChange={(e) => handleInputChange('numberOfUnits', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="propertyCondition">Property Condition</Label>
              <Input
                id="propertyCondition"
                value={formData.propertyCondition}
                onChange={(e) => handleInputChange('propertyCondition', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="vacant">Vacant</Label>
              <Input
                id="vacant"
                value={formData.vacant}
                onChange={(e) => handleInputChange('vacant', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="numberOfLeasedUnits">Number of Leased Units</Label>
              <Input
                id="numberOfLeasedUnits"
                value={formData.numberOfLeasedUnits}
                onChange={(e) => handleInputChange('numberOfLeasedUnits', e.target.value)}
              />
            </div>
            <div>
              <Label>Nonconforming/Grandfathered use?</Label>
              <RadioGroup
                value={formData.nonconformingUse}
                onValueChange={(value) => handleInputChange('nonconformingUse', value)}
                className="flex gap-4 mt-2"
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
            </div>
            <div>
              <Label htmlFor="shortTermRental">Short Term Rental</Label>
              <Input
                id="shortTermRental"
                value={formData.shortTermRental}
                onChange={(e) => handleInputChange('shortTermRental', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="m2mLease">M2M Lease</Label>
              <Input
                id="m2mLease"
                value={formData.m2mLease}
                onChange={(e) => handleInputChange('m2mLease', e.target.value)}
              />
            </div>
            <div>
              <Label>Section 8?</Label>
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
              <Label htmlFor="decliningMarkets">Declining Markets</Label>
              <Input
                id="decliningMarkets"
                value={formData.decliningMarkets}
                onChange={(e) => handleInputChange('decliningMarkets', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="propertySquareFootage">Property Square Footage</Label>
              <Input
                id="propertySquareFootage"
                value={formData.propertySquareFootage}
                onChange={(e) => handleInputChange('propertySquareFootage', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="acquisitionDate">Acquisition Date</Label>
              <Input
                id="acquisitionDate"
                type="date"
                value={formData.acquisitionDate}
                onChange={(e) => handleInputChange('acquisitionDate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="expectedClosingDate">Expected Closing Date</Label>
              <Input
                id="expectedClosingDate"
                type="date"
                value={formData.expectedClosingDate}
                onChange={(e) => handleInputChange('expectedClosingDate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="existingDebt">Existing Debt</Label>
              <Input
                id="existingDebt"
                value={formData.existingDebt}
                onChange={(e) => handleInputChange('existingDebt', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="marketRent">Market Rent ($)</Label>
              <Input
                id="marketRent"
                value={formData.marketRent}
                onChange={(e) => handleInputChange('marketRent', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="inPlaceLease">In-Place Lease ($)</Label>
              <Input
                id="inPlaceLease"
                value={formData.inPlaceLease}
                onChange={(e) => handleInputChange('inPlaceLease', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="monthlyTaxes">Monthly Taxes ($)</Label>
              <Input
                id="monthlyTaxes"
                value={formData.monthlyTaxes}
                onChange={(e) => handleInputChange('monthlyTaxes', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="monthlyInsurance">Monthly Insurance ($)</Label>
              <Input
                id="monthlyInsurance"
                value={formData.monthlyInsurance}
                onChange={(e) => handleInputChange('monthlyInsurance', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="monthlyHOA">Monthly HOA/Special Assess ($)</Label>
              <Input
                id="monthlyHOA"
                value={formData.monthlyHOA}
                onChange={(e) => handleInputChange('monthlyHOA', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="monthlyFloodInsurance">Monthly Flood Insurance ($)</Label>
              <Input
                id="monthlyFloodInsurance"
                value={formData.monthlyFloodInsurance}
                onChange={(e) => handleInputChange('monthlyFloodInsurance', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Loan Details */}
        <Card>
          <CardHeader>
            <CardTitle>Loan Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="interestOnly">Interest Only</Label>
              <Input
                id="interestOnly"
                value={formData.interestOnly}
                onChange={(e) => handleInputChange('interestOnly', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="loanPurpose">Loan Purpose</Label>
              <Input
                id="loanPurpose"
                value={formData.loanPurpose}
                onChange={(e) => handleInputChange('loanPurpose', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="delayedPurchase">Delayed Purchase</Label>
              <Input
                id="delayedPurchase"
                value={formData.delayedPurchase}
                onChange={(e) => handleInputChange('delayedPurchase', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="appraisedValue">Appraised Value ($)</Label>
              <Input
                id="appraisedValue"
                value={formData.appraisedValue}
                onChange={(e) => handleInputChange('appraisedValue', e.target.value)}
              />
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
                  <SelectItem value="Not Required">Not Required</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="purchasePrice">Purchase Price ($)</Label>
              <Input
                id="purchasePrice"
                value={formData.purchasePrice}
                onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="rehabCost">Rehab Cost ($)</Label>
              <Input
                id="rehabCost"
                value={formData.rehabCost}
                onChange={(e) => handleInputChange('rehabCost', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="baseLoanAmount">Base Loan Amount ($)</Label>
              <Input
                id="baseLoanAmount"
                value={formData.baseLoanAmount}
                onChange={(e) => handleInputChange('baseLoanAmount', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="originationPoints">Origination Points</Label>
              <Input
                id="originationPoints"
                value={formData.originationPoints}
                onChange={(e) => handleInputChange('originationPoints', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="prepaymentPenaltyTerm">Prepayment Penalty Term</Label>
              <Input
                id="prepaymentPenaltyTerm"
                value={formData.prepaymentPenaltyTerm}
                onChange={(e) => handleInputChange('prepaymentPenaltyTerm', e.target.value)}
              />
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
            <div>
              <Label htmlFor="brokerPointsOrFee">Broker Points or Fee</Label>
              <Input
                id="brokerPointsOrFee"
                value={formData.brokerPointsOrFee}
                onChange={(e) => handleInputChange('brokerPointsOrFee', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="brokerProcessingFee">Broker Processing Fee ($)</Label>
              <Input
                id="brokerProcessingFee"
                value={formData.brokerProcessingFee}
                onChange={(e) => handleInputChange('brokerProcessingFee', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Export PDF Options */}
        <Card>
          <CardHeader>
            <CardTitle>Export PDF Options</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Generate Loan Quote</Label>
              <RadioGroup
                value={formData.generateLoanQuote}
                onValueChange={(value) => handleInputChange('generateLoanQuote', value)}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="generateQuoteYes" />
                  <Label htmlFor="generateQuoteYes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="generateQuoteNo" />
                  <Label htmlFor="generateQuoteNo">No</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label htmlFor="loanOfficerName">Loan Officer Name</Label>
              <Input
                id="loanOfficerName"
                value={formData.loanOfficerName}
                onChange={(e) => handleInputChange('loanOfficerName', e.target.value)}
              />
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

        {/* Broker Submission Section */}
        <Card>
          <CardHeader>
            <CardTitle>Broker Submission Section</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="brokerSubmission">Broker Submission</Label>
              <Select value={formData.brokerSubmission} onValueChange={(value) => handleInputChange('brokerSubmission', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Complete">Complete</SelectItem>
                </SelectContent>
              </Select>
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

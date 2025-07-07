import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { statesWithAbbreviations } from '@/utils/locationData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileText } from 'lucide-react';

interface DSCRFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onBack: () => void;
  isLoading?: boolean;
}

const DSCRForm: React.FC<DSCRFormProps> = ({
  initialData,
  onSubmit,
  onBack,
  isLoading
}) => {
  const [formState, setFormState] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    yourCompany: '',
    usCitizen: '',
    closingType: '',
    
    // Additional Borrower Information
    firstTimeInvestor: 'No',
    monthsOfReserves: '12',
    desiredLoanTerm: '360',
    numberOfPropertiesOnLoan: '1',
    creditEvent: 'No',
    mortgageLatePayments: 'No',
    
    // Broker Information
    brokerCompanyName: '',
    brokerFirstName: '',
    brokerLastName: '',
    brokerPhone: '',
    brokerEmail: '',
    
    // Purchase vs Refinance
    loanPurpose: '',
    
    // Subject Property Address
    streetAddress: '',
    city: '',
    propertyState: '',
    zipCode: '',
    propertyCounty: '',
    
    // Property Details - New Purchase
    propertyType: '',
    condoApprovalType: '',
    hasPurchaseContract: '',
    purchaseContractCloseDate: '',
    numberOfUnits: '',
    nonconformingUnits: '',
    totalNetOperationIncome: '',
    leaseInPlace: '',
    leaseStructure: '',
    section8Lease: '',
    strRentalHistory: '',
    purchasePrice: '',
    estimatedRehabCost: '',
    
    // Property Details - Refinance
    refinanceType: '',
    currentPropertyValue: '',
    currentLoanBalance: '',
    datePurchased: '',
    marketValue: '',
    hasMortgage: '',
    mortgagePayoff: '',
    rehabCostSpent: '',
    rehabCostNeeded: '',
    
    // Loan Details
    desiredLTV: '',
    desiredClosingDate: '',
    
    // Property Rents (Monthly)
    unit1Rent: '',
    unit2Rent: '',
    unit3Rent: '',
    unit4Rent: '',
    unit5Rent: '',
    unit6Rent: '',
    unit7Rent: '',
    unit8Rent: '',
    unit9Rent: '',
    unit10Rent: '',
    
    // Annual Property Expenses
    annualTaxes: '',
    annualInsurance: '',
    annualAssociationFees: '',
    annualFloodInsurance: '',
    
    // Final Details
    creditScore: '',
    
    // Additional Property Information
    propertyCondition: 'C4',
    vacant: 'No',
    numberOfLeasedUnits: '',
    shortTermRental: 'No',
    m2mLease: 'No',
    ruralProperty: 'No',
    decliningMarkets: 'No',
    propertySquareFootage: '',
    
    // Additional Loan Details
    crossCollateralized: 'No',
    interestOnly: 'No',
    delayedPurchase: 'No',
    thirdPartyValuationStatus: 'Pending',
    baseLoadAmount: '',
    interestReserves: 'No',
    originationPoints: '',
    prepaymentPenaltyTerm: '5 Year',
    prepaymentPenaltyStructure: 'Step-Down',
    isProductAApproved: 'Yes',
    
    // Loan Officer Information
    loanOfficerName: 'Gregory Clarke',
    exceptionRequest: 'No',
    managerException: 'No',
    pricingException: 'No',
    
    // Broker Information
    brokerSubmission: 'Not Applicable',
    brokerPoints: '',
    brokerProcessingFee: ''
  });

  // Initialize form with data if available
  useEffect(() => {
    if (initialData) {
      setFormState(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  // Calculate total rental income
  const calculateTotalRental = () => {
    const units = parseInt(formState.numberOfUnits) || 0;
    let total = 0;
    
    for (let i = 1; i <= units; i++) {
      const rent = parseFloat(formState[`unit${i}Rent` as keyof typeof formState] as string) || 0;
      total += rent;
    }
    
    return total;
  };

  // Calculate total rehab cost for refinance
  const calculateTotalRehabCost = () => {
    const spent = parseFloat(formState.rehabCostSpent) || 0;
    const needed = parseFloat(formState.rehabCostNeeded) || 0;
    return spent + needed;
  };

  // List of numeric fields that should only accept numbers
  const numericFields = [
    'purchasePrice', 'estimatedRehabCost', 'marketValue', 'mortgagePayoff',
    'rehabCostSpent', 'rehabCostNeeded', 'totalNetOperationIncome',
    'unit1Rent', 'unit2Rent', 'unit3Rent', 'unit4Rent', 'unit5Rent',
    'unit6Rent', 'unit7Rent', 'unit8Rent', 'unit9Rent', 'unit10Rent',
    'annualTaxes', 'annualInsurance', 'annualAssociationFees', 'annualFloodInsurance',
    'creditScore', 'desiredLTV'
  ];

  const handleInputChange = (field: string, value: string) => {
    // For numeric fields, validate and clean the input
    if (numericFields.includes(field)) {
      // Remove any non-numeric characters except decimal point
      const cleanValue = value.replace(/[^0-9.]/g, '');
      
      // Ensure only one decimal point
      const parts = cleanValue.split('.');
      const validValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : cleanValue;
      
      setFormState(prev => ({
        ...prev,
        [field]: validValue
      }));
    } else {
      setFormState(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Always pass form data to parent component
    onSubmit({
      formData: formState,
      isLoading: true
    });

    // For now, we'll just pass the form data as-is
    // The API integration can be added later if needed
    setTimeout(() => {
      onSubmit({
        formData: formState
      });
    }, 1000);
  };

  const renderRentalIncomeFields = () => {
    const units = parseInt(formState.numberOfUnits) || 0;
    const fields = [];
    
    for (let i = 1; i <= units; i++) {
      fields.push(
        <div key={i}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Unit {i} Estimated Rental Income
          </label>
          <Input 
            type="number" 
            value={formState[`unit${i}Rent` as keyof typeof formState] as string} 
            onChange={e => handleInputChange(`unit${i}Rent`, e.target.value)} 
            placeholder="$0" 
          />
        </div>
      );
    }
    
    return fields;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dominion-blue mb-2">DSCR Questionnaire</h1>
        <p className="text-gray-600">Complete the form below to get your loan pricing</p>
        {initialData && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-700 font-medium">Form auto-populated from uploaded document</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-dominion-blue">Personal Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <Input 
                  type="text" 
                  value={formState.firstName} 
                  onChange={e => handleInputChange('firstName', e.target.value)} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <Input 
                  type="text" 
                  value={formState.lastName} 
                  onChange={e => handleInputChange('lastName', e.target.value)} 
                  required 
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <Input 
                  type="tel" 
                  value={formState.phone} 
                  onChange={e => handleInputChange('phone', e.target.value)} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <Input 
                  type="email" 
                  value={formState.email} 
                  onChange={e => handleInputChange('email', e.target.value)} 
                  required 
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Company</label>
                <Input 
                  type="text" 
                  value={formState.yourCompany} 
                  onChange={e => handleInputChange('yourCompany', e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Are you a U.S. Citizen? *</label>
                <Select value={formState.usCitizen} onValueChange={value => handleInputChange('usCitizen', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Will this be closing under an Entity or Personal? *
                </label>
                <Select value={formState.closingType} onValueChange={value => handleInputChange('closingType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entity">Entity</SelectItem>
                    <SelectItem value="Personal">Personal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subject Property Address */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-dominion-blue">Subject Property Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Street *</label>
              <Input 
                type="text" 
                value={formState.streetAddress} 
                onChange={e => handleInputChange('streetAddress', e.target.value)} 
                required 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <Input 
                  type="text" 
                  value={formState.city} 
                  onChange={e => handleInputChange('city', e.target.value)} 
                  required 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                <Select value={formState.propertyState} onValueChange={(state) => handleInputChange('propertyState', state)}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg max-h-60 overflow-y-auto z-50">
                    {statesWithAbbreviations.map((state) => (
                      <SelectItem key={state.abbreviation} value={state.abbreviation}>
                        {state.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property County *</label>
                <Input 
                  type="text" 
                  value={formState.propertyCounty} 
                  onChange={e => handleInputChange('propertyCounty', e.target.value)} 
                  required 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code *</label>
                <Input 
                  type="text" 
                  value={formState.zipCode} 
                  onChange={e => handleInputChange('zipCode', e.target.value)} 
                  required 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loan Purpose */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-dominion-blue">Loan Purpose</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={formState.loanPurpose} onValueChange={value => handleInputChange('loanPurpose', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Purchase">Purchase</SelectItem>
                <SelectItem value="Refinance">Refinance</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Property Details - Conditional based on Purchase vs Refinance */}
        {formState.loanPurpose === 'Purchase' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-dominion-blue">Property Details - New Purchase</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type *</label>
                  <Select value={formState.propertyType} onValueChange={value => handleInputChange('propertyType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single Family">Single Family</SelectItem>
                      <SelectItem value="Two to Four Family">Two to Four Family</SelectItem>
                      <SelectItem value="Multi Family">Multi Family</SelectItem>
                      <SelectItem value="Mixed Use">Mixed Use</SelectItem>
                      <SelectItem value="Condominium">Condominium</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {/* Conditional Condo Approval Type - appears as sub-field */}
                  {formState.propertyType === 'Condominium' && (
                    <div className="mt-4 ml-6 pl-4 border-l-2 border-blue-200 bg-blue-50/30 rounded-r-lg p-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="text-blue-700">↳</span> Condominium Approval Type
                      </label>
                      <Select value={formState.condoApprovalType} onValueChange={value => handleInputChange('condoApprovalType', value)}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select approval type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Warrantable">Warrantable</SelectItem>
                          <SelectItem value="Non-Warrantable">Non-Warrantable</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Is there a Purchase Contract in place? *</label>
                  <Select value={formState.hasPurchaseContract} onValueChange={value => handleInputChange('hasPurchaseContract', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {/* Conditional Purchase Contract Close Date - appears as sub-field */}
                  {formState.hasPurchaseContract === 'Yes' && (
                    <div className="mt-4 ml-6 pl-4 border-l-2 border-green-200 bg-green-50/30 rounded-r-lg p-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="text-green-700">↳</span> Purchase Contract close date?
                      </label>
                      <Input 
                        type="date" 
                        value={formState.purchaseContractCloseDate} 
                        onChange={e => handleInputChange('purchaseContractCloseDate', e.target.value)} 
                        className="bg-white"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Units *</label>
                  <Select value={formState.numberOfUnits} onValueChange={value => handleInputChange('numberOfUnits', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select units" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="7">7</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                      <SelectItem value="9">9</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {/* Conditional Nonconforming Units - appears as sub-field */}
                  {parseInt(formState.numberOfUnits) >= 2 && (
                    <div className="mt-4 ml-6 pl-4 border-l-2 border-yellow-200 bg-yellow-50/30 rounded-r-lg p-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="text-yellow-700">↳</span> Are these units Nonconforming/Grandfathered use?
                      </label>
                      <Select value={formState.nonconformingUnits} onValueChange={value => handleInputChange('nonconformingUnits', value)}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  {/* Conditional Net Operation Income - appears as sub-field */}
                  {parseInt(formState.numberOfUnits) >= 5 && (
                    <div className="mt-4 ml-6 pl-4 border-l-2 border-purple-200 bg-purple-50/30 rounded-r-lg p-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="text-purple-700">↳</span> What is the total Net Operation Income?
                      </label>
                      <Input 
                        type="number" 
                        value={formState.totalNetOperationIncome} 
                        onChange={e => handleInputChange('totalNetOperationIncome', e.target.value)} 
                        placeholder="$0" 
                        className="bg-white"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Will there be a lease in place before closing?
                  </label>
                  <Select value={formState.leaseInPlace} onValueChange={value => handleInputChange('leaseInPlace', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {/* Conditional Lease Details - appears as sub-fields */}
                  {formState.leaseInPlace === 'Yes' && (
                    <div className="mt-4 ml-6 pl-4 border-l-2 border-indigo-200 bg-indigo-50/30 rounded-r-lg p-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <span className="text-indigo-700">↳</span> What is the lease structure?
                        </label>
                        <Select value={formState.leaseStructure} onValueChange={value => handleInputChange('leaseStructure', value)}>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select lease structure" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Long-Term Lease">Long-Term Lease</SelectItem>
                            <SelectItem value="Short-Term Rental">Short-Term Rental</SelectItem>
                            <SelectItem value="Single-Room Occupancy">Single-Room Occupancy</SelectItem>
                            <SelectItem value="Month-to-Month Lease">Month-to-Month Lease</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <span className="text-indigo-700">↳</span> Is the property under a section 8 lease?
                        </label>
                        <Select value={formState.section8Lease} onValueChange={value => handleInputChange('section8Lease', value)}>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <span className="text-indigo-700">↳</span> Is there 12 months of STR Rental History?
                        </label>
                        <Select value={formState.strRentalHistory} onValueChange={value => handleInputChange('strRentalHistory', value)}>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Price *</label>
                  <Input 
                    type="number" 
                    value={formState.purchasePrice} 
                    onChange={e => handleInputChange('purchasePrice', e.target.value)} 
                    placeholder="$500,000" 
                    required 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {formState.loanPurpose === 'Refinance' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-dominion-blue">Property Details - Refinance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Refinance Type *</label>
                  <Select value={formState.refinanceType} onValueChange={value => handleInputChange('refinanceType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select refinance type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash-Out">Cash-Out</SelectItem>
                      <SelectItem value="Rate-Term">Rate-Term</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type *</label>
                  <Select value={formState.propertyType} onValueChange={value => handleInputChange('propertyType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single Family">Single Family</SelectItem>
                      <SelectItem value="Two to Four Family">Two to Four Family</SelectItem>
                      <SelectItem value="Multi Family">Multi Family</SelectItem>
                      <SelectItem value="Mixed Use">Mixed Use</SelectItem>
                      <SelectItem value="Condominium">Condominium</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {/* Conditional Condo Approval Type */}
                  {formState.propertyType === 'Condominium' && (
                    <div className="mt-4 ml-6 pl-4 border-l-2 border-blue-200 bg-blue-50/30 rounded-r-lg p-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="text-blue-700">↳</span> Condominium Approval Type
                      </label>
                      <Select value={formState.condoApprovalType} onValueChange={value => handleInputChange('condoApprovalType', value)}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select approval type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Warrantable">Warrantable</SelectItem>
                          <SelectItem value="Non-Warrantable">Non-Warrantable</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Units *</label>
                  <Select value={formState.numberOfUnits} onValueChange={value => handleInputChange('numberOfUnits', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select units" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="7">7</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                      <SelectItem value="9">9</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {/* Conditional Nonconforming Units */}
                  {parseInt(formState.numberOfUnits) >= 2 && (
                    <div className="mt-4 ml-6 pl-4 border-l-2 border-yellow-200 bg-yellow-50/30 rounded-r-lg p-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="text-yellow-700">↳</span> Are these units Nonconforming/Grandfathered use?
                      </label>
                      <Select value={formState.nonconformingUnits} onValueChange={value => handleInputChange('nonconformingUnits', value)}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  {/* Conditional Net Operation Income */}
                  {parseInt(formState.numberOfUnits) >= 5 && (
                    <div className="mt-4 ml-6 pl-4 border-l-2 border-purple-200 bg-purple-50/30 rounded-r-lg p-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="text-purple-700">↳</span> What is the total Net Operation Income?
                      </label>
                      <Input 
                        type="number" 
                        value={formState.totalNetOperationIncome} 
                        onChange={e => handleInputChange('totalNetOperationIncome', e.target.value)} 
                        placeholder="$0" 
                        className="bg-white"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Will there be a lease in place before closing?
                  </label>
                  <Select value={formState.leaseInPlace} onValueChange={value => handleInputChange('leaseInPlace', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {/* Conditional Lease Details */}
                  {formState.leaseInPlace === 'Yes' && (
                    <div className="mt-4 ml-6 pl-4 border-l-2 border-indigo-200 bg-indigo-50/30 rounded-r-lg p-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <span className="text-indigo-700">↳</span> What is the lease structure?
                        </label>
                        <Select value={formState.leaseStructure} onValueChange={value => handleInputChange('leaseStructure', value)}>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select lease structure" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Long-Term Lease">Long-Term Lease</SelectItem>
                            <SelectItem value="Short-Term Rental">Short-Term Rental</SelectItem>
                            <SelectItem value="Single-Room Occupancy">Single-Room Occupancy</SelectItem>
                            <SelectItem value="Month-to-Month Lease">Month-to-Month Lease</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <span className="text-indigo-700">↳</span> Is the property under a section 8 lease?
                        </label>
                        <Select value={formState.section8Lease} onValueChange={value => handleInputChange('section8Lease', value)}>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <span className="text-indigo-700">↳</span> Is there 12 months of STR Rental History?
                        </label>
                        <Select value={formState.strRentalHistory} onValueChange={value => handleInputChange('strRentalHistory', value)}>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Price *</label>
                  <Input 
                    type="number" 
                    value={formState.purchasePrice} 
                    onChange={e => handleInputChange('purchasePrice', e.target.value)} 
                    placeholder="$500,000" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Purchased *</label>
                  <Input 
                    type="date" 
                    value={formState.datePurchased} 
                    onChange={e => handleInputChange('datePurchased', e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Market Value (Estimated) *</label>
                  <Input 
                    type="number" 
                    value={formState.marketValue} 
                    onChange={e => handleInputChange('marketValue', e.target.value)} 
                    placeholder="$500,000" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Is there a mortgage on the property? *</label>
                  <Select value={formState.hasMortgage} onValueChange={value => handleInputChange('hasMortgage', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {/* Conditional Mortgage Payoff */}
                  {formState.hasMortgage === 'Yes' && (
                    <div className="mt-4 ml-6 pl-4 border-l-2 border-red-200 bg-red-50/30 rounded-r-lg p-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="text-red-700">↳</span> What is the estimated Mortgage Payoff?
                      </label>
                      <Input 
                        type="number" 
                        value={formState.mortgagePayoff} 
                        onChange={e => handleInputChange('mortgagePayoff', e.target.value)} 
                        placeholder="$0" 
                        className="bg-white"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What is your estimated rehab cost already spent on the property (If Applicable)?
                  </label>
                  <Input 
                    type="number" 
                    value={formState.rehabCostSpent} 
                    onChange={e => handleInputChange('rehabCostSpent', e.target.value)} 
                    placeholder="$0" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What is your estimated rehab cost needed (If Applicable)?
                  </label>
                  <Input 
                    type="number" 
                    value={formState.rehabCostNeeded} 
                    onChange={e => handleInputChange('rehabCostNeeded', e.target.value)} 
                    placeholder="$0" 
                  />
                </div>
              </div>

              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Total Estimated Rehab Cost:</span>
                  <span className="text-xl font-bold text-dominion-blue">
                    ${calculateTotalRehabCost().toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loan Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-dominion-blue">Loan Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Desired LTV? *</label>
                <Input 
                  type="text" 
                  value={formState.desiredLTV} 
                  onChange={e => handleInputChange('desiredLTV', e.target.value)} 
                  placeholder="e.g., 75%" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Desired Closing Date</label>
                <Input 
                  type="date" 
                  value={formState.desiredClosingDate} 
                  onChange={e => handleInputChange('desiredClosingDate', e.target.value)} 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Rents (Monthly) */}
        {formState.numberOfUnits && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-dominion-blue">
                Property Rents (Monthly) - {formState.loanPurpose === 'Purchase' ? 'New Purchase' : 'Current Rents'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderRentalIncomeFields()}
              </div>
              <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Total Rental Income:</span>
                  <span className="text-xl font-bold text-dominion-blue">
                    ${calculateTotalRental().toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Annual Property Expenses */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-dominion-blue">Annual Property Expenses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Taxes *</label>
                <Input 
                  type="number" 
                  value={formState.annualTaxes} 
                  onChange={e => handleInputChange('annualTaxes', e.target.value)} 
                  placeholder="$6,000" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Insurance Costs *</label>
                <Input 
                  type="number" 
                  value={formState.annualInsurance} 
                  onChange={e => handleInputChange('annualInsurance', e.target.value)} 
                  placeholder="$2,400" 
                  required 
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Association Fees</label>
                <Input 
                  type="number" 
                  value={formState.annualAssociationFees} 
                  onChange={e => handleInputChange('annualAssociationFees', e.target.value)} 
                  placeholder="$1,800" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Flood Insurance Premiums</label>
                <Input 
                  type="number" 
                  value={formState.annualFloodInsurance} 
                  onChange={e => handleInputChange('annualFloodInsurance', e.target.value)} 
                  placeholder="$900" 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Borrower Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-dominion-blue">Additional Borrower Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Credit Score *</label>
                <Input 
                  type="number" 
                  value={formState.creditScore} 
                  onChange={e => handleInputChange('creditScore', e.target.value)} 
                  placeholder="740" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Time Investor? *</label>
                <Select value={formState.firstTimeInvestor} onValueChange={value => handleInputChange('firstTimeInvestor', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Months of Reserves *</label>
                <Input 
                  type="number" 
                  value={formState.monthsOfReserves} 
                  onChange={e => handleInputChange('monthsOfReserves', e.target.value)} 
                  placeholder="12" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Desired Loan Term (months) *</label>
                <Select value={formState.desiredLoanTerm} onValueChange={value => handleInputChange('desiredLoanTerm', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="360">360 months (30 years)</SelectItem>
                    <SelectItem value="300">300 months (25 years)</SelectItem>
                    <SelectItem value="240">240 months (20 years)</SelectItem>
                    <SelectItem value="180">180 months (15 years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Properties on Loan *</label>
                <Input 
                  type="number" 
                  value={formState.numberOfPropertiesOnLoan} 
                  onChange={e => handleInputChange('numberOfPropertiesOnLoan', e.target.value)} 
                  placeholder="1" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Credit Event? *</label>
                <Select value={formState.creditEvent} onValueChange={value => handleInputChange('creditEvent', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mortgage Late Payments? *</label>
                <Select value={formState.mortgageLatePayments} onValueChange={value => handleInputChange('mortgageLatePayments', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Property Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-dominion-blue">Additional Property Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Condition *</label>
                <Select value={formState.propertyCondition} onValueChange={value => handleInputChange('propertyCondition', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="C1">C1 - Excellent</SelectItem>
                    <SelectItem value="C2">C2 - Good</SelectItem>
                    <SelectItem value="C3">C3 - Average</SelectItem>
                    <SelectItem value="C4">C4 - Below Average</SelectItem>
                    <SelectItem value="C5">C5 - Poor</SelectItem>
                    <SelectItem value="C6">C6 - Unsatisfactory</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Square Footage</label>
                <Input 
                  type="number" 
                  value={formState.propertySquareFootage} 
                  onChange={e => handleInputChange('propertySquareFootage', e.target.value)} 
                  placeholder="2000" 
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Is Property Vacant? *</label>
                <Select value={formState.vacant} onValueChange={value => handleInputChange('vacant', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Leased Units</label>
                <Input 
                  type="number" 
                  value={formState.numberOfLeasedUnits} 
                  onChange={e => handleInputChange('numberOfLeasedUnits', e.target.value)} 
                  placeholder="2" 
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Short Term Rental? *</label>
                <Select value={formState.shortTermRental} onValueChange={value => handleInputChange('shortTermRental', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">M2M Lease? *</label>
                <Select value={formState.m2mLease} onValueChange={value => handleInputChange('m2mLease', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rural Property? *</label>
                <Select value={formState.ruralProperty} onValueChange={value => handleInputChange('ruralProperty', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Declining Markets? *</label>
                <Select value={formState.decliningMarkets} onValueChange={value => handleInputChange('decliningMarkets', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Loan Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-dominion-blue">Additional Loan Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cross Collateralized? *</label>
                <Select value={formState.crossCollateralized} onValueChange={value => handleInputChange('crossCollateralized', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interest Only? *</label>
                <Select value={formState.interestOnly} onValueChange={value => handleInputChange('interestOnly', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delayed Purchase? *</label>
                <Select value={formState.delayedPurchase} onValueChange={value => handleInputChange('delayedPurchase', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interest Reserves? *</label>
                <Select value={formState.interestReserves} onValueChange={value => handleInputChange('interestReserves', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Origination Points</label>
                <Input 
                  type="number" 
                  value={formState.originationPoints} 
                  onChange={e => handleInputChange('originationPoints', e.target.value)} 
                  placeholder="2000" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prepayment Penalty Term *</label>
                <Select value={formState.prepaymentPenaltyTerm} onValueChange={value => handleInputChange('prepaymentPenaltyTerm', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="1 Year">1 Year</SelectItem>
                    <SelectItem value="2 Year">2 Year</SelectItem>
                    <SelectItem value="3 Year">3 Year</SelectItem>
                    <SelectItem value="4 Year">4 Year</SelectItem>
                    <SelectItem value="5 Year">5 Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Broker Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-dominion-blue">Broker Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Broker Company Name</label>
                <Input 
                  type="text" 
                  value={formState.brokerCompanyName} 
                  onChange={e => handleInputChange('brokerCompanyName', e.target.value)} 
                  placeholder="Broker Company LLC" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Broker First Name</label>
                <Input 
                  type="text" 
                  value={formState.brokerFirstName} 
                  onChange={e => handleInputChange('brokerFirstName', e.target.value)} 
                  placeholder="John" 
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Broker Last Name</label>
                <Input 
                  type="text" 
                  value={formState.brokerLastName} 
                  onChange={e => handleInputChange('brokerLastName', e.target.value)} 
                  placeholder="Smith" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Broker Phone</label>
                <Input 
                  type="tel" 
                  value={formState.brokerPhone} 
                  onChange={e => handleInputChange('brokerPhone', e.target.value)} 
                  placeholder="(555) 123-4567" 
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Broker Email</label>
                <Input 
                  type="email" 
                  value={formState.brokerEmail} 
                  onChange={e => handleInputChange('brokerEmail', e.target.value)} 
                  placeholder="broker@company.com" 
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Broker Points or Fee</label>
                <Input 
                  type="number" 
                  value={formState.brokerPoints} 
                  onChange={e => handleInputChange('brokerPoints', e.target.value)} 
                  placeholder="0" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Broker Processing Fee</label>
                <Input 
                  type="number" 
                  value={formState.brokerProcessingFee} 
                  onChange={e => handleInputChange('brokerProcessingFee', e.target.value)} 
                  placeholder="0" 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pre-Payment Penalty */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-dominion-blue">Pre-Payment Penalty</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prepayment Penalty Term *</label>
                <Select value={formState.prepaymentPenaltyTerm} onValueChange={value => handleInputChange('prepaymentPenaltyTerm', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select term" />
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Prepayment Penalty Structure *</label>
                <Select value={formState.prepaymentPenaltyStructure} onValueChange={value => handleInputChange('prepaymentPenaltyStructure', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select structure" />
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
            </div>
          </CardContent>
        </Card>

        {/* Loan Officer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-dominion-blue">Loan Officer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loan Officer Name *</label>
                <Input 
                  type="text" 
                  value={formState.loanOfficerName} 
                  onChange={e => handleInputChange('loanOfficerName', e.target.value)} 
                  placeholder="Gregory Clarke" 
                  required 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-between items-center pt-6">
          <Button type="button" variant="outline" onClick={onBack}>
            Back to Upload
          </Button>
          <Button type="submit" disabled={isLoading} className="bg-dominion-blue hover:bg-blue-700">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Get Pricing'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DSCRForm;

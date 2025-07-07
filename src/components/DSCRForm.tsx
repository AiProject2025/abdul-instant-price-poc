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
    creditScore: ''
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated rehab cost (If Applicable)?
                  </label>
                  <Input 
                    type="number" 
                    value={formState.estimatedRehabCost} 
                    onChange={e => handleInputChange('estimatedRehabCost', e.target.value)} 
                    placeholder="$0" 
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

        {/* Final Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-dominion-blue">Final Details</CardTitle>
          </CardHeader>
          <CardContent>
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

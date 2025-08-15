import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { statesWithAbbreviations } from '@/utils/locationData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, FileText, AlertTriangle, User, Home, DollarSign, Calendar, Shield } from 'lucide-react';
import StateCountySelector from '@/components/StateCountySelector';
import ConfirmPricingDialog from '@/components/ConfirmPricingDialog';

interface DSCRFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onBack: () => void;
  isLoading?: boolean;
  isPackageLoan?: boolean;
}

const DSCRForm: React.FC<DSCRFormProps> = ({
  initialData,
  onSubmit,
  onBack,
  isLoading,
  isPackageLoan
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
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
    
    // Cross Collateral Information
    crossCollateralLoan: 'No',
    numberOfProperties: '',
    
    // Subject Property Address
    streetAddress: '',
    city: '',
    propertyState: '',
    zipCode: '',
    propertyCounty: '',
    
    // Property Details - New Purchase
    propertyType: '',
    propertyCondition: 'C3',
    rural: 'No',
    decliningMarket: 'No',
    interestOnly: 'No',
    condoApprovalType: '',
    hasPurchaseContract: '',
    purchaseContractCloseDate: '',
    numberOfUnits: '',
    numberOfLeasedUnits: '',
    hasVacantUnits: 'No',
    numberOfVacantUnits: '',
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
    desiredClosingDate: (() => {
      const date = new Date();
      date.setMonth(date.getMonth() + 1); // Set to 1 month from today
      const formattedDate = date.toISOString().split('T')[0];
      console.log('Setting default closing date to:', formattedDate);
      return formattedDate;
    })(),
    interestReserves: 'Yes',
    
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
    dscrRent: '',
    estRent: '',
    mktRent: '',
    totalSquareFeet: '2000', // Default to single family
    
    // Package Loan specific fields
    prePaymentPenaltyTerm: '',
    
    // Annual Property Expenses
    annualTaxes: '',
    annualInsurance: '',
    annualAssociationFees: '',
    annualFloodInsurance: '',
    
    // Final Details
    creditScore: ''
  });

  // Define required fields for validation
  const requiredFields = {
    firstName: 'First Name',
    lastName: 'Last Name', 
    phone: 'Phone',
    email: 'Email',
    usCitizen: 'U.S. Citizen',
    closingType: 'Closing Type',
    crossCollateralLoan: 'Cross Collateral Loan',
    streetAddress: 'Street Address',
    city: 'City',
    propertyState: 'Property State',
    zipCode: 'ZIP Code',
    propertyCounty: 'Property County',
    loanPurpose: 'Loan Purpose',
    propertyType: 'Property Type',
    numberOfUnits: 'Number of Units',
    desiredLTV: 'Desired LTV',
    creditScore: 'Credit Score'
  };

  // Check if a field is required and empty
  const isFieldInvalid = (fieldName: string) => {
    return requiredFields[fieldName as keyof typeof requiredFields] && !formState[fieldName as keyof typeof formState];
  };

  // Get error message for a field
  const getFieldError = (fieldName: string) => {
    if (isFieldInvalid(fieldName)) {
      return `${requiredFields[fieldName as keyof typeof requiredFields]} is required`;
    }
    return '';
  };

  // Validate all required fields
  const validateForm = () => {
    const missingFields: string[] = [];
    Object.keys(requiredFields).forEach(fieldName => {
      if (isFieldInvalid(fieldName)) {
        missingFields.push(fieldName);
      }
    });
    return missingFields;
  };

  console.log('Extracted Data',initialData)

  // Initialize form with data if available
  useEffect(() => {
    if (initialData) {
      const updatedData = { ...initialData };
      
      // Auto-sync numberOfLeasedUnits when numberOfUnits is provided in initial data
      if (updatedData.numberOfUnits && !updatedData.numberOfLeasedUnits) {
        updatedData.numberOfLeasedUnits = updatedData.numberOfUnits;
        console.log('Auto-populating numberOfLeasedUnits from initialData:', updatedData.numberOfUnits);
      }
      
      // Auto-set square footage based on number of units in initial data
      if (updatedData.numberOfUnits && !updatedData.totalSquareFeet) {
        const units = parseInt(updatedData.numberOfUnits) || 1;
        if (units === 1) {
          updatedData.totalSquareFeet = '2000';
          console.log('Setting initial square footage to 2000 for single family');
        } else if (units >= 2 && units <= 4) {
          updatedData.totalSquareFeet = '2800';
          console.log('Setting initial square footage to 2800 for 2-4 units');
        } else if (units >= 5 && units <= 10) {
          updatedData.totalSquareFeet = '8000';
          console.log('Setting initial square footage to 8000 for 5-10 units');
        }
      }

      // For package loans, ensure Cross Collateral Loan is set to 'Yes'
      if (isPackageLoan) {
        updatedData.crossCollateralLoan = 'Yes';
        console.log('Setting crossCollateralLoan to Yes for package loan');
      }

      // If desiredLTV is not set but we have one in initialData, ensure it's used
      if (updatedData.desiredLTV) {
        console.log('Using desiredLTV from initialData:', updatedData.desiredLTV);
      }

      // If numberOfProperties is not set but we have one in initialData, ensure it's used  
      if (updatedData.numberOfProperties) {
        console.log('Using numberOfProperties from initialData:', updatedData.numberOfProperties);
      }

      // If desiredClosingDate is not provided in initialData, use default (1 month from today)
      if (!updatedData.desiredClosingDate) {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        updatedData.desiredClosingDate = date.toISOString().split('T')[0];
        console.log('Setting default desiredClosingDate to:', updatedData.desiredClosingDate);
      }
      
      setFormState(prev => ({
        ...prev,
        ...updatedData
      }));
    }
  }, [initialData, isPackageLoan]);

  // Calculate total rental income
  const calculateTotalRental = () => {
    if (isPackageLoan) {
      if (formState.dscrRent) {
        const v = parseFloat(formState.dscrRent) || 0;
        return v;
      }
      if (formState.mktRent) {
        const v = parseFloat(formState.mktRent) || 0;
        return v;
      }
      if (formState.estRent) {
        const v = parseFloat(formState.estRent) || 0;
        return v;
      }
    }
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
    'dscrRent', 'estRent', 'mktRent',
    'annualTaxes', 'annualInsurance', 'annualAssociationFees', 'annualFloodInsurance',
    'creditScore', 'desiredLTV', 'totalSquareFeet'
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
      setFormState(prev => {
        const newState = {
          ...prev,
          [field]: value
        };
        
        // Auto-sync numberOfLeasedUnits when numberOfUnits changes
        if (field === 'numberOfUnits') {
          console.log('Number of units changed to:', value);
          newState.numberOfLeasedUnits = value;
          console.log('Setting number of leased units to:', value);
          
          // Auto-set square footage based on number of units
          const units = parseInt(value) || 1;
          if (units === 1) {
            newState.totalSquareFeet = '2000'; // Single family
            console.log('Setting square footage to 2000 for single family');
          } else if (units >= 2 && units <= 4) {
            newState.totalSquareFeet = '2800'; // 2-4 units
            console.log('Setting square footage to 2800 for 2-4 units');
          } else if (units >= 5 && units <= 10) {
            newState.totalSquareFeet = '8000'; // 5-10 units (Multi Family)
            console.log('Setting square footage to 8000 for 5-10 units');
          }
        }
        
        return newState;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if form is valid before showing confirmation dialog
    const missingFields = validateForm();
    if (missingFields.length > 0) {
      // Form has errors, don't show dialog
      return;
    }
    
    // Show confirmation dialog instead of directly submitting
    setShowConfirmDialog(true);
  };

  const handleConfirmPricing = (data: { desiredLTV: string; desiredClosingDate: string }) => {
    // Update form state with confirmed values
    const updatedFormState = {
      ...formState,
      desiredLTV: data.desiredLTV,
      desiredClosingDate: data.desiredClosingDate
    };
    
    setShowConfirmDialog(false);
    onSubmit({
      formData: updatedFormState,
      isLoading: true
    });
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
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary">DSCR Questionnaire</h1>
            <p className="text-muted-foreground">Complete all required fields to get your loan pricing</p>
          </div>
        </div>
        
        {initialData && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-green-600" />
              <span className="text-green-700 text-sm font-medium">Form auto-populated from uploaded document</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card className="border-l-4 border-l-primary shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl text-primary">Personal Information</CardTitle>
              <Badge variant="secondary" className="ml-auto">Required</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${isFieldInvalid('firstName') ? 'text-red-600' : 'text-foreground'} mb-2`}>
                  First Name *
                </label>
                <Input 
                  type="text" 
                  value={formState.firstName} 
                  onChange={e => handleInputChange('firstName', e.target.value)}
                  className={isFieldInvalid('firstName') ? 'border-red-500 focus:border-red-500' : ''}
                  placeholder="Enter your first name"
                />
                {getFieldError('firstName') && (
                  <div className="flex items-center gap-1 text-red-600 text-xs">
                    <AlertTriangle className="h-3 w-3" />
                    {getFieldError('firstName')}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${isFieldInvalid('lastName') ? 'text-red-600' : 'text-foreground'} mb-2`}>
                  Last Name *
                </label>
                <Input 
                  type="text" 
                  value={formState.lastName} 
                  onChange={e => handleInputChange('lastName', e.target.value)}
                  className={isFieldInvalid('lastName') ? 'border-red-500 focus:border-red-500' : ''}
                  placeholder="Enter your last name"
                />
                {getFieldError('lastName') && (
                  <div className="flex items-center gap-1 text-red-600 text-xs">
                    <AlertTriangle className="h-3 w-3" />
                    {getFieldError('lastName')}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${isFieldInvalid('phone') ? 'text-red-600' : 'text-foreground'} mb-2`}>
                  Phone Number *
                </label>
                <Input 
                  type="tel" 
                  value={formState.phone} 
                  onChange={e => handleInputChange('phone', e.target.value)}
                  className={isFieldInvalid('phone') ? 'border-red-500 focus:border-red-500' : ''}
                  placeholder="(555) 123-4567"
                />
                {getFieldError('phone') && (
                  <div className="flex items-center gap-1 text-red-600 text-xs">
                    <AlertTriangle className="h-3 w-3" />
                    {getFieldError('phone')}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${isFieldInvalid('email') ? 'text-red-600' : 'text-foreground'} mb-2`}>
                  Email Address *
                </label>
                <Input 
                  type="email" 
                  value={formState.email} 
                  onChange={e => handleInputChange('email', e.target.value)}
                  className={isFieldInvalid('email') ? 'border-red-500 focus:border-red-500' : ''}
                  placeholder="your.email@example.com"
                />
                {getFieldError('email') && (
                  <div className="flex items-center gap-1 text-red-600 text-xs">
                    <AlertTriangle className="h-3 w-3" />
                    {getFieldError('email')}
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Company (Optional)
                </label>
                <Input 
                  type="text" 
                  value={formState.yourCompany} 
                  onChange={e => handleInputChange('yourCompany', e.target.value)}
                  placeholder="Your company name"
                />
              </div>
              
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${isFieldInvalid('usCitizen') ? 'text-red-600' : 'text-foreground'} mb-2`}>
                  U.S. Citizen Status *
                </label>
                <Select value={formState.usCitizen} onValueChange={value => handleInputChange('usCitizen', value)}>
                  <SelectTrigger className={isFieldInvalid('usCitizen') ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select citizenship status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes, I am a U.S. Citizen</SelectItem>
                    <SelectItem value="No">No, I am not a U.S. Citizen</SelectItem>
                  </SelectContent>
                </Select>
                {getFieldError('usCitizen') && (
                  <div className="flex items-center gap-1 text-red-600 text-xs">
                    <AlertTriangle className="h-3 w-3" />
                    {getFieldError('usCitizen')}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${isFieldInvalid('closingType') ? 'text-red-600' : 'text-foreground'} mb-2`}>
                  Closing Type *
                </label>
                <Select value={formState.closingType} onValueChange={value => handleInputChange('closingType', value)}>
                  <SelectTrigger className={isFieldInvalid('closingType') ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select closing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entity">Entity (LLC, Corp, etc.)</SelectItem>
                    <SelectItem value="Personal">Personal Name</SelectItem>
                  </SelectContent>
                </Select>
                {getFieldError('closingType') && (
                  <div className="flex items-center gap-1 text-red-600 text-xs">
                    <AlertTriangle className="h-3 w-3" />
                    {getFieldError('closingType')}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loan Structure */}
        <Card className="border-l-4 border-l-orange-500 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-orange-500" />
              <CardTitle className="text-xl text-orange-700">Loan Structure</CardTitle>
              <Badge variant="secondary" className="ml-auto">Required</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${isFieldInvalid('crossCollateralLoan') ? 'text-red-600' : 'text-foreground'} mb-2`}>
                Cross Collateral Loan *
              </label>
              <Select value={formState.crossCollateralLoan} onValueChange={value => handleInputChange('crossCollateralLoan', value)}>
                <SelectTrigger className={isFieldInvalid('crossCollateralLoan') ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select loan structure" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes - Multiple Properties</SelectItem>
                  <SelectItem value="No">No - Single Property</SelectItem>
                </SelectContent>
              </Select>
              {getFieldError('crossCollateralLoan') && (
                <div className="flex items-center gap-1 text-red-600 text-xs">
                  <AlertTriangle className="h-3 w-3" />
                  {getFieldError('crossCollateralLoan')}
                </div>
              )}
              
              {/* Conditional Number of Properties - Enhanced Design */}
              {formState.crossCollateralLoan === 'Yes' && (
                <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100/50 border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <label className="text-sm font-medium text-orange-700">
                      Number of Properties (Max 25)
                    </label>
                  </div>
                  <Input 
                    type="number" 
                    value={formState.numberOfProperties} 
                    onChange={e => handleInputChange('numberOfProperties', e.target.value)} 
                    placeholder="Enter number of properties" 
                    className="bg-white border-orange-200 focus:border-orange-400"
                    min="2"
                    max="25"
                  />
                  {parseInt(formState.numberOfProperties) > 25 && (
                    <div className="mt-2 flex items-center gap-1 text-red-600 text-xs">
                      <AlertTriangle className="h-3 w-3" />
                      Maximum of 25 properties allowed for cross collateral loans.
                    </div>
                  )}
                  <p className="text-xs text-orange-600 mt-2">
                    Cross collateral loans allow you to use multiple properties as collateral for a single loan.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Property Address */}
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-xl text-blue-700">Property Address</CardTitle>
              <Badge variant="secondary" className="ml-auto">Required</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${isFieldInvalid('streetAddress') ? 'text-red-600' : 'text-foreground'} mb-2`}>
                Street Address *
              </label>
              <Input 
                type="text" 
                value={formState.streetAddress} 
                onChange={e => handleInputChange('streetAddress', e.target.value)}
                className={isFieldInvalid('streetAddress') ? 'border-red-500 focus:border-red-500' : ''}
                placeholder="123 Main Street"
              />
              {getFieldError('streetAddress') && (
                <div className="flex items-center gap-1 text-red-600 text-xs">
                  <AlertTriangle className="h-3 w-3" />
                  {getFieldError('streetAddress')}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${isFieldInvalid('city') ? 'text-red-600' : 'text-foreground'} mb-2`}>
                  City *
                </label>
                <Input 
                  type="text" 
                  value={formState.city} 
                  onChange={e => handleInputChange('city', e.target.value)}
                  className={isFieldInvalid('city') ? 'border-red-500 focus:border-red-500' : ''}
                  placeholder="City name"
                />
                {getFieldError('city') && (
                  <div className="flex items-center gap-1 text-red-600 text-xs">
                    <AlertTriangle className="h-3 w-3" />
                    {getFieldError('city')}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${isFieldInvalid('zipCode') ? 'text-red-600' : 'text-foreground'} mb-2`}>
                  ZIP Code *
                </label>
                <Input 
                  type="text" 
                  value={formState.zipCode} 
                  onChange={e => handleInputChange('zipCode', e.target.value)}
                  className={isFieldInvalid('zipCode') ? 'border-red-500 focus:border-red-500' : ''}
                  placeholder="12345"
                />
                {getFieldError('zipCode') && (
                  <div className="flex items-center gap-1 text-red-600 text-xs">
                    <AlertTriangle className="h-3 w-3" />
                    {getFieldError('zipCode')}
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-200">
              <StateCountySelector
                selectedState={formState.propertyState}
                selectedCounty={formState.propertyCounty}
                selectedZipCode={formState.zipCode}
                onStateChange={(state) => handleInputChange('propertyState', state)}
                onCountyChange={(county) => handleInputChange('propertyCounty', county)}
                onZipCodeChange={(zip) => handleInputChange('zipCode', zip)}
              />
              {(getFieldError('propertyState') || getFieldError('propertyCounty')) && (
                <div className="mt-2 space-y-1">
                  {getFieldError('propertyState') && (
                    <div className="flex items-center gap-1 text-red-600 text-xs">
                      <AlertTriangle className="h-3 w-3" />
                      {getFieldError('propertyState')}
                    </div>
                  )}
                  {getFieldError('propertyCounty') && (
                    <div className="flex items-center gap-1 text-red-600 text-xs">
                      <AlertTriangle className="h-3 w-3" />
                      {getFieldError('propertyCounty')}
                    </div>
                  )}
                </div>
              )}
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
                       <SelectItem value="single-family">Single Family</SelectItem>
                       <SelectItem value="condominium">Condominium</SelectItem>
                       <SelectItem value="condotel">Condotel</SelectItem>
                       <SelectItem value="two-to-four-family">Two to Four Family</SelectItem>
                       <SelectItem value="mixed-use">Mixed-Use</SelectItem>
                       <SelectItem value="pud">PUD</SelectItem>
                       <SelectItem value="townhouse">Townhouse</SelectItem>
                       <SelectItem value="cooperative">Cooperative</SelectItem>
                       <SelectItem value="multi-family">Multi-Family</SelectItem>
                       <SelectItem value="modular-home">Modular Home</SelectItem>
                       <SelectItem value="manufactured-home">Manufactured Home</SelectItem>
                     </SelectContent>
                  </Select>
                  
                   {/* Conditional Condo Approval Type - appears as sub-field */}
                   {formState.propertyType === 'condominium' && (
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Condition *</label>
                  <Select value={formState.propertyCondition} onValueChange={value => handleInputChange('propertyCondition', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rural? *</label>
                  <Select value={formState.rural} onValueChange={value => handleInputChange('rural', value)}>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Declining market? *</label>
                  <Select value={formState.decliningMarket} onValueChange={value => handleInputChange('decliningMarket', value)}>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interest only? *</label>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Leased Units *</label>
                    <Input 
                      type="number" 
                      value={formState.numberOfLeasedUnits} 
                      onChange={e => handleInputChange('numberOfLeasedUnits', e.target.value)} 
                      placeholder="Enter number of leased units" 
                      min="0"
                      max={formState.numberOfUnits || "10"}
                    />
                  </div>
                </div>

                {/* Vacant Units Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Are there any vacant units? *</label>
                  <Select value={formState.hasVacantUnits} onValueChange={value => handleInputChange('hasVacantUnits', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {/* Conditional Vacant Units Count - appears as sub-field */}
                  {formState.hasVacantUnits === 'Yes' && parseInt(formState.numberOfUnits) > 1 && (
                    <div className="mt-4 ml-6 pl-4 border-l-2 border-orange-200 bg-orange-50/30 rounded-r-lg p-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="text-orange-700">↳</span> How many units are vacant?
                      </label>
                      <Input 
                        type="number" 
                        value={formState.numberOfVacantUnits} 
                        onChange={e => handleInputChange('numberOfVacantUnits', e.target.value)} 
                        placeholder="Enter number of vacant units" 
                        className="bg-white"
                        min="1"
                        max={formState.numberOfUnits || "10"}
                      />
                    </div>
                  )}
                  
                  {/* Flag for 10+ units */}
                  {parseInt(formState.numberOfUnits) > 10 && (
                    <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-700">
                            <strong>Bridge Product Required:</strong> Properties with more than 10 units require our bridge financing products. Please contact our team for specialized financing options.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                  
                {/* Conditional Nonconforming Units - appears as sub-field */}
                {parseInt(formState.numberOfUnits) >= 2 && (
                  <div className="ml-6 pl-4 border-l-2 border-yellow-200 bg-yellow-50/30 rounded-r-lg p-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="text-yellow-700">↳</span> Any nonconforming units?
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
                  <div className="ml-6 pl-4 border-l-2 border-purple-200 bg-purple-50/30 rounded-r-lg p-3">
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
                       <SelectItem value="single-family">Single Family</SelectItem>
                       <SelectItem value="condominium">Condominium</SelectItem>
                       <SelectItem value="condotel">Condotel</SelectItem>
                       <SelectItem value="two-to-four-family">Two to Four Family</SelectItem>
                       <SelectItem value="mixed-use">Mixed-Use</SelectItem>
                       <SelectItem value="pud">PUD</SelectItem>
                       <SelectItem value="townhouse">Townhouse</SelectItem>
                       <SelectItem value="cooperative">Cooperative</SelectItem>
                       <SelectItem value="multi-family">Multi-Family</SelectItem>
                       <SelectItem value="modular-home">Modular Home</SelectItem>
                       <SelectItem value="manufactured-home">Manufactured Home</SelectItem>
                     </SelectContent>
                  </Select>
                  
                   {/* Conditional Condo Approval Type */}
                   {formState.propertyType === 'condominium' && (
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Condition *</label>
                  <Select value={formState.propertyCondition} onValueChange={value => handleInputChange('propertyCondition', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rural? *</label>
                  <Select value={formState.rural} onValueChange={value => handleInputChange('rural', value)}>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Declining market? *</label>
                  <Select value={formState.decliningMarket} onValueChange={value => handleInputChange('decliningMarket', value)}>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interest only? *</label>
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

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Leased Units *</label>
                    <Input 
                      type="number" 
                      value={formState.numberOfLeasedUnits} 
                      onChange={e => handleInputChange('numberOfLeasedUnits', e.target.value)} 
                      placeholder="Enter number of leased units" 
                      min="0"
                      max={formState.numberOfUnits || "10"}
                    />
                  </div>
                </div>

                {/* Vacant Units Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Are there any vacant units? *</label>
                  <Select value={formState.hasVacantUnits} onValueChange={value => handleInputChange('hasVacantUnits', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {/* Conditional Vacant Units Count - appears as sub-field */}
                  {formState.hasVacantUnits === 'Yes' && parseInt(formState.numberOfUnits) > 1 && (
                    <div className="mt-4 ml-6 pl-4 border-l-2 border-orange-200 bg-orange-50/30 rounded-r-lg p-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="text-orange-700">↳</span> How many units are vacant?
                      </label>
                      <Input 
                        type="number" 
                        value={formState.numberOfVacantUnits} 
                        onChange={e => handleInputChange('numberOfVacantUnits', e.target.value)} 
                        placeholder="Enter number of vacant units" 
                        className="bg-white"
                        min="1"
                        max={formState.numberOfUnits || "10"}
                      />
                    </div>
                  )}
                  
                  {/* Flag for 10+ units */}
                  {parseInt(formState.numberOfUnits) > 10 && (
                    <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-700">
                            <strong>Bridge Product Required:</strong> Properties with more than 10 units require our bridge financing products. Please contact our team for specialized financing options.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                  
                {/* Conditional Nonconforming Units */}
                {parseInt(formState.numberOfUnits) >= 2 && (
                  <div className="ml-6 pl-4 border-l-2 border-yellow-200 bg-yellow-50/30 rounded-r-lg p-3">
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
                  <div className="ml-6 pl-4 border-l-2 border-purple-200 bg-purple-50/30 rounded-r-lg p-3">
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
            
            {/* Interest Reserves - Only show for refinance loans */}
            {formState.loanPurpose === 'Refinance' && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interest Reserves *
                </label>
                <p className="text-sm text-gray-600 mb-3">
                  {formState.refinanceType === 'Rate/Term' 
                    ? 'For Rate/Term refinance, liquidity needs to be 2x per loan guidelines.'
                    : 'Applicable for Product B and H on Cash Out refinance, or when only 1 note buyer is available.'
                  }
                </p>
                <Select value={formState.interestReserves} onValueChange={value => handleInputChange('interestReserves', value)}>
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
              {isPackageLoan && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">DSCR Rent (Monthly)</label>
                    <Input 
                      type="number" 
                      value={formState.dscrRent}
                      onChange={e => handleInputChange('dscrRent', e.target.value)} 
                      placeholder="$0" 
                    />
                    <p className="text-xs text-gray-500 mt-1">If provided, this overrides total unit rents for package loan pricing.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Rent (Monthly)</label>
                    <Input 
                      type="number" 
                      value={formState.estRent}
                      onChange={e => handleInputChange('estRent', e.target.value)} 
                      placeholder="$0" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Market Rent (Monthly)</label>
                    <Input 
                      type="number" 
                      value={formState.mktRent}
                      onChange={e => handleInputChange('mktRent', e.target.value)} 
                      placeholder="$0" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pre Payment Penalty Term *</label>
                    <Select value={formState.prePaymentPenaltyTerm} onValueChange={value => handleInputChange('prePaymentPenaltyTerm', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select prepayment penalty term" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no-prepay">No Prepay</SelectItem>
                        <SelectItem value="1-year">1 Year</SelectItem>
                        <SelectItem value="2-year">2 Year</SelectItem>
                        <SelectItem value="3-year">3 Year</SelectItem>
                        <SelectItem value="4-year">4 Year</SelectItem>
                        <SelectItem value="5-year">5 Year</SelectItem>
                        <SelectItem value="6-year">6 Year</SelectItem>
                        <SelectItem value="7-year">7 Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderRentalIncomeFields()}
              </div>
              
              {/* Total Square Feet */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Square Feet
                    </label>
                    <Input 
                      type="number" 
                      value={formState.totalSquareFeet} 
                      onChange={e => handleInputChange('totalSquareFeet', e.target.value)} 
                      placeholder="2,000" 
                    />
                  </div>
                  
                  {/* Show per-unit square footage calculation */}
                  {formState.totalSquareFeet && formState.numberOfUnits && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Square Feet Per Unit
                      </label>
                      <div className="p-3 bg-white border border-gray-300 rounded text-lg font-semibold text-dominion-blue">
                        {Math.round(parseFloat(formState.totalSquareFeet) / parseInt(formState.numberOfUnits)).toLocaleString()} sq ft
                      </div>
                    </div>
                  )}
                </div>
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

      <ConfirmPricingDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmPricing}
        currentLTV={formState.desiredLTV}
        currentClosingDate={formState.desiredClosingDate}
      />
    </div>
  );
};

export default DSCRForm;


import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Upload, FileText } from 'lucide-react';

interface DSCRFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onBack: () => void;
  isLoading?: boolean;
}

const DSCRForm: React.FC<DSCRFormProps> = ({ initialData, onSubmit, onBack, isLoading }) => {
  const [formState, setFormState] = useState({
    // Borrower Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Property Information  
    streetAddress: '',
    city: '',
    propertyState: '',
    propertyCounty: '',
    zipCode: '',
    propertyType: '',
    numberOfUnits: '',
    appraisedValue: '',
    purchasePrice: '',
    
    // Loan Information
    baseLoanAmount: '',
    loanPurpose: '',
    
    // Income Information
    marketRent: '',
    currentRent: '',
    
    // Expense Information
    monthlyTaxes: '',
    monthlyInsurance: '',
    monthlyHOA: '',
    monthlyFloodInsurance: '',
    
    // Financial Information
    decisionCreditScore: '',
    monthsOfReserves: ''
  });

  // Auto-populate form with extracted data
  useEffect(() => {
    if (initialData) {
      setFormState(prev => ({
        ...prev,
        firstName: initialData.firstName || prev.firstName,
        lastName: initialData.lastName || prev.lastName,
        email: initialData.email || prev.email,
        phone: initialData.phone || prev.phone,
        streetAddress: initialData.propertyAddress || initialData.streetAddress || prev.streetAddress,
        city: initialData.propertyCity || initialData.city || prev.city,
        propertyState: initialData.propertyState || initialData.state || prev.propertyState,
        propertyCounty: initialData.propertyCounty || initialData.county || prev.propertyCounty,
        zipCode: initialData.propertyZip || initialData.zipCode || prev.zipCode,
        propertyType: initialData.propertyType || prev.propertyType,
        numberOfUnits: initialData.numberOfUnits || prev.numberOfUnits,
        appraisedValue: initialData.appraisedValue || prev.appraisedValue,
        baseLoanAmount: initialData.loanAmount || initialData.baseLoanAmount || prev.baseLoanAmount,
        marketRent: initialData.marketRent || prev.marketRent,
        monthlyTaxes: initialData.monthlyTaxes || prev.monthlyTaxes,
        monthlyInsurance: initialData.monthlyInsurance || prev.monthlyInsurance,
        decisionCreditScore: initialData.creditScore || initialData.decisionCreditScore || prev.decisionCreditScore,
        monthsOfReserves: initialData.monthsOfReserves || prev.monthsOfReserves
      }));
    }
  }, [initialData]);

  const handleInputChange = (field: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Determine loan purpose and refinance type based on selection
    let loanPurpose = '';
    let refinanceType = '';
    
    if (formState.loanPurpose === 'Purchase') {
      loanPurpose = 'purchase';
      refinanceType = '';
    } else if (formState.loanPurpose === 'Rate Term Refinance') {
      loanPurpose = 'refinance';
      refinanceType = 'rate-term';
    } else if (formState.loanPurpose === 'Cash Out Refinance') {
      loanPurpose = 'refinance';
      refinanceType = 'cash-out';
    }
    
    // Map form fields to API payload format
    const apiPayload = {
      state: formState.propertyState,
      county: formState.propertyCounty,
      zip_code: formState.zipCode,
      property_type: formState.propertyType?.toLowerCase().replace(' ', '-') || '',
      number_of_units: formState.numberOfUnits,
      appraised_value: parseFloat(formState.appraisedValue) || 0,
      purchase_price: parseFloat(formState.purchasePrice) || 0,
      base_loan_amount: parseFloat(formState.baseLoanAmount) || 0,
      loan_purpose: loanPurpose,
      refinance_type: refinanceType,
      monthly_market_rent: formState.marketRent,
      property_rental_income: formState.currentRent,
      monthly_taxes: formState.monthlyTaxes,
      monthly_hoa: formState.monthlyHOA || '0.00',
      monthly_insurance: formState.monthlyInsurance,
      monthly_flood_insurance: formState.monthlyFloodInsurance || '0.00',
      credit_score: formState.decisionCreditScore,
      months_of_reserves: formState.monthsOfReserves
    };

    try {
      console.log('Calling instant pricing API with payload:', apiPayload);
      
      const response = await fetch('https://instant-pricing-252613984003.us-east1.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload)
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const apiResponse = await response.json();
      console.log('API Response:', apiResponse);
      
      // Pass both form data and API response to parent component
      onSubmit({
        formData: formState,
        pricingResults: apiResponse
      });
      
    } catch (error) {
      console.error('Error calling instant pricing API:', error);
      // Still call onSubmit with form data in case of API error
      onSubmit(formState);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dominion-blue mb-2">DSCR Loan Application</h1>
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
        {/* Borrower Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-dominion-blue">Borrower Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <Input
                  type="text"
                  value={formState.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <Input
                  type="text"
                  value={formState.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <Input
                  type="email"
                  value={formState.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <Input
                  type="tel"
                  value={formState.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-dominion-blue">Property Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
              <Input
                type="text"
                value={formState.streetAddress}
                onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <Input
                  type="text"
                  value={formState.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                <Input
                  type="text"
                  value={formState.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  required
                />
              </div>
            </div>
            
            {/* State and County as text inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property State *</label>
                <Input
                  type="text"
                  value={formState.propertyState}
                  onChange={(e) => handleInputChange('propertyState', e.target.value)}
                  placeholder="e.g., CA"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property County *</label>
                <Input
                  type="text"
                  value={formState.propertyCounty}
                  onChange={(e) => handleInputChange('propertyCounty', e.target.value)}
                  placeholder="e.g., Los Angeles"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type *</label>
                <Select value={formState.propertyType} onValueChange={(value) => handleInputChange('propertyType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single Family">Single Family</SelectItem>
                    <SelectItem value="Duplex">Duplex</SelectItem>
                    <SelectItem value="Triplex">Triplex</SelectItem>
                    <SelectItem value="Fourplex">Fourplex</SelectItem>
                    <SelectItem value="Condo">Condo</SelectItem>
                    <SelectItem value="Townhome">Townhome</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Units *</label>
                <Select value={formState.numberOfUnits} onValueChange={(value) => handleInputChange('numberOfUnits', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select units" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Appraised Value *</label>
                <Input
                  type="number"
                  value={formState.appraisedValue}
                  onChange={(e) => handleInputChange('appraisedValue', e.target.value)}
                  placeholder="$500,000"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Price</label>
                <Input
                  type="number"
                  value={formState.purchasePrice}
                  onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                  placeholder="$480,000"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loan Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-dominion-blue">Loan Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Base Loan Amount *</label>
                <Input
                  type="number"
                  value={formState.baseLoanAmount}
                  onChange={(e) => handleInputChange('baseLoanAmount', e.target.value)}
                  placeholder="$400,000"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loan Purpose *</label>
                <Select value={formState.loanPurpose} onValueChange={(value) => handleInputChange('loanPurpose', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select loan purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Purchase">Purchase</SelectItem>
                    <SelectItem value="Rate Term Refinance">Rate Term Refinance</SelectItem>
                    <SelectItem value="Cash Out Refinance">Cash Out Refinance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Income Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-dominion-blue">Income Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Market Rent *</label>
                <Input
                  type="number"
                  value={formState.marketRent}
                  onChange={(e) => handleInputChange('marketRent', e.target.value)}
                  placeholder="$3,500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Rent</label>
                <Input
                  type="number"
                  value={formState.currentRent}
                  onChange={(e) => handleInputChange('currentRent', e.target.value)}
                  placeholder="$3,200"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expense Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-dominion-blue">Expense Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Taxes *</label>
                <Input
                  type="number"
                  value={formState.monthlyTaxes}
                  onChange={(e) => handleInputChange('monthlyTaxes', e.target.value)}
                  placeholder="$500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Insurance *</label>
                <Input
                  type="number"
                  value={formState.monthlyInsurance}
                  onChange={(e) => handleInputChange('monthlyInsurance', e.target.value)}
                  placeholder="$200"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly HOA</label>
                <Input
                  type="number"
                  value={formState.monthlyHOA}
                  onChange={(e) => handleInputChange('monthlyHOA', e.target.value)}
                  placeholder="$150"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Flood Insurance</label>
                <Input
                  type="number"
                  value={formState.monthlyFloodInsurance}
                  onChange={(e) => handleInputChange('monthlyFloodInsurance', e.target.value)}
                  placeholder="$75"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-dominion-blue">Financial Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Decision Credit Score *</label>
                <Input
                  type="number"
                  value={formState.decisionCreditScore}
                  onChange={(e) => handleInputChange('decisionCreditScore', e.target.value)}
                  placeholder="740"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Months of Reserves *</label>
                <Input
                  type="number"
                  value={formState.monthsOfReserves}
                  onChange={(e) => handleInputChange('monthsOfReserves', e.target.value)}
                  placeholder="12"
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

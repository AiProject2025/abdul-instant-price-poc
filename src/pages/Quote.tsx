import { useState } from "react";
import QuestionnaireUpload from "@/components/QuestionnaireUpload";
import DSCRForm from "@/components/DSCRForm";
import LoanPassView from "@/components/LoanPassView";
import PricingResults from "@/components/PricingResults";
import BondDisplay from "@/components/BondDisplay";
import { LoganChatbot } from "@/components/LoganChatbot";
import { Button } from "@/components/ui/button";
import QuoteTracker from "@/components/QuoteTracker";
import ScenarioGrid from "@/components/ScenarioGrid";
import { saveQuote } from "@/services/quoteTracker";
import { generateLoanQuote } from "@/utils/documentGenerator";
import { ArrowLeft, History } from "lucide-react";
import { useScenarios, Scenario } from "@/hooks/useScenarios";

const Quote = () => {
  const [currentStep, setCurrentStep] = useState<"upload" | "questionnaire" | "loanpass" | "results" | "scenarios">("upload");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  const [lastSubmittedFormData, setLastSubmittedFormData] = useState<any>(null);
  const [pricingResults, setPricingResults] = useState<any[]>([]);
  const [ineligibleBuyers, setIneligibleBuyers] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [flags, setFlags] = useState<string[]>([]);

  const { saveScenarioResults } = useScenarios();

  const transformApiResponseToResults = (apiResponse: any) => {
    // Handle the new response structure where quotes are under the 'quotes' key
    const quotesData = apiResponse.quotes || apiResponse;
    
    const results = Object.entries(quotesData)
      .filter(([noteBuyer, data]: [string, any]) => {
        // Only include buyers that have pricing data and empty flags
        return data.flags && data.flags.length === 0 && data.adjusted_interest_rate;
      })
      .map(([noteBuyer, data]: [string, any]) => {
        // Determine loan purpose
        const loanPurpose = data.loan_purpose === 'refinance' ? 'Refinance' : 'Purchase';
        
        // Determine refinance type if applicable - check the form data since API doesn't return it
        let refinanceType;
        if (data.loan_purpose === 'refinance' && lastSubmittedFormData?.refinanceType) {
          refinanceType = lastSubmittedFormData.refinanceType === 'CashOut' ? 'Cash Out' : 'Rate/Term';
        }

        return {
          lender: "Dominion Financial",
          noteBuyer: noteBuyer,
          product: noteBuyer, // Using note buyer name as product
          rate: data.adjusted_interest_rate,
          monthlyPayment: Math.round(data.final_est_payment),
          totalInterest: Math.round(parseFloat(data.loan_amount) * 0.65), // Keep existing calculation
          loanAmount: parseFloat(data.loan_amount),
          dscr: data.final_dscr,
          propertyType: data.property_type.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          loanPurpose: loanPurpose,
          refinanceType: refinanceType,
          pppDuration: "5/4/3/2/1",
          ltv: parseFloat(data.ltv),
          points: data.points || 2.0, // Default to 2.0 if not provided by API
          isLocked: false
        };
      });

    // Sort by rate (best rate first)
    return results.sort((a, b) => a.rate - b.rate);
  };

  const getIneligibleBuyers = (apiResponse: any) => {
    const quotesData = apiResponse.quotes || {};
    
    return Object.entries(quotesData)
      .filter(([noteBuyer, data]: [string, any]) => {
        // Include buyers that have flags (rejection reasons)
        return data.flags && data.flags.length > 0;
      })
      .map(([noteBuyer, data]: [string, any]) => ({
        noteBuyer,
        flags: data.flags
      }));
  };

  const transformFormDataForAPI = (formData: any) => {
    // Helper function to normalize text values to lowercase with hyphens
    const normalizeTextValue = (value: string) => {
      if (!value) return '';
      return value.toString().toLowerCase().replace(/\s+/g, '-');
    };

    // Helper function to ensure numeric value is converted to string
    const normalizeNumericValue = (value: any) => {
      if (!value) return '0';
      const numValue = parseFloat(value.toString().replace(/[^0-9.-]/g, ''));
      return isNaN(numValue) ? '0' : numValue.toString();
    };

    // Calculate total rental income
    const calculateTotalRental = () => {
      const units = parseInt(formData.numberOfUnits) || 0;
      let total = 0;
      
      for (let i = 1; i <= units; i++) {
        const rent = parseFloat(formData[`unit${i}Rent`]) || 0;
        total += rent;
      }
      
      return total.toString();
    };

    // Calculate total rehab cost
    const calculateRehabCost = () => {
      if (formData.loanPurpose === 'Purchase') {
        return normalizeNumericValue(formData.estimatedRehabCost);
      } else {
        const spent = parseFloat(formData.rehabCostSpent) || 0;
        const needed = parseFloat(formData.rehabCostNeeded) || 0;
        return (spent + needed).toString();
      }
    };

    // Transform to API format with normalization
    const apiData: any = {
      // Personal Info (text fields to lowercase)
      firstName: formData.firstName?.toLowerCase() || '',
      lastName: formData.lastName?.toLowerCase() || '',
      phone: formData.phone || '',
      email: formData.email?.toLowerCase() || '',
      yourCompany: formData.yourCompany?.toLowerCase() || '',
      usCitizen: normalizeTextValue(formData.usCitizen),
      borrower_type: normalizeTextValue(formData.closingType),
      
      // Subject Property Address (text fields to lowercase)
      address: formData.streetAddress?.toLowerCase() || '',
      city: formData.city?.toLowerCase() || '',
      state: formData.propertyState?.toLowerCase() || '', // This will already be the abbreviation
      zip_code: formData.zipCode || '',
      county: formData.propertyCounty?.toLowerCase() || '',
      
      // Loan Purpose (normalize dropdown values)
      loan_purpose: normalizeTextValue(formData.loanPurpose),
      
      // Cross Collateral Information
      cross_collateral_loan: normalizeTextValue(formData.crossCollateralLoan),
      number_of_properties: normalizeNumericValue(formData.numberOfProperties),
      
      // Property Details (normalize dropdown values)
      property_type: normalizeTextValue(formData.propertyType),
      property_condition: normalizeTextValue(formData.propertyCondition),
      rural: normalizeTextValue(formData.rural),
      declining_market: normalizeTextValue(formData.decliningMarket),
      interest_only: normalizeTextValue(formData.interestOnly),
      number_of_units: formData.numberOfUnits || '1',
      number_of_leased_units: normalizeNumericValue(formData.numberOfLeasedUnits),
      has_vacant_units: normalizeTextValue(formData.hasVacantUnits),
      number_of_vacant_units: normalizeNumericValue(formData.numberOfVacantUnits),
      
      // Loan Details
      desired_ltv: normalizeNumericValue(formData.desiredLTV),
      desired_closing_date: formData.desiredClosingDate || '',
      interest_reserves: normalizeTextValue(formData.interestReserves),
      
      // Calculated Rental Income
      market_rent: calculateTotalRental(),
      
      // Property Details
      total_square_feet: normalizeNumericValue(formData.totalSquareFeet),
      
      // Annual Property Expenses (numeric values)
      annual_taxes: normalizeNumericValue(formData.annualTaxes),
      annual_insurance: normalizeNumericValue(formData.annualInsurance),
      annual_association_fees: normalizeNumericValue(formData.annualAssociationFees),
      annual_flood_insurance: normalizeNumericValue(formData.annualFloodInsurance),
      
      // Final Details
      decision_credit_score: normalizeNumericValue(formData.creditScore),
      
      // Rehab Cost
      rehab_cost: calculateRehabCost()
    };

    // Add conditional fields based on property type
    if (formData.propertyType === 'Condominium') {
      apiData['condo_approval_type'] = normalizeTextValue(formData.condoApprovalType);
    }

    // Add conditional fields based on number of units
    if (parseInt(formData.numberOfUnits) >= 2) {
      apiData['isNonconfirming'] = normalizeTextValue(formData.nonconformingUnits);
    }

    if (parseInt(formData.numberOfUnits) >= 5) {
      apiData['total_net_operation_income'] = normalizeNumericValue(formData.totalNetOperationIncome);
    }

    // Add lease information
    if (formData.leaseInPlace) {
      apiData['lease_in_place'] = normalizeTextValue(formData.leaseInPlace);
      if (formData.leaseInPlace === 'Yes') {
        apiData['lease_structure'] = normalizeTextValue(formData.leaseStructure);
        apiData['section_8'] = normalizeTextValue(formData.section8Lease);
        apiData['str_rental_history'] = normalizeTextValue(formData.strRentalHistory);
      }
    }

    // Add loan purpose specific fields
    if (formData.loanPurpose === 'Purchase') {
      apiData['purchase_price'] = normalizeNumericValue(formData.purchasePrice);
      if (formData.hasPurchaseContract) {
        apiData['has_purchase_contract'] = normalizeTextValue(formData.hasPurchaseContract);
        if (formData.hasPurchaseContract === 'Yes') {
          apiData['purchase_contract_close_date'] = formData.purchaseContractCloseDate || '';
        }
      }
    } else if (formData.loanPurpose === 'Refinance') {
      apiData['refinance_type'] = normalizeTextValue(formData.refinanceType);
      apiData['purchase_price'] = normalizeNumericValue(formData.purchasePrice);
      apiData['date_purchased'] = formData.datePurchased || '';
      apiData['market_value'] = normalizeNumericValue(formData.marketValue);
      if (formData.hasMortgage) {
        apiData['has_mortgage'] = normalizeTextValue(formData.hasMortgage);
        if (formData.hasMortgage === 'Yes') {
          apiData['mortgage_payoff'] = normalizeNumericValue(formData.mortgagePayoff);
        }
      }
    }

    return apiData;
  };

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsProcessing(true);
    
    try {
      console.log('Uploading file for data extraction:', file.name);
      
      // Create FormData to send the file
      const formData = new FormData();
      formData.append('file', file);
      
      // Call your document extraction API with production URL
      const response = await fetch('https://n8n-prod.onrender.com/webhook/2165eeb2-1590-43d2-8383-efee85dd15d6/instant-pricing/data-extraction', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Document extraction failed with status: ${response.status}`);
      }

      const extractionResult = await response.json();
      console.log('Document extraction result:', extractionResult);
      
      setExtractedData(extractionResult);
      setCurrentStep("questionnaire");
      setIsProcessing(false);
    } catch (error) {
      console.error('Error extracting data from document:', error);
      // Even if extraction fails, allow user to proceed with manual entry
      setExtractedData(null);
      setCurrentStep("questionnaire");
      setIsProcessing(false);
    }
  };

  const handleManualEntry = () => {
    // Go directly to questionnaire with no extracted data - user enters everything manually
    setExtractedData(null);
    setCurrentStep("questionnaire");
  };

  const handleQuestionnaireSubmit = async (data: any) => {
    // If this is just a loading trigger, set loading state and return
    if (data.isLoading) {
      setIsProcessing(true);
      return;
    }

    const currentFormData = data.formData || data;
    setFormData(currentFormData);
    setLastSubmittedFormData(currentFormData);
    
    // Save the quote with flagging
    const savedQuote = saveQuote(currentFormData);
    console.log("Quote saved:", savedQuote);

    try {
      setIsProcessing(true);
      
      // Transform form data to API format
      const apiPayload = transformFormDataForAPI(currentFormData);
      console.log('API Payload:', apiPayload);

      // Make API call to pricing endpoint
      const response = await fetch('https://n8n-prod.onrender.com/webhook/59ba939c-b2ff-450f-a9d4-04134eeda0de/instant-pricing/pricing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload)
      });

      if (!response.ok) {
        throw new Error(`Pricing API failed with status: ${response.status}`);
      }

      const pricingResponse = await response.json();
      console.log('Pricing API Response:', pricingResponse);

      // Transform API response to results format
      const results = transformApiResponseToResults(pricingResponse);
      setPricingResults(results);
      
      // Get ineligible buyers
      const ineligible = getIneligibleBuyers(pricingResponse);
      setIneligibleBuyers(ineligible);
      
      // Store the flags from the API response
      if (pricingResponse.flags) {
        setFlags(pricingResponse.flags);
      } else {
        setFlags([]);
      }
      
    } catch (error) {
      console.error('Error calling pricing API:', error);
      // Fallback to empty results if API fails
      setPricingResults([]);
      setFlags([]);
    }
    
    // Move to results and stop loading
    setCurrentStep("results");
    setIsProcessing(false);
  };

  const handleLoanPassSubmit = async (data: any) => {
    setFormData(data);
    setIsProcessing(true);
    
    // Simulate API call for loan pass processing
    setTimeout(() => {
      console.log("Loan Pass submitted:", data);
      setIsProcessing(false);
      // Could navigate to results or another appropriate step
    }, 2000);
  };

  const handleBackToUpload = () => {
    setCurrentStep("upload");
    setUploadedFile(null);
    setExtractedData(null);
    setFormData(null);
    setLastSubmittedFormData(null);
  };

  const handleGenerateLoanQuote = async (selectedResult?: any, editedData?: any) => {
    console.log("Generating loan quote...");
    
    if (!lastSubmittedFormData) {
      console.error("Missing form data");
      return;
    }

    try {
      let quoteData;
      
      if (editedData) {
        // Use edited data if provided
        quoteData = editedData;
      } else if (selectedResult) {
        // Use selected result if provided
        quoteData = {
          borrowerName: `${lastSubmittedFormData.firstName || ''} ${lastSubmittedFormData.lastName || ''}`.trim() || 'Borrower',
          propertyAddress: `${lastSubmittedFormData.streetAddress || ''}, ${lastSubmittedFormData.city || ''}, ${lastSubmittedFormData.propertyState || ''} ${lastSubmittedFormData.zipCode || ''}`.replace(/^,\s*/, '').replace(/,\s*$/, ''),
          loanAmount: selectedResult.loanAmount,
          interestRate: selectedResult.rate,
          monthlyPayment: selectedResult.monthlyPayment,
          loanTerm: 360, // 30 years
          ltv: selectedResult.ltv,
          dscr: selectedResult.dscr,
          propertyType: selectedResult.propertyType,
          loanPurpose: selectedResult.loanPurpose,
          refinanceType: selectedResult.refinanceType,
          points: selectedResult.points,
          noteBuyer: selectedResult.noteBuyer,
          loanOfficer: lastSubmittedFormData.loanOfficerName || 'Gregory Clarke',
          phoneNumber: '410-705-2277',
          date: new Date().toLocaleDateString()
        };
      } else {
        // Use the first (best) pricing result as fallback
        if (!pricingResults.length) {
          console.error("Missing pricing results");
          return;
        }
        
        const bestResult = pricingResults[0];
        
        quoteData = {
          borrowerName: `${lastSubmittedFormData.firstName || ''} ${lastSubmittedFormData.lastName || ''}`.trim() || 'Borrower',
          propertyAddress: `${lastSubmittedFormData.streetAddress || ''}, ${lastSubmittedFormData.city || ''}, ${lastSubmittedFormData.propertyState || ''} ${lastSubmittedFormData.zipCode || ''}`.replace(/^,\s*/, '').replace(/,\s*$/, ''),
          loanAmount: bestResult.loanAmount,
          interestRate: bestResult.rate,
          monthlyPayment: bestResult.monthlyPayment,
          loanTerm: 360, // 30 years
          ltv: bestResult.ltv,
          dscr: bestResult.dscr,
          propertyType: bestResult.propertyType,
          loanPurpose: bestResult.loanPurpose,
          refinanceType: bestResult.refinanceType,
          points: bestResult.points,
          noteBuyer: bestResult.noteBuyer,
          loanOfficer: lastSubmittedFormData.loanOfficerName || 'Gregory Clarke',
          phoneNumber: '410-705-2277',
          date: new Date().toLocaleDateString()
        };
      }

      await generateLoanQuote(quoteData);
    } catch (error) {
      console.error('Error generating loan quote:', error);
    }
  };

  const handleBackToQuestionnaire = () => {
    setCurrentStep("questionnaire");
  };

  const handleNavigationBack = () => {
    if (currentStep === "results") {
      setCurrentStep("questionnaire");
    } else {
      handleBackToUpload();
    }
  };

  const handleQuoteSelect = (quote: any) => {
    console.log('handleQuoteSelect called with:', quote);
    if (quote.originalFormData) {
      console.log('Restoring form data:', quote.originalFormData);
      // Restore the form data and navigate to questionnaire
      setLastSubmittedFormData(quote.originalFormData);
      setFormData(quote.originalFormData);
      setExtractedData(null); // Clear extracted data since we're using saved data
      setCurrentStep("questionnaire");
      console.log('Navigation to questionnaire completed');
    } else {
      console.log('No originalFormData found in quote');
    }
  };

  const handleScenarioSelect = (scenario: any) => {
    console.log("Selected scenario:", scenario);
    
    // Restore the form data from the selected scenario
    setFormData(scenario.form_data);
    setLastSubmittedFormData(scenario.form_data);
    setCurrentStep("questionnaire");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/87eaaf76-9665-4138-b3ce-aefec128e3db.png" 
                alt="Dominion Financial" 
                className="h-8 mr-3"
              />
              
              {/* Back Button */}
              {currentStep !== "upload" && (
                <Button
                  variant="ghost"
                  onClick={handleNavigationBack}
                  className="ml-4 text-dominion-blue hover:bg-blue-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {currentStep === "results" ? "Back to Form" : "Back to Upload"}
                </Button>
              )}
            </div>
            
            {/* View Selection Buttons */}
            {currentStep !== "upload" && currentStep !== "results" && (
              <div className="flex items-center gap-2">
                <Button
                  variant={currentStep === "questionnaire" ? "default" : "outline"}
                  onClick={() => setCurrentStep("questionnaire")}
                  className="text-sm"
                >
                  DSCR Questionnaire
                </Button>
                <Button
                  variant={currentStep === "loanpass" ? "default" : "outline"}
                  onClick={() => setCurrentStep("loanpass")}
                  className="text-sm"
                >
                  Loan Pass View
                </Button>
              </div>
            )}
            
            {/* Scenarios Button - Always visible when not on upload */}
            {currentStep !== "upload" && (
              <div className="flex items-center gap-2">
                <Button
                  variant={currentStep === "scenarios" ? "default" : "outline"}
                  onClick={() => setCurrentStep("scenarios")}
                  className="text-sm"
                >
                  <History className="w-4 h-4 mr-2" />
                  Saved Scenarios
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Bond Display - Visible on all screens */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <BondDisplay />
        </div>
      </div>

      <main className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {currentStep === "upload" && (
            <div className="space-y-8">
              <QuestionnaireUpload
                onFileUpload={handleFileUpload}
                onManualEntry={handleManualEntry}
                isLoading={isProcessing}
              />
              
              {/* Quote Tracker on Upload Screen */}
              <QuoteTracker onQuoteSelect={handleQuoteSelect} />
            </div>
          )}

          {currentStep === "questionnaire" && (
            <DSCRForm
              initialData={lastSubmittedFormData || extractedData}
              onSubmit={handleQuestionnaireSubmit}
              onBack={handleBackToUpload}
              isLoading={isProcessing}
            />
          )}

          {currentStep === "loanpass" && (
            <LoanPassView
              onSubmit={handleLoanPassSubmit}
              onBack={handleBackToUpload}
              isLoading={isProcessing}
            />
          )}

          {currentStep === "results" && formData && (
            <PricingResults
              results={pricingResults}
              flags={flags}
              ineligibleBuyers={ineligibleBuyers}
              onBackToForm={handleBackToQuestionnaire}
              onGenerateLoanQuote={handleGenerateLoanQuote}
              lastSubmittedFormData={lastSubmittedFormData}
            />
          )}

          {currentStep === "scenarios" && (
            <ScenarioGrid onSelectScenario={handleScenarioSelect} />
          )}
        </div>
      </main>

      {/* Logan Chatbot - Available on all Quote screens */}
      <LoganChatbot />
    </div>
  );
};

export default Quote;

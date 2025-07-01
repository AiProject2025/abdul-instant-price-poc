import { useState } from "react";
import QuestionnaireUpload from "@/components/QuestionnaireUpload";
import DSCRForm from "@/components/DSCRForm";
import LoanPassView from "@/components/LoanPassView";
import PricingResults from "@/components/PricingResults";
import BondDisplay from "@/components/BondDisplay";
import { LoganChatbot } from "@/components/LoganChatbot";
import { Button } from "@/components/ui/button";
import QuoteTracker from "@/components/QuoteTracker";
import { saveQuote } from "@/services/quoteTracker";
import { ArrowLeft } from "lucide-react";

const Quote = () => {
  const [currentStep, setCurrentStep] = useState<"upload" | "questionnaire" | "loanpass" | "results">("upload");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  const [lastSubmittedFormData, setLastSubmittedFormData] = useState<any>(null);
  const [pricingResults, setPricingResults] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [flags, setFlags] = useState<string[]>([]);

  const transformApiResponseToResults = (apiResponse: any) => {
    // Handle the new response structure where quotes are under the 'quotes' key
    const quotesData = apiResponse.quotes || apiResponse;
    
    const results = Object.entries(quotesData).map(([noteBuyer, data]: [string, any]) => ({
      lender: "Dominion Financial",
      noteBuyer: noteBuyer,
      product: noteBuyer, // Using note buyer name as product
      rate: data.adjusted_interest_rate,
      monthlyPayment: Math.round(data.final_est_payment),
      totalInterest: Math.round(parseFloat(data.loan_amount) * 0.65), // Keep existing calculation
      loanAmount: parseFloat(data.loan_amount),
      dscr: data.final_dscr,
      propertyType: data.property_type.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
      loanType: data.loan_purpose === 'refinance' ? 'DSCR Refinance' : 'DSCR Purchase',
      pppDuration: "5/4/3/2/1",
      ltv: parseFloat(data.ltv),
      isLocked: false
    }));

    // Sort by rate (best rate first)
    return results.sort((a, b) => a.rate - b.rate);
  };

  const transformFormDataForAPI = (formData: any) => {
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
        return formData.estimatedRehabCost || "0";
      } else {
        const spent = parseFloat(formData.rehabCostSpent) || 0;
        const needed = parseFloat(formData.rehabCostNeeded) || 0;
        return (spent + needed).toString();
      }
    };

    // Transform to API format with new key mappings
    const apiData: any = {
      // Personal Info
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      email: formData.email,
      yourCompany: formData.yourCompany,
      usCitizen: formData.usCitizen,
      borrower_type: formData.closingType, // mapped from closingType
      
      // Subject Property Address
      address: formData.streetAddress, // mapped from streetAddress
      city: formData.city,
      state: formData.propertyState, // mapped from propertyState
      zip_code: formData.zipCode, // mapped from zipCode
      county: formData.propertyCounty, // mapped from propertyCounty
      
      // Loan Purpose
      loan_purpose: formData.loanPurpose, // mapped from loanPurpose
      
      // Property Details
      property_type: formData.propertyType, // mapped from propertyType
      number_of_units: formData.numberOfUnits, // mapped from numberOfUnits
      
      // Loan Details
      desired_ltv: formData.desiredLTV,
      desired_closing_date: formData.desiredClosingDate,
      
      // Calculated Rental Income
      market_rent: calculateTotalRental(), // mapped from totalRentalIncome
      
      // Annual Property Expenses
      annual_taxes: formData.annualTaxes,
      annual_insurance: formData.annualInsurance,
      annual_association_fees: formData.annualAssociationFees || "0",
      annual_flood_insurance: formData.annualFloodInsurance || "0",
      
      // Final Details
      decision_credit_score: formData.creditScore, // mapped from creditScore
      
      // Rehab Cost
      rehab_cost: calculateRehabCost() // unified field for both estimated and total rehab cost
    };

    // Add conditional fields based on property type
    if (formData.propertyType === 'Condominium') {
      apiData['condo_approval_type'] = formData.condoApprovalType; // mapped from condoApprovalType
    }

    // Add conditional fields based on number of units
    if (parseInt(formData.numberOfUnits) >= 2) {
      apiData['isNonconfirming'] = formData.nonconformingUnits; // mapped from nonconformingUnits
    }

    if (parseInt(formData.numberOfUnits) >= 5) {
      apiData['total_net_operation_income'] = formData.totalNetOperationIncome;
    }

    // Add lease information
    if (formData.leaseInPlace) {
      apiData['lease_in_place'] = formData.leaseInPlace;
      if (formData.leaseInPlace === 'Yes') {
        apiData['lease_structure'] = formData.leaseStructure;
        apiData['section_8'] = formData.section8Lease; // mapped from section8Lease  
        apiData['str_rental_history'] = formData.strRentalHistory;
      }
    }

    // Add loan purpose specific fields
    if (formData.loanPurpose === 'Purchase') {
      apiData['purchase_price'] = formData.purchasePrice; // mapped from purchasePrice
      if (formData.hasPurchaseContract) {
        apiData['has_purchase_contract'] = formData.hasPurchaseContract;
        if (formData.hasPurchaseContract === 'Yes') {
          apiData['purchase_contract_close_date'] = formData.purchaseContractCloseDate;
        }
      }
    } else if (formData.loanPurpose === 'Refinance') {
      apiData['refinance_type'] = formData.refinanceType; // mapped from refinanceType
      apiData['purchase_price'] = formData.purchasePrice; // mapped from purchasePrice
      apiData['date_purchased'] = formData.datePurchased;
      apiData['market_value'] = formData.marketValue;
      if (formData.hasMortgage) {
        apiData['has_mortgage'] = formData.hasMortgage;
        if (formData.hasMortgage === 'Yes') {
          apiData['mortgage_payoff'] = formData.mortgagePayoff;
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
      const response = await fetch('https://n8n-prod.onrender.com/webhook-test/59ba939c-b2ff-450f-a9d4-04134eeda0de/instant-pricing/pricing', {
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

  const handleStartApplication = () => {
    // Handle application start logic here
    console.log("Starting application...");
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
              onBackToForm={handleBackToQuestionnaire}
              onStartApplication={handleStartApplication}
            />
          )}
        </div>
      </main>

      {/* Logan Chatbot - Available on all Quote screens */}
      <LoganChatbot />
    </div>
  );
};

export default Quote;

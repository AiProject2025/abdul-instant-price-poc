import { useState, useEffect } from "react";
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
import { generateLoanQuote, generateComparisonGrid } from "@/utils/documentGenerator";
import { ArrowLeft, History } from "lucide-react";
import { useScenarios, Scenario } from "@/hooks/useScenarios";
import { useToast } from "@/hooks/use-toast";
import { transformFormDataForAPI } from "@/utils/pricingPayload";
import { useLocation } from "react-router-dom";
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
  const { toast } = useToast();
  const location = useLocation();
  useEffect(() => {
    const state = location.state as any;
    const prefill = state?.prefill;
    if (prefill) {
      const normalized = { ...prefill };
      if (normalized.loanPurpose) {
        const s = normalized.loanPurpose.toString().toLowerCase();
        normalized.loanPurpose = s.includes('refi') ? 'Refinance' : 'Purchase';
      }
      setLastSubmittedFormData(normalized);
      setExtractedData(normalized);
      setCurrentStep('questionnaire');
    }
  }, [location.state]);

  const transformApiResponseToResults = (apiResponse: any) => {
    // Handle the new response structure where quotes are under the 'quotes' key
    const quotesData = apiResponse.quotes || apiResponse;

    const results = Object.entries(quotesData)
      .filter(([noteBuyer, data]: [string, any]) => {
        // Only include buyers that have pricing data and empty flags
        return data.flags && data.flags.length === 0 && data.adjusted_interest_rate;
      })
      .map(([noteBuyer, data]: [string, any]) => {
        // Debug logging
        console.log('🔍 Processing result for noteBuyer:', noteBuyer, 'data:', data);

        // Determine loan purpose
        const loanPurpose = data.loan_purpose === 'refinance' ? 'Refinance' : 'Purchase';

        // Determine refinance type if applicable - check the form data since API doesn't return it
        let refinanceType;
        if (data.loan_purpose === 'refinance' && lastSubmittedFormData?.refinanceType) {
          refinanceType = lastSubmittedFormData.refinanceType === 'CashOut' ? 'Cash Out' : 'Rate/Term';
        }

        const resultObj = {
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
          ltv: parseFloat(data.ltv),
          points: data.adjusted_price - 100, // Convert adjusted_price to points
          pppDuration: `${data.rate_lock_period_days} days`,
          refinanceType: refinanceType || 'Rate/Term',
          rateLockDays: data.rate_lock_period_days,
          isLocked: false
        };

        console.log('✅ Final result object:', resultObj);
        return resultObj;
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

  // Moved to shared util: transformFormDataForAPI


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

      // Flatten common n8n shape { output: { ...fields }} to direct fields for the form
      const prefillData = (extractionResult && extractionResult.output) ? extractionResult.output : extractionResult;

      // Normalize loan purpose wording if present (e.g., "Cash-Out Refinance" -> "Refinance")
      if (prefillData && prefillData.loanPurpose) {
        const s = prefillData.loanPurpose.toString().toLowerCase();
        prefillData.loanPurpose = s.includes('refi') ? 'Refinance' : 'Purchase';
      }

      setExtractedData(prefillData);
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

  const handleDataTapeUpload = async (file: File) => {
    setIsProcessing(true);

    try {
      console.log('Processing data tape file via n8n:', file.name);

      const fd = new FormData();
      fd.append('file', file);

      // Use n8n API to parse portfolio sheet and return normalized data
      const res = await fetch('https://n8n-prod.onrender.com/webhook/b86054ef-0fd4-43b2-8099-1f2269c7946a', {
        method: 'POST',
        body: fd,
      });

      if (!res.ok) {
        throw new Error(`Data tape API failed with status: ${res.status}`);
      }

      const payload = await res.json();
      const list: any[] = payload?.output || payload || [];

      if (!Array.isArray(list) || list.length === 0) {
        throw new Error('No properties found in uploaded file');
      }

      const p = list[0];
      const mapStructureType = (s?: string) => {
        const t = (s || '').toLowerCase();
        if (t.includes('single')) return 'single-family';
        if (t.includes('condo')) return 'condominium';
        if (t.includes('duplex') || t.includes('fourplex') || t.includes('triplex') || t.includes('plex')) return 'two-to-four-family';
        if (t.includes('mixed')) return 'mixed-use';
        if (t.includes('town')) return 'townhouse';
        if (t.includes('multi')) return 'multi-family';
        return 'single-family';
      };
      const mapOccupancy = (s?: string) => {
        const t = (s || '').toLowerCase();
        if (t.includes('tenant')) return 'Leased';
        if (t.includes('owner')) return 'Owner Occupied';
        if (t.includes('vacant')) return 'Vacant';
        return '';
      };

      const mappedFormData = {
        loanPurpose: (p.purpose_of_loan || '').includes('Refinance') ? 'Refinance' : 'Purchase',
        creditScore: (p.borrower_credit_score ?? '').toString(),

        streetAddress: p.full_property_address || '',
        propertyCounty: p.county_name || '',

        propertyType: mapStructureType(p.structure_type),
        propertyCondition: p.current_condition || 'C3',

        datePurchased: p.purchase_date || '',
        purchasePrice: p.purchase_price || '',
        marketValue: p.current_market_value || '',

        mortgagePayoff: p.existing_mortgage_balance || '',

        rehabCostSpent: p.rehab_costs || '',

        unit1Rent: p.market_rent || p.current_lease_amount || '',

        annualTaxes: p.annual_property_taxes || '',
        annualInsurance: p.annual_hazard_insurance_premium || '',
        annualAssociationFees: p.annual_home_owner_association_fees || '',
        annualFloodInsurance: p.annual_flood_insurance_premium || '',

        currentOccupancyStatus: mapOccupancy(p.current_occupancy_status),

        yourCompany: p.entity_name || '',
      };

      console.log('Mapped form data from n8n:', mappedFormData);

      setExtractedData(mappedFormData);
      setLastSubmittedFormData(mappedFormData);
      setCurrentStep('questionnaire');
    } catch (error) {
      console.error('Error processing data tape via n8n:', error);
      setExtractedData(null);
      setCurrentStep('questionnaire');
    } finally {
      setIsProcessing(false);
    }
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
      const response = await fetch('http://localhost:4000/api/pricing', {
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

      if (editedData && editedData.selectedScenarios) {
        // Generate comparison grid for multiple scenarios
        console.log("Generating comparison grid for selected scenarios:", editedData.selectedScenarios);
        await generateComparisonGrid(editedData.selectedScenarios, lastSubmittedFormData);
        return;
      } else if (editedData) {
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

  const handleScenarioSelect = async (scenario: any) => {
    // This function is no longer used - we handle editing directly in PricingResults
  };

  const handleScenarioReQuote = async (scenario: any) => {
    try {
      console.log("Re-quoting scenario:", scenario);

      // Restore the form data from the selected scenario
      setFormData(scenario.form_data);
      setLastSubmittedFormData(scenario.form_data);

      // Transform the form data for the API call
      const transformedData = transformFormDataForAPI(scenario.form_data);

      // Make a fresh pricing API call
      const response = await fetch('http://localhost:4000/api/pricing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformedData),
      });

      const data = await response.json();
      console.log('Re-Quote API Response:', data);

      if (data.quotes) {
        const transformedResults = transformApiResponseToResults(data);
        const transformedIneligible = getIneligibleBuyers(data);

        setPricingResults(transformedResults);
        setIneligibleBuyers(transformedIneligible);
        setFlags(data.flags || []);
        setCurrentStep("results");

        toast({
          title: "Success",
          description: "Scenario re-quoted successfully with fresh pricing"
        });
      }
    } catch (error) {
      console.error('Error re-quoting scenario:', error);
      toast({
        title: "Error",
        description: "Failed to re-quote scenario. Please try again.",
        variant: "destructive"
      });
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

              {/* Property and Client Info */}
              {lastSubmittedFormData && (
                <div className="ml-4 text-sm text-gray-600">
                  <div className="font-medium text-gray-900">
                    {lastSubmittedFormData.firstName} {lastSubmittedFormData.lastName}
                  </div>
                  <div>
                    {lastSubmittedFormData.streetAddress} {lastSubmittedFormData.city}, {lastSubmittedFormData.propertyState}
                  </div>
                </div>
              )}

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
                onDataTapeUpload={handleDataTapeUpload}
                onClientSelect={(client) => {
                  console.log('Client selected:', client);
                  // Pre-populate form with client data
                  const clientData = {
                    borrowerName: client.name,
                    email: client.email,
                    phone: client.phone,
                    // If client has properties, use the first one as default
                    ...(client.properties.length > 0 && {
                      propertyAddress: client.properties[0].address,
                      city: client.properties[0].city,
                      propertyState: client.properties[0].state,
                      zipCode: client.properties[0].zip_code,
                      propertyType: client.properties[0].property_type
                    })
                  };
                  setLastSubmittedFormData(clientData);
                  setCurrentStep('questionnaire');
                }}
                isLoading={isProcessing}
                skipDataTapeDialog={true}
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
              isPackageLoan={new URLSearchParams(location.search).get('packageLoan') === 'true' || (location.state as any)?.source === 'package'}
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
              onReQuoteScenario={handleScenarioReQuote}
              onReQuoteWithUpdatedData={handleQuestionnaireSubmit}
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

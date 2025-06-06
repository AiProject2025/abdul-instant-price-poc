import { useState } from "react";
import QuestionnaireUpload from "@/components/QuestionnaireUpload";
import DSCRForm from "@/components/DSCRForm";
import LoanPassView from "@/components/LoanPassView";
import PricingResults from "@/components/PricingResults";
import RiskTracker from "@/components/RiskTracker";
import { Button } from "@/components/ui/button";
import QuoteTracker from "@/components/QuoteTracker";
import { saveQuote } from "@/services/quoteTracker";
import { ArrowLeft } from "lucide-react";

const Quote = () => {
  const [currentStep, setCurrentStep] = useState<"upload" | "questionnaire" | "loanpass" | "results">("upload");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  const [pricingResults, setPricingResults] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const generatePricingResults = (data: any) => {
    const loanAmount = parseFloat(data.baseLoanAmount) || parseFloat(data.loanAmount) || 400000;
    const appraisedValue = parseFloat(data.appraisedValue) || parseFloat(data.propertyValue) || 500000;
    const ltv = Math.round((loanAmount / appraisedValue) * 100);
    
    // Calculate DSCR
    const monthlyRent = parseFloat(data.marketRent) || 0;
    const monthlyExpenses = (parseFloat(data.monthlyTaxes) || 0) + 
                           (parseFloat(data.monthlyInsurance) || 0) + 
                           (parseFloat(data.monthlyHOA) || 0) + 
                           (parseFloat(data.monthlyFloodInsurance) || 0);
    const netIncome = monthlyRent - monthlyExpenses;
    const estimatedPayment = (loanAmount * 0.006);
    const dscr = estimatedPayment > 0 ? netIncome / estimatedPayment : 1.25;

    const noteBuyers = [
      { product: "Product A", noteBuyer: "Blackstone", baseRate: 7.125 },
      { product: "Product B", noteBuyer: "Bayview", baseRate: 7.250 },
      { product: "Product C", noteBuyer: "Corevest", baseRate: 7.375 },
      { product: "Product D", noteBuyer: "Maxes", baseRate: 7.500 },
      { product: "Product E", noteBuyer: "Onslow", baseRate: 7.625 }
    ];

    const mockResults = noteBuyers.map((buyer, index) => {
      const rate = buyer.baseRate + (Math.random() * 0.5 - 0.25); // Add some variation
      const monthlyPayment = Math.round((loanAmount * (rate / 100)) / 12);
      
      return {
        lender: "Dominion Financial",
        noteBuyer: buyer.noteBuyer,
        product: buyer.product,
        rate: rate,
        monthlyPayment: monthlyPayment,
        totalInterest: Math.round(loanAmount * 0.65),
        loanAmount: loanAmount,
        dscr: dscr,
        propertyType: data.propertyType || "Single Family",
        loanType: "DSCR Investment",
        pppDuration: "2 Years",
        ltv: ltv,
        isLocked: false
      };
    });

    return mockResults.slice(0, 3); // Return top 3 offers
  };

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsProcessing(true);
    
    // Simulate AI processing to extract comprehensive data
    setTimeout(() => {
      const mockExtractedData = {
        borrowerName: "John Doe",
        propertyAddress: "123 Main St",
        propertyCity: "Los Angeles",
        propertyState: "California",
        propertyZip: "90210",
        loanAmount: "400000",
        appraisedValue: "500000",
        marketRent: "3500",
        monthlyTaxes: "500",
        monthlyInsurance: "200",
        creditScore: "740",
        monthsOfReserves: "12",
        propertyType: "Single Family",
        numberOfUnits: "1",
        // Add more comprehensive mock data to auto-populate as much as possible
      };
      setExtractedData(mockExtractedData);
      setCurrentStep("questionnaire");
      setIsProcessing(false);
    }, 3000);
  };

  const handleManualEntry = () => {
    // Go directly to questionnaire with no extracted data - user enters everything manually
    setExtractedData(null);
    setCurrentStep("questionnaire");
  };

  const handleQuestionnaireSubmit = async (data: any) => {
    setFormData(data);
    setIsProcessing(true);
    
    // Save the quote with flagging
    const savedQuote = saveQuote(data);
    console.log("Quote saved:", savedQuote);
    
    // Generate pricing results with enhanced data
    const results = generatePricingResults(data);
    setPricingResults(results);
    
    // Simulate API call for pricing
    setTimeout(() => {
      setCurrentStep("results");
      setIsProcessing(false);
    }, 2000);
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
  };

  const handleStartApplication = () => {
    // Handle application start logic here
    console.log("Starting application...");
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
              
              {/* Back to Upload Button */}
              {currentStep !== "upload" && (
                <Button
                  variant="ghost"
                  onClick={handleBackToUpload}
                  className="ml-4 text-dominion-blue hover:bg-blue-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Upload
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
              <QuoteTracker />
            </div>
          )}

          {currentStep === "questionnaire" && (
            <DSCRForm
              initialData={extractedData}
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
            <div className="space-y-8">
              <PricingResults
                results={pricingResults}
                onBackToForm={() => setCurrentStep("questionnaire")}
                onStartApplication={handleStartApplication}
              />
              
              <RiskTracker loanData={formData} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Quote;

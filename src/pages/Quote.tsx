
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Upload, ArrowLeft, ChevronRight } from "lucide-react";
import QuestionnaireUpload from "@/components/QuestionnaireUpload";
import DSCRForm from "@/components/DSCRForm";
import PricingResults from "@/components/PricingResults";

const Quote = () => {
  const [currentStep, setCurrentStep] = useState("upload"); // upload, form, results
  const [uploadedData, setUploadedData] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  const [pricingData, setPricingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    try {
      // Simulate AI extraction process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock extracted data
      const extractedData = {
        borrowerName: "John Smith",
        entityName: "Smith Properties LLC",
        creditScore: "780",
        monthsOfReserves: "12",
        propertyAddress: "123 Investment St, Baltimore, MD 21224",
        propertyType: "Single Family",
        numberOfUnits: "1",
        marketRent: "4800",
        monthlyTaxes: "125",
        monthlyInsurance: "125",
        appraisedValue: "525000",
        loanAmount: "393750"
      };
      
      setUploadedData(extractedData);
      setCurrentStep("form");
      
      toast({
        title: "Upload Successful",
        description: "AI has successfully extracted data from your questionnaire.",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error processing your file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (data: any) => {
    setFormData(data);
    setIsLoading(true);
    
    try {
      // Call LoanPass API
      const response = await fetch("https://us-central1-dominion-portal.cloudfunctions.net/loanpassRatePricing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          template_type: data.loanPurpose === "refinance" ? "cash-out-input" : "purchase-input",
          credit_score: data.creditScore,
          ltv: ((parseFloat(data.loanAmount) / parseFloat(data.appraisedValue)) * 100).toFixed(2),
          "Unit 1 Actual Rent": data.marketRent,
          loan_term: data.loanTerm,
          monthly_taxes: data.monthlyTaxes,
          monthly_insurance: data.monthlyInsurance,
          monthly_hoa: data.monthlyHoa || "0",
          is_interest_only: data.interestOnly,
          loan_purpose: data.loanPurpose,
          property_type: data.propertyType,
          number_of_units: data.numberOfUnits,
          property_state: data.propertyState,
          property_county: data.propertyCounty,
          credit_event: data.creditEvent,
          mortgage_late_payments: data.mortgageLatePayments
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get pricing");
      }

      const pricingResults = await response.json();
      setPricingData(pricingResults);
      setCurrentStep("results");
      
      toast({
        title: "Pricing Complete",
        description: "Your loan has been priced successfully.",
      });
    } catch (error) {
      toast({
        title: "Pricing Failed",
        description: "There was an error getting your loan pricing. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (currentStep === "form") {
      setCurrentStep("upload");
    } else if (currentStep === "results") {
      setCurrentStep("form");
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
            </div>
            {currentStep !== "upload" && (
              <div className="flex items-center">
                <Button variant="outline" onClick={goBack} className="mr-4">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${currentStep === "upload" ? "text-dominion-blue" : "text-gray-500"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "upload" ? "bg-dominion-blue text-white" : currentStep === "form" || currentStep === "results" ? "bg-dominion-green text-white" : "bg-gray-300"}`}>
                1
              </div>
              <span className="ml-2 font-medium">Upload</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
            <div className={`flex items-center ${currentStep === "form" ? "text-dominion-blue" : "text-gray-500"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "form" ? "bg-dominion-blue text-white" : currentStep === "results" ? "bg-dominion-green text-white" : "bg-gray-300"}`}>
                2
              </div>
              <span className="ml-2 font-medium">Review Data</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
            <div className={`flex items-center ${currentStep === "results" ? "text-dominion-blue" : "text-gray-500"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "results" ? "bg-dominion-blue text-white" : "bg-gray-300"}`}>
                3
              </div>
              <span className="ml-2 font-medium">Get Pricing</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {currentStep === "upload" && (
          <QuestionnaireUpload 
            onFileUpload={handleFileUpload}
            onManualEntry={() => setCurrentStep("form")}
            isLoading={isLoading}
          />
        )}

        {currentStep === "form" && (
          <DSCRForm 
            initialData={uploadedData}
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
          />
        )}

        {currentStep === "results" && pricingData && (
          <PricingResults 
            pricingData={pricingData}
            formData={formData}
          />
        )}
      </main>
    </div>
  );
};

export default Quote;

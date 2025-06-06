import { useState } from "react";
import QuestionnaireUpload from "@/components/QuestionnaireUpload";
import DSCRForm from "@/components/DSCRForm";
import PricingResults from "@/components/PricingResults";

const Quote = () => {
  const [currentStep, setCurrentStep] = useState<"upload" | "form" | "results">("upload");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
      setCurrentStep("form");
      setIsProcessing(false);
    }, 3000);
  };

  const handleManualEntry = () => {
    // Go directly to form with no extracted data - user enters everything manually
    setExtractedData(null);
    setCurrentStep("form");
  };

  const handleFormSubmit = async (data: any) => {
    setFormData(data);
    setIsProcessing(true);
    
    // Simulate API call for pricing
    setTimeout(() => {
      setCurrentStep("results");
      setIsProcessing(false);
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
            </div>
          </div>
        </div>
      </nav>

      <main className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {currentStep === "upload" && (
            <QuestionnaireUpload
              onFileUpload={handleFileUpload}
              onManualEntry={handleManualEntry}
              isLoading={isProcessing}
            />
          )}

          {currentStep === "form" && (
            <DSCRForm
              initialData={extractedData}
              onSubmit={handleFormSubmit}
              onBack={handleBackToUpload}
              isLoading={isProcessing}
            />
          )}

          {currentStep === "results" && formData && (
            <PricingResults
              results={formData}
              onBackToForm={() => setCurrentStep("form")}
              onStartApplication={handleStartApplication}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Quote;

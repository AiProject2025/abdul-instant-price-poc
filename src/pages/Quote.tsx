
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
    
    // Simulate AI processing
    setTimeout(() => {
      const mockExtractedData = {
        borrowerName: "John Doe",
        propertyAddress: "123 Main St",
        loanAmount: "400000",
        // Add more mock data as needed
      };
      setExtractedData(mockExtractedData);
      setCurrentStep("form");
      setIsProcessing(false);
    }, 3000);
  };

  const handleManualEntry = () => {
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
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Quote;

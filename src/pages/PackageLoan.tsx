import { useState } from "react";
import PackageLoanForm from "@/components/PackageLoanForm";
import { useToast } from "@/hooks/use-toast";

const PackageLoan = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePackageSubmit = async (data: any) => {
    setIsLoading(true);
    
    try {
      console.log("Package Loan Data:", data);
      
      // Process your package loan here
      // Send to your backend, generate quotes, etc.
      
      toast({
        title: "Package Loan Submitted",
        description: `Successfully submitted package with ${data.properties.length} properties`,
      });
      
    } catch (error) {
      console.error('Error submitting package:', error);
      toast({
        title: "Error",
        description: "Failed to submit package loan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Package Loan Application
            </h1>
            <p className="text-xl text-gray-600">
              Submit multiple properties for package loan pricing
            </p>
          </div>
          
          <PackageLoanForm 
            onSubmit={handlePackageSubmit} 
            isLoading={isLoading} 
          />
        </div>
      </div>
    </div>
  );
};

export default PackageLoan;
import { useState } from "react";
import { Link } from "react-router-dom";
import PackageLoanForm from "@/components/PackageLoanForm";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, LogOut } from "lucide-react";

const PackageLoan = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signOut } = useAuth();

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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center text-dominion-blue hover:text-dominion-green transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center">
                <img src="/lovable-uploads/87eaaf76-9665-4138-b3ce-aefec128e3db.png" alt="Dominion Financial" className="h-8 mr-3" />
              </div>
            </div>
            <nav className="flex space-x-6 items-center">
              <Link to="/" className="text-dominion-blue hover:text-dominion-green font-medium transition-colors">
                <Home className="h-4 w-4 mr-1 inline" />
                Home
              </Link>
              <Link to="/quote" className="text-dominion-blue hover:text-dominion-green font-medium transition-colors">
                Single Quote
              </Link>
              <Button
                onClick={signOut}
                variant="outline"
                size="sm"
                className="text-dominion-blue border-dominion-blue hover:bg-dominion-blue hover:text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="py-8">
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
    </div>
  );
};

export default PackageLoan;
import { useState } from "react";
import { Link } from "react-router-dom";
import PackageLoanForm from "@/components/PackageLoanForm";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, LogOut, Building2, TrendingUp, Shield } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-indigo-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-200/20 to-blue-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Modern Navigation Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-6">
              <Link to="/" className="flex items-center text-dominion-blue hover:text-dominion-green font-medium transition-all duration-300 hover:drop-shadow-sm group">
                <div className="p-2 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-lg mr-3 group-hover:from-blue-500/20 group-hover:to-blue-600/20 transition-all duration-300">
                  <ArrowLeft className="h-4 w-4" />
                </div>
                Back to Home
              </Link>
              <div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
              <div className="flex items-center">
                <div className="relative">
                  <img src="/lovable-uploads/87eaaf76-9665-4138-b3ce-aefec128e3db.png" alt="Dominion Financial" className="h-10 mr-3 drop-shadow-lg" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent rounded blur-sm"></div>
                </div>
              </div>
            </div>
            <nav className="flex space-x-4 items-center">
              <Link to="/" className="flex items-center text-dominion-blue hover:text-dominion-green font-medium transition-all duration-300 hover:drop-shadow-sm px-3 py-2 rounded-lg hover:bg-white/30">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
              <Link to="/quote" className="flex items-center text-dominion-blue hover:text-dominion-green font-medium transition-all duration-300 hover:drop-shadow-sm px-3 py-2 rounded-lg hover:bg-white/30">
                Single Quote
              </Link>
              <Button
                onClick={signOut}
                variant="outline"
                size="sm"
                className="text-dominion-blue border-dominion-blue/30 bg-white/50 backdrop-blur-sm hover:bg-dominion-blue hover:text-white transition-all duration-300"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Clean Header Section */}
      <div className="relative z-10 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Package Loan Application
              </h1>
              <p className="text-gray-600">
                Process multiple properties for comprehensive loan analysis
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
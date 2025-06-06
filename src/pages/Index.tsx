import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BondDisplay from "@/components/BondDisplay";
import { Calculator, FileText, TrendingUp, Shield, Clock, DollarSign } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/87eaaf76-9665-4138-b3ce-aefec128e3db.png" 
                alt="Dominion Financial" 
                className="h-10 mr-3"
              />
            </div>
            <nav className="flex space-x-8">
              <Link to="/quote" className="text-dominion-blue hover:text-dominion-green font-medium">
                Get Quote
              </Link>
            </nav>
          </div>
        </div>
        
        {/* Bond Display */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
          <BondDisplay />
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-dominion-blue sm:text-5xl lg:text-6xl">
            Unlock Your Investment Property's Potential
          </h1>
          <p className="mt-4 text-lg text-dominion-gray">
            Get the best DSCR loan rates from top note buyers. Fast, easy, and reliable.
          </p>
          <div className="mt-8 flex justify-center">
            <Button asChild className="bg-dominion-blue hover:bg-dominion-blue/90 text-white">
              <Link to="/quote">Get a Free Quote</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold text-dominion-blue text-center mb-8">
            Why Choose Dominion Financial?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card className="bg-blue-50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-dominion-blue flex items-center">
                  <Calculator className="mr-2 h-5 w-5" /> Competitive Rates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-dominion-gray">
                  We work with a network of note buyers to ensure you get the best possible DSCR loan rates.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-green-50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-dominion-blue flex items-center">
                  <FileText className="mr-2 h-5 w-5" /> Streamlined Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-dominion-gray">
                  Our online application and expert support make getting a DSCR loan simple and stress-free.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-yellow-50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-dominion-blue flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" /> Maximize Your ROI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-dominion-gray">
                  Unlock the potential of your investment property with flexible loan options tailored to your needs.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="bg-red-50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-dominion-blue flex items-center">
                  <Shield className="mr-2 h-5 w-5" /> Secure & Reliable
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-dominion-gray">
                  Your data is protected with industry-leading security measures. Trust us to handle your loan with care.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="bg-purple-50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-dominion-blue flex items-center">
                  <Clock className="mr-2 h-5 w-5" /> Fast Approvals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-dominion-gray">
                  Get quick loan decisions and funding so you can seize investment opportunities without delay.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="bg-orange-50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-dominion-blue flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" /> Expert Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-dominion-gray">
                  Our team of experienced loan specialists is here to guide you through every step of the process.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dominion-blue text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Dominion Financial. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;


import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Calculator, TrendingUp, Shield, Clock, CheckCircle } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/87eaaf76-9665-4138-b3ce-aefec128e3db.png" 
                alt="Dominion Financial" 
                className="h-8 mr-3"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/quote">
                <Button className="bg-dominion-green hover:bg-dominion-green/90 text-white">
                  Get Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            DSCR Loan Pricing Made Simple
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Upload your DSCR questionnaire and get instant pricing from multiple notebuyers. 
            Our AI extracts data automatically and provides competitive rates in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/quote">
              <Button size="lg" className="bg-white text-dominion-blue hover:bg-gray-100 px-8 py-3">
                <Upload className="mr-2 h-5 w-5" />
                Upload Questionnaire
              </Button>
            </Link>
            <Link to="/quote">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-dominion-blue px-8 py-3">
                <Calculator className="mr-2 h-5 w-5" />
                Manual Entry
              </Button>
            </Link>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center items-center space-x-8 text-sm">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-dominion-green rounded-full flex items-center justify-center mr-2">
                <span className="text-white font-semibold">1</span>
              </div>
              <span>Upload or Enter Data</span>
            </div>
            <div className="h-px w-12 bg-white/30"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-dominion-green rounded-full flex items-center justify-center mr-2">
                <span className="text-white font-semibold">2</span>
              </div>
              <span>AI Processing</span>
            </div>
            <div className="h-px w-12 bg-white/30"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-dominion-green rounded-full flex items-center justify-center mr-2">
                <span className="text-white font-semibold">3</span>
              </div>
              <span>Get Pricing</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dominion-blue mb-4">Why Choose Our Platform?</h2>
            <p className="text-lg text-dominion-gray max-w-2xl mx-auto">
              Experience the fastest and most accurate DSCR loan pricing in the industry
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-dominion-green mx-auto mb-4" />
                <CardTitle className="text-dominion-blue">Instant Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get competitive rates from 28+ notebuyers in seconds, not days
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-dominion-green mx-auto mb-4" />
                <CardTitle className="text-dominion-blue">AI-Powered Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Advanced AI extracts and validates data with 99.9% accuracy
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Clock className="h-12 w-12 text-dominion-green mx-auto mb-4" />
                <CardTitle className="text-dominion-blue">24/7 Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Upload questionnaires and get pricing anytime, anywhere
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dominion-blue mb-4">How It Works</h2>
            <p className="text-lg text-dominion-gray">Simple steps to get your DSCR loan priced</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-dominion-green rounded-full flex items-center justify-center mr-4">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-dominion-blue mb-2">Upload Your DSCR Questionnaire</h3>
                  <p className="text-dominion-gray">Simply drag and drop your completed DSCR questionnaire or fill out our form manually.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-dominion-green rounded-full flex items-center justify-center mr-4">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-dominion-blue mb-2">AI Data Extraction</h3>
                  <p className="text-dominion-gray">Our AI automatically extracts borrower information, property details, and loan requirements.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-dominion-green rounded-full flex items-center justify-center mr-4">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-dominion-blue mb-2">Instant Competitive Pricing</h3>
                  <p className="text-dominion-gray">Receive personalized rates from multiple notebuyers with detailed terms and conditions.</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-8">
              <img 
                src="/lovable-uploads/86aed73b-6ca7-4a10-87e5-1da0e15eb49c.png" 
                alt="Pricing Interface Preview" 
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-dominion-blue text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Join thousands of investors who trust Dominion Financial for their DSCR loan needs.</p>
          <Link to="/quote">
            <Button size="lg" className="bg-dominion-green hover:bg-dominion-green/90 text-white px-8 py-3">
              Get Your Quote Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-4">
            <img 
              src="/lovable-uploads/87eaaf76-9665-4138-b3ce-aefec128e3db.png" 
              alt="Dominion Financial" 
              className="h-8 mx-auto mb-2 brightness-0 invert"
            />
          </div>
          <p className="text-gray-400">© 2025 Dominion Financial. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

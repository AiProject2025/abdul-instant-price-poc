
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BondDisplay from "@/components/BondDisplay";
import { Calculator, FileText, TrendingUp, Shield, Clock, DollarSign, Zap, Brain } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-indigo-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-200/30 to-blue-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="relative">
                <img 
                  src="/lovable-uploads/87eaaf76-9665-4138-b3ce-aefec128e3db.png" 
                  alt="Dominion Financial" 
                  className="h-10 mr-3 drop-shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent rounded blur-sm"></div>
              </div>
            </div>
            <nav className="flex space-x-8">
              <Link to="/quote" className="text-dominion-blue hover:text-dominion-green font-medium transition-all duration-300 hover:drop-shadow-sm">
                Get Quote
              </Link>
            </nav>
          </div>
        </div>
        
        {/* Enhanced Bond Display */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
          <div className="relative">
            <BondDisplay />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none shimmer"></div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative">
            <h1 className="text-5xl font-extrabold text-dominion-blue sm:text-6xl lg:text-7xl leading-tight">
              <span className="bg-gradient-to-r from-dominion-blue via-blue-700 to-dominion-green bg-clip-text text-transparent">
                AI-Powered Investment
              </span>
              <br />
              <span className="relative">
                Property Lending
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-green-500/20 blur-2xl -z-10"></div>
              </span>
            </h1>
            <p className="mt-6 text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Leverage advanced AI algorithms and machine learning to secure the best DSCR loan rates. 
              Fast, intelligent, and data-driven financing solutions.
            </p>
            <div className="mt-10 flex justify-center">
              <Button asChild className="bg-gradient-to-r from-dominion-blue to-blue-700 hover:from-blue-700 hover:to-dominion-blue text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105">
                <Link to="/quote">
                  <Brain className="mr-2 h-5 w-5" />
                  Get AI-Powered Quote
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white/60 backdrop-blur-sm py-16 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-dominion-blue mb-4">
              Next-Generation Lending Platform
            </h2>
            <p className="text-xl text-slate-600">Powered by artificial intelligence and advanced analytics</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="bg-gradient-to-br from-blue-50 to-white hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 shadow-lg group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-xl font-bold text-dominion-blue flex items-center">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg mr-3 shadow-lg">
                    <Calculator className="h-5 w-5 text-white" />
                  </div>
                  AI-Optimized Rates
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-slate-600 leading-relaxed">
                  Our machine learning algorithms analyze thousands of data points to secure the most competitive DSCR loan rates in real-time.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-gradient-to-br from-green-50 to-white hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 shadow-lg group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-xl font-bold text-dominion-blue flex items-center">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg mr-3 shadow-lg">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  Instant Processing
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-slate-600 leading-relaxed">
                  Advanced automation and AI-driven document analysis streamline approvals, reducing processing time by 90%.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-gradient-to-br from-purple-50 to-white hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 shadow-lg group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-xl font-bold text-dominion-blue flex items-center">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg mr-3 shadow-lg">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  Smart Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-slate-600 leading-relaxed">
                  Predictive analytics and market intelligence help maximize your investment property's ROI potential.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="bg-gradient-to-br from-red-50 to-white hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 shadow-lg group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-xl font-bold text-dominion-blue flex items-center">
                  <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg mr-3 shadow-lg">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  Enterprise Security
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-slate-600 leading-relaxed">
                  Bank-level encryption and AI-powered fraud detection ensure your financial data remains completely secure.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="bg-gradient-to-br from-indigo-50 to-white hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 shadow-lg group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-xl font-bold text-dominion-blue flex items-center">
                  <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg mr-3 shadow-lg">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  24/7 AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-slate-600 leading-relaxed">
                  Our intelligent virtual assistant provides instant support and guidance throughout your lending journey.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="bg-gradient-to-br from-orange-50 to-white hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 shadow-lg group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-xl font-bold text-dominion-blue flex items-center">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg mr-3 shadow-lg">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  Expert AI Guidance
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-slate-600 leading-relaxed">
                  Combine human expertise with AI insights for personalized lending strategies and optimal outcomes.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-dominion-blue to-blue-800 text-white py-12 relative z-10 shadow-2xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative">
            <p className="text-sm opacity-90">
              &copy; {new Date().getFullYear()} Dominion Financial. All rights reserved. Powered by Advanced AI Technology.
            </p>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

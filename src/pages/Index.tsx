import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoganChatbot } from "@/components/LoganChatbot";
import ModernNavigation from "@/components/ModernNavigation";
import { Hero } from "@/components/ui/animated-hero";
import AnimatedGradientBackground from "@/components/ui/animated-gradient-background";
import { useAuth } from "@/hooks/useAuth";
import { Calculator, FileText, TrendingUp, Shield, Clock, DollarSign, Zap, Brain, LogOut } from "lucide-react";
const Index = () => {
  const { signOut } = useAuth();

  return <div className="min-h-screen bg-background">
      {/* Modern Navigation Header */}
      <ModernNavigation />
      
      {/* Hero Section - Full Height */}
      <section className="relative h-screen overflow-hidden">
        <AnimatedGradientBackground 
          Breathing={true}
          breathingRange={3}
          animationSpeed={0.01}
          gradientColors={[
            "#ffffff",
            "#ffffff", 
            "#1e40af",
            "#10b981",
            "#ffffff"
          ]}
          gradientStops={[50, 65, 75, 85, 100]}
        />
        <div className="relative z-10 flex items-center justify-center h-full pt-20">
          <Hero />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white/60 backdrop-blur-sm py-16 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-dominion-blue mb-4">
              <span className="text-sm text-gray-500 font-medium mr-2">(Coming Soon!)</span>
              Next-Generation Lending Platform
            </h2>
            <p className="text-xl text-slate-600">Powered by docIQ 1.0 Beta and advanced analytics</p>
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

      {/* Logan Chatbot */}
      <LoganChatbot />
    </div>;
};
export default Index;
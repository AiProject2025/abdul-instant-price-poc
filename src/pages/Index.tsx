import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LoganChatbot } from "@/components/LoganChatbot";
import ModernNavigation from "@/components/ModernNavigation";
import { Hero } from "@/components/ui/animated-hero";
import AnimatedGradientBackground from "@/components/ui/animated-gradient-background";
import { GlowingFeaturesGrid } from "@/components/ui/glowing-features";
import { useAuth } from "@/hooks/useAuth";
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
        />
        <div className="relative z-10 flex items-center justify-center h-full pt-20">
          <Hero />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 relative z-10">
        <GlowingFeaturesGrid />
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-4 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Dominion Financial. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Logan Chatbot */}
      <LoganChatbot />
    </div>;
};
export default Index;
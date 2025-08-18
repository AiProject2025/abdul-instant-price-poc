import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Menu, 
  X, 
  LogOut, 
  Calculator, 
  Home, 
  FileText,
  ChevronRight,
  User,
  FileSearch,
  Settings,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BondData {
  yieldValue: number;
  change: number;
  lastUpdate: string;
}

const ModernNavigation = () => {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [bondData, setBondData] = useState<{
    tenYear: BondData | null;
    fiveYear: BondData | null;
  }>({
    tenYear: null,
    fiveYear: null
  });

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Bond data fetching
  const fetchBondData = async () => {
    try {
      const mockData = {
        tenYear: {
          yieldValue: 4.268,
          change: 0.018,
          lastUpdate: new Date().toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
          })
        },
        fiveYear: {
          yieldValue: 4.080,
          change: 0.049,
          lastUpdate: new Date().toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
          })
        }
      };
      
      setBondData(mockData);
    } catch (err) {
      console.error('Failed to fetch bond data');
    }
  };

  useEffect(() => {
    fetchBondData();
    const interval = setInterval(fetchBondData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Bond display helpers
  const formatYield = (yieldValue: number) => `${yieldValue.toFixed(3)}%`;
  
  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(3)}%`;
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-3 w-3 text-green-400" />;
    if (change < 0) return <TrendingDown className="h-3 w-3 text-red-400" />;
    return <Minus className="h-3 w-3 text-gray-400" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const userInitials = user?.email?.substring(0, 2).toUpperCase() || 'US';

  return (
    <>
      {/* Modern Island Navigation Header */}
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out",
          "bg-transparent h-20"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 h-full flex items-center">
          {isMobile ? (
            // Mobile Single Island
            <div className={cn(
              "flex items-center justify-between p-4 rounded-2xl transition-all duration-300 w-full",
              isScrolled 
                ? "bg-background/95 backdrop-blur-xl shadow-xl border border-border/50" 
                : "bg-background/80 backdrop-blur-md shadow-lg"
            )}>
              {/* Mobile Logo */}
              <Link to="/" className="flex items-center group">
                <div className="relative overflow-hidden rounded-lg">
                  <img 
                    src="/lovable-uploads/87eaaf76-9665-4138-b3ce-aefec128e3db.png" 
                    alt="Dominion Financial" 
                    className="h-8 transition-all duration-300 drop-shadow-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </Link>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative z-50"
              >
                <div className="relative">
                  <Menu 
                    className={cn(
                      "h-5 w-5 transition-all duration-300",
                      isMobileMenuOpen ? "rotate-180 opacity-0" : "rotate-0 opacity-100"
                    )} 
                  />
                  <X 
                    className={cn(
                      "h-5 w-5 absolute inset-0 transition-all duration-300",
                      isMobileMenuOpen ? "rotate-0 opacity-100" : "-rotate-180 opacity-0"
                    )} 
                  />
                </div>
              </Button>
            </div>
          ) : (
            // Desktop Three Island Layout
            <div className="flex items-center justify-center space-x-3 w-full">
              {/* Island 1: Logo */}
              <div className={cn(
                "flex items-center px-4 py-3 h-14 rounded-2xl transition-all duration-300",
                isScrolled 
                  ? "bg-background/95 backdrop-blur-xl shadow-xl border border-border/50" 
                  : "bg-background/80 backdrop-blur-md shadow-lg"
              )}>
                <Link to="/" className="flex items-center group">
                  <div className="relative overflow-hidden rounded-lg">
                    <img 
                      src="/lovable-uploads/87eaaf76-9665-4138-b3ce-aefec128e3db.png" 
                      alt="Dominion Financial" 
                      className="h-8 transition-all duration-300 drop-shadow-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                      Dominion Financial
                    </div>
                    <div className="text-xs text-muted-foreground">
                      AI-Powered Lending
                    </div>
                  </div>
                </Link>
              </div>

              {/* Island 2: Bond Display */}
              <div className={cn(
                "flex items-center px-8 py-3 h-14 rounded-2xl transition-all duration-300 min-w-[400px]",
                isScrolled 
                  ? "bg-[hsl(var(--dominion-blue))] shadow-xl border border-border/50" 
                  : "bg-[hsl(var(--dominion-blue))] shadow-lg",
                "text-white"
              )}>
                <div className="flex items-center space-x-6 text-sm w-full">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">10Y:</span>
                    <span className="font-bold">
                      {bondData.tenYear ? formatYield(bondData.tenYear.yieldValue) : '4.268%'}
                    </span>
                    {bondData.tenYear && (
                      <div className={`flex items-center space-x-1 ${getChangeColor(bondData.tenYear.change)}`}>
                        {getChangeIcon(bondData.tenYear.change)}
                        <span className="text-xs">{formatChange(bondData.tenYear.change)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="h-4 w-px bg-white/30"></div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">5Y:</span>
                    <span className="font-bold">
                      {bondData.fiveYear ? formatYield(bondData.fiveYear.yieldValue) : '4.080%'}
                    </span>
                    {bondData.fiveYear && (
                      <div className={`flex items-center space-x-1 ${getChangeColor(bondData.fiveYear.change)}`}>
                        {getChangeIcon(bondData.fiveYear.change)}
                        <span className="text-xs">{formatChange(bondData.fiveYear.change)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-xs opacity-75 ml-auto">
                    {bondData.tenYear?.lastUpdate || new Date().toLocaleTimeString('en-US', { hour12: false })}
                  </div>
                </div>
              </div>

              {/* Island 3: User Actions */}
              <div className={cn(
                "flex items-center space-x-2 px-4 py-3 h-14 rounded-2xl transition-all duration-300",
                isScrolled 
                  ? "bg-background/95 backdrop-blur-xl shadow-xl border border-border/50" 
                  : "bg-background/80 backdrop-blur-md shadow-lg"
              )}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs px-3 py-2 h-8 bg-[hsl(var(--dominion-blue))]/10 text-[hsl(var(--dominion-blue))] hover:bg-[hsl(var(--dominion-blue))]/20"
                >
                  <Calculator className="h-3 w-3 mr-1" />
                  Quick Quote
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 px-3 rounded-lg group text-foreground font-medium text-xs">
                      {userInitials}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="w-56 mt-2 mr-4" 
                    align="end" 
                    forceMount
                  >
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user?.email || 'User'}</p>
                        <p className="text-xs text-muted-foreground">Lending Specialist</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="group">
                      <User className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="group">
                      <FileSearch className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                      <span>Previous Quotes</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="group">
                      <Calculator className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                      <span>Saved Calculations</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="group">
                      <Settings className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={signOut}
                      className="text-destructive focus:text-destructive group"
                    >
                      <LogOut className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobile && (
        <div
          className={cn(
            "fixed inset-0 z-40 bg-background/95 backdrop-blur-xl transition-all duration-300",
            isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <div className="flex flex-col items-center justify-center min-h-screen space-y-8 p-8">
            {/* Mobile Bond Display */}
            <div className="bg-[hsl(var(--dominion-blue))] text-white p-6 rounded-2xl shadow-xl">
              <div className="flex flex-col items-center space-y-4 text-sm">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="font-medium">10Y:</div>
                    <div className="font-bold">
                      {bondData.tenYear ? formatYield(bondData.tenYear.yieldValue) : '4.268%'}
                    </div>
                    {bondData.tenYear && (
                      <div className={`flex items-center justify-center space-x-1 ${getChangeColor(bondData.tenYear.change)}`}>
                        {getChangeIcon(bondData.tenYear.change)}
                        <span className="text-xs">{formatChange(bondData.tenYear.change)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="h-8 w-px bg-white/30"></div>
                  
                  <div className="text-center">
                    <div className="font-medium">5Y:</div>
                    <div className="font-bold">
                      {bondData.fiveYear ? formatYield(bondData.fiveYear.yieldValue) : '4.080%'}
                    </div>
                    {bondData.fiveYear && (
                      <div className={`flex items-center justify-center space-x-1 ${getChangeColor(bondData.fiveYear.change)}`}>
                        {getChangeIcon(bondData.fiveYear.change)}
                        <span className="text-xs">{formatChange(bondData.fiveYear.change)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-xs opacity-75">
                  {bondData.tenYear?.lastUpdate || new Date().toLocaleTimeString('en-US', { hour12: false })}
                </div>
              </div>
            </div>

            {/* Mobile Navigation Items */}
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "group flex items-center space-x-4 px-6 py-4 rounded-xl text-lg font-medium transition-all duration-300",
                "animate-fade-in",
                location.pathname === "/"
                  ? "bg-primary text-primary-foreground shadow-lg scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent hover:scale-105"
              )}
            >
              <Home className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              <span>Home</span>
            </Link>

            <Link
              to="/quote"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "group flex items-center space-x-4 px-6 py-4 rounded-xl text-lg font-medium transition-all duration-300",
                "animate-fade-in",
                location.pathname === "/quote"
                  ? "bg-primary text-primary-foreground shadow-lg scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent hover:scale-105"
              )}
              style={{ animationDelay: "100ms" }}
            >
              <Calculator className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              <span>Get Quote</span>
            </Link>

            <Link
              to="/package-loan"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "group flex items-center space-x-4 px-6 py-4 rounded-xl text-lg font-medium transition-all duration-300",
                "animate-fade-in",
                location.pathname === "/package-loan"
                  ? "bg-primary text-primary-foreground shadow-lg scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent hover:scale-105"
              )}
              style={{ animationDelay: "200ms" }}
            >
              <FileText className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              <span>Package Loan</span>
            </Link>

            {/* Mobile User Options */}
            <div className="flex flex-col space-y-4 w-full max-w-sm">
              <Button
                variant="outline"
                size="lg"
                className="group flex items-center space-x-4 px-6 py-4 text-lg animate-fade-in w-full"
                style={{ animationDelay: "300ms" }}
              >
                <FileSearch className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                <span>Previous Quotes</span>
              </Button>

              <Button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  signOut();
                }}
                variant="destructive"
                size="lg"
                className="group flex items-center space-x-4 px-6 py-4 text-lg animate-fade-in w-full"
                style={{ animationDelay: "400ms" }}
              >
                <LogOut className="h-6 w-6 group-hover:animate-pulse" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModernNavigation;
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Menu, 
  X, 
  LogOut, 
  Calculator, 
  Home, 
  FileText,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const ModernNavigation = () => {
  const { signOut } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Breadcrumb generation
  const getBreadcrumbs = () => {
    const path = location.pathname;
    const breadcrumbs = [
      { label: "Home", path: "/", icon: Home }
    ];

    if (path === "/quote") {
      breadcrumbs.push({ label: "Get Quote", path: "/quote", icon: Calculator });
    } else if (path === "/package-loan") {
      breadcrumbs.push({ label: "Package Loan", path: "/package-loan", icon: FileText });
    }

    return breadcrumbs;
  };

  const navigationItems = [
    { label: "Home", path: "/", icon: Home },
    { label: "Get Quote", path: "/quote", icon: Calculator },
    { label: "Package Loan", path: "/package-loan", icon: FileText },
  ];

  return (
    <>
      {/* Main Navigation Header */}
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out",
          isScrolled 
            ? "bg-background/95 backdrop-blur-xl shadow-lg border-b border-border/50" 
            : "bg-background/80 backdrop-blur-md"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo Section */}
            <Link to="/" className="flex items-center group">
              <div className="relative overflow-hidden rounded-lg">
                <img 
                  src="/lovable-uploads/87eaaf76-9665-4138-b3ce-aefec128e3db.png" 
                  alt="Dominion Financial" 
                  className={cn(
                    "transition-all duration-300 drop-shadow-lg",
                    isScrolled ? "h-8" : "h-10"
                  )}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="ml-3 hidden sm:block">
                <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                  Dominion Financial
                </div>
                <div className="text-xs text-muted-foreground">
                  AI-Powered Lending
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            {!isMobile && (
              <nav className="flex items-center space-x-8">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "group flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                        isActive
                          ? "bg-primary/10 text-primary shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      <Icon className={cn(
                        "h-4 w-4 transition-transform duration-300",
                        "group-hover:scale-110"
                      )} />
                      <span className="relative">
                        {item.label}
                        {isActive && (
                          <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                        )}
                      </span>
                    </Link>
                  );
                })}
                
                <Button
                  onClick={signOut}
                  variant="outline"
                  size="sm"
                  className="group relative overflow-hidden border-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-300"
                >
                  <LogOut className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                  Logout
                </Button>
              </nav>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
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
            )}
          </div>

          {/* Breadcrumbs */}
          {!isMobile && getBreadcrumbs().length > 1 && (
            <div className="pb-3 flex items-center space-x-2 text-sm text-muted-foreground">
              {getBreadcrumbs().map((crumb, index) => {
                const Icon = crumb.icon;
                const isLast = index === getBreadcrumbs().length - 1;
                
                return (
                  <React.Fragment key={crumb.path}>
                    <Link
                      to={crumb.path}
                      className={cn(
                        "flex items-center space-x-1 hover:text-foreground transition-colors duration-200",
                        isLast && "text-foreground font-medium"
                      )}
                    >
                      <Icon className="h-3 w-3" />
                      <span>{crumb.label}</span>
                    </Link>
                    {!isLast && (
                      <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
                    )}
                  </React.Fragment>
                );
              })}
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
            {/* Mobile Breadcrumbs */}
            {getBreadcrumbs().length > 1 && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                {getBreadcrumbs().map((crumb, index) => {
                  const Icon = crumb.icon;
                  const isLast = index === getBreadcrumbs().length - 1;
                  
                  return (
                    <React.Fragment key={crumb.path}>
                      <div className="flex items-center space-x-1">
                        <Icon className="h-3 w-3" />
                        <span className={isLast ? "text-foreground font-medium" : ""}>{crumb.label}</span>
                      </div>
                      {!isLast && (
                        <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            )}

            {/* Mobile Navigation Items */}
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "group flex items-center space-x-4 px-6 py-4 rounded-xl text-lg font-medium transition-all duration-300",
                    "animate-fade-in",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg scale-105"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent hover:scale-105"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Icon className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Mobile Logout Button */}
            <Button
              onClick={() => {
                setIsMobileMenuOpen(false);
                signOut();
              }}
              variant="destructive"
              size="lg"
              className="group flex items-center space-x-4 px-6 py-4 text-lg animate-fade-in"
              style={{ animationDelay: `${navigationItems.length * 100}ms` }}
            >
              <LogOut className="h-6 w-6 group-hover:animate-pulse" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ModernNavigation;
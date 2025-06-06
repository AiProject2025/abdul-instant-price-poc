
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Calculator, FileText, Home, Clock, Percent, Lock, Unlock } from "lucide-react";

interface PricingResultsProps {
  results: {
    lender: string;
    noteBuyer: string;
    product: string;
    rate: number;
    monthlyPayment: number;
    totalInterest: number;
    loanAmount: number;
    dscr: number;
    propertyType: string;
    loanType: string;
    pppDuration: string;
    ltv: number;
    isLocked?: boolean;
  }[];
  onStartApplication: () => void;
  onBackToForm: () => void;
}

const PricingResults = ({ results, onStartApplication }: PricingResultsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatRate = (rate: number) => {
    return `${rate.toFixed(3)}%`;
  };

  const handleLockRate = (index: number) => {
    console.log(`Locking rate for ${results[index].noteBuyer} - ${results[index].product}`);
    // Add lock rate logic here
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-dominion-blue mb-2">Your DSCR Loan Pricing Results</h2>
        <p className="text-dominion-gray">
          We found {results.length} competitive offers from our network of note buyers
        </p>
      </div>

      <div className="grid gap-4">
        {results.map((result, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <CardTitle className="text-dominion-blue">{result.lender}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {result.product}
                    </Badge>
                    {result.isLocked && (
                      <Badge className="text-xs bg-green-100 text-green-800 border-green-200">
                        <Lock className="h-3 w-3 mr-1" />
                        Rate Locked
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-sm">
                    Note Buyer: <span className="font-medium">{result.noteBuyer}</span>
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-dominion-green">
                    {formatRate(result.rate)}
                  </div>
                  <div className="text-sm text-dominion-gray">Interest Rate</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Primary Loan Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5 text-dominion-green" />
                  <div>
                    <div className="font-semibold">{formatCurrency(result.monthlyPayment)}</div>
                    <div className="text-sm text-dominion-gray">Monthly Payment</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calculator className="h-5 w-5 text-dominion-blue" />
                  <div>
                    <div className="font-semibold">{formatCurrency(result.loanAmount)}</div>
                    <div className="text-sm text-dominion-gray">Loan Amount</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-dominion-gray" />
                  <div>
                    <div className="font-semibold">{result.dscr.toFixed(3)}</div>
                    <div className="text-sm text-dominion-gray">DSCR Ratio</div>
                  </div>
                </div>
              </div>

              {/* Secondary Details */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Home className="h-4 w-4 text-dominion-blue" />
                  <div>
                    <div className="text-sm font-medium">{result.propertyType}</div>
                    <div className="text-xs text-dominion-gray">Property Type</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-dominion-blue" />
                  <div>
                    <div className="text-sm font-medium">{result.loanType}</div>
                    <div className="text-xs text-dominion-gray">Loan Type</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-dominion-blue" />
                  <div>
                    <div className="text-sm font-medium">{result.pppDuration}</div>
                    <div className="text-xs text-dominion-gray">PPP Duration</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Percent className="h-4 w-4 text-dominion-blue" />
                  <div>
                    <div className="text-sm font-medium">{result.ltv}%</div>
                    <div className="text-xs text-dominion-gray">LTV</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  onClick={onStartApplication}
                  className="flex-1 bg-dominion-blue hover:bg-dominion-blue/90 text-white"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Start Application with {result.noteBuyer}
                </Button>
                
                {/* Lock Rate Button - only for non-Blackstone products */}
                {result.noteBuyer !== "Blackstone" && (
                  <Button 
                    onClick={() => handleLockRate(index)}
                    variant={result.isLocked ? "secondary" : "outline"}
                    className="px-4"
                    disabled={result.isLocked}
                  >
                    {result.isLocked ? (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Locked
                      </>
                    ) : (
                      <>
                        <Unlock className="mr-2 h-4 w-4" />
                        Lock Rate
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-dominion-blue text-white">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Need Help Choosing?</h3>
            <p className="mb-4 opacity-90">
              Our loan experts can help you compare these note buyer options and find the best fit for your investment goals.
            </p>
            <Button 
              variant="outline" 
              className="bg-white text-dominion-blue hover:bg-gray-100"
            >
              Speak with a Loan Expert
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingResults;

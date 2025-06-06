
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, Calculator, FileText } from "lucide-react";

interface PricingResultsProps {
  results: {
    lender: string;
    rate: number;
    monthlyPayment: number;
    totalInterest: number;
    loanAmount: number;
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-dominion-blue mb-2">Your DSCR Loan Pricing Results</h2>
        <p className="text-dominion-gray">
          We found {results.length} competitive offers from our network of lenders
        </p>
      </div>

      <div className="grid gap-4">
        {results.map((result, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-dominion-blue">{result.lender}</CardTitle>
                  <CardDescription>Investment Property Loan</CardDescription>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                    <div className="font-semibold">{formatCurrency(result.totalInterest)}</div>
                    <div className="text-sm text-dominion-gray">Total Interest</div>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={onStartApplication}
                className="w-full bg-dominion-blue hover:bg-dominion-blue/90 text-white"
              >
                <FileText className="mr-2 h-4 w-4" />
                Start Application with {result.lender}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-dominion-blue text-white">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Need Help Choosing?</h3>
            <p className="mb-4 opacity-90">
              Our loan experts can help you compare these options and find the best fit for your investment goals.
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


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Calendar, Percent } from "lucide-react";

interface PricingResultsProps {
  pricingData: Record<string, number>;
  formData: any;
}

const PricingResults = ({ pricingData, formData }: PricingResultsProps) => {
  const calculateMonthlyPayment = (rate: number, loanAmount: number, termMonths: number, isInterestOnly: boolean) => {
    const monthlyRate = rate / 100 / 12;
    const principal = parseFloat(loanAmount);
    
    if (isInterestOnly) {
      return (principal * monthlyRate).toFixed(2);
    }
    
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                          (Math.pow(1 + monthlyRate, termMonths) - 1);
    return monthlyPayment.toFixed(2);
  };

  const calculateCashFlow = (monthlyPayment: number, rent: number, taxes: number, insurance: number, hoa: number) => {
    const totalExpenses = parseFloat(monthlyPayment.toString()) + parseFloat(taxes) + parseFloat(insurance) + parseFloat(hoa);
    return parseFloat(rent) - totalExpenses;
  };

  const loanAmount = parseFloat(formData.baseLoanAmount);
  const termMonths = parseInt(formData.loanTerm);
  const isInterestOnly = formData.interestOnly === "yes";
  const monthlyRent = parseFloat(formData.marketRent);
  const monthlyTaxes = parseFloat(formData.monthlyTaxes);
  const monthlyInsurance = parseFloat(formData.monthlyInsurance);
  const monthlyHoa = parseFloat(formData.monthlyHoa || "0");

  const notebuyerResults = Object.entries(pricingData).map(([name, rate]) => {
    const monthlyPayment = calculateMonthlyPayment(rate, loanAmount, termMonths, isInterestOnly);
    const cashFlow = calculateCashFlow(parseFloat(monthlyPayment), monthlyRent, monthlyTaxes, monthlyInsurance, monthlyHoa);
    
    return {
      name,
      rate,
      monthlyPayment: parseFloat(monthlyPayment),
      cashFlow,
      totalInterest: isInterestOnly ? 0 : (parseFloat(monthlyPayment) * termMonths) - loanAmount
    };
  }).sort((a, b) => a.rate - b.rate);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-dominion-blue mb-4">
          Your DSCR Loan Pricing Results
        </h1>
        <p className="text-lg text-dominion-gray">
          Competitive rates from {Object.keys(pricingData).length} notebuyers
        </p>
      </div>

      {/* Loan Summary */}
      <Card className="bg-gradient-to-r from-dominion-blue to-dominion-green text-white">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <DollarSign className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">${loanAmount.toLocaleString()}</div>
              <div className="text-sm opacity-90">Loan Amount</div>
            </div>
            <div>
              <Calendar className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{termMonths / 12} years</div>
              <div className="text-sm opacity-90">Loan Term</div>
            </div>
            <div>
              <TrendingUp className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">${monthlyRent.toLocaleString()}</div>
              <div className="text-sm opacity-90">Monthly Rent</div>
            </div>
            <div>
              <Percent className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{((loanAmount / parseFloat(formData.appraisedValue)) * 100).toFixed(1)}%</div>
              <div className="text-sm opacity-90">LTV</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notebuyer Results */}
      <div className="grid gap-4">
        {notebuyerResults.map((result, index) => (
          <Card key={result.name} className={`transition-all hover:shadow-lg ${index === 0 ? 'ring-2 ring-dominion-green' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg text-dominion-blue">{result.name}</CardTitle>
                  {index === 0 && (
                    <Badge className="mt-1 bg-dominion-green text-white">Best Rate</Badge>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-dominion-green">{result.rate.toFixed(3)}%</div>
                  <div className="text-sm text-dominion-gray">Interest Rate</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-dominion-blue">
                    ${result.monthlyPayment.toLocaleString()}
                  </div>
                  <div className="text-sm text-dominion-gray">
                    Monthly Payment {isInterestOnly ? "(IO)" : "(P&I)"}
                  </div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className={`text-lg font-semibold ${result.cashFlow >= 0 ? 'text-dominion-green' : 'text-red-500'}`}>
                    ${result.cashFlow >= 0 ? '+' : ''}${result.cashFlow.toLocaleString()}
                  </div>
                  <div className="text-sm text-dominion-gray">Monthly Cash Flow</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-dominion-blue">
                    {!isInterestOnly ? `$${result.totalInterest.toLocaleString()}` : 'N/A'}
                  </div>
                  <div className="text-sm text-dominion-gray">Total Interest</div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button className="bg-dominion-blue hover:bg-dominion-blue/90 text-white">
                  Select This Notebuyer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Property Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-dominion-blue">Property Analysis</CardTitle>
          <CardDescription>Investment property financial summary</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-dominion-blue mb-3">Monthly Income</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Market Rent:</span>
                  <span className="font-medium">${monthlyRent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>Total Income:</span>
                  <span className="text-dominion-green">${monthlyRent.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-dominion-blue mb-3">Monthly Expenses</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Property Taxes:</span>
                  <span>${monthlyTaxes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Insurance:</span>
                  <span>${monthlyInsurance.toLocaleString()}</span>
                </div>
                {monthlyHoa > 0 && (
                  <div className="flex justify-between">
                    <span>HOA:</span>
                    <span>${monthlyHoa.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>Total (excl. debt):</span>
                  <span className="text-red-500">${(monthlyTaxes + monthlyInsurance + monthlyHoa).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-dominion-blue text-white">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Ready to Move Forward?</h3>
          <p className="mb-4 opacity-90">Contact our team to lock in your rate and start the application process.</p>
          <Button className="bg-dominion-green hover:bg-dominion-green/90 text-white">
            Contact Loan Officer
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingResults;

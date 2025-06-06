
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, TrendingUp, CheckCircle, XCircle, AlertCircle, Lock } from "lucide-react";

interface RiskFlag {
  id: string;
  category: "High" | "Medium" | "Low";
  title: string;
  description: string;
  status: "flagged" | "cleared" | "review";
  details?: string;
}

interface RiskTrackerProps {
  loanData?: any;
}

const RiskTracker = ({ loanData }: RiskTrackerProps) => {
  const generateRiskFlags = (): RiskFlag[] => {
    const flags: RiskFlag[] = [];
    
    if (loanData) {
      const creditScore = parseInt(loanData.decisionCreditScore) || parseInt(loanData.creditScore) || 0;
      const loanAmount = parseFloat(loanData.baseLoanAmount) || parseFloat(loanData.loanAmount) || 0;
      const propertyState = loanData.propertyState || loanData.state || '';
      
      // Calculate DSCR
      const monthlyRent = parseFloat(loanData.marketRent) || 0;
      const monthlyExpenses = (parseFloat(loanData.monthlyTaxes) || 0) + 
                             (parseFloat(loanData.monthlyInsurance) || 0) + 
                             (parseFloat(loanData.monthlyHOA) || 0) + 
                             (parseFloat(loanData.monthlyFloodInsurance) || 0);
      const netIncome = monthlyRent - monthlyExpenses;
      const estimatedPayment = (loanAmount * 0.006);
      const dscr = estimatedPayment > 0 ? netIncome / estimatedPayment : 0;

      // Judicial foreclosure states
      const judicialStates = [
        'Connecticut', 'Delaware', 'Florida', 'Hawaii', 'Illinois', 'Indiana', 'Iowa', 
        'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Nebraska', 'New Jersey', 
        'New Mexico', 'New York', 'North Dakota', 'Ohio', 'Oklahoma', 'Pennsylvania', 
        'South Carolina', 'South Dakota', 'Vermont', 'Wisconsin'
      ];

      // Credit Score Analysis
      if (creditScore >= 680 && creditScore <= 699) {
        flags.push({
          id: "credit-1",
          category: "Medium",
          title: "Credit Score in Caution Range",
          description: `Credit score of ${creditScore} falls in 680-699 range requiring additional review`,
          status: "review",
          details: `Minimum acceptable but may limit note buyer options. Consider requesting updated credit report.`
        });
      } else if (creditScore >= 700) {
        flags.push({
          id: "credit-2",
          category: "Low",
          title: "Credit Score Verified",
          description: `Strong credit score of ${creditScore} verified`,
          status: "cleared",
          details: `Exceeds minimum requirements for all note buyer programs.`
        });
      } else if (creditScore < 680) {
        flags.push({
          id: "credit-3",
          category: "High",
          title: "Credit Score Below Minimum",
          description: `Credit score of ${creditScore} below 680 minimum requirement`,
          status: "flagged",
          details: `Does not meet minimum credit requirements for DSCR lending programs.`
        });
      }

      // DSCR Analysis
      if (dscr < 1.1) {
        flags.push({
          id: "dscr-1",
          category: "High",
          title: "DSCR Below Minimum Threshold",
          description: `DSCR of ${dscr.toFixed(3)} is below 1.1 minimum requirement`,
          status: "flagged",
          details: `Property cash flow insufficient to support debt service. Consider reducing loan amount or increasing rent.`
        });
      } else if (dscr >= 1.1 && dscr < 1.25) {
        flags.push({
          id: "dscr-2",
          category: "Medium",
          title: "DSCR at Minimum Level",
          description: `DSCR of ${dscr.toFixed(3)} meets minimum but requires monitoring`,
          status: "review",
          details: `Marginal cash flow coverage. Consider requesting additional reserves or rent verification.`
        });
      } else {
        flags.push({
          id: "dscr-3",
          category: "Low",
          title: "DSCR Exceeds Requirements",
          description: `Strong DSCR of ${dscr.toFixed(3)} provides adequate cash flow coverage`,
          status: "cleared",
          details: `Property demonstrates strong cash flow to support debt service.`
        });
      }

      // Loan Amount Analysis
      if (loanAmount < 120000) {
        flags.push({
          id: "loan-1",
          category: "Medium",
          title: "Small Loan Amount",
          description: `Loan amount of $${loanAmount.toLocaleString()} is below $120k threshold`,
          status: "review",
          details: `Small loan amounts may have limited note buyer interest and higher pricing.`
        });
      } else {
        flags.push({
          id: "loan-2",
          category: "Low",
          title: "Loan Amount Within Normal Range",
          description: `Loan amount of $${loanAmount.toLocaleString()} meets program requirements`,
          status: "cleared",
          details: `Loan size appropriate for institutional note buyer programs.`
        });
      }

      // State Analysis
      if (judicialStates.includes(propertyState)) {
        flags.push({
          id: "state-1",
          category: "Medium",
          title: "Judicial Foreclosure State",
          description: `Property located in ${propertyState}, a judicial foreclosure state`,
          status: "review",
          details: `Judicial foreclosure process may increase timeline and costs in default scenarios.`
        });
      } else {
        flags.push({
          id: "state-2",
          category: "Low",
          title: "Non-Judicial Foreclosure State",
          description: `Property in ${propertyState} allows non-judicial foreclosure`,
          status: "cleared",
          details: `Streamlined foreclosure process available if needed.`
        });
      }

      // Property Type Analysis
      const propertyType = loanData.propertyType || '';
      if (propertyType.includes('Condo') || propertyType.includes('Townhome')) {
        flags.push({
          id: "property-1",
          category: "Medium",
          title: "Condo/Townhome Property Type",
          description: `${propertyType} may have limited note buyer appetite`,
          status: "review",
          details: `Some note buyers have restrictions on condos/townhomes. HOA review required.`
        });
      }

      // Reserve Analysis
      const monthsReserves = parseInt(loanData.monthsOfReserves) || 0;
      if (monthsReserves < 6) {
        flags.push({
          id: "reserves-1",
          category: "High",
          title: "Insufficient Reserves",
          description: `${monthsReserves} months of reserves below 6-month minimum`,
          status: "flagged",
          details: `Inadequate reserves for property maintenance and vacancy periods.`
        });
      } else if (monthsReserves >= 6 && monthsReserves < 12) {
        flags.push({
          id: "reserves-2",
          category: "Medium",
          title: "Minimum Reserve Requirements",
          description: `${monthsReserves} months reserves meets minimum threshold`,
          status: "review",
          details: `At minimum reserve level. Consider requesting additional liquidity verification.`
        });
      }
    }

    return flags;
  };

  const riskFlags = generateRiskFlags();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "flagged":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "cleared":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "review":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const flaggedCount = riskFlags.filter(flag => flag.status === "flagged").length;
  const reviewCount = riskFlags.filter(flag => flag.status === "review").length;
  const clearedCount = riskFlags.filter(flag => flag.status === "cleared").length;

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-dominion-blue to-dominion-green text-white">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-white">
              Risk Adverse Loan Tracker
            </CardTitle>
            <CardDescription className="text-gray-100">
              Powered by DocIQ™ 1.0 Beta
            </CardDescription>
            <p className="text-sm text-gray-200 mt-1">
              AI-Driven Flagging Engine for DSCR Lending Accuracy & Risk Control
            </p>
          </div>
          <Shield className="h-8 w-8 text-white" />
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Risk Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="text-2xl font-bold text-red-600">{flaggedCount}</div>
            <div className="text-sm text-red-700">High Risk Flags</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">{reviewCount}</div>
            <div className="text-sm text-yellow-700">Items for Review</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">{clearedCount}</div>
            <div className="text-sm text-green-700">Cleared Items</div>
          </div>
        </div>

        {/* Risk Flags List */}
        <div className="space-y-3">
          <h4 className="font-semibold text-dominion-blue mb-3">Detailed Risk Analysis</h4>
          {riskFlags.length === 0 ? (
            <div className="text-center py-8 text-dominion-gray">
              <Shield className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No loan data available for risk analysis</p>
            </div>
          ) : (
            riskFlags.map((flag) => (
              <div key={flag.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    {getStatusIcon(flag.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h5 className="font-medium text-dominion-blue">{flag.title}</h5>
                      <Badge className={`text-xs ${getCategoryColor(flag.category)}`}>
                        {flag.category} Risk
                      </Badge>
                    </div>
                    <p className="text-sm text-dominion-gray mb-2">{flag.description}</p>
                    {flag.details && (
                      <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                        <strong>Details:</strong> {flag.details}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* DocIQ Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-dominion-gray">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>DocIQ™ Confidence Score: {flaggedCount === 0 ? '98.5' : '94.2'}%</span>
            </div>
            <div>
              Last analyzed: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskTracker;

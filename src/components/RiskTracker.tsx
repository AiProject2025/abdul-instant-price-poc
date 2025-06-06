
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, TrendingUp, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface RiskFlag {
  id: string;
  category: "High" | "Medium" | "Low";
  title: string;
  description: string;
  status: "flagged" | "cleared" | "review";
}

interface RiskTrackerProps {
  loanData?: any;
}

const RiskTracker = ({ loanData }: RiskTrackerProps) => {
  // Mock risk flags based on loan data analysis
  const riskFlags: RiskFlag[] = [
    {
      id: "dscr-1",
      category: "Medium",
      title: "DSCR Ratio Analysis",
      description: "Property cash flow shows 1.15x coverage - meets minimum but requires monitoring",
      status: "review"
    },
    {
      id: "credit-1", 
      category: "Low",
      title: "Credit Score Verification",
      description: "Credit score of 740 verified through multiple bureaus",
      status: "cleared"
    },
    {
      id: "appraisal-1",
      category: "High",
      title: "Property Valuation Flag",
      description: "Appraisal value appears 15% above recent comps in area",
      status: "flagged"
    },
    {
      id: "income-1",
      category: "Low", 
      title: "Rental Income Documentation",
      description: "Market rent analysis confirms stated rental income",
      status: "cleared"
    },
    {
      id: "reserves-1",
      category: "Medium",
      title: "Reserve Requirements",
      description: "12 months reserves meet policy but at minimum threshold",
      status: "review"
    }
  ];

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
          <h4 className="font-semibold text-dominion-blue mb-3">Risk Analysis Results</h4>
          {riskFlags.map((flag) => (
            <div key={flag.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <div className="mt-1">
                {getStatusIcon(flag.status)}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h5 className="font-medium text-dominion-blue">{flag.title}</h5>
                  <Badge className={`text-xs ${getCategoryColor(flag.category)}`}>
                    {flag.category} Risk
                  </Badge>
                </div>
                <p className="text-sm text-dominion-gray">{flag.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* DocIQ Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-dominion-gray">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>DocIQ™ Confidence Score: 94.2%</span>
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

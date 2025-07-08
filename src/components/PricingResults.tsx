import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Calculator, FileText, Home, Clock, Percent, Lock, Unlock, Grid, List, Edit } from "lucide-react";
import FlagsDisplay from "@/components/FlagsDisplay";
import EditableQuoteDetails from "@/components/EditableQuoteDetails";
import { useState } from "react";

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
    loanPurpose: string;
    refinanceType?: string;
    pppDuration: string;
    ltv: number;
    points: number;
    isLocked?: boolean;
  }[];
  flags?: string[];
  onGenerateLoanQuote: (selectedResult?: any, editedData?: any) => void;
  onBackToForm: () => void;
  lastSubmittedFormData?: any;
}

const PricingResults = ({ results, flags, onGenerateLoanQuote, lastSubmittedFormData }: PricingResultsProps) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<any>(null);

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

  const handleEditQuote = (result: any) => {
    if (!lastSubmittedFormData) return;

    const quoteData = {
      borrowerName: `${lastSubmittedFormData.firstName || ''} ${lastSubmittedFormData.lastName || ''}`.trim() || 'Borrower',
      propertyAddress: `${lastSubmittedFormData.streetAddress || ''}, ${lastSubmittedFormData.city || ''}, ${lastSubmittedFormData.propertyState || ''} ${lastSubmittedFormData.zipCode || ''}`.replace(/^,\s*/, '').replace(/,\s*$/, ''),
      loanAmount: result.loanAmount,
      interestRate: result.rate,
      monthlyPayment: result.monthlyPayment,
      loanTerm: 360, // 30 years
      ltv: result.ltv,
      dscr: result.dscr,
      propertyType: result.propertyType,
      loanPurpose: result.loanPurpose,
      refinanceType: result.refinanceType,
      points: result.points,
      noteBuyer: result.noteBuyer,
      loanOfficer: lastSubmittedFormData.loanOfficerName || 'Gregory Clarke',
      phoneNumber: '410-705-2277',
      date: new Date().toLocaleDateString()
    };

    setSelectedResult(result);
    setIsEditDialogOpen(true);
  };

  const handleSaveEditedQuote = (editedData: any) => {
    onGenerateLoanQuote(selectedResult, editedData);
  };

  return (
    <div className="space-y-6">
      {/* Show flags first if they exist */}
      {flags && flags.length > 0 && (
        <FlagsDisplay flags={flags} />
      )}

      <div className="flex justify-between items-center">
        <div className="text-center flex-1">
          <h2 className="text-2xl font-bold text-dominion-blue mb-2">Your DSCR Loan Pricing Results</h2>
          <p className="text-dominion-gray">
            We found {results.length} competitive offers from our network of note buyers
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'grid gap-4'}>
        {results.map((result, index) => (
          viewMode === 'grid' ? (
            // Grid View - Compact Card
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg text-dominion-blue">{result.noteBuyer}</CardTitle>
                    {result.isLocked && (
                      <Badge className="text-xs bg-green-100 text-green-800 border-green-200 mt-1">
                        <Lock className="h-3 w-3 mr-1" />
                        Locked
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-dominion-green">
                      {formatRate(result.rate)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-dominion-gray">Monthly Payment:</span>
                    <span className="font-semibold">{formatCurrency(result.monthlyPayment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-dominion-gray">Loan Amount:</span>
                    <span className="font-semibold">{formatCurrency(result.loanAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-dominion-gray">DSCR:</span>
                    <span className="font-semibold">{result.dscr.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-dominion-gray">LTV:</span>
                    <span className="font-semibold">{result.ltv}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-dominion-gray">Points:</span>
                    <span className="font-semibold">{result.points}%</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => onGenerateLoanQuote(result)}
                    className="flex-1 bg-dominion-blue hover:bg-dominion-blue/90 text-white text-sm"
                    size="sm"
                  >
                    <FileText className="mr-2 h-3 w-3" />
                    Quick Quote
                  </Button>
                  <Button 
                    onClick={() => handleEditQuote(result)}
                    variant="outline"
                    size="sm"
                    className="px-3"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            // List View - Full Card
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
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
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
                      <div className="text-sm font-medium">
                        {result.loanPurpose}
                        {result.refinanceType && ` - ${result.refinanceType}`}
                      </div>
                      <div className="text-xs text-dominion-gray">Loan Purpose</div>
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
                  <div className="flex items-center space-x-2">
                    <Calculator className="h-4 w-4 text-dominion-blue" />
                    <div>
                      <div className="text-sm font-medium">{result.points}%</div>
                      <div className="text-xs text-dominion-gray">Points</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button 
                    onClick={() => onGenerateLoanQuote(result)}
                    className="flex-1 bg-dominion-blue hover:bg-dominion-blue/90 text-white"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Quick Quote
                  </Button>
                  
                  <Button 
                    onClick={() => handleEditQuote(result)}
                    variant="outline"
                    className="px-4"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Quote
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
          )
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

      {/* Editable Quote Details Dialog */}
      {selectedResult && lastSubmittedFormData && (
        <EditableQuoteDetails
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          initialData={{
            borrowerName: `${lastSubmittedFormData.firstName || ''} ${lastSubmittedFormData.lastName || ''}`.trim() || 'Borrower',
            propertyAddress: `${lastSubmittedFormData.streetAddress || ''}, ${lastSubmittedFormData.city || ''}, ${lastSubmittedFormData.propertyState || ''} ${lastSubmittedFormData.zipCode || ''}`.replace(/^,\s*/, '').replace(/,\s*$/, ''),
            loanAmount: selectedResult.loanAmount,
            interestRate: selectedResult.rate,
            monthlyPayment: selectedResult.monthlyPayment,
            loanTerm: 360,
            ltv: selectedResult.ltv,
            dscr: selectedResult.dscr,
            propertyType: selectedResult.propertyType,
            loanPurpose: selectedResult.loanPurpose,
            refinanceType: selectedResult.refinanceType,
            points: selectedResult.points,
            noteBuyer: selectedResult.noteBuyer,
            loanOfficer: lastSubmittedFormData.loanOfficerName || 'Gregory Clarke',
            phoneNumber: '410-705-2277',
            date: new Date().toLocaleDateString()
          }}
          onSave={handleSaveEditedQuote}
        />
      )}
    </div>
  );
};

export default PricingResults;

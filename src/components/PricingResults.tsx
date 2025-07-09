import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, DollarSign, Calculator, FileText, Home, Clock, Percent, Lock, Unlock, Grid, List, Edit, AlertTriangle } from "lucide-react";
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
  ineligibleBuyers?: { noteBuyer: string; flags: string[] }[];
  onGenerateLoanQuote: (selectedResult?: any, editedData?: any) => void;
  onBackToForm: () => void;
  lastSubmittedFormData?: any;
}

const PricingResults = ({ results, flags, ineligibleBuyers = [], onGenerateLoanQuote, lastSubmittedFormData }: PricingResultsProps) => {
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
    setSelectedResult(null);
    setIsEditDialogOpen(false);
  };

  const handleReQuote = async (editedData: any) => {
    // Close the edit dialog and trigger a new quote with the updated data
    setIsEditDialogOpen(false);
    setSelectedResult(null);
    
    // Here you would call the pricing API again with the updated data
    // For now, we'll just call the onGenerateLoanQuote function
    onGenerateLoanQuote(selectedResult, editedData);
  };

  const handleEmailJosh = () => {
    const borrowerName = lastSubmittedFormData 
      ? `${lastSubmittedFormData.firstName || ''} ${lastSubmittedFormData.lastName || ''}`.trim() || 'Borrower'
      : 'Borrower';

    const propertyAddress = lastSubmittedFormData 
      ? `${lastSubmittedFormData.streetAddress || ''}, ${lastSubmittedFormData.city || ''}, ${lastSubmittedFormData.propertyState || ''} ${lastSubmittedFormData.zipCode || ''}`.replace(/^,\s*/, '').replace(/,\s*$/, '')
      : 'Property Address Not Available';

    const emailSubject = `DSCR Loan Quote - ${borrowerName} - Flagged Transaction`;
    
    const emailBody = `Hi Josh,

A DSCR loan quote has been generated that requires your review due to flagged conditions.

BORROWER INFORMATION:
- Name: ${borrowerName}
- Property Address: ${propertyAddress}

TRANSACTION FLAGS:
${flags && flags.length > 0 ? flags.map(flag => `- ${flag}`).join('\n') : '- No specific flags listed'}

PRICING RESULTS (${results.length} offers found):

${results.map((result, index) => `
OFFER ${index + 1}:
- Lender: ${result.lender}
- Note Buyer: ${result.noteBuyer}
- Product: ${result.product}
- Interest Rate: ${formatRate(result.rate)}
- Monthly Payment: ${formatCurrency(result.monthlyPayment)}
- Loan Amount: ${formatCurrency(result.loanAmount)}
- DSCR: ${result.dscr.toFixed(3)}
- LTV: ${result.ltv}%
- Points: ${result.points}%
- Property Type: ${result.propertyType}
- Loan Purpose: ${result.loanPurpose}${result.refinanceType ? ` - ${result.refinanceType}` : ''}
- PPP Duration: ${result.pppDuration}
${result.isLocked ? '- Status: Rate Locked' : ''}
`).join('\n')}

This transaction has been flagged for one buyer and requires manual review before proceeding.

Please review and advise on next steps.

Best regards,
DSCR Loan System`;

    const mailtoLink = `mailto:joshb@thedominiongroup.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
  };

  const handleFeatureRequest = () => {
    const borrowerName = lastSubmittedFormData 
      ? `${lastSubmittedFormData.firstName || ''} ${lastSubmittedFormData.lastName || ''}`.trim() || 'Borrower'
      : 'Borrower';

    const emailSubject = `DSCR System - Feature Request`;
    
    const emailBody = `Hi John,

I would like to request a new feature for the DSCR loan system.

FEATURE REQUEST DETAILS:
- Requested by: ${borrowerName}
- Date: ${new Date().toLocaleDateString()}
- Current Context: Reviewing loan pricing results

FEATURE DESCRIPTION:
[Please describe the feature you would like to add]

BUSINESS JUSTIFICATION:
[Please explain why this feature would be valuable]

Best regards,
DSCR Loan System`;

    const mailtoLink = `mailto:johnm@thedominiongroup.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
  };

  // Combine eligible and ineligible buyers for the table
  const allBuyersForTable = [
    // Available buyers
    ...results.map(result => ({
      noteBuyer: result.noteBuyer,
      isAvailable: true,
      flags: []
    })),
    // Ineligible buyers
    ...ineligibleBuyers.map(buyer => ({
      noteBuyer: buyer.noteBuyer,
      isAvailable: false,
      flags: buyer.flags
    }))
  ];
  
  return (
    <div className="space-y-6">
      {/* Show flags first if they exist */}
      {flags && flags.length > 0 && (
        <FlagsDisplay flags={flags} />
      )}

      <div className="text-center">
        <h2 className="text-2xl font-bold text-dominion-blue mb-2">Your DSCR Loan Pricing Results</h2>
        <p className="text-dominion-gray">
          We found {results.length} competitive offers from our network of note buyers
        </p>
      </div>

      <Tabs defaultValue="results" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="results">Results ({results.length})</TabsTrigger>
          <TabsTrigger value="ineligible">Ineligible Buyer Reasons</TabsTrigger>
        </TabsList>
        
        <TabsContent value="results" className="space-y-6">
          <div className="flex justify-end">
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
        </TabsContent>

        <TabsContent value="ineligible" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-5 w-5" />
                Ineligible Buyer Reasons
              </CardTitle>
              <CardDescription>
                This shows why specific note buyers may not be available for this loan application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Note Buyer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ineligibility Reasons</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allBuyersForTable.map((buyer) => (
                    <TableRow key={buyer.noteBuyer}>
                      <TableCell className="font-medium">{buyer.noteBuyer}</TableCell>
                      <TableCell>
                        {buyer.isAvailable ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            Available
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
                            Ineligible
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {buyer.isAvailable ? (
                          <span className="text-sm text-gray-600">Pricing available</span>
                        ) : (
                          <div className="space-y-1">
                            {buyer.flags.map((flag, index) => (
                              <div key={index} className="text-sm text-red-700 flex items-start gap-1">
                                <span className="text-xs">•</span>
                                <span>{flag}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Interest Reserves Section for Price Team */}
      {lastSubmittedFormData?.interestReserves && (
        <Card className="bg-yellow-50 border border-yellow-200">
          <CardHeader>
            <CardTitle className="text-xl text-yellow-800">Price Team Review Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interest Reserves Selected:</label>
                <div className="p-2 bg-white border rounded text-sm font-medium">
                  {lastSubmittedFormData.interestReserves}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Refinance Type:</label>
                <div className="p-2 bg-white border rounded text-sm font-medium">
                  {lastSubmittedFormData.refinanceType || 'N/A'}
                </div>
              </div>
            </div>
            <div className="p-4 bg-white border rounded">
              <h4 className="font-medium text-gray-700 mb-2">Price Team Notes:</h4>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  • Applicable for Product B and H on Cash Out refinance
                </p>
                <p className="text-sm text-gray-600">
                  • For Rate/Term refinance, liquidity needs to be 2x per loan guidelines
                </p>
                <p className="text-sm text-gray-600">
                  • Same rules apply if only 1 note buyer is available
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-dominion-blue text-white">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Manager Approval Request</h3>
            <p className="mb-4 opacity-90">
              Any Single Note Buyer deals or Price Exceptions must be approved by Management. Submit your Request Below. Any Features you want added or issues with the interface select Submit Feedback.
            </p>
            <div className="flex flex-col gap-3 items-center">
              <a 
                href="mailto:Wade@thedominiongroup.com"
                className="inline-flex items-center justify-center px-6 py-2 bg-white text-dominion-blue font-semibold rounded-md hover:bg-gray-100 transition-colors"
              >
                Email Wade
              </a>
              <div className="flex gap-3 justify-center">
                <Button 
                  variant="outline" 
                  className="bg-white text-dominion-blue hover:bg-gray-100"
                  onClick={handleEmailJosh}
                >
                  Email Josh
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-white text-dominion-blue hover:bg-gray-100"
                  onClick={handleFeatureRequest}
                >
                  Request Feature
                </Button>
              </div>
            </div>
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
          onReQuote={handleReQuote}
          currentPricingResults={results}
        />
      )}
    </div>
  );
};

export default PricingResults;

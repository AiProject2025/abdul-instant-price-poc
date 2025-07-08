import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getQuotes, getQuoteStats, Quote, clearAllQuotes } from "@/services/quoteTracker";
import { AlertTriangle, TrendingUp, FileText, Flag, Trash2, MousePointer, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface QuoteTrackerProps {
  onQuoteSelect?: (quote: Quote) => void;
}

const QuoteTracker = ({ onQuoteSelect }: QuoteTrackerProps) => {
  const [quotes, setQuotes] = useState(getQuotes());
  const [stats, setStats] = useState(getQuoteStats());
  const [isOpen, setIsOpen] = useState(false);

  const handleClearQuotes = () => {
    clearAllQuotes();
    setQuotes([]);
    setStats(getQuoteStats());
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleQuoteClick = (quote: Quote) => {
    console.log('Quote clicked:', quote);
    console.log('Original form data:', quote.originalFormData);
    if (onQuoteSelect) {
      onQuoteSelect(quote);
    } else {
      console.log('No onQuoteSelect handler provided');
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="w-full">
        <CardHeader className="bg-gradient-to-r from-dominion-blue to-dominion-green text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl font-bold text-white">
                  Quote Tracking Dashboard
                </CardTitle>
                <span className="text-sm text-gray-200 font-medium">(Coming Soon!)</span>
              </div>
              <CardDescription className="text-gray-100">
                Monitor all quotes and flagged items. Click on any quote to restore it.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearQuotes}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
              <FileText className="h-8 w-8 text-white" />
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-white hover:bg-white/20 p-1"
                >
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        </CardHeader>
        
        <CollapsibleContent>
          <CardContent className="p-6">
            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-dominion-blue">{stats.totalQuotes}</div>
                <div className="text-sm text-dominion-gray">Total Quotes</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="text-2xl font-bold text-red-600">{stats.flaggedQuotes}</div>
                <div className="text-sm text-red-700">Flagged Quotes</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-600">{stats.flaggedPercentage}%</div>
                <div className="text-sm text-yellow-700">Flag Rate</div>
              </div>
            </div>

            {/* Detailed Flag Counts */}
            <div className="mb-6">
              <h4 className="font-semibold text-dominion-blue mb-3">Flag Details</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="text-lg font-bold text-orange-600">{stats.flagDetails.creditUnder699}</div>
                  <div className="text-xs text-orange-700">Credit 680-699</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-lg font-bold text-purple-600">{stats.flagDetails.loanUnder120k}</div>
                  <div className="text-xs text-purple-700">Loan Under $120k</div>
                </div>
                <div className="text-center p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <div className="text-lg font-bold text-indigo-600">{stats.flagDetails.judicialForeclosureStates}</div>
                  <div className="text-xs text-indigo-700">Judicial States</div>
                </div>
                <div className="text-center p-3 bg-pink-50 rounded-lg border border-pink-200">
                  <div className="text-lg font-bold text-pink-600">{stats.flagDetails.dscrBelow11}</div>
                  <div className="text-xs text-pink-700">DSCR Below 1.1</div>
                </div>
                <div className="text-center p-3 bg-teal-50 rounded-lg border border-teal-200">
                  <div className="text-lg font-bold text-teal-600">{stats.flagDetails.onlyOneBuyer}</div>
                  <div className="text-xs text-teal-700">Only 1 Buyer</div>
                </div>
              </div>
            </div>

            {/* Recent Quotes */}
            <div className="space-y-3">
              <h4 className="font-semibold text-dominion-blue mb-3">Recent Quotes</h4>
              {quotes.length === 0 ? (
                <div className="text-center py-8 text-dominion-gray">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No quotes generated yet</p>
                </div>
              ) : (
                quotes.slice(-10).reverse().map((quote: Quote) => (
                  <div 
                    key={quote.id} 
                    className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors hover:border-dominion-blue/50 hover:shadow-md"
                    onClick={() => handleQuoteClick(quote)}
                  >
                    <div className="mt-1">
                      {quote.isFlagged ? (
                        <Flag className="h-4 w-4 text-red-500" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="font-medium text-dominion-blue">{quote.borrowerName}</h5>
                        <div className="flex items-center space-x-2">
                          {quote.isFlagged && (
                            <Badge className="text-xs bg-red-100 text-red-800 border-red-200">
                              Flagged
                            </Badge>
                          )}
                          <MousePointer className="h-3 w-3 text-dominion-gray opacity-60" />
                          <span className="text-xs text-dominion-gray">
                            {formatDate(quote.timestamp)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-dominion-gray mb-1">{quote.propertyAddress}</p>
                      <div className="text-xs text-dominion-gray">
                        Credit: {quote.creditScore} | DSCR: {quote.dscr.toFixed(2)} | Loan: ${quote.loanAmount.toLocaleString()}
                      </div>
                      {quote.isFlagged && quote.flagReasons.length > 0 && (
                        <div className="mt-2">
                          <div className="flex flex-wrap gap-1">
                            {quote.flagReasons.map((reason, index) => (
                              <Badge key={index} variant="outline" className="text-xs text-red-600 border-red-300">
                                {reason}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default QuoteTracker;


export interface Quote {
  id: string;
  timestamp: Date;
  borrowerName: string;
  propertyAddress: string;
  creditScore: number;
  dscr: number;
  loanAmount: number;
  propertyState: string;
  isFlagged: boolean;
  flagReasons: string[];
}

// Judicial foreclosure states
const JUDICIAL_FORECLOSURE_STATES = [
  'Connecticut', 'Delaware', 'Florida', 'Hawaii', 'Illinois', 'Indiana', 'Iowa', 
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Nebraska', 'New Jersey', 
  'New Mexico', 'New York', 'North Dakota', 'Ohio', 'Oklahoma', 'Pennsylvania', 
  'South Carolina', 'South Dakota', 'Vermont', 'Wisconsin'
];

export const calculateQuoteFlags = (quote: Omit<Quote, 'isFlagged' | 'flagReasons' | 'id' | 'timestamp'>): { isFlagged: boolean; flagReasons: string[] } => {
  const flagReasons: string[] = [];

  // Credit score below 700 (680-699 range)
  if (quote.creditScore >= 680 && quote.creditScore <= 699) {
    flagReasons.push('Credit score in 680-699 range');
  }

  // DSCR under 1.1
  if (quote.dscr < 1.1) {
    flagReasons.push('DSCR under 1.1');
  }

  // Judicial foreclosure states
  if (JUDICIAL_FORECLOSURE_STATES.includes(quote.propertyState)) {
    flagReasons.push('Property in judicial foreclosure state');
  }

  // Loan under $120k
  if (quote.loanAmount < 120000) {
    flagReasons.push('Loan amount under $120k');
  }

  return {
    isFlagged: flagReasons.length > 0,
    flagReasons
  };
};

export const saveQuote = (quoteData: any): Quote => {
  const quotes = getQuotes();
  
  // Calculate DSCR (simplified calculation)
  const monthlyRent = parseFloat(quoteData.marketRent) || 0;
  const monthlyExpenses = (parseFloat(quoteData.monthlyTaxes) || 0) + 
                         (parseFloat(quoteData.monthlyInsurance) || 0) + 
                         (parseFloat(quoteData.monthlyHOA) || 0) + 
                         (parseFloat(quoteData.monthlyFloodInsurance) || 0);
  const netIncome = monthlyRent - monthlyExpenses;
  const loanAmount = parseFloat(quoteData.baseLoanAmount) || parseFloat(quoteData.loanAmount) || 0;
  const estimatedPayment = (loanAmount * 0.006); // Rough estimate at 7.2% annual
  const dscr = estimatedPayment > 0 ? netIncome / estimatedPayment : 0;

  const quoteToCheck = {
    borrowerName: `${quoteData.firstName || ''} ${quoteData.lastName || ''}`.trim() || 'Unknown',
    propertyAddress: `${quoteData.streetAddress || ''} ${quoteData.city || ''} ${quoteData.propertyState || ''}`.trim() || 'Unknown',
    creditScore: parseInt(quoteData.decisionCreditScore) || parseInt(quoteData.creditScore) || 0,
    dscr: dscr,
    loanAmount: loanAmount,
    propertyState: quoteData.propertyState || quoteData.state || ''
  };

  const { isFlagged, flagReasons } = calculateQuoteFlags(quoteToCheck);

  // Check for only 1 buyer showing pricing
  const buyerCount = 1; // This would need to be determined from actual pricing logic
  if (buyerCount === 1) {
    flagReasons.push('Only 1 buyer showing pricing');
  }

  const newQuote: Quote = {
    id: `quote-${Date.now()}`,
    timestamp: new Date(),
    ...quoteToCheck,
    isFlagged: isFlagged || buyerCount === 1,
    flagReasons
  };

  quotes.push(newQuote);
  localStorage.setItem('dominion-quotes', JSON.stringify(quotes));
  
  return newQuote;
};

export const getQuotes = (): Quote[] => {
  const stored = localStorage.getItem('dominion-quotes');
  if (!stored) return [];
  
  try {
    return JSON.parse(stored).map((q: any) => ({
      ...q,
      timestamp: new Date(q.timestamp)
    }));
  } catch {
    return [];
  }
};

export const clearAllQuotes = (): void => {
  localStorage.removeItem('dominion-quotes');
};

export const getQuoteStats = () => {
  const quotes = getQuotes();
  const totalQuotes = quotes.length;
  const flaggedQuotes = quotes.filter(q => q.isFlagged).length;
  
  // Count specific flag types
  const creditUnder699 = quotes.filter(q => 
    q.flagReasons.includes('Credit score in 680-699 range')
  ).length;
  
  const loanUnder120k = quotes.filter(q => 
    q.flagReasons.includes('Loan amount under $120k')
  ).length;
  
  const judicialForeclosureStates = quotes.filter(q => 
    q.flagReasons.includes('Property in judicial foreclosure state')
  ).length;
  
  const dscrBelow11 = quotes.filter(q => 
    q.flagReasons.includes('DSCR under 1.1')
  ).length;
  
  const onlyOneBuyer = quotes.filter(q => 
    q.flagReasons.includes('Only 1 buyer showing pricing')
  ).length;
  
  return {
    totalQuotes,
    flaggedQuotes,
    flaggedPercentage: totalQuotes > 0 ? Math.round((flaggedQuotes / totalQuotes) * 100) : 0,
    flagDetails: {
      creditUnder699,
      loanUnder120k,
      judicialForeclosureStates,
      dscrBelow11,
      onlyOneBuyer
    }
  };
};

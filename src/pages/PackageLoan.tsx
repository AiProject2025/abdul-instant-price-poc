import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PackageLoanForm from "@/components/PackageLoanForm";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, LogOut } from "lucide-react";
import PricingResults from "@/components/PricingResults";
import { transformFormDataForAPI } from "@/utils/pricingPayload";

const PackageLoan = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<"form" | "results">("form");
  const [pricingResults, setPricingResults] = useState<any[]>([]);
  const [ineligibleBuyers, setIneligibleBuyers] = useState<any[]>([]);
  const [flags, setFlags] = useState<string[]>([]);
  const [lastSubmittedFormData, setLastSubmittedFormData] = useState<any>(null);
  const { toast } = useToast();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const parseMoney = (val: any) => {
    if (val === null || val === undefined) return 0;
    const n = parseFloat(val.toString().replace(/[^0-9.-]/g, ""));
    return isNaN(n) ? 0 : n;
  };

  const extractAddressParts = (full: string) => {
    // Expect formats like "1712 Termini Drive Charlotte, NC 28262" or "3200 Lockridge, Kansas City, MO 64128"
    if (!full) return { streetAddress: "", city: "", state: "", zipCode: "" };
    const [streetAndMaybeCity, rest] = full.split(",");
    let streetAddress = streetAndMaybeCity?.trim() || "";

    let city = "";
    let state = "";
    let zipCode = "";

    if (rest) {
      // If has two commas, the first part after first comma is city
      const parts = full.split(",").map((s) => s.trim());
      if (parts.length >= 3) {
        streetAddress = parts[0];
        city = parts[1];
        const stateZip = parts[2];
        const m = stateZip.match(/([A-Z]{2})\s*(\d{5})?/i);
        if (m) {
          state = (m[1] || "").toUpperCase();
          zipCode = m[2] || "";
        }
      } else {
        // One comma case: "Street, ST 12345" (no explicit city)
        const m = rest.trim().match(/([A-Z]{2})\s*(\d{5})?/i);
        if (m) {
          state = (m[1] || "").toUpperCase();
          zipCode = m[2] || "";
        }
      }
    }

    return { streetAddress, city, state, zipCode };
  };

  const getPrimaryProperty = (properties: any[]) => {
    // Choose address with lowest leading street number
    const scored = properties.map((p) => {
      const addr = p.fullPropertyAddress || "";
      const numMatch = addr.trim().match(/^(\d+)/);
      const num = numMatch ? parseInt(numMatch[1], 10) : Number.MAX_SAFE_INTEGER;
      return { property: p, score: num };
    });
    scored.sort((a, b) => a.score - b.score);
    return scored[0]?.property || properties[0];
  };

  const mostCommon = (arr: string[]) => {
    const counts: Record<string, number> = {};
    arr.forEach((v) => {
      const key = (v || "").toString();
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
  };

  const mapPropertyTypeForForm = (t: string) => {
    const s = (t || "").toLowerCase();
    if (s.includes("condo")) return "Condominium";
    if (s.includes("multi")) return "Multifamily";
    if (s.includes("town")) return "Townhouse";
    if (s.includes("single")) return "Single Family";
    return t || "Single Family";
  };

  const handlePackageSubmit = async (data: any) => {
    setIsLoading(true);

    try {
      const props = data.properties || [];
      if (!props.length) throw new Error("No properties in selected package");

      // Validate: Same State Requirement
      // const states = props.map((p: any) => extractAddressParts(p.fullPropertyAddress).state).filter(Boolean);
      // console.log('states test',states)
      // const uniqueStates = Array.from(new Set(states));
      //
      // if (uniqueStates.length !== 1) {
      //   toast({
      //     title: "Package Invalid",
      //     description: "All properties in a portfolio must be in the same state.",
      //     variant: "destructive",
      //   });
      //   return;
      // }

      // Primary property by lowest street number
      const primary = getPrimaryProperty(props);
      const addr = extractAddressParts(primary.fullPropertyAddress);

      // Property type = most common type across portfolio
      const propertyType = mapPropertyTypeForForm(mostCommon(props.map((p: any) => p.structureType)));
      const numberOfUnits = primary.numberOfUnits || 1;

      // Aggregations (portfolio totals)
      const totalPurchasePrice = props.reduce((s: number, p: any) => s + (p.purchasePrice || 0), 0);
      const totalRehabCosts = props.reduce((s: number, p: any) => s + (p.rehabCosts || 0), 0);
      const totalMarketValue = props.reduce((s: number, p: any) => s + (p.currentMarketValue || 0), 0);
      const totalMortgagePayoff = props.reduce((s: number, p: any) => s + (p.existingMortgageBalance || 0), 0);
      const totalAnnualTaxes = props.reduce((s: number, p: any) => s + (p.annualPropertyTaxes || 0), 0);
      const totalAnnualInsurance = props.reduce((s: number, p: any) => s + (p.annualHazardInsurance || 0), 0);
      const totalAnnualFlood = props.reduce((s: number, p: any) => s + (p.annualFloodInsurance || 0), 0);
      const totalAnnualHOA = props.reduce((s: number, p: any) => s + (p.annualHomeOwnersAssociation || p.annualHOAFees || 0), 0);

      // Rent: sum monthly market rents or lease amounts
      const totalMonthlyRent = props.reduce((s: number, p: any) => s + (parseMoney(p.marketRent) || parseMoney(p.currentLeaseAmount)), 0);

      // Earliest purchase date for refinance
      const purchaseDates = props
        .map((p: any) => p.purchaseDate)
        .filter(Boolean)
        .sort();
      const earliestPurchaseDate = purchaseDates[0] || '';

      // Build aggregated form data matching single-quote schema
      const aggregatedFormData: any = {
        // Loan/Portfolio
        loanPurpose: (data.loanPurpose || primary.purposeOfLoan || '').toString(),
        creditScore: data.creditScore || primary.borrowersCreditScore || '',
        crossCollateralLoan: 'Yes',
        numberOfProperties: props.length.toString(),

        // Address (single address rule)
        streetAddress: addr.streetAddress,
        city: addr.city,
        propertyState: addr.state,
        zipCode: addr.zipCode,
        propertyCounty: primary.countyName || '',

        // Property
        propertyType,
        propertyCondition: primary.currentCondition || 'C3',
        numberOfUnits: numberOfUnits.toString(),
        leaseInPlace: 'Yes',
        unit1Rent: totalMonthlyRent.toString(),

        // Expenses (annual)
        annualTaxes: totalAnnualTaxes.toString(),
        annualInsurance: totalAnnualInsurance.toString(),
        annualAssociationFees: totalAnnualHOA.toString(),
        annualFloodInsurance: totalAnnualFlood.toString(),

        // Purchase/Refi specifics
        purchasePrice: totalPurchasePrice.toString(),
        estimatedRehabCost: totalRehabCosts.toString(),
        marketValue: totalMarketValue.toString(),
        hasMortgage: totalMortgagePayoff > 0 ? 'Yes' : 'No',
        mortgagePayoff: totalMortgagePayoff.toString(),
        datePurchased: earliestPurchaseDate,

        // Misc
        yourCompany: primary.entityName || '',
      };

      // Persist for results and document gen
      setLastSubmittedFormData(aggregatedFormData);

      // Apply portfolio rules: filter to primary state and recompute aggregates
      const primaryState = addr.state;
      const includedProps = props.filter((p: any) => extractAddressParts(p.fullPropertyAddress).state === primaryState);
      if (includedProps.length > 0) {
        const distinctTypes = Array.from(new Set(includedProps.map((p: any) => mapPropertyTypeForForm(p.structureType))));
        const totals = includedProps.reduce((acc: any, p: any) => {
          const rent = parseMoney(p.marketRent) || parseMoney(p.currentLeaseAmount);
          acc.purchase += p.purchasePrice || 0;
          acc.rehab += p.rehabCosts || 0;
          acc.mv += p.currentMarketValue || 0;
          acc.payoff += p.existingMortgageBalance || 0;
          acc.taxes += p.annualPropertyTaxes || 0;
          acc.hazard += p.annualHazardInsurance || 0;
          acc.flood += p.annualFloodInsurance || 0;
          acc.rent += rent || 0;
          return acc;
        }, {purchase:0,rehab:0,mv:0,payoff:0,taxes:0,hazard:0,flood:0,rent:0});

        const creditScores = includedProps.map((p:any) => parseInt(p.borrowersCreditScore || '0', 10)).filter((n:number)=>!isNaN(n) && n>0);
        const lowestCredit = creditScores.length ? Math.min(...creditScores) : (aggregatedFormData.creditScore || '');

        aggregatedFormData.numberOfProperties = includedProps.length.toString();
        aggregatedFormData.propertyType = mapPropertyTypeForForm(mostCommon(includedProps.map((p:any)=>p.structureType)));
        aggregatedFormData.propertyTypes = distinctTypes.join(', ');
        aggregatedFormData.unit1Rent = totals.rent.toString();
        aggregatedFormData.annualTaxes = totals.taxes.toString();
        aggregatedFormData.annualInsurance = (totals.hazard).toString();
        aggregatedFormData.annualFloodInsurance = totals.flood.toString();
        aggregatedFormData.annualAssociationFees = includedProps.reduce((s:number,p:any)=> s + (p.annualHomeOwnersAssociation || p.annualHOAFees || 0),0).toString();
        aggregatedFormData.purchasePrice = totals.purchase.toString();
        aggregatedFormData.estimatedRehabCost = totals.rehab.toString();
        aggregatedFormData.marketValue = totals.mv.toString();
        aggregatedFormData.hasMortgage = totals.payoff > 0 ? 'Yes' : 'No';
        aggregatedFormData.mortgagePayoff = totals.payoff.toString();
        aggregatedFormData.creditScore = lowestCredit.toString();

        const dates = includedProps.map((p:any)=>p.purchaseDate).filter(Boolean).sort();
        aggregatedFormData.datePurchased = dates[0] || aggregatedFormData.datePurchased;
      }

      // Redirect to DSCR questionnaire with prefilled portfolio data
      navigate('/quote', { state: { prefill: aggregatedFormData, source: 'package' } });
      toast({ title: 'Portfolio Ready', description: `Prefilled questionnaire for ${props.length}-property package` });
      setIsLoading(false);
      return;

      // Call pricing API using the same endpoint as single quote
      const apiPayload = transformFormDataForAPI(aggregatedFormData);
      const response = await fetch(
        'https://n8n-prod.onrender.com/webhook/59ba939c-b2ff-450f-a9d4-04134eeda0de/instant-pricing/pricing',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(apiPayload),
        }
      );

      if (!response.ok) {
        throw new Error(`Pricing API failed with status: ${response.status}`);
      }

      const pricingResponse = await response.json();

      // Extract eligible results
      const quotesData = pricingResponse.quotes || pricingResponse || {};
      const results = Object.entries(quotesData)
        .filter(([, d]: any) => d.flags && d.flags.length === 0 && d.adjusted_interest_rate)
        .map(([noteBuyer, d]: any) => ({
          lender: 'Dominion Financial',
          noteBuyer,
          product: noteBuyer,
          rate: d.adjusted_interest_rate,
          monthlyPayment: Math.round(d.final_est_payment),
          totalInterest: Math.round(parseFloat(d.loan_amount) * 0.65),
          loanAmount: parseFloat(d.loan_amount),
          dscr: d.final_dscr,
          propertyType: (d.property_type || '').replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          loanPurpose: apiPayload.loan_purpose === 'refinance' ? 'Refinance' : 'Purchase',
          ltv: parseFloat(d.ltv),
          points: d.adjusted_price - 100,
          pppDuration: `${d.rate_lock_period_days} days`,
          refinanceType: apiPayload.refinance_type ? (apiPayload.refinance_type === 'cashout' ? 'Cash Out' : 'Rate/Term') : undefined,
          rateLockDays: d.rate_lock_period_days,
          isLocked: false,
        }))
        .sort((a: any, b: any) => a.rate - b.rate);

      const ineligible = Object.entries(quotesData)
        .filter(([, d]: any) => d.flags && d.flags.length > 0)
        .map(([noteBuyer, d]: any) => ({ noteBuyer, flags: d.flags }));

      setPricingResults(results);
      setIneligibleBuyers(ineligible);
      setFlags(pricingResponse.flags || []);
      setCurrentStep('results');

      toast({
        title: 'Package Priced',
        description: `Received ${results.length} offers for ${props.length}-property portfolio`,
      });
    } catch (error) {
      console.error('Error submitting package:', error);
      toast({
        title: "Error",
        description: "Failed to get package pricing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-indigo-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-200/20 to-blue-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Modern Navigation Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-6">
              <Link to="/" className="flex items-center text-dominion-blue hover:text-dominion-green font-medium transition-all duration-300 hover:drop-shadow-sm group">
                <div className="p-2 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-lg mr-3 group-hover:from-blue-500/20 group-hover:to-blue-600/20 transition-all duration-300">
                  <ArrowLeft className="h-4 w-4" />
                </div>
                Back to Home
              </Link>
              <div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
              <div className="flex items-center">
                <div className="relative">
                  <img src="/lovable-uploads/87eaaf76-9665-4138-b3ce-aefec128e3db.png" alt="Dominion Financial" className="h-10 mr-3 drop-shadow-lg" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent rounded blur-sm"></div>
                </div>
              </div>
            </div>
            <nav className="flex space-x-4 items-center">
              <Link to="/" className="flex items-center text-dominion-blue hover:text-dominion-green font-medium transition-all duration-300 hover:drop-shadow-sm px-3 py-2 rounded-lg hover:bg-white/30">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
              <Link to="/quote" className="flex items-center text-dominion-blue hover:text-dominion-green font-medium transition-all duration-300 hover:drop-shadow-sm px-3 py-2 rounded-lg hover:bg-white/30">
                Single Quote
              </Link>
              <Button
                onClick={signOut}
                variant="outline"
                size="sm"
                className="text-dominion-blue border-dominion-blue/30 bg-white/50 backdrop-blur-sm hover:bg-dominion-blue hover:text-white transition-all duration-300"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {currentStep === 'form' && (
              <>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Package Loan Application
                  </h1>
                  <p className="text-gray-600">
                    Process multiple properties for comprehensive loan analysis
                  </p>
                </div>
                <PackageLoanForm onSubmit={handlePackageSubmit} isLoading={isLoading} />
              </>
            )}

            {currentStep === 'results' && (
              <PricingResults
                results={pricingResults}
                flags={flags}
                ineligibleBuyers={ineligibleBuyers}
                onGenerateLoanQuote={() => {}}
                onBackToForm={() => setCurrentStep('form')}
                lastSubmittedFormData={lastSubmittedFormData}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageLoan;
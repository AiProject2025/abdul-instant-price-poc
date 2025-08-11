import { useState } from "react";
import { Link } from "react-router-dom";
import PackageLoanForm from "@/components/PackageLoanForm";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, LogOut } from "lucide-react";
import PricingResults from "@/components/PricingResults";
import LoanPassView from "@/components/LoanPassView";
import { transformFormDataForAPI } from "@/utils/pricingPayload";

const PackageLoan = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<"form" | "review" | "results">("form");
  const [pricingResults, setPricingResults] = useState<any[]>([]);
  const [ineligibleBuyers, setIneligibleBuyers] = useState<any[]>([]);
  const [flags, setFlags] = useState<string[]>([]);
  const [lastSubmittedFormData, setLastSubmittedFormData] = useState<any>(null);
  const [reviewData, setReviewData] = useState<any | null>(null);
  const [fieldSources, setFieldSources] = useState<Record<string, "tape" | "derived" | "default" | "manualRequired">>({});
  const { toast } = useToast();
  const { signOut } = useAuth();

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

      // Removed same-state requirement per project update


      // Primary property by lowest street number
      const primary = getPrimaryProperty(props);
      const addr = extractAddressParts(primary.fullPropertyAddress);

      // Property type - most restrictive: any Multi-Family => Multi-Family, else any Condo => Condominium, else Townhome, else Single Family
      const hasMF = props.some((p: any) => (p.structureType || "").toLowerCase().includes("multi"));
      const hasCondo = props.some((p: any) => (p.structureType || "").toLowerCase().includes("condo"));
      const hasTown = props.some((p: any) => (p.structureType || "").toLowerCase().includes("town"));
      const propertyType = hasMF ? "Multi-Family" : hasCondo ? "Condominium" : hasTown ? "Townhouse" : "Single Family";

      // Units come from primary property
      const numberOfUnits = (primary.numberOfUnits || 1).toString();

      // Aggregations (portfolio totals)
      const toNum = (v: any) => {
        if (v === null || v === undefined) return 0;
        const n = parseFloat(v.toString().replace(/[^0-9.\-]/g, ""));
        return isNaN(n) ? 0 : n;
      };

      const sum = (arr: any[], key: string) => arr.reduce((s, p: any) => s + toNum(p[key]), 0);

      const totalPurchasePrice = sum(props, "purchasePrice");
      const totalRehabCosts = sum(props, "rehabCosts");
      const totalMarketValue = sum(props, "currentMarketValue");
      const totalMortgagePayoff = sum(props, "existingMortgageBalance");
      const totalAnnualTaxes = sum(props, "annualPropertyTaxes");
      const totalAnnualInsurance = sum(props, "annualHazardInsurance");
      const totalAnnualFlood = sum(props, "annualFloodInsurance");
      const totalAnnualHOA = sum(props, "annualHomeOwnersAssociation");
      const totalSquareFeet = sum(props, "squareFootage");

      // Rent: sum monthly market rents or lease amounts
      const totalMonthlyRent = props.reduce((s: number, p: any) => s + (toNum(p.marketRent) || toNum(p.currentLeaseAmount)), 0);

      // Earliest purchase date for refinance
      const purchaseDates = props
        .map((p: any) => p.purchaseDate)
        .filter(Boolean)
        .sort();
      const earliestPurchaseDate = purchaseDates[0] || "";

      // Borrower score: lowest across properties, or from form-level
      const scores = props
        .map((p: any) => toNum(p.borrowersCreditScore))
        .filter((n: number) => n > 0);
      const decisionCreditScore = scores.length ? Math.min(...scores) : toNum(data.creditScore);

      // Derivations/defaults per guidance
      const occupancyValues = props.map((p: any) => (p.currentOccupancyStatus || "").toLowerCase());
      const inferredLeaseInPlace = occupancyValues.some((v) => v.includes("lease") || v.includes("leased")) ? "Yes" : "No";

      const rural = props.some((p: any) => (p.isRural || "").toString().toLowerCase() === "yes") ? "Yes" : "No";

      // Field sources tracker
      const sources: Record<string, "tape" | "derived" | "default" | "manualRequired"> = {};

      const review: any = {
        // Borrower
        entityOrPersonal: "", // manual
        citizenshipType: "", // manual
        decisionCreditScore: decisionCreditScore ? decisionCreditScore.toString() : "",

        // Property
        state: addr.state,
        county: primary.countyName || "",
        zipCode: addr.zipCode,
        streetAddress: addr.streetAddress,
        city: addr.city,
        propertyType,
        numberOfUnits,
        propertyCondition: primary.currentCondition || "",
        ruralProperty: rural,
        decliningMarkets: "", // manual
        propertySquareFootage: totalSquareFeet ? totalSquareFeet.toString() : "",

        // Conditional
        condoApprovalType: propertyType === "Condominium" ? "" : "",

        // Dates
        datePurchased: earliestPurchaseDate || null,

        // Financial (monthly for UX)
        marketRent: totalMonthlyRent ? totalMonthlyRent.toString() : "",
        monthlyTaxes: Math.round(totalAnnualTaxes / 12).toString(),
        monthlyInsurance: Math.round(totalAnnualInsurance / 12).toString(),
        monthlyHOASpecialAssess: Math.round(totalAnnualHOA / 12).toString(),
        monthlyFloodInsurance: Math.round(totalAnnualFlood / 12).toString(),

        // Loan Details
        crossCollateralized: "No", // default
        interestOnly: "No", // default
        loanPurpose: (data.loanPurpose || primary.purposeOfLoan || "").toString(),
        refinanceType: "",
        appraisedValue: totalMarketValue ? totalMarketValue.toString() : "",
        purchasePrice: totalPurchasePrice ? totalPurchasePrice.toString() : "",
        rehabCost: totalRehabCosts ? totalRehabCosts.toString() : "",
        hasMortgage: totalMortgagePayoff > 0 ? "Yes" : "No",
        mortgagePayoff: totalMortgagePayoff ? totalMortgagePayoff.toString() : "",
        interestReserves: "0", // default to 0 months
        inPlaceLease: inferredLeaseInPlace,
        shortTermRental: "No", // default lease structure -> Long-term
        section8: "No", // default

        numberOfPropertiesOnLoan: props.length.toString(),
      };

      // Populate sources map
      sources.decision_credit_score = decisionCreditScore ? "derived" : "manualRequired";
      sources.property_type = "derived";
      sources.number_of_units = "derived";
      sources.total_square_feet = totalSquareFeet ? "derived" : "manualRequired";
      sources.property_condition = primary.currentCondition ? "tape" : "manualRequired";
      sources.rural = rural ? "derived" : "manualRequired";
      sources.declining_market = "manualRequired";
      sources.condo_approval_type = propertyType === "Condominium" ? "manualRequired" : "derived";
      sources.loan_purpose = review.loanPurpose ? "tape" : "manualRequired";
      sources.purchase_price = totalPurchasePrice ? "derived" : "manualRequired";
      sources.market_value = totalMarketValue ? "derived" : "manualRequired";
      sources.desired_ltv = "manualRequired";
      sources.rehab_cost = totalRehabCosts ? "derived" : "manualRequired";
      sources.has_mortgage = "derived";
      sources.mortgage_payoff = review.hasMortgage === "Yes" ? (totalMortgagePayoff ? "derived" : "manualRequired") : "derived";
      sources.cross_collateral_loan = "default";
      sources.interest_only = "default";
      sources.market_rent = totalMonthlyRent ? "derived" : "manualRequired";
      sources.lease_in_place = inferredLeaseInPlace ? "derived" : "manualRequired";
      sources.lease_structure = "default";
      sources.section_8 = "default";
      sources.annual_taxes = totalAnnualTaxes ? "derived" : "manualRequired";
      sources.annual_insurance = totalAnnualInsurance ? "derived" : "manualRequired";
      sources.annual_association_fees = totalAnnualHOA ? "derived" : "manualRequired";
      sources.annual_flood_insurance = totalAnnualFlood ? "derived" : "manualRequired";
      sources.state = addr.state ? "tape" : "manualRequired";
      sources.county = review.county ? "tape" : "manualRequired";
      sources.interest_reserves = "default";
      sources.us_citizen = "manualRequired";
      sources.borrower_type = "manualRequired";

      setReviewData(review);
      setFieldSources(sources);
      setCurrentStep("review");

      toast({
        title: "Review Required",
        description: "Confirm required LoanPASS fields before pricing.",
      });
    } catch (error) {
      console.error("Error preparing review:", error);
      toast({
        title: "Error",
        description: "Failed to prepare review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewSubmit = async (form: any) => {
    // Validate required items
    const requiredChecks: Array<[string, any]> = [
      ["citizenshipType", form.citizenshipType],
      ["entityOrPersonal", form.entityOrPersonal],
      ["decisionCreditScore", form.decisionCreditScore],
      ["propertyType", form.propertyType],
      ["numberOfUnits", form.numberOfUnits],
      ["propertySquareFootage", form.propertySquareFootage],
      ["state", form.state],
      ["county", form.county],
      ["loanPurpose", form.loanPurpose],
      ["appraisedValue", form.appraisedValue],
      ["marketRent", form.marketRent],
      ["monthlyTaxes", form.monthlyTaxes],
      ["monthlyInsurance", form.monthlyInsurance],
      ["monthlyHOASpecialAssess", form.monthlyHOASpecialAssess],
      ["monthlyFloodInsurance", form.monthlyFloodInsurance],
    ];

    const missing = requiredChecks.filter(([_, v]) => v === undefined || v === null || v === "" || v === 0).map(([k]) => k);
    if (missing.length) {
      toast({
        title: "Missing Required Fields",
        description: `Please complete: ${missing.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Map LoanPassView form to pricing payload shape
      const aggregatedFormData: any = {
        // Borrower
        closingType: form.entityOrPersonal, // Entity | Personal
        usCitizen: form.citizenshipType === "US Citizen" ? "Yes" : "No",
        creditScore: form.decisionCreditScore,
        yourCompany: form.businessName || "",

        // Address
        streetAddress: form.streetAddress,
        city: form.city,
        propertyState: (form.state || "").split(" ").pop(),
        zipCode: form.zipCode,
        propertyCounty: form.county,

        // Property
        propertyType: form.propertyType,
        numberOfUnits: form.numberOfUnits,
        propertyCondition: form.propertyCondition || "",
        rural: form.ruralProperty,
        decliningMarket: form.decliningMarkets || "No",
        totalSquareFeet: form.propertySquareFootage,

        // Loan
        loanPurpose: form.loanPurpose,
        purchasePrice: form.purchasePrice,
        estimatedRehabCost: form.rehabCost,
        marketValue: form.appraisedValue,
        desiredLTV: form.desiredLTV || "",
        crossCollateralLoan: form.crossCollateralized,
        interestOnly: form.interestOnly,
        interestReserves: form.interestReserves || "0",

        // Refi specifics
        hasMortgage: form.hasMortgage || (parseMoney(form.mortgagePayoff) > 0 ? "Yes" : "No"),
        mortgagePayoff: form.mortgagePayoff || "0",
        refinanceType: form.refinanceType || "",
        datePurchased: form.datePurchased || "",

        // Income/DSCR
        marketRent: form.marketRent,
        hasVacantUnits: undefined,
        leaseInPlace: form.inPlaceLease || "No",
        leaseStructure: form.shortTermRental === "Yes" ? "Short Term" : "Long Term",
        section8Lease: form.section8 || "No",

        // Expenses (annual)
        annualTaxes: (12 * parseMoney(form.monthlyTaxes)).toString(),
        annualInsurance: (12 * parseMoney(form.monthlyInsurance)).toString(),
        annualAssociationFees: (12 * parseMoney(form.monthlyHOASpecialAssess)).toString(),
        annualFloodInsurance: (12 * parseMoney(form.monthlyFloodInsurance)).toString(),
      };

      const apiPayload = transformFormDataForAPI(aggregatedFormData);

      const response = await fetch(
        "https://n8n-prod.onrender.com/webhook/59ba939c-b2ff-450f-a9d4-04134eeda0de/instant-pricing/pricing",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(apiPayload),
        }
      );

      if (!response.ok) {
        throw new Error(`Pricing API failed with status: ${response.status}`);
      }

      const pricingResponse = await response.json();
      const quotesData = pricingResponse.quotes || pricingResponse || {};
      const results = Object.entries(quotesData)
        .filter(([, d]: any) => d.flags && d.flags.length === 0 && d.adjusted_interest_rate)
        .map(([noteBuyer, d]: any) => ({
          lender: "Dominion Financial",
          noteBuyer,
          product: noteBuyer,
          rate: d.adjusted_interest_rate,
          monthlyPayment: Math.round(d.final_est_payment),
          totalInterest: Math.round(parseFloat(d.loan_amount) * 0.65),
          loanAmount: parseFloat(d.loan_amount),
          dscr: d.final_dscr,
          propertyType: (d.property_type || "").replace("-", " ").replace(/\b\w/g, (l: string) => l.toUpperCase()),
          loanPurpose: apiPayload.loan_purpose === "refinance" ? "Refinance" : "Purchase",
          ltv: parseFloat(d.ltv),
          points: d.adjusted_price - 100,
          pppDuration: `${d.rate_lock_period_days} days`,
          refinanceType: apiPayload.refinance_type ? (apiPayload.refinance_type === "cashout" ? "Cash Out" : "Rate/Term") : undefined,
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
      setLastSubmittedFormData(aggregatedFormData);
      setCurrentStep("results");

      toast({
        title: "Package Priced",
        description: `Received ${results.length} offers`,
      });
    } catch (error) {
      console.error("Error submitting pricing:", error);
      toast({
        title: "Error",
        description: "Failed to get package pricing. Please review and try again.",
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

            {currentStep === 'review' && reviewData && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <aside className="md:col-span-1">
                  <div className="bg-white rounded-lg border p-4">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Review Checklist</h2>
                    <div className="space-y-4 text-sm">
                      <div>
                        <div className="font-medium text-gray-800 mb-1">Manual input required</div>
                        <ul className="list-disc list-inside text-gray-700">
                          {Object.entries(fieldSources)
                            .filter(([_, v]) => v === 'manualRequired')
                            .map(([k]) => (
                              <li key={k}>{k.replace(/_/g, ' ')}</li>
                            ))}
                        </ul>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 mb-1">Defaults applied</div>
                        <ul className="list-disc list-inside text-gray-700">
                          {Object.entries(fieldSources)
                            .filter(([_, v]) => v === 'default')
                            .map(([k]) => (
                              <li key={k}>{k.replace(/_/g, ' ')}</li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </aside>
                <div className="md:col-span-3">
                  <LoanPassView
                    onBack={() => setCurrentStep('form')}
                    onSubmit={handleReviewSubmit}
                    isLoading={isLoading}
                    initialData={reviewData}
                  />
                </div>
              </div>
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
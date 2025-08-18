import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PackageLoanForm from "@/components/PackageLoanForm";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import PricingResults from "@/components/PricingResults";
import ModernNavigation from "@/components/ModernNavigation";

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

    // Helper function to flatten webhook output data
    const flattenWebhookOutput = (webhookData: any) => {
        if (!webhookData) return {};

        // If there's an output field, merge it with the top-level fields
        if (webhookData.output && typeof webhookData.output === 'object') {
            const { output, ...topLevelFields } = webhookData;
            const flattened = { ...topLevelFields, ...output };

            console.log('Flattening webhook data from:', webhookData);
            console.log('Flattened webhook data to:', flattened);

            return flattened;
        }

        return webhookData;
    };

    const handlePackageSubmit = async (data: any) => {
        setIsLoading(true);

        try {
            const props = data.properties || [];
            if (!props.length) throw new Error("No properties in selected package");

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
                loanPurpose: (() => {
                    const v = (data.loanPurpose || primary.purposeOfLoan || '').toString();
                    const s = v.toLowerCase();
                    if (s.includes('refi')) return 'Refinance';
                    if (s.includes('refinance')) return 'Refinance';
                    return 'Purchase';
                })(),
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
            
            console.log(`Original package size: ${props.length} properties`);
            console.log(`Properties in primary state (${primaryState}): ${includedProps.length} properties`);
            
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

                // Update aggregated form data with filtered/recalculated values
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
                
                // Recalculate LTV based on updated totals - for refinance loans only
                if (totals.mv > 0 && totals.payoff > 0) {
                    const recalculatedLTV = Math.round((totals.payoff / totals.mv) * 100);
                    aggregatedFormData.desiredLTV = recalculatedLTV.toString();
                    console.log('✅ Recalculated LTV for included properties:', recalculatedLTV, '% (Market Value:', totals.mv, 'Mortgage:', totals.payoff, ')');
                } else if (totals.mv > 0) {
                    // For purchase loans, calculate based on loan amount to market value ratio
                    const loanAmount = totals.purchase + totals.rehab - totals.payoff;
                    if (loanAmount > 0) {
                        const purchaseLTV = Math.round((loanAmount / totals.mv) * 100);
                        aggregatedFormData.desiredLTV = Math.min(purchaseLTV, 80).toString(); // Cap at 80% for purchase
                        console.log('✅ Calculated LTV for purchase package:', aggregatedFormData.desiredLTV, '% (Loan Amount:', loanAmount, 'Market Value:', totals.mv, ')');
                    }
                }
                
                console.log('✅ Final aggregated form data with', includedProps.length, 'properties and LTV:', aggregatedFormData.desiredLTV);
            } else {
                // Calculate LTV using original totals if no portfolio filtering occurred
                const calculatedMarketValue = totalMarketValue || parseInt(aggregatedFormData.marketValue) || 0;
                const calculatedMortgageBalance = totalMortgagePayoff || parseInt(aggregatedFormData.mortgagePayoff) || 0;
                
                if (calculatedMarketValue > 0 && calculatedMortgageBalance > 0) {
                    const calculatedLTV = Math.round((calculatedMortgageBalance / calculatedMarketValue) * 100);
                    aggregatedFormData.desiredLTV = calculatedLTV.toString();
                    console.log('✅ Calculated LTV for unfiltered package:', calculatedLTV, '% (Market Value:', calculatedMarketValue, 'Mortgage:', calculatedMortgageBalance, ')');
                }
                console.log('✅ Using original package data with', props.length, 'properties and LTV:', aggregatedFormData.desiredLTV);
            }

            // Store calculated values before webhook merge to preserve them
            const calculatedValues = {
                numberOfProperties: aggregatedFormData.numberOfProperties,
                desiredLTV: aggregatedFormData.desiredLTV
            };

            // Merge webhook output if provided by form - FIXED: Flatten the data properly
            if ((data as any).webhookOutput) {
                const flattenedWebhookData = flattenWebhookOutput((data as any).webhookOutput);
                Object.assign(aggregatedFormData, flattenedWebhookData);
                console.log('Merged flattened webhook data:', aggregatedFormData);
            }

            // Restore calculated values after webhook merge to ensure they're not overwritten
            if (calculatedValues.numberOfProperties) {
                aggregatedFormData.numberOfProperties = calculatedValues.numberOfProperties;
                console.log('✅ Preserved numberOfProperties:', calculatedValues.numberOfProperties);
            }
            if (calculatedValues.desiredLTV) {
                aggregatedFormData.desiredLTV = calculatedValues.desiredLTV;
                console.log('✅ Preserved desiredLTV:', calculatedValues.desiredLTV);
            }

            // Normalize loan purpose after merge to match DSCR form options
            if (aggregatedFormData.loanPurpose) {
                const s = aggregatedFormData.loanPurpose.toString().toLowerCase();
                aggregatedFormData.loanPurpose = s.includes('refi') ? 'Refinance' : 'Purchase';
            }

            // Redirect to DSCR questionnaire with prefilled portfolio data
            navigate('/quote?packageLoan=true', { state: { prefill: aggregatedFormData, source: 'package' } });
            toast({ title: 'Portfolio Ready', description: `Prefilled questionnaire for ${props.length}-property package` });
            setIsLoading(false);
            return;

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

            {/* Modern Navigation - Using consistent ModernNavigation component */}
            <ModernNavigation />

            {/* Main Content */}
            <main className="relative z-10 flex-1 pt-24">
                {currentStep === "form" ? (
                    <PackageLoanForm 
                        onSubmit={handlePackageSubmit} 
                        isLoading={isLoading}
                    />
                ) : (
                    <PricingResults 
                        results={pricingResults}
                        flags={flags}
                        ineligibleBuyers={ineligibleBuyers}
                        onGenerateLoanQuote={() => {}}
                        onBackToForm={() => setCurrentStep("form")}
                    />
                )}
            </main>
        </div>
    );
};

export default PackageLoan;

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, User, Home, Calculator } from "lucide-react";
import { statesAndCounties } from "@/utils/locationData";

const dscrFormSchema = z.object({
  // Borrower Information
  borrowerName: z.string().min(1, "Borrower name is required"),
  entityName: z.string().optional(),
  entityClosing: z.enum(["yes", "no"]),
  firstTimeInvestor: z.enum(["yes", "no"]),
  citizenshipType: z.string().min(1, "Citizenship type is required"),
  creditScore: z.string().min(1, "Credit score is required"),
  monthsOfReserves: z.string().min(1, "Months of reserves is required"),
  creditEvent: z.enum(["yes", "no"]),
  mortgageLatePayments: z.enum(["yes", "no"]),

  // Property Information
  propertyAddress: z.string().min(1, "Property address is required"),
  propertyCity: z.string().min(1, "Property city is required"),
  propertyState: z.string().min(1, "Property state is required"),
  propertyCounty: z.string().min(1, "Property county is required"),
  propertyZip: z.string().min(5, "Property ZIP code is required"),
  propertyType: z.string().min(1, "Property type is required"),
  numberOfUnits: z.string().min(1, "Number of units is required"),
  numberOfLeasedUnits: z.string().min(1, "Number of leased units is required"),
  propertyCondition: z.string().min(1, "Property condition is required"),
  vacant: z.enum(["yes", "no"]),
  shortTermRental: z.enum(["yes", "no"]),
  section8: z.enum(["yes", "no"]),
  ruralProperty: z.enum(["yes", "no"]),
  decliningMarkets: z.enum(["yes", "no"]),
  propertySquareFootage: z.string().min(1, "Property square footage is required"),
  acquisitionDate: z.string().min(1, "Acquisition date is required"),
  expectedClosingDate: z.string().min(1, "Expected closing date is required"),
  existingDebt: z.enum(["yes", "no"]),
  marketRent: z.string().min(1, "Market rent is required"),
  inPlaceLease: z.string().min(1, "In-place lease amount is required"),
  monthlyTaxes: z.string().min(1, "Monthly taxes are required"),
  monthlyInsurance: z.string().min(1, "Monthly insurance is required"),
  monthlyHoa: z.string().default("0"),
  monthlyFloodInsurance: z.string().default("0"),

  // Loan Details
  crossCollateralized: z.enum(["yes", "no"]),
  interestOnly: z.enum(["yes", "no"]),
  loanPurpose: z.string().min(1, "Loan purpose is required"),
  refinanceType: z.string().optional(),
  cashOutAmount: z.string().optional(),
  delayedPurchase: z.enum(["yes", "no"]),
  appraisedValue: z.string().min(1, "Appraised value is required"),
  thirdPartyValuationStatus: z.string().min(1, "Third party valuation status is required"),
  purchasePrice: z.string().optional(),
  rehabCost: z.string().default("0"),
  baseLoanAmount: z.string().min(1, "Base loan amount is required"),
  interestReserves: z.enum(["yes", "no"]),
  originationPoints: z.string().min(1, "Origination points is required"),
  prepaymentPenaltyTerm: z.string().min(1, "Prepayment penalty term is required"),
  prepaymentPenaltyStructure: z.string().min(1, "Prepayment penalty structure is required"),
  loanTerm: z.string().min(1, "Loan term is required"),
});

type DSCRFormData = z.infer<typeof dscrFormSchema>;

interface DSCRFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
}

const DSCRForm = ({ initialData, onSubmit, isLoading }: DSCRFormProps) => {
  const [selectedState, setSelectedState] = useState<string>("");
  const [availableCounties, setAvailableCounties] = useState<string[]>([]);

  const form = useForm<DSCRFormData>({
    resolver: zodResolver(dscrFormSchema),
    defaultValues: {
      borrowerName: initialData?.borrowerName || "",
      entityName: initialData?.entityName || "",
      entityClosing: "no",
      firstTimeInvestor: "no",
      citizenshipType: "US Citizen",
      creditScore: initialData?.creditScore || "",
      monthsOfReserves: initialData?.monthsOfReserves || "",
      creditEvent: "no",
      mortgageLatePayments: "no",
      propertyAddress: initialData?.propertyAddress || "",
      propertyCity: initialData?.propertyCity || "",
      propertyState: "",
      propertyCounty: "",
      propertyZip: "",
      propertyType: initialData?.propertyType || "",
      numberOfUnits: initialData?.numberOfUnits || "",
      numberOfLeasedUnits: initialData?.numberOfUnits || "",
      propertyCondition: "C1",
      vacant: "no",
      shortTermRental: "no",
      section8: "no",
      ruralProperty: "no",
      decliningMarkets: "no",
      propertySquareFootage: "2000",
      acquisitionDate: "",
      expectedClosingDate: "",
      existingDebt: "no",
      marketRent: initialData?.marketRent || "",
      inPlaceLease: initialData?.marketRent || "",
      monthlyTaxes: initialData?.monthlyTaxes || "",
      monthlyInsurance: initialData?.monthlyInsurance || "",
      monthlyHoa: "0",
      monthlyFloodInsurance: "0",
      crossCollateralized: "no",
      interestOnly: "no",
      loanPurpose: "refinance",
      refinanceType: "cash-out",
      cashOutAmount: "25000",
      delayedPurchase: "no",
      appraisedValue: initialData?.appraisedValue || "",
      thirdPartyValuationStatus: "pending",
      purchasePrice: "",
      rehabCost: "0",
      baseLoanAmount: initialData?.loanAmount || "",
      interestReserves: "yes",
      originationPoints: "2.000",
      prepaymentPenaltyTerm: "5 Year",
      prepaymentPenaltyStructure: "Step-Down",
      loanTerm: "360",
    },
  });

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    const counties = statesAndCounties[state] || [];
    setAvailableCounties(counties);
    form.setValue("propertyState", state);
    form.setValue("propertyCounty", "");
  };

  const handleSubmit = (data: DSCRFormData) => {
    onSubmit(data);
  };

  if (isLoading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-12 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-dominion-blue mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-dominion-blue mb-2">Processing Your Request</h3>
          <p className="text-dominion-gray">Getting pricing from multiple notebuyers...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-dominion-blue mb-4">
          DSCR Loan Information
        </h1>
        <p className="text-lg text-dominion-gray">
          {initialData ? "Review and complete the extracted information" : "Enter your loan details to get pricing"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Tabs defaultValue="borrower" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="borrower" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Borrower
              </TabsTrigger>
              <TabsTrigger value="property" className="flex items-center">
                <Home className="mr-2 h-4 w-4" />
                Property
              </TabsTrigger>
              <TabsTrigger value="loan" className="flex items-center">
                <Calculator className="mr-2 h-4 w-4" />
                Loan Details
              </TabsTrigger>
            </TabsList>

            {/* Borrower Information Tab */}
            <TabsContent value="borrower">
              <Card>
                <CardHeader>
                  <CardTitle>Borrower Information</CardTitle>
                  <CardDescription>Enter borrower details and qualifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="borrowerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Borrower Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="entityName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Entity Name (if applicable)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="entityClosing"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Closing under entity or personal name?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="yes">Entity</SelectItem>
                              <SelectItem value="no">Personal</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="firstTimeInvestor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Time Investor</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="citizenshipType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Citizenship Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="US Citizen">US Citizen</SelectItem>
                              <SelectItem value="Permanent Resident">Permanent Resident</SelectItem>
                              <SelectItem value="Non-Resident Alien">Non-Resident Alien</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="creditScore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Decision Credit Score</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="800">800+</SelectItem>
                              <SelectItem value="780">780-799</SelectItem>
                              <SelectItem value="760">760-779</SelectItem>
                              <SelectItem value="740">740-759</SelectItem>
                              <SelectItem value="720">720-739</SelectItem>
                              <SelectItem value="700">700-719</SelectItem>
                              <SelectItem value="680">680-699</SelectItem>
                              <SelectItem value="660">660-679</SelectItem>
                              <SelectItem value="640">640-659</SelectItem>
                              <SelectItem value="620">620-639</SelectItem>
                              <SelectItem value="600">600-619</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="monthsOfReserves"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Months of Reserves</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="6">6 months</SelectItem>
                              <SelectItem value="12">12 months</SelectItem>
                              <SelectItem value="18">18 months</SelectItem>
                              <SelectItem value="24">24 months</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="creditEvent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Credit Event</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="mortgageLatePayments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mortgage Late Payments</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Property Information Tab */}
            <TabsContent value="property">
              <Card>
                <CardHeader>
                  <CardTitle>Property Information</CardTitle>
                  <CardDescription>Enter property details and location</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="propertyAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="propertyCity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="propertyState"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <Select onValueChange={handleStateChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.keys(statesAndCounties).map((state) => (
                                <SelectItem key={state} value={state}>
                                  {state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="propertyZip"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP Code</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="propertyCounty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>County</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select county" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableCounties.map((county) => (
                              <SelectItem key={county} value={county}>
                                {county}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="propertyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Single Family">Single Family</SelectItem>
                              <SelectItem value="Condo">Condo</SelectItem>
                              <SelectItem value="Townhouse">Townhouse</SelectItem>
                              <SelectItem value="2-4 Units">2-4 Units</SelectItem>
                              <SelectItem value="5+ Units">5+ Units</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="numberOfUnits"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Units</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="marketRent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Market Rent ($)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="inPlaceLease"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>In-Place Lease ($)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="monthlyTaxes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Taxes ($)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="monthlyInsurance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Insurance ($)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="monthlyHoa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly HOA ($)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Loan Details Tab */}
            <TabsContent value="loan">
              <Card>
                <CardHeader>
                  <CardTitle>Loan Details</CardTitle>
                  <CardDescription>Specify loan requirements and terms</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="loanPurpose"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loan Purpose</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="purchase">Purchase</SelectItem>
                              <SelectItem value="refinance">Refinance</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="loanTerm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Desired Loan Term</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="360">360 months</SelectItem>
                              <SelectItem value="300">300 months</SelectItem>
                              <SelectItem value="240">240 months</SelectItem>
                              <SelectItem value="180">180 months</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="appraisedValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Appraised Value ($)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="baseLoanAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Base Loan Amount ($)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="interestOnly"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Interest Only</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="prepaymentPenaltyTerm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prepayment Penalty Term</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="5 Year">5 Year</SelectItem>
                              <SelectItem value="3 Year">3 Year</SelectItem>
                              <SelectItem value="1 Year">1 Year</SelectItem>
                              <SelectItem value="No Prepayment">No Prepayment</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="bg-dominion-green hover:bg-dominion-green/90 text-white px-8 py-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting Pricing...
                </>
              ) : (
                "Get Loan Pricing"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default DSCRForm;

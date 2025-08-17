import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Loader2, FileSpreadsheet, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import ClientSearch from "./ClientSearch";
import { ClientWithProperties } from "@/hooks/useClients";

interface QuestionnaireUploadProps {
  onFileUpload: (file: File) => void;
  onManualEntry: () => void;
  onClientSelect?: (client: ClientWithProperties) => void;
  onDataTapeUpload: (file: File) => void;
  isLoading: boolean;
  skipDataTapeDialog?: boolean;
}
const QuestionnaireUpload = ({
  onFileUpload,
  onManualEntry,
  onClientSelect,
  onDataTapeUpload,
  isLoading,
  skipDataTapeDialog = false
}: QuestionnaireUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [dataTapeDragActive, setDataTapeDragActive] = useState(false);
  const [showDataTapeDialog, setShowDataTapeDialog] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isProcessingDataTape, setIsProcessingDataTape] = useState(false);
  const navigate = useNavigate();
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  }, [onFileUpload]);
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  const handleDataTapeDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDataTapeDragActive(true);
    } else if (e.type === "dragleave") {
      setDataTapeDragActive(false);
    }
  }, []);

  const processDataTapeForPackage = async (file: File) => {
    setIsProcessingDataTape(true);
    try {
      // Send to n8n to parse and normalize the portfolio
      const fd = new FormData();
      fd.append('file', file);

      const res = await fetch('https://n8n-prod.onrender.com/webhook/b86054ef-0fd4-43b2-8099-1f2269c7946a', {
        method: 'POST',
        body: fd,
      });

      if (!res.ok) {
        throw new Error(`Data tape API failed with status: ${res.status}`);
      }

      const payload = await res.json();
      const list: any[] = payload?.output || payload || [];

      const mapStructureType = (s?: string) => {
        const t = (s || '').toLowerCase();
        if (t.includes('single')) return 'Single Family';
        if (t.includes('duplex')) return 'Duplex';
        if (t.includes('triplex') || t.includes('fourplex') || t.includes('plex')) return 'Multi-Family';
        if (t.includes('condo')) return 'Condo';
        if (t.includes('town')) return 'Townhome';
        if (t.includes('manufactured') || t.includes('mobile')) return 'Single Family';
        return s || '';
      };
      const mapOccupancy = (s?: string) => {
        const t = (s || '').toLowerCase();
        if (t.includes('tenant')) return 'Leased';
        if (t.includes('owner')) return 'Owner Occupied';
        if (t.includes('vacant')) return 'Vacant';
        if (t.includes('mtm') || t.includes('month')) return 'MTM';
        return '';
      };
      const dollars = (n: any) => {
        const v = Number(n) || 0;
        return v > 0 ? `$${Math.round(v).toLocaleString()}` : '';
      };

      const properties = list.map((item, idx) => ({
        id: `property-${Date.now()}-${idx}`,
        fullPropertyAddress: item.full_property_address || '',
        countyName: item.county_name || '',
        structureType: mapStructureType(item.structure_type),
        numberOfUnits: undefined,
        squareFootage: 0,
        sqfType: '',
        condo: item.condo ? 'Yes' : 'No',
        legalNonConforming: 'No',
        isRural: 'no',
        borrowersCreditScore: (item.borrower_credit_score ?? '').toString(),
        purposeOfLoan: (item.purpose_of_loan || '').includes('Refinance') ? (item.purpose_of_loan?.includes('Cash-Out') ? 'Cash-Out' : 'Refinance') : 'Purchase',
        purchaseDate: item.purchase_date || '',
        purchasePrice: Number(item.purchase_price) || 0,
        rehabCosts: Number(item.rehab_costs) || 0,
        currentMarketValue: Number(item.current_market_value) || 0,
        existingMortgageBalance: Number(item.existing_mortgage_balance) || 0,
        currentMortgageRate: Number(item.current_mortgage_rate) || 0,
        currentOccupancyStatus: mapOccupancy(item.current_occupancy_status),
        marketRent: dollars(item.market_rent),
        currentLeaseAmount: dollars(item.current_lease_amount),
        annualPropertyTaxes: Number(item.annual_property_taxes) || 0,
        annualHazardInsurance: Number(item.annual_hazard_insurance_premium) || 0,
        annualFloodInsurance: Number(item.annual_flood_insurance_premium) || 0,
        annualHomeOwnersAssociation: Number(item.annual_home_owner_association_fees) || 0,
        currentCondition: item.current_condition || '',
        strategyForProperty: item.strategy_for_property || '',
        entityName: item.entity_name || '',
        notes: item.notes || '',
      }));

      const inferredPurpose = list.some(i => (i.purpose_of_loan || '').toLowerCase().includes('refinance')) ? 'refinance' : 'purchase';
      const inferredScore = (list[0]?.borrower_credit_score ?? '').toString();

      const persisted = {
        loanPurpose: inferredPurpose,
        creditScore: inferredScore,
        numberOfProperties: properties.length,
        properties,
      };

      localStorage.removeItem('dominionDataTape');
      localStorage.setItem('dominionDataTape', JSON.stringify(persisted));

      // Navigate to package loan page
      navigate('/package-loan');
    } catch (error) {
      console.error('Error processing data tape:', error);
      alert('Error processing data tape file. Please check the file format and try again.');
    } finally {
      setIsProcessingDataTape(false);
    }
  };
  const handleDataTapeSelection = (file: File) => {
    if (skipDataTapeDialog) {
      // If we're on quote page, directly process for package loan
      processDataTapeForPackage(file);
    } else {
      setPendingFile(file);
      setShowDataTapeDialog(true);
    }
  };

  const handlePackageLoanChoice = () => {
    if (pendingFile) {
      processDataTapeForPackage(pendingFile);
      setShowDataTapeDialog(false);
      setPendingFile(null);
    }
  };

  const handleSingleQuoteChoice = () => {
    if (pendingFile) {
      onDataTapeUpload(pendingFile);
      setShowDataTapeDialog(false);
      setPendingFile(null);
    }
  };

  const handleDataTapeDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDataTapeDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleDataTapeSelection(e.dataTransfer.files[0]);
    }
  }, [onDataTapeUpload, navigate]);

  const handleDataTapeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleDataTapeSelection(e.target.files[0]);
    }
  };
  if (isLoading || isProcessingDataTape) {
    return <Card className="max-w-2xl mx-auto">
        <CardContent className="p-12 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-dominion-blue mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-dominion-blue mb-2">
            {isProcessingDataTape ? 'Processing Your Data Tape' : 'Processing Your Questionnaire'}
          </h3>
          <p className="text-dominion-gray">
            {isProcessingDataTape 
              ? 'Our system is normalizing your portfolio data. This may take a few moments...'
              : 'Our AI is extracting data from your document. This may take a few moments...'
            }
          </p>
        </CardContent>
      </Card>;
  }
  const handleClientSelect = (client: ClientWithProperties) => {
    if (onClientSelect) {
      onClientSelect(client);
    }
  };

  return <div className="space-y-8">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">
          Get Your DSCR Quote
        </h1>
        <p className="text-lg text-muted-foreground">
          Choose how you'd like to get started with your commercial real estate loan quote
        </p>
      </div>

      <ClientSearch
        onClientSelect={handleClientSelect}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Upload Questionnaire Option */}
        <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-blue-200 transition-colors">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-blue-900 mb-2">Upload Questionnaire</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload your completed DSCR questionnaire for instant data extraction
                </p>
              </div>

              <div className={`border-2 border-dashed rounded-xl p-6 transition-all duration-300 ${dragActive ? "border-blue-400 bg-blue-50" : "border-border hover:border-blue-300 hover:bg-blue-50/50"}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
                <input type="file" id="file-upload" className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={handleFileInput} />
                <label htmlFor="file-upload" className="cursor-pointer block">
                  <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-1">
                    Drop file here or <span className="text-blue-600 font-medium">browse</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, DOC, DOCX, TXT
                  </p>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Data Tape Option */}
        <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-purple-200">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-purple-200 transition-colors">
                <FileSpreadsheet className="h-8 w-8 text-purple-600" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-blue-900 mb-2">Upload Data Tape</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Batch process multiple properties from your portfolio data
                </p>
              </div>

              <div className={`border-2 border-dashed rounded-xl p-6 transition-all duration-300 ${dataTapeDragActive ? "border-purple-400 bg-purple-50" : "border-border hover:border-purple-300 hover:bg-purple-50/50"}`} onDragEnter={handleDataTapeDrag} onDragLeave={handleDataTapeDrag} onDragOver={handleDataTapeDrag} onDrop={handleDataTapeDrop}>
                <input type="file" id="data-tape-upload" className="hidden" accept=".csv,.xls,.xlsx" onChange={handleDataTapeInput} />
                <label htmlFor="data-tape-upload" className="cursor-pointer block">
                  <FileSpreadsheet className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-1">
                    Drop file here or <span className="text-purple-600 font-medium">browse</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    CSV, XLS, XLSX
                  </p>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Manual Entry Option */}
        <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-green-200">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-green-200 transition-colors">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-blue-900 mb-2">Manual Entry</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Fill out our guided form step-by-step
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg text-left">
                  <h4 className="font-medium text-blue-900 mb-3">Required Information:</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                      Borrower information
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                      Property details
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                      Loan requirements
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                      Financial information
                    </li>
                  </ul>
                </div>
                <Button 
                  onClick={onManualEntry} 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Start Manual Entry
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Beautiful Data Tape Choice Dialog */}
      <AlertDialog open={showDataTapeDialog} onOpenChange={setShowDataTapeDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-dominion-blue">
              <FileSpreadsheet className="h-5 w-5" />
              Data Tape Uploaded Successfully!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Choose how you'd like to use this data tape file:
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Calculator className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-semibold text-blue-900">Package Loan</div>
                <div className="text-sm text-blue-700">Process all properties for comprehensive package loan analysis</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <FileText className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-semibold text-green-900">Single Quote</div>
                <div className="text-sm text-green-700">Use the first property only for a quick single quote</div>
              </div>
            </div>
          </div>

          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel
              onClick={handleSingleQuoteChoice}
              className="bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600"
            >
              <FileText className="h-4 w-4 mr-2" />
              Single Quote
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePackageLoanChoice}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Package Loan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
};
export default QuestionnaireUpload;
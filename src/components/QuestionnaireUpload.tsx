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
}
const QuestionnaireUpload = ({
  onFileUpload,
  onManualEntry,
  onClientSelect,
  onDataTapeUpload,
  isLoading
}: QuestionnaireUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [dataTapeDragActive, setDataTapeDragActive] = useState(false);
  const [showDataTapeDialog, setShowDataTapeDialog] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
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
    try {
      // Import the parser and process the file
      const { parseDataTapeFile } = await import('@/utils/dataTapeParser');
      const parsedData = await parseDataTapeFile(file);

      // Clear any existing data and store the new parsed data
      localStorage.removeItem('dominionDataTape');
      localStorage.setItem('dominionDataTape', JSON.stringify(parsedData));

      // Navigate to package loan page
      navigate('/package-loan');
    } catch (error) {
      console.error('Error processing data tape:', error);
      alert('Error processing data tape file. Please check the file format and try again.');
    }
  };

  const handleDataTapeSelection = (file: File) => {
    setPendingFile(file);
    setShowDataTapeDialog(true);
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
  if (isLoading) {
    return <Card className="max-w-2xl mx-auto">
        <CardContent className="p-12 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-dominion-blue mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-dominion-blue mb-2">Processing Your Questionnaire</h3>
          <p className="text-dominion-gray">Our AI is extracting data from your document. This may take a few moments...</p>
        </CardContent>
      </Card>;
  }
  const handleClientSelect = (client: ClientWithProperties) => {
    if (onClientSelect) {
      onClientSelect(client);
    }
  };

  return <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-dominion-blue mb-4">
          DSCR Loan Quote System
        </h1>
        <p className="text-lg text-dominion-gray max-w-2xl mx-auto">
          Search for existing clients or create a new quote by uploading a questionnaire or entering information manually.
        </p>
      </div>

      <ClientSearch
        onClientSelect={handleClientSelect}
      />

      <div className="text-center">
        <h2 className="text-2xl font-semibold text-dominion-blue mb-4">
          Create New Quote
        </h2>
        <p className="text-dominion-gray max-w-2xl mx-auto">
          Upload your completed DSCR questionnaire and let our AI extract the data automatically,
          or enter the information manually using our form.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* File Upload Option */}
        <Card className="relative">
          <CardHeader className="text-center">
            <Upload className="h-12 w-12 text-dominion-green mx-auto mb-4" />
            <CardTitle className="text-dominion-blue">Upload Questionnaire</CardTitle>
            <CardDescription>
              Drag and drop your DSCR questionnaire or click to browse
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? "border-dominion-green bg-green-50" : "border-gray-300 hover:border-dominion-green hover:bg-gray-50"}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
              <input type="file" id="file-upload" className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={handleFileInput} />
              <label htmlFor="file-upload" className="cursor-pointer">
                <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Drop your file here or <span className="text-dominion-blue font-medium">browse</span>
                </p>
                <p className="text-xs text-gray-400">
                  Supports PDF, DOC, DOCX, TXT files
                </p>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Upload Data Tape Option */}
        <Card className="relative">
          <CardHeader className="text-center">
            <Upload className="h-12 w-12 text-dominion-blue mx-auto mb-4" />
            <CardTitle className="text-dominion-blue">Upload Data Tape</CardTitle>
            <CardDescription>
              Upload your data tape for batch processing multiple properties
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dataTapeDragActive ? "border-dominion-blue bg-blue-50" : "border-gray-300 hover:border-dominion-blue hover:bg-gray-50"}`} onDragEnter={handleDataTapeDrag} onDragLeave={handleDataTapeDrag} onDragOver={handleDataTapeDrag} onDrop={handleDataTapeDrop}>
              <input type="file" id="data-tape-upload" className="hidden" accept=".csv,.xls,.xlsx" onChange={handleDataTapeInput} />
              <label htmlFor="data-tape-upload" className="cursor-pointer">
                <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Drop your data tape here or <span className="text-dominion-blue font-medium">browse</span>
                </p>
                <p className="text-xs text-gray-400">
                  Supports CSV, XLS, XLSX files
                </p>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Manual Entry Option */}
        <Card>
          <CardHeader className="text-center">
            <FileText className="h-12 w-12 text-dominion-blue mx-auto mb-4" />
            <CardTitle className="text-dominion-blue">Manual Entry</CardTitle>
            <CardDescription>
              Fill out the DSCR information manually using our guided form
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-dominion-blue mb-2">What you'll need:</h4>
                <ul className="text-sm text-dominion-gray space-y-1">
                  <li>• Borrower information</li>
                  <li>• Property details</li>
                  <li>• Loan requirements</li>
                  <li>• Financial information</li>
                </ul>
              </div>
              <Button onClick={onManualEntry} className="w-full bg-dominion-blue hover:bg-dominion-blue/90 text-white">
                Start Manual Entry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Benefits Section */}
      <Card className="bg-gradient-to-r from-dominion-blue to-dominion-green text-white">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <h4 className="font-semibold mb-2">AI-Powered Extraction</h4>
              <p className="text-sm opacity-90">Advanced OCR and NLP technology</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">99.9% Accuracy</h4>
              <p className="text-sm opacity-90">Human-reviewed data validation</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Instant Pricing</h4>
              <p className="text-sm opacity-90">Results in under 60 seconds</p>
            </div>
          </div>
        </CardContent>
      </Card>

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
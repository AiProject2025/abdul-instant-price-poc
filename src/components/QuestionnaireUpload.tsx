import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Loader2 } from "lucide-react";
interface QuestionnaireUploadProps {
  onFileUpload: (file: File) => void;
  onManualEntry: () => void;
  isLoading: boolean;
}
const QuestionnaireUpload = ({
  onFileUpload,
  onManualEntry,
  isLoading
}: QuestionnaireUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
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
  if (isLoading) {
    return <Card className="max-w-2xl mx-auto">
        <CardContent className="p-12 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-dominion-blue mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-dominion-blue mb-2">Processing Your Questionnaire</h3>
          <p className="text-dominion-gray">Our AI is extracting data from your document. This may take a few moments...</p>
        </CardContent>
      </Card>;
  }
  return <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-dominion-blue mb-4">
          Upload Your DSCR Questionnaire
        </h1>
        <p className="text-lg text-dominion-gray max-w-2xl mx-auto">
          Upload your completed DSCR questionnaire and let our AI extract the data automatically, 
          or enter the information manually using our form.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </div>;
};
export default QuestionnaireUpload;
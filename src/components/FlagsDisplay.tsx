
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface FlagsDisplayProps {
  flags: string[];
}

const FlagsDisplay = ({ flags }: FlagsDisplayProps) => {
  if (!flags || flags.length === 0) {
    return null;
  }

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="text-red-800 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Ineligible Flags
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {flags.map((flag, index) => (
            <div key={index} className="flex items-start gap-2 text-red-700">
              <span className="text-lg">🚫</span>
              <span className="text-sm">{flag}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FlagsDisplay;

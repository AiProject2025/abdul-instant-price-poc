import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Calendar, Target } from 'lucide-react';

interface ConfirmPricingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { desiredLTV: string; desiredClosingDate: string }) => void;
  currentLTV: string;
  currentClosingDate: string;
}

const ConfirmPricingDialog: React.FC<ConfirmPricingDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentLTV,
  currentClosingDate
}) => {
  const [desiredLTV, setDesiredLTV] = React.useState(currentLTV);
  const [desiredClosingDate, setDesiredClosingDate] = React.useState(currentClosingDate);

  React.useEffect(() => {
    setDesiredLTV(currentLTV);
    setDesiredClosingDate(currentClosingDate);
  }, [currentLTV, currentClosingDate]);

  const handleConfirm = () => {
    onConfirm({ desiredLTV, desiredClosingDate });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Confirm Pricing Parameters
          </DialogTitle>
          <DialogDescription>
            Please review and confirm your desired LTV and closing date before we get your pricing.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="ltv" className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              Desired Loan-to-Value (LTV) %
            </Label>
            <Input
              id="ltv"
              type="number"
              value={desiredLTV}
              onChange={(e) => setDesiredLTV(e.target.value)}
              placeholder="75"
              min="0"
              max="100"
              className="text-lg font-medium"
            />
            <p className="text-xs text-muted-foreground">
              Typical range: 70% - 80% for investment properties
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="closing-date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-500" />
              Desired Closing Date
            </Label>
            <Input
              id="closing-date"
              type="date"
              value={desiredClosingDate}
              onChange={(e) => setDesiredClosingDate(e.target.value)}
              className="text-lg font-medium"
            />
            <p className="text-xs text-muted-foreground">
              Currently set to: {formatDate(desiredClosingDate)}
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="bg-dominion-blue hover:bg-blue-700">
            Get Pricing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmPricingDialog;
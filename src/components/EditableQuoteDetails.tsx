import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditableQuoteDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    borrowerName: string;
    propertyAddress: string;
    loanAmount: number;
    interestRate: number;
    monthlyPayment: number;
    loanTerm: number;
    ltv: number;
    dscr: number;
    propertyType: string;
    loanPurpose: string;
    refinanceType?: string;
    points: number;
    noteBuyer: string;
    loanOfficer: string;
    phoneNumber: string;
    date: string;
  };
  onSave: (data: any) => void;
}

const EditableQuoteDetails = ({ isOpen, onClose, initialData, onSave }: EditableQuoteDetailsProps) => {
  const [editData, setEditData] = useState(initialData);

  const handleInputChange = (field: string, value: any) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(editData);
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Quote Details</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="borrowerName">Borrower Name</Label>
            <Input
              id="borrowerName"
              value={editData.borrowerName}
              onChange={(e) => handleInputChange('borrowerName', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="propertyAddress">Property Address</Label>
            <Input
              id="propertyAddress"
              value={editData.propertyAddress}
              onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="loanAmount">Loan Amount</Label>
            <Input
              id="loanAmount"
              type="number"
              value={editData.loanAmount}
              onChange={(e) => handleInputChange('loanAmount', parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interestRate">Interest Rate (%)</Label>
            <Input
              id="interestRate"
              type="number"
              step="0.001"
              value={editData.interestRate}
              onChange={(e) => handleInputChange('interestRate', parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyPayment">Monthly Payment</Label>
            <Input
              id="monthlyPayment"
              type="number"
              value={editData.monthlyPayment}
              onChange={(e) => handleInputChange('monthlyPayment', parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="loanTerm">Loan Term (months)</Label>
            <Input
              id="loanTerm"
              type="number"
              value={editData.loanTerm}
              onChange={(e) => handleInputChange('loanTerm', parseInt(e.target.value) || 360)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ltv">LTV (%)</Label>
            <Input
              id="ltv"
              type="number"
              value={editData.ltv}
              onChange={(e) => handleInputChange('ltv', parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dscr">DSCR</Label>
            <Input
              id="dscr"
              type="number"
              step="0.001"
              value={editData.dscr}
              onChange={(e) => handleInputChange('dscr', parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="propertyType">Property Type</Label>
            <Select
              value={editData.propertyType}
              onValueChange={(value) => handleInputChange('propertyType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Single Family">Single Family</SelectItem>
                <SelectItem value="Townhouse">Townhouse</SelectItem>
                <SelectItem value="Condominium">Condominium</SelectItem>
                <SelectItem value="2-4 Unit">2-4 Unit</SelectItem>
                <SelectItem value="5+ Unit">5+ Unit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="loanPurpose">Loan Purpose</Label>
            <Select
              value={editData.loanPurpose}
              onValueChange={(value) => handleInputChange('loanPurpose', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Purchase">Purchase</SelectItem>
                <SelectItem value="Refinance">Refinance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {editData.loanPurpose === 'Refinance' && (
            <div className="space-y-2">
              <Label htmlFor="refinanceType">Refinance Type</Label>
              <Select
                value={editData.refinanceType || ''}
                onValueChange={(value) => handleInputChange('refinanceType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select refinance type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash Out">Cash Out</SelectItem>
                  <SelectItem value="Rate/Term">Rate/Term</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="points">Points (%)</Label>
            <Input
              id="points"
              type="number"
              step="0.001"
              value={editData.points}
              onChange={(e) => handleInputChange('points', parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="noteBuyer">Note Buyer</Label>
            <Input
              id="noteBuyer"
              value={editData.noteBuyer}
              onChange={(e) => handleInputChange('noteBuyer', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="loanOfficer">Loan Officer</Label>
            <Input
              id="loanOfficer"
              value={editData.loanOfficer}
              onChange={(e) => handleInputChange('loanOfficer', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={editData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              value={editData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-dominion-blue hover:bg-dominion-blue/90">
            Save & Generate Quote
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditableQuoteDetails;
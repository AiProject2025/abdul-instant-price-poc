import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, RotateCcw } from 'lucide-react';
import { useScenarios, Scenario } from '@/hooks/useScenarios';

const DeletedScenariosDialog = () => {
  const [open, setOpen] = useState(false);
  const { deletedScenarios, restoreScenario, fetchDeletedScenarios } = useScenarios();

  const handleOpen = () => {
    setOpen(true);
    fetchDeletedScenarios();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleRestore = async (scenarioId: string) => {
    await restoreScenario(scenarioId);
    fetchDeletedScenarios(); // Refresh the list
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={handleOpen}>
          <Trash2 className="w-4 h-4 mr-2" />
          View Deleted Scenarios
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Deleted Scenarios</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {deletedScenarios.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No deleted scenarios found.
            </div>
          ) : (
            deletedScenarios.map((scenario) => (
              <Card key={scenario.id} className="border-red-200 bg-red-50/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {scenario.name}
                      <Badge variant="destructive">
                        Deleted {scenario.deleted_at ? new Date(scenario.deleted_at).toLocaleDateString() : ''}
                      </Badge>
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestore(scenario.id)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Restore
                    </Button>
                  </div>
                  {scenario.deleted_by_name && (
                    <div className="text-sm text-muted-foreground">
                      Deleted by: {scenario.deleted_by_name}
                    </div>
                  )}
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <strong>Borrower:</strong> 
                      <div>{scenario.form_data.borrowerName || 'N/A'}</div>
                    </div>
                    <div>
                      <strong>Loan Amount:</strong> 
                      <div>{formatCurrency(scenario.form_data.loanAmount || 0)}</div>
                    </div>
                    <div>
                      <strong>Property Type:</strong> 
                      <div>{scenario.form_data.propertyType || 'N/A'}</div>
                    </div>
                    <div>
                      <strong>LTV:</strong> 
                      <div>{scenario.form_data.ltv || 0}%</div>
                    </div>
                    <div>
                      <strong>DSCR:</strong> 
                      <div>{scenario.form_data.dscr || 0}</div>
                    </div>
                    <div>
                      <strong>Points:</strong> 
                      <div>{scenario.form_data.points || 0}%</div>
                    </div>
                    <div>
                      <strong>Note Buyer:</strong> 
                      <div>{scenario.form_data.noteBuyer || 'N/A'}</div>
                    </div>
                    <div>
                      <strong>Created:</strong> 
                      <div>{new Date(scenario.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeletedScenariosDialog;
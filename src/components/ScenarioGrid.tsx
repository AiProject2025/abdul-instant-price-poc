import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Eye } from 'lucide-react';
import { useScenarios, Scenario, ScenarioResult } from '@/hooks/useScenarios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ScenarioGridProps {
  onSelectScenario?: (scenario: Scenario) => void;
}

const ScenarioGrid = ({ onSelectScenario }: ScenarioGridProps) => {
  const { scenarios, scenarioResults, loading, deleteScenario, fetchScenarioResults } = useScenarios();
  const [expandedScenario, setExpandedScenario] = useState<string | null>(null);

  const handleToggleExpand = async (scenarioId: string) => {
    if (expandedScenario === scenarioId) {
      setExpandedScenario(null);
    } else {
      setExpandedScenario(scenarioId);
      if (!scenarioResults[scenarioId]) {
        await fetchScenarioResults(scenarioId);
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatRate = (rate: number) => {
    return `${rate.toFixed(3)}%`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div>Loading scenarios...</div>
        </CardContent>
      </Card>
    );
  }

  if (scenarios.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            No scenarios saved yet. Create a quote to save your first scenario.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Saved Scenarios</h2>
      {scenarios.map((scenario) => (
        <Card key={scenario.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {scenario.name}
                <Badge variant="outline">
                  {new Date(scenario.created_at).toLocaleDateString()}
                </Badge>
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleExpand(scenario.id)}
                >
                  <Eye className="w-4 h-4" />
                  {expandedScenario === scenario.id ? 'Hide' : 'View'} Results
                </Button>
                {onSelectScenario && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectScenario(scenario)}
                  >
                    Load Scenario
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteScenario(scenario.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {expandedScenario === scenario.id && (
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Form Data:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div><strong>Loan Amount:</strong> {formatCurrency(scenario.form_data.loanAmount || 0)}</div>
                    <div><strong>Property Type:</strong> {scenario.form_data.propertyType || 'N/A'}</div>
                    <div><strong>LTV:</strong> {scenario.form_data.ltv || 0}%</div>
                    <div><strong>DSCR:</strong> {scenario.form_data.dscr || 0}</div>
                  </div>
                </div>

                {scenarioResults[scenario.id] && scenarioResults[scenario.id].length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Pricing Results:</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Note Buyer</TableHead>
                          <TableHead>Rate</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Loan Amount</TableHead>
                          <TableHead>Monthly Payment</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {scenarioResults[scenario.id].map((result) => (
                          <TableRow key={result.id}>
                            <TableCell className="font-medium">{result.buyer_name}</TableCell>
                            <TableCell>{formatRate(result.rate)}</TableCell>
                            <TableCell>{formatCurrency(result.price)}</TableCell>
                            <TableCell>{formatCurrency(result.loan_amount)}</TableCell>
                            <TableCell>{formatCurrency(result.additional_data?.monthlyPayment || 0)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {scenarioResults[scenario.id] && scenarioResults[scenario.id].length === 0 && (
                  <div className="text-muted-foreground">No pricing results found for this scenario.</div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};

export default ScenarioGrid;
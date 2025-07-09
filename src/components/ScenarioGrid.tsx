import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Eye, Grid3X3, List } from 'lucide-react';
import { useScenarios, Scenario, ScenarioResult } from '@/hooks/useScenarios';
import DeletedScenariosDialog from '@/components/DeletedScenariosDialog';
import AuditLogDialog from '@/components/AuditLogDialog';
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
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

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

  // Group scenarios by note buyer for grid view
  const groupedByNoteBuyer = scenarios.reduce((groups, scenario) => {
    const noteBuyer = scenario.form_data.noteBuyer || 'Unknown Note Buyer';
    if (!groups[noteBuyer]) {
      groups[noteBuyer] = [];
    }
    groups[noteBuyer].push(scenario);
    return groups;
  }, {} as Record<string, Scenario[]>);

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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Saved Scenarios</h2>
        <div className="flex gap-2">
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-r-none"
            >
              <List className="w-4 h-4 mr-2" />
              List
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-l-none"
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              By Note Buyer
            </Button>
          </div>
          <DeletedScenariosDialog />
          <AuditLogDialog />
        </div>
      </div>
      {viewMode === 'list' ? (
        // List View (existing layout)
        scenarios.map((scenario) => (
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
                    {expandedScenario === scenario.id ? 'Hide' : 'View'} Details
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
            
            <CardContent>
              {/* Always show key scenario info */}
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Scenario Summary:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-muted/50 p-4 rounded-lg">
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
                    <strong>Interest Only:</strong> 
                    <div>{scenario.form_data.interestOnly || 'No'}</div>
                  </div>
                  <div>
                    <strong>Note Buyer:</strong> 
                    <div>{scenario.form_data.noteBuyer || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* Show pricing results if available */}
              {scenarioResults[scenario.id] && scenarioResults[scenario.id].length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Pricing Results by Note Buyer:</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Note Buyer</TableHead>
                        <TableHead>Rate</TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Monthly Payment</TableHead>
                        <TableHead>Loan Amount</TableHead>
                        <TableHead>Features</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scenarioResults[scenario.id].map((result) => (
                        <TableRow key={result.id}>
                          <TableCell className="font-medium">{result.buyer_name}</TableCell>
                          <TableCell>{formatRate(result.rate)}</TableCell>
                          <TableCell>{result.additional_data?.points || 0}%</TableCell>
                          <TableCell>{formatCurrency(result.additional_data?.monthlyPayment || 0)}</TableCell>
                          <TableCell>{formatCurrency(result.loan_amount)}</TableCell>
                          <TableCell>
                            <div className="text-xs">
                              {result.additional_data?.interestOnly === 'Yes' && 
                                <Badge variant="secondary" className="mr-1">Interest Only</Badge>
                              }
                              {result.additional_data?.points > 0 && 
                                <Badge variant="outline">{result.additional_data.points}% Points</Badge>
                              }
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {expandedScenario === scenario.id && (
                <div className="space-y-4 border-t pt-4">
                  <div>
                    <h4 className="font-semibold mb-2">Complete Form Data:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm bg-muted/20 p-4 rounded-lg max-h-60 overflow-y-auto">
                      {Object.entries(scenario.form_data).map(([key, value]) => (
                        <div key={key}>
                          <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong>
                          <div className="text-muted-foreground">
                            {typeof value === 'number' && key.toLowerCase().includes('amount') 
                              ? formatCurrency(value as number)
                              : String(value)
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {(!scenarioResults[scenario.id] || scenarioResults[scenario.id].length === 0) && (
                <div className="text-muted-foreground text-center py-4 border border-dashed rounded-lg">
                  No pricing results found for this scenario. 
                  <br />
                  <span className="text-sm">Load this scenario and run pricing to see results here.</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        // Grid View by Note Buyer
        <div className="space-y-6">
          {Object.entries(groupedByNoteBuyer).map(([noteBuyer, noteBuyerScenarios]) => (
            <div key={noteBuyer} className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold">{noteBuyer}</h3>
                <Badge variant="secondary">{noteBuyerScenarios.length} scenarios</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {noteBuyerScenarios.map((scenario) => (
                  <Card key={scenario.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg leading-tight mb-1">
                            {scenario.name}
                          </CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {new Date(scenario.created_at).toLocaleDateString()}
                          </Badge>
                        </div>
                        <div className="flex gap-1 ml-2">
                          {onSelectScenario && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onSelectScenario(scenario)}
                              className="px-2"
                            >
                              Load
                            </Button>
                          )}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteScenario(scenario.id)}
                            className="px-2"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="font-medium">Borrower:</span>
                            <div className="text-muted-foreground truncate">
                              {scenario.form_data.borrowerName || 'N/A'}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Loan Amount:</span>
                            <div className="text-muted-foreground">
                              {formatCurrency(scenario.form_data.loanAmount || 0)}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">LTV:</span>
                            <div className="text-muted-foreground">
                              {scenario.form_data.ltv || 0}%
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">DSCR:</span>
                            <div className="text-muted-foreground">
                              {scenario.form_data.dscr || 0}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-1 flex-wrap mt-2">
                          {scenario.form_data.points > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {scenario.form_data.points}% Points
                            </Badge>
                          )}
                          {scenario.form_data.interestOnly === 'Yes' && (
                            <Badge variant="secondary" className="text-xs">
                              Interest Only
                            </Badge>
                          )}
                          {scenario.form_data.propertyType && (
                            <Badge variant="outline" className="text-xs">
                              {scenario.form_data.propertyType}
                            </Badge>
                          )}
                        </div>

                        {/* Show pricing results count if available */}
                        {scenarioResults[scenario.id] && scenarioResults[scenario.id].length > 0 && (
                          <div className="mt-2 pt-2 border-t">
                            <Badge variant="default" className="text-xs">
                              {scenarioResults[scenario.id].length} pricing result{scenarioResults[scenario.id].length !== 1 ? 's' : ''}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScenarioGrid;
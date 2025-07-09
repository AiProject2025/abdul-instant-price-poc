import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Eye, Grid3X3, List, FileText, X, GripVertical, Plus } from 'lucide-react';
import { useScenarios, Scenario, ScenarioResult } from '@/hooks/useScenarios';
import DeletedScenariosDialog from '@/components/DeletedScenariosDialog';
import AuditLogDialog from '@/components/AuditLogDialog';
import { useToast } from '@/hooks/use-toast';
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
  const [comparisonScenarios, setComparisonScenarios] = useState<Scenario[]>([]);
  const [isGeneratingPresentation, setIsGeneratingPresentation] = useState(false);
  const [draggedScenario, setDraggedScenario] = useState<Scenario | null>(null);
  const { toast } = useToast();

  // Debug - log when component renders
  console.log('ScenarioGrid rendered with drag & drop functionality');

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

  const handleScenarioSelect = (scenarioId: string, checked: boolean) => {
    // Legacy function - can be removed
  };

  const handleDragStart = (e: React.DragEvent, scenario: Scenario) => {
    setDraggedScenario(scenario);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', scenario.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedScenario) {
      // Check if already in comparison
      if (comparisonScenarios.find(s => s.id === draggedScenario.id)) {
        toast({
          title: "Already added",
          description: "This scenario is already in the comparison.",
          variant: "destructive"
        });
        return;
      }

      // Check limit
      if (comparisonScenarios.length >= 5) {
        toast({
          title: "Maximum reached",
          description: "You can compare up to 5 scenarios at a time.",
          variant: "destructive"
        });
        return;
      }

      setComparisonScenarios([...comparisonScenarios, draggedScenario]);
      setDraggedScenario(null);
    }
  };

  const removeFromComparison = (scenarioId: string) => {
    setComparisonScenarios(comparisonScenarios.filter(s => s.id !== scenarioId));
  };

  const clearComparison = () => {
    setComparisonScenarios([]);
  };

  const generateClientPresentation = async () => {
    if (comparisonScenarios.length === 0) {
      toast({
        title: "No scenarios to compare",
        description: "Please drag scenarios to the comparison area first.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingPresentation(true);
    
    try {
      // Fetch results for each comparison scenario
      const scenariosWithResults = await Promise.all(
        comparisonScenarios.map(async (scenario) => {
          if (!scenarioResults[scenario.id]) {
            await fetchScenarioResults(scenario.id);
          }
          return {
            ...scenario,
            results: scenarioResults[scenario.id] || []
          };
        })
      );

      // Generate Word document
      await generateMultiScenarioDocument(scenariosWithResults);
      
      toast({
        title: "Presentation generated",
        description: `Client presentation with ${comparisonScenarios.length} scenarios has been downloaded.`,
      });
      
    } catch (error) {
      console.error('Error generating presentation:', error);
      toast({
        title: "Error",
        description: "Failed to generate client presentation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPresentation(false);
    }
  };

  const generateMultiScenarioDocument = async (scenariosWithResults: any[]) => {
    const { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow, HeadingLevel, AlignmentType, WidthType } = await import('docx');
    const { saveAs } = await import('file-saver');

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Title
          new Paragraph({
            children: [
              new TextRun({
                text: "Loan Scenario Comparison",
                bold: true,
                size: 32,
              }),
            ],
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Generated on ${new Date().toLocaleDateString()}`,
                italics: true,
                size: 20,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 },
          }),

          // Executive Summary
          new Paragraph({
            children: [
              new TextRun({
                text: "Executive Summary",
                bold: true,
                size: 24,
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `This presentation compares ${scenariosWithResults.length} loan scenarios to help you make an informed decision. Each scenario includes detailed pricing from multiple note buyers, terms, and key loan features.`,
                size: 20,
              }),
            ],
            spacing: { after: 400 },
          }),

          // Scenarios section
          ...scenariosWithResults.map((scenario, index) => [
            new Paragraph({
              children: [
                new TextRun({
                  text: `Scenario ${index + 1}: ${scenario.name}`,
                  bold: true,
                  size: 24,
                }),
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 600, after: 200 },
            }),

            // Scenario details table
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: "Property Details", bold: true })] })],
                      width: { size: 50, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: "Loan Details", bold: true })] })],
                      width: { size: 50, type: WidthType.PERCENTAGE },
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({ children: [new TextRun(`Borrower: ${scenario.form_data.borrowerName || 'N/A'}`)] }),
                        new Paragraph({ children: [new TextRun(`Property Type: ${scenario.form_data.propertyType || 'N/A'}`)] }),
                        new Paragraph({ children: [new TextRun(`Address: ${scenario.form_data.propertyAddress || 'N/A'}`)] }),
                        new Paragraph({ children: [new TextRun(`Property Value: ${formatCurrency(scenario.form_data.propertyValue || 0)}`)] }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({ children: [new TextRun(`Loan Amount: ${formatCurrency(scenario.form_data.loanAmount || 0)}`)] }),
                        new Paragraph({ children: [new TextRun(`LTV: ${scenario.form_data.ltv || 0}%`)] }),
                        new Paragraph({ children: [new TextRun(`DSCR: ${scenario.form_data.dscr || 0}`)] }),
                        new Paragraph({ children: [new TextRun(`Interest Only: ${scenario.form_data.interestOnly || 'No'}`)] }),
                      ],
                    }),
                  ],
                }),
              ],
            }),

            new Paragraph({ text: "", spacing: { after: 200 } }),

            // Pricing results
            ...(scenario.results && scenario.results.length > 0 ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Pricing Options",
                    bold: true,
                    size: 20,
                  }),
                ],
                spacing: { before: 200, after: 100 },
              }),

              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Note Buyer", bold: true })] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Rate", bold: true })] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Points", bold: true })] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Monthly Payment", bold: true })] })] }),
                    ],
                  }),
                  ...scenario.results.map((result: any) =>
                    new TableRow({
                      children: [
                        new TableCell({ children: [new Paragraph({ children: [new TextRun(result.buyer_name)] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun(formatRate(result.rate))] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun(`${result.additional_data?.points || 0}%`)] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun(formatCurrency(result.additional_data?.monthlyPayment || 0))] })] }),
                      ],
                    })
                  ),
                ],
              }),
            ] : [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "No pricing results available for this scenario.",
                    italics: true,
                  }),
                ],
                spacing: { after: 200 },
              }),
            ]),

            new Paragraph({ text: "", spacing: { after: 400 } }),
          ]).flat(),
        ],
      }],
    });

    const buffer = await Packer.toBuffer(doc);
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    
    const fileName = `loan-scenarios-comparison-${new Date().toISOString().split('T')[0]}.docx`;
    saveAs(blob, fileName);
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
      {/* Debug info */}
      <div className="text-xs text-muted-foreground">
        Debug: {scenarios.length} scenarios, {comparisonScenarios.length} in comparison
      </div>
      
      {/* Comparison Drop Zone */}
      <Card 
        className={`border-2 border-dashed transition-all ${
          draggedScenario ? 'border-primary bg-primary/5' : 'border-muted-foreground/30'
        }`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Comparison Workspace</h3>
              <Badge variant="secondary">
                {comparisonScenarios.length}/5 scenarios
              </Badge>
            </div>
            {comparisonScenarios.length > 0 && (
              <div className="flex gap-2">
                <Button
                  onClick={generateClientPresentation}
                  disabled={isGeneratingPresentation}
                  className="flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  {isGeneratingPresentation ? 'Generating...' : 'Generate Client Presentation'}
                </Button>
                <Button
                  variant="outline"
                  onClick={clearComparison}
                  size="sm"
                >
                  <X className="w-4 h-4" />
                  Clear
                </Button>
              </div>
            )}
          </div>

          {comparisonScenarios.length === 0 ? (
            <div className="text-center py-8">
              <Plus className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">
                Drag scenarios here to build a comparison for your client
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {comparisonScenarios.map((scenario) => (
                <Card key={scenario.id} className="bg-muted/50 border-primary/20">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{scenario.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(scenario.form_data.loanAmount || 0)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromComparison(scenario.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Saved Scenarios</h2>
          {comparisonScenarios.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {comparisonScenarios.length} in comparison
            </Badge>
          )}
        </div>
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
        // Compact List View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {scenarios.map((scenario) => (
            <Card 
              key={scenario.id} 
              className="hover:shadow-md transition-all cursor-move group"
              draggable
              onDragStart={(e) => handleDragStart(e, scenario)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground group-hover:text-primary mt-0.5" />
                  <div className="flex gap-1">
                    {onSelectScenario && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSelectScenario(scenario)}
                        className="h-6 w-6 p-0"
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteScenario(scenario.id)}
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <h4 className="font-medium text-sm line-clamp-2">{scenario.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {new Date(scenario.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Loan:</span>
                      <div className="font-medium">{formatCurrency(scenario.form_data.loanAmount || 0)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">LTV:</span>
                      <div className="font-medium">{scenario.form_data.ltv || 0}%</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">DSCR:</span>
                      <div className="font-medium">{scenario.form_data.dscr || 0}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Buyer:</span>
                      <div className="font-medium text-xs truncate">{scenario.form_data.noteBuyer || 'N/A'}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {scenario.form_data.interestOnly === 'Yes' && (
                      <Badge variant="secondary" className="text-xs h-5">IO</Badge>
                    )}
                    {scenario.form_data.points > 0 && (
                      <Badge variant="outline" className="text-xs h-5">{scenario.form_data.points}% pts</Badge>
                    )}
                    {scenarioResults[scenario.id] && scenarioResults[scenario.id].length > 0 && (
                      <Badge variant="default" className="text-xs h-5">
                        {scenarioResults[scenario.id].length} results
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // Compact Grid View by Note Buyer
        <div className="space-y-6">
          {Object.entries(groupedByNoteBuyer).map(([noteBuyer, noteBuyerScenarios]) => (
            <div key={noteBuyer} className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{noteBuyer}</h3>
                <Badge variant="secondary">{noteBuyerScenarios.length} scenarios</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                {noteBuyerScenarios.map((scenario) => (
                  <Card 
                    key={scenario.id} 
                    className="hover:shadow-md transition-all cursor-move group"
                    draggable
                    onDragStart={(e) => handleDragStart(e, scenario)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <GripVertical className="w-3 h-3 text-muted-foreground group-hover:text-primary mt-0.5" />
                        <div className="flex gap-1">
                          {onSelectScenario && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onSelectScenario(scenario)}
                              className="h-5 w-5 p-0"
                            >
                              <Eye className="w-2.5 h-2.5" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteScenario(scenario.id)}
                            className="h-5 w-5 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <h4 className="font-medium text-xs line-clamp-2">{scenario.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {new Date(scenario.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Loan:</span>
                            <span className="font-medium">{formatCurrency(scenario.form_data.loanAmount || 0)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">LTV:</span>
                            <span className="font-medium">{scenario.form_data.ltv || 0}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">DSCR:</span>
                            <span className="font-medium">{scenario.form_data.dscr || 0}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {scenario.form_data.interestOnly === 'Yes' && (
                            <Badge variant="secondary" className="text-xs h-4">IO</Badge>
                          )}
                          {scenario.form_data.points > 0 && (
                            <Badge variant="outline" className="text-xs h-4">{scenario.form_data.points}%</Badge>
                          )}
                          {scenarioResults[scenario.id] && scenarioResults[scenario.id].length > 0 && (
                            <Badge variant="default" className="text-xs h-4">
                              {scenarioResults[scenario.id].length}
                            </Badge>
                          )}
                        </div>
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
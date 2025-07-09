import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Eye, Grid3X3, List, FileText, X } from 'lucide-react';
import { useScenarios, Scenario, ScenarioResult } from '@/hooks/useScenarios';
import DeletedScenariosDialog from '@/components/DeletedScenariosDialog';
import AuditLogDialog from '@/components/AuditLogDialog';
import ClientPresentationPreview from '@/components/ClientPresentationPreview';
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
  const [selectedScenarios, setSelectedScenarios] = useState<Set<string>>(new Set());
  const [showPresentationPreview, setShowPresentationPreview] = useState(false);
  const [scenariosForPresentation, setScenariosForPresentation] = useState<any[]>([]);
  const [isGeneratingPresentation, setIsGeneratingPresentation] = useState(false);
  const { toast } = useToast();

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

  const extractNoteBuyerFromName = (name: string) => {
    // Extract note buyer from scenario name (e.g., "Property Scenario - Note Buyer A" -> "Note Buyer A")
    const parts = name.split(' - ');
    return parts.length > 1 ? parts[parts.length - 1] : name;
  };

  const handleScenarioSelect = (scenarioId: string, checked: boolean) => {
    const newSelected = new Set(selectedScenarios);
    if (checked) {
      newSelected.add(scenarioId);
    } else {
      newSelected.delete(scenarioId);
    }
    setSelectedScenarios(newSelected);
  };

  const clearSelection = () => {
    setSelectedScenarios(new Set());
  };

  const generateClientPresentation = async () => {
    console.log('🔥 Generate Client Presentation button clicked!');
    console.log('Selected scenarios count:', selectedScenarios.size);
    if (selectedScenarios.size === 0) {
      toast({
        title: "No scenarios selected",
        description: "Please select at least one scenario to generate a presentation.",
        variant: "destructive"
      });
      return;
    }

    if (selectedScenarios.size > 5) {
      toast({
        title: "Too many scenarios selected", 
        description: "Please select 5 or fewer scenarios for a clean presentation.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingPresentation(true);
    
    try {
      console.log('Preparing presentation preview...');
      
      // Get selected scenarios with their results
      const selectedScenariosData = scenarios.filter(s => selectedScenarios.has(s.id));
      console.log('Selected scenarios:', selectedScenariosData.length);
      
      // Fetch results for each selected scenario
      const scenariosWithResults = await Promise.all(
        selectedScenariosData.map(async (scenario) => {
          if (!scenarioResults[scenario.id]) {
            console.log('Fetching results for scenario:', scenario.name);
            await fetchScenarioResults(scenario.id);
          }
          return {
            ...scenario,
            results: scenarioResults[scenario.id] || []
          };
        })
      );

      console.log('Scenarios with results prepared:', scenariosWithResults);

      // Set data for preview and show it
      setScenariosForPresentation(scenariosWithResults);
      setShowPresentationPreview(true);
      
    } catch (error) {
      console.error('Error preparing presentation:', error);
      toast({
        title: "Error",
        description: "Failed to prepare presentation preview. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPresentation(false);
    }
  };

  const generateMultiScenarioDocument = async (scenariosWithResults: any[]) => {
    const { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow, HeadingLevel, AlignmentType, WidthType, BorderStyle } = await import('docx');
    const { saveAs } = await import('file-saver');

    // Extract property information from first scenario
    const firstScenario = scenariosWithResults[0];
    const propertyInfo = firstScenario?.form_data || {};

    // Helper function to create table rows
    const createDataRow = (label: string, values: string[], isSection = false) => {
      return new TableRow({
        children: [
          new TableCell({ 
            children: [new Paragraph({ 
              children: [new TextRun({ 
                text: label, 
                bold: isSection, 
                color: isSection ? "333333" : "000000" 
              })],
              alignment: isSection ? AlignmentType.LEFT : AlignmentType.LEFT 
            })],
            shading: { fill: isSection ? "F0F0F0" : "E8F4FD" },
            width: { size: 20, type: WidthType.PERCENTAGE },
          }),
          ...values.map(value => 
            new TableCell({ 
              children: [new Paragraph({ 
                children: [new TextRun({ text: value })],
                alignment: AlignmentType.CENTER 
              })],
              width: { size: 80 / values.length, type: WidthType.PERCENTAGE },
            })
          )
        ]
      });
    };

    // Process scenario data for comparison
    const processedScenarios = scenariosWithResults.map(scenario => {
      const results = scenario.results || [];
      const bestResult = results.length > 0 ? results.reduce((best, current) => 
        current.rate < best.rate ? current : best
      ) : null;
      
      return {
        ...scenario,
        bestResult,
        formData: scenario.form_data || {}
      };
    });

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Title
          new Paragraph({
            children: [
              new TextRun({
                text: "Note Buyer Comparison Grid",
                bold: true,
                size: 32,
                color: "003366",
              }),
            ],
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),

          // Property Header
          new Paragraph({
            children: [
              new TextRun({
                text: `Property: ${propertyInfo.propertyAddress || 'Property Address'} | ${propertyInfo.propertyType || 'Property Type'} | Value: ${formatCurrency(propertyInfo.propertyValue || 0)}`,
                size: 20,
                color: "666666",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          // Main Comparison Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" },
              left: { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" },
              right: { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" },
              insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" },
            },
            rows: [
              // Header row
              new TableRow({
                children: [
                  new TableCell({ 
                    children: [new Paragraph({ 
                      children: [new TextRun({ text: "Loan Parameters", bold: true, color: "FFFFFF" })],
                      alignment: AlignmentType.CENTER 
                    })],
                    shading: { fill: "003366" },
                    width: { size: 20, type: WidthType.PERCENTAGE },
                  }),
                  ...processedScenarios.map((scenario, index) => 
                    new TableCell({ 
                      children: [
                        new Paragraph({ 
                          children: [new TextRun({ text: `Option ${index + 1}`, bold: true, color: "FFFFFF" })],
                          alignment: AlignmentType.CENTER 
                        }),
                        new Paragraph({ 
                          children: [new TextRun({ text: extractNoteBuyerFromName(scenario.name), size: 18, color: "FFFFFF" })],
                          alignment: AlignmentType.CENTER 
                        })
                      ],
                      shading: { fill: "003366" },
                      width: { size: Math.floor(80 / scenariosWithResults.length), type: WidthType.PERCENTAGE },
                    })
                  ),
                ],
              }),

              // LOAN STRUCTURE Section Header
              new TableRow({
                children: [
                  new TableCell({ 
                    children: [new Paragraph({ 
                      children: [new TextRun({ text: "LOAN STRUCTURE", bold: true, size: 14 })] 
                    })],
                    shading: { fill: "F0F0F0" },
                  }),
                  ...scenariosWithResults.map(() => 
                    new TableCell({ 
                      children: [new Paragraph("")],
                      shading: { fill: "F0F0F0" },
                    })
                  ),
                ],
              }),

              // Loan Amount
              new TableRow({
                children: [
                  new TableCell({ 
                    children: [new Paragraph({ children: [new TextRun({ text: "Loan Amount", bold: true })] })],
                    shading: { fill: "E8F4FD" },
                  }),
                  ...scenariosWithResults.map(scenario => 
                    new TableCell({ 
                      children: [new Paragraph({ 
                        children: [new TextRun(formatCurrency(scenario.form_data.loanAmount || 0))],
                        alignment: AlignmentType.CENTER 
                      })] 
                    })
                  ),
                ],
              }),

              // LTV Ratio
              new TableRow({
                children: [
                  new TableCell({ 
                    children: [new Paragraph({ children: [new TextRun({ text: "LTV Ratio", bold: true })] })],
                    shading: { fill: "E8F4FD" },
                  }),
                  ...scenariosWithResults.map(scenario => {
                    const ltv = scenario.form_data.loanAmount && scenario.form_data.propertyValue ? 
                      ((scenario.form_data.loanAmount / scenario.form_data.propertyValue) * 100).toFixed(1) : 
                      scenario.form_data.ltv || 'N/A';
                    return new TableCell({ 
                      children: [new Paragraph({ 
                        children: [new TextRun(`${ltv}%`)],
                        alignment: AlignmentType.CENTER 
                      })] 
                    });
                  }),
                ],
              }),

              // Property Type
              new TableRow({
                children: [
                  new TableCell({ 
                    children: [new Paragraph({ children: [new TextRun({ text: "Property Type", bold: true })] })],
                    shading: { fill: "E8F4FD" },
                  }),
                  ...scenariosWithResults.map(scenario => 
                    new TableCell({ 
                      children: [new Paragraph({ 
                        children: [new TextRun(scenario.form_data.propertyType || 'N/A')],
                        alignment: AlignmentType.CENTER 
                      })] 
                    })
                  ),
                ],
              }),

              // PRICING & RATES Section Header
              new TableRow({
                children: [
                  new TableCell({ 
                    children: [new Paragraph({ 
                      children: [new TextRun({ text: "PRICING & RATES", bold: true, size: 14 })] 
                    })],
                    shading: { fill: "F0F0F0" },
                  }),
                  ...scenariosWithResults.map(() => 
                    new TableCell({ 
                      children: [new Paragraph("")],
                      shading: { fill: "F0F0F0" },
                    })
                  ),
                ],
              }),

              // Best Interest Rate
              new TableRow({
                children: [
                  new TableCell({ 
                    children: [new Paragraph({ children: [new TextRun({ text: "Best Interest Rate", bold: true })] })],
                    shading: { fill: "E8F4FD" },
                  }),
                  ...scenariosWithResults.map(scenario => {
                    const bestRate = scenario.results?.length > 0 ? 
                      Math.min(...scenario.results.map((r: any) => r.rate)) : 0;
                    return new TableCell({ 
                      children: [new Paragraph({ 
                        children: [new TextRun(formatRate(bestRate))],
                        alignment: AlignmentType.CENTER 
                      })] 
                    });
                  }),
                ],
              }),

              // Best Pricing
              new TableRow({
                children: [
                  new TableCell({ 
                    children: [new Paragraph({ children: [new TextRun({ text: "Best Pricing", bold: true })] })],
                    shading: { fill: "E8F4FD" },
                  }),
                  ...scenariosWithResults.map(scenario => {
                    const bestPrice = scenario.results?.length > 0 ? 
                      Math.max(...scenario.results.map((r: any) => r.price)) : 0;
                    return new TableCell({ 
                      children: [new Paragraph({ 
                        children: [new TextRun(`${bestPrice.toFixed(3)}%`)],
                        alignment: AlignmentType.CENTER 
                      })] 
                    });
                  }),
                ],
              }),

              // CASH FLOW ANALYSIS Section Header
              new TableRow({
                children: [
                  new TableCell({ 
                    children: [new Paragraph({ 
                      children: [new TextRun({ text: "CASH FLOW ANALYSIS", bold: true, size: 14 })] 
                    })],
                    shading: { fill: "F0F0F0" },
                  }),
                  ...scenariosWithResults.map(() => 
                    new TableCell({ 
                      children: [new Paragraph("")],
                      shading: { fill: "F0F0F0" },
                    })
                  ),
                ],
              }),

              // Monthly Rental Income
              new TableRow({
                children: [
                  new TableCell({ 
                    children: [new Paragraph({ children: [new TextRun({ text: "Monthly Rental Income", bold: true })] })],
                    shading: { fill: "E8F4FD" },
                  }),
                  ...scenariosWithResults.map(scenario => 
                    new TableCell({ 
                      children: [new Paragraph({ 
                        children: [new TextRun(formatCurrency(scenario.form_data.monthlyRent || 0))],
                        alignment: AlignmentType.CENTER 
                      })] 
                    })
                  ),
                ],
              }),

              // DSCR
              new TableRow({
                children: [
                  new TableCell({ 
                    children: [new Paragraph({ children: [new TextRun({ text: "DSCR", bold: true })] })],
                    shading: { fill: "E8F4FD" },
                  }),
                  ...scenariosWithResults.map(scenario => 
                    new TableCell({ 
                      children: [new Paragraph({ 
                        children: [new TextRun(`${scenario.form_data.dscr || 'N/A'}`)],
                        alignment: AlignmentType.CENTER 
                      })] 
                    })
                  ),
                ],
              }),

              // NOTE BUYERS Section Header
              new TableRow({
                children: [
                  new TableCell({ 
                    children: [new Paragraph({ 
                      children: [new TextRun({ text: "NOTE BUYERS", bold: true, size: 14 })] 
                    })],
                    shading: { fill: "F0F0F0" },
                  }),
                  ...scenariosWithResults.map(() => 
                    new TableCell({ 
                      children: [new Paragraph("")],
                      shading: { fill: "F0F0F0" },
                    })
                  ),
                ],
              }),

              // Available Buyers Count
              new TableRow({
                children: [
                  new TableCell({ 
                    children: [new Paragraph({ children: [new TextRun({ text: "Available Buyers", bold: true })] })],
                    shading: { fill: "E8F4FD" },
                  }),
                  ...scenariosWithResults.map(scenario => 
                    new TableCell({ 
                      children: [new Paragraph({ 
                        children: [new TextRun(`${scenario.results?.length || 0} buyers`)],
                        alignment: AlignmentType.CENTER 
                      })] 
                    })
                  ),
                ],
              }),

              // Top Buyer Names
              new TableRow({
                children: [
                  new TableCell({ 
                    children: [new Paragraph({ children: [new TextRun({ text: "Top Buyers", bold: true })] })],
                    shading: { fill: "E8F4FD" },
                  }),
                  ...scenariosWithResults.map(scenario => {
                    const topBuyers = scenario.results?.slice(0, 2).map((r: any) => r.buyer_name).join(', ') || 'None';
                    return new TableCell({ 
                      children: [new Paragraph({ 
                        children: [new TextRun(topBuyers)],
                        alignment: AlignmentType.CENTER 
                      })] 
                    });
                  }),
                ],
              }),
            ],
          }),

          // Summary Section
          new Paragraph({
            children: [
              new TextRun({
                text: "Option Summary & Recommendations",
                bold: true,
                size: 24,
                color: "003366",
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 600, after: 300 },
          }),

          // Individual option summaries
          ...scenariosWithResults.map((scenario, index) => [
            new Paragraph({
              children: [
                new TextRun({
                  text: `Option ${index + 1}: ${scenario.name}`,
                  bold: true,
                  size: 20,
                  color: "003366",
                }),
              ],
              heading: HeadingLevel.HEADING_3,
              spacing: { before: 300, after: 100 },
            }),

            new Paragraph({
              children: [
                new TextRun(`Loan Amount: ${formatCurrency(scenario.form_data.loanAmount || 0)}`),
              ],
              spacing: { after: 50 },
            }),

            new Paragraph({
              children: [
                new TextRun(`Property Value: ${formatCurrency(scenario.form_data.propertyValue || 0)}`),
              ],
              spacing: { after: 50 },
            }),

            new Paragraph({
              children: [
                new TextRun(`LTV: ${scenario.form_data.loanAmount && scenario.form_data.propertyValue ? 
                  ((scenario.form_data.loanAmount / scenario.form_data.propertyValue) * 100).toFixed(1) : 
                  scenario.form_data.ltv || 'N/A'}%`),
              ],
              spacing: { after: 50 },
            }),

            new Paragraph({
              children: [
                new TextRun(`DSCR: ${scenario.form_data.dscr || 'N/A'}`),
              ],
              spacing: { after: 50 },
            }),

            new Paragraph({
              children: [
                new TextRun(`Available Note Buyers: ${scenario.results?.length || 0}`),
              ],
              spacing: { after: 100 },
            }),

            ...(scenario.results?.length > 0 ? 
              scenario.results.slice(0, 3).map((result: any) => 
                new Paragraph({
                  children: [
                    new TextRun(`• ${result.buyer_name}: ${formatRate(result.rate)} rate, ${result.price.toFixed(3)}% price`),
                  ],
                  spacing: { after: 50 },
                })
              ) : [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "No pricing results available for this scenario.",
                      italics: true
                    }),
                  ],
                  spacing: { after: 50 },
                })
              ]
            ),

            new Paragraph({
              text: "",
              spacing: { after: 200 },
            }),
          ]).flat(),
        ],
      }],
    });

    const buffer = await Packer.toBuffer(doc);
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    
    const fileName = `client-presentation-${new Date().toISOString().split('T')[0]}.docx`;
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
    <>
      <ClientPresentationPreview 
        scenarios={scenariosForPresentation}
        open={showPresentationPreview}
        onOpenChange={setShowPresentationPreview}
      />
      
      <div className="space-y-4">
      {/* Selection Panel - shows when scenarios are selected */}
      {selectedScenarios.size > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-primary">
                  {selectedScenarios.size} scenarios selected
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Ready to generate client presentation
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={generateClientPresentation}
                  disabled={isGeneratingPresentation}
                  className="flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  {isGeneratingPresentation ? 'Generating Grid...' : 'Generate Comparison Grid (Word)'}
                </Button>
                <Button
                  variant="outline"
                  onClick={clearSelection}
                  size="sm"
                >
                  <X className="w-4 h-4" />
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Saved Scenarios</h2>
          {selectedScenarios.size > 0 && (
            <Badge variant="secondary" className="ml-2">
              {selectedScenarios.size} selected
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
        // List View with Checkboxes
        scenarios.map((scenario) => (
          <Card key={scenario.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedScenarios.has(scenario.id)}
                    onCheckedChange={(checked) => handleScenarioSelect(scenario.id, !!checked)}
                  />
                  <CardTitle className="flex items-center gap-2">
                    {scenario.name}
                    <Badge variant="outline">
                      {new Date(scenario.created_at).toLocaleDateString()}
                    </Badge>
                  </CardTitle>
                </div>
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
        // Grid View by Note Buyer with Checkboxes
        <div className="space-y-6">
          {Object.entries(groupedByNoteBuyer).map(([noteBuyer, noteBuyerScenarios]) => (
            <div key={noteBuyer} className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold">{noteBuyer}</h3>
                <Badge variant="secondary">{noteBuyerScenarios.length} scenarios</Badge>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {noteBuyerScenarios.map((scenario) => (
                  <Card key={scenario.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2 px-4 pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          <Checkbox
                            checked={selectedScenarios.has(scenario.id)}
                            onCheckedChange={(checked) => handleScenarioSelect(scenario.id, checked as boolean)}
                            className="mt-0.5 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-sm leading-tight mb-1 truncate">
                              {scenario.name}
                            </CardTitle>
                            <Badge variant="outline" className="text-xs">
                              {new Date(scenario.created_at).toLocaleDateString()}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-1 ml-1 flex-shrink-0">
                          {onSelectScenario && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onSelectScenario(scenario)}
                              className="px-1.5 h-7 text-xs"
                            >
                              Load
                            </Button>
                          )}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteScenario(scenario.id)}
                            className="px-1.5 h-7"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0 px-4 pb-4">
                      <div className="space-y-1.5 text-xs">
                        <div className="space-y-1">
                          <div>
                            <span className="font-medium text-gray-600">Amount:</span>
                            <div className="text-muted-foreground font-medium">
                              {formatCurrency(scenario.form_data.loanAmount || 0)}
                            </div>
                          </div>
                          <div className="grid grid-cols-4 gap-4">
                            <div>
                              <span className="font-medium text-gray-600">LTV:</span>
                              <div className="text-muted-foreground">
                                {scenario.form_data.ltv || 0}%
                              </div>
                            </div>
                            <div>
                              <span className="font-medium text-gray-600">DSCR:</span>
                              <div className="text-muted-foreground">
                                {scenario.form_data.dscr || 0}
                              </div>
                            </div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Borrower:</span>
                            <div className="text-muted-foreground truncate">
                              {scenario.form_data.borrowerName || 'N/A'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-1 flex-wrap">
                          {scenario.form_data.points > 0 && (
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              {scenario.form_data.points}pts
                            </Badge>
                          )}
                          {scenario.form_data.interestOnly === 'Yes' && (
                            <Badge variant="secondary" className="text-xs px-1 py-0">
                              IO
                            </Badge>
                          )}
                          {scenario.form_data.propertyType && (
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              {scenario.form_data.propertyType.substring(0, 8)}
                            </Badge>
                          )}
                        </div>

                        {/* Show pricing results count if available */}
                        {scenarioResults[scenario.id] && scenarioResults[scenario.id].length > 0 && (
                          <div className="pt-1.5 border-t">
                            <Badge variant="default" className="text-xs px-2 py-0">
                              {scenarioResults[scenario.id].length} result{scenarioResults[scenario.id].length !== 1 ? 's' : ''}
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
    </>
  );
};

export default ScenarioGrid;
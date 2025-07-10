import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, FileText, Eye, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ComparisonGridPreviewProps {
  selectedScenarios: any[];
  onGenerateDocument: (editedScenarios?: any[]) => void;
  onClose: () => void;
}

const ComparisonGridPreview = ({ selectedScenarios, onGenerateDocument, onClose }: ComparisonGridPreviewProps) => {
  console.log('🔍 ComparisonGridPreview received scenarios:', selectedScenarios);
  selectedScenarios.forEach((scenario, index) => {
    console.log(`Scenario ${index}:`, {
      name: scenario.name,
      hasResults: !!scenario.results,
      resultsLength: scenario.results?.length || 0,
      results: scenario.results,
      formData: scenario.form_data
    });
  });
  
  const [editableScenarios, setEditableScenarios] = useState(selectedScenarios);
  const [editingCell, setEditingCell] = useState<{ scenarioIndex: number; field: string } | null>(null);

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

  const formatPoints = (points: number) => {
    return `${points.toFixed(2)}%`;
  };

  const getPropertyInfo = () => {
    if (editableScenarios.length === 0) return { address: '', propertyType: '', value: 0 };
    
    const first = editableScenarios[0];
    const formData = first.form_data || first;
    return {
      address: formData.propertyAddress || '',
      propertyType: formData.propertyType || '',
      value: formData.propertyValue || (formData.loanAmount ? Math.round(formData.loanAmount / ((formData.ltv || 75) / 100)) : 0)
    };
  };

  const propertyInfo = getPropertyInfo();

  const handleCellEdit = (scenarioIndex: number, field: string, value: string) => {
    const updatedScenarios = [...editableScenarios];
    let parsedValue: any = value;
    
    // Parse numeric values
    if (['loanAmount', 'interestRate', 'monthlyPayment', 'ltv', 'dscr', 'points'].includes(field)) {
      parsedValue = parseFloat(value.replace(/[^\d.-]/g, '')) || 0;
    }
    
    const scenario = updatedScenarios[scenarioIndex];
    
    // Update form_data fields
    if (['loanAmount', 'ltv', 'dscr', 'monthlyPayment'].includes(field)) {
      updatedScenarios[scenarioIndex] = {
        ...scenario,
        form_data: {
          ...scenario.form_data,
          [field]: parsedValue
        }
      };
    } 
    // Update results for rate and points
    else if (['interestRate', 'points'].includes(field)) {
      const results = scenario.results || [];
      if (results.length > 0) {
        const updatedResults = results.map((result: any) => ({
          ...result,
          rate: field === 'interestRate' ? parsedValue : result.rate,
          additional_data: {
            ...result.additional_data,
            points: field === 'points' ? parsedValue : result.additional_data?.points || 0
          }
        }));
        
        updatedScenarios[scenarioIndex] = {
          ...scenario,
          results: updatedResults
        };
      }
    }
    
    setEditableScenarios(updatedScenarios);
  };

  const getBestValue = (field: string) => {
    const values = editableScenarios.map(scenario => {
      const formData = scenario.form_data || scenario;
      const results = scenario.results || [];
      const bestResult = results.length > 0 ? results.reduce((best: any, current: any) => 
        current.rate < best.rate ? current : best
      ) : null;
      
      switch (field) {
        case 'ltv': return formData.ltv || 75;
        case 'loanAmount': return formData.loanAmount || 0;
        case 'interestRate': return bestResult?.rate || 0;
        case 'points': return 0; // Default points
        case 'monthlyPayment': return 0; // Will be calculated
        case 'dscr': return formData.dscr || 0;
        default: return 0;
      }
    });

    switch (field) {
      case 'ltv':
      case 'loanAmount':
      case 'dscr':
        return Math.max(...values);
      case 'interestRate':
      case 'points':
      case 'monthlyPayment':
        return Math.min(...values);
      default:
        return Math.max(...values);
    }
  };

  const getCellClass = (scenario: any, field: string) => {
    const formData = scenario.form_data || scenario;
    const results = scenario.results || [];
    const bestResult = results.length > 0 ? results.reduce((best: any, current: any) => 
      current.rate < best.rate ? current : best
    ) : null;
    
    let value = 0;
    switch (field) {
      case 'ltv': 
        value = formData.ltv || 75;
        break;
      case 'loanAmount': 
        value = formData.loanAmount || 0;
        break;
      case 'interestRate': 
        value = bestResult?.rate || 0;
        break;
      case 'points': 
        value = 0;
        break;
      case 'monthlyPayment': 
        value = 0;
        break;
      case 'dscr': 
        value = formData.dscr || 0;
        break;
      default: 
        value = 0;
    }
    
    const bestValue = getBestValue(field);
    
    if (value === bestValue && value > 0) {
      return 'best-option';
    }
    
    // Good option criteria (close to best)
    const tolerance = 0.1; // 10% tolerance
    const isGood = bestValue > 0 && Math.abs((value - bestValue) / bestValue) <= tolerance;
    
    if (isGood && field !== 'interestRate' && field !== 'points' && field !== 'monthlyPayment') {
      return 'good-option';
    }
    
    return 'standard-option';
  };

  const getCashFlowClass = (cashFlow: number) => {
    if (cashFlow > 0) return 'positive';
    if (cashFlow < 0) return 'negative';
    return 'neutral';
  };

  const calculateCashFlow = (scenario: any) => {
    const formData = scenario.form_data || scenario;
    const monthlyRent = formData.monthlyRent || 4500;
    const taxes = 200; // Monthly taxes
    const insurance = 150; // Monthly insurance
    const monthlyPayment = calculateMonthlyPayment(scenario);
    const totalPiti = monthlyPayment + taxes + insurance;
    return monthlyRent - totalPiti;
  };

  const calculateDownPayment = (scenario: any) => {
    const formData = scenario.form_data || scenario;
    const propertyValue = formData.propertyValue || (formData.loanAmount ? Math.round(formData.loanAmount / ((formData.ltv || 75) / 100)) : 0);
    return propertyValue - (formData.loanAmount || 0);
  };

  const calculateMonthlyPayment = (scenario: any) => {
    const formData = scenario.form_data || scenario;
    const results = scenario.results || [];
    
    // First check if we have a result with monthlyPayment already calculated
    if (results.length > 0) {
      const resultWithPayment = results.find((r: any) => r.additional_data?.monthlyPayment);
      if (resultWithPayment) {
        return resultWithPayment.additional_data.monthlyPayment;
      }
    }
    
    const bestResult = results.length > 0 ? results.reduce((best: any, current: any) => 
      current.rate < best.rate ? current : best
    ) : null;
    
    if (bestResult) {
      const principal = formData.loanAmount || 0;
      const monthlyRate = (bestResult.rate / 100) / 12;
      const numPayments = 360; // 30 years
      
      if (monthlyRate === 0) return principal / numPayments;
      
      const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                            (Math.pow(1 + monthlyRate, numPayments) - 1);
      return monthlyPayment;
    }
    
    return 0;
  };

  const EditableCell = ({ value, scenarioIndex, field, className = "" }: { 
    value: any; 
    scenarioIndex: number; 
    field: string; 
    className?: string; 
  }) => {
    const isEditing = editingCell?.scenarioIndex === scenarioIndex && editingCell?.field === field;
    
    if (isEditing) {
      return (
        <Input
          value={value}
          onChange={(e) => handleCellEdit(scenarioIndex, field, e.target.value)}
          onBlur={() => setEditingCell(null)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              setEditingCell(null);
            }
          }}
          className="h-8 text-center"
          autoFocus
        />
      );
    }

    return (
      <div 
        className={`cursor-pointer hover:bg-gray-100 p-1 rounded text-center ${className}`}
        onClick={() => setEditingCell({ scenarioIndex, field })}
      >
        {value}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-start justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full my-8">
      <style>{`
        .best-option {
          background-color: #d4ffd4 !important;
          font-weight: bold;
        }
        .good-option {
          background-color: #fffacd !important;
        }
        .standard-option {
          background-color: white;
        }
        .positive {
          color: green !important;
          font-weight: bold;
        }
        .negative {
          color: red !important;
        }
        .neutral {
          color: #666;
        }
      `}</style>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-center text-dominion-blue">
                Note Buyer Comparison Grid Preview
              </CardTitle>
              <div className="text-center text-dominion-gray mt-2">
                <strong>Property:</strong> {propertyInfo.address} | <strong>{propertyInfo.propertyType}</strong> | <strong>Value:</strong> {formatCurrency(propertyInfo.value)}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={onClose} variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Back to Results
              </Button>
              <Button onClick={() => onGenerateDocument(editableScenarios)} className="bg-dominion-blue hover:bg-dominion-blue/90">
                <FileText className="w-4 h-4 mr-2" />
                Generate Word Document
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-dominion-blue">
              <Edit className="w-4 h-4" />
              <span>Click any cell to edit values before generating the document</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table className="comparison-table border-collapse w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-dominion-blue text-white sticky left-0 z-10">
                    Loan Parameters
                  </TableHead>
                  {editableScenarios.map((scenario, index) => {
                    const noteBuyer = scenario.name ? scenario.name.split(' - ').pop() : `Product ${String.fromCharCode(65 + index)}`;
                    return (
                      <TableHead key={index} className="bg-dominion-blue text-white text-center min-w-[150px]">
                        <div className="font-bold">{noteBuyer}</div>
                        <div className="text-xs font-normal">30-Year Fixed</div>
                      </TableHead>
                    );
                  })}
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {/* LOAN STRUCTURE */}
                <TableRow>
                  <TableCell colSpan={editableScenarios.length + 1} className="bg-gray-100 font-bold uppercase text-sm">
                    Loan Structure
                  </TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell className="bg-blue-50 font-bold sticky left-0 z-5">Maximum LTV</TableCell>
                  {editableScenarios.map((scenario, index) => {
                    const formData = scenario.form_data || scenario;
                    return (
                      <TableCell key={index} className={getCellClass(scenario, 'ltv')}>
                        <EditableCell 
                          value={`${formData.ltv || 75}%`} 
                          scenarioIndex={index} 
                          field="ltv"
                        />
                      </TableCell>
                    );
                  })}
                </TableRow>

                <TableRow>
                  <TableCell className="bg-blue-50 font-bold sticky left-0 z-5">Loan Amount (at Max LTV)</TableCell>
                  {editableScenarios.map((scenario, index) => {
                    const formData = scenario.form_data || scenario;
                    return (
                      <TableCell key={index} className={getCellClass(scenario, 'loanAmount')}>
                        <EditableCell 
                          value={formatCurrency(formData.loanAmount || 0)} 
                          scenarioIndex={index} 
                          field="loanAmount"
                        />
                      </TableCell>
                    );
                  })}
                </TableRow>

                <TableRow>
                  <TableCell className="bg-blue-50 font-bold sticky left-0 z-5">Loan Type</TableCell>
                  {editableScenarios.map((scenario, index) => (
                    <TableCell key={index} className="text-center">30-Year Fixed</TableCell>
                  ))}
                </TableRow>

                <TableRow>
                  <TableCell className="bg-blue-50 font-bold sticky left-0 z-5">Amortization</TableCell>
                  {editableScenarios.map((scenario, index) => (
                    <TableCell key={index} className="text-center">360 months</TableCell>
                  ))}
                </TableRow>

                {/* PRICING & RATES */}
                <TableRow>
                  <TableCell colSpan={editableScenarios.length + 1} className="bg-gray-100 font-bold uppercase text-sm">
                    Pricing & Rates
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="bg-blue-50 font-bold sticky left-0 z-5">Interest Rate</TableCell>
                  {editableScenarios.map((scenario, index) => {
                    const results = scenario.results || [];
                    const bestResult = results.length > 0 ? results.reduce((best: any, current: any) => 
                      current.rate < best.rate ? current : best
                    ) : null;
                    return (
                      <TableCell key={index} className={getCellClass(scenario, 'interestRate')}>
                        <EditableCell 
                          value={formatRate(bestResult?.rate || 0)} 
                          scenarioIndex={index} 
                          field="interestRate"
                        />
                      </TableCell>
                    );
                  })}
                </TableRow>

                <TableRow>
                  <TableCell className="bg-blue-50 font-bold sticky left-0 z-5">Origination Points</TableCell>
                  {editableScenarios.map((scenario, index) => (
                    <TableCell key={index} className={getCellClass(scenario, 'points')}>
                      <EditableCell 
                        value={formatPoints(0)} 
                        scenarioIndex={index} 
                        field="points"
                      />
                    </TableCell>
                  ))}
                </TableRow>

                <TableRow>
                  <TableCell className="bg-blue-50 font-bold sticky left-0 z-5">Origination Fee ($)</TableCell>
                  {editableScenarios.map((scenario, index) => {
                    const formData = scenario.form_data || scenario;
                    const fee = (formData.loanAmount || 0) * (0) / 100; // No points for now
                    return (
                      <TableCell key={index} className="text-center">
                        {formatCurrency(fee)}
                      </TableCell>
                    );
                  })}
                </TableRow>

                {/* MONTHLY PAYMENTS */}
                <TableRow>
                  <TableCell colSpan={editableScenarios.length + 1} className="bg-gray-100 font-bold uppercase text-sm">
                    Monthly Payments
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="bg-blue-50 font-bold sticky left-0 z-5">Principal & Interest</TableCell>
                  {editableScenarios.map((scenario, index) => {
                    const monthlyPayment = calculateMonthlyPayment(scenario);
                    return (
                      <TableCell key={index} className={getCellClass(scenario, 'monthlyPayment')}>
                        <EditableCell 
                          value={formatCurrency(monthlyPayment)} 
                          scenarioIndex={index} 
                          field="monthlyPayment"
                        />
                      </TableCell>
                    );
                  })}
                </TableRow>

                <TableRow>
                  <TableCell className="bg-blue-50 font-bold sticky left-0 z-5">Taxes (Monthly)</TableCell>
                  {editableScenarios.map((scenario, index) => (
                    <TableCell key={index} className="text-center">$200</TableCell>
                  ))}
                </TableRow>

                <TableRow>
                  <TableCell className="bg-blue-50 font-bold sticky left-0 z-5">Insurance (Monthly)</TableCell>
                  {editableScenarios.map((scenario, index) => (
                    <TableCell key={index} className="text-center">$150</TableCell>
                  ))}
                </TableRow>

                <TableRow>
                  <TableCell className="bg-blue-50 font-bold sticky left-0 z-5">Total PITI</TableCell>
                  {editableScenarios.map((scenario, index) => {
                    const monthlyPayment = calculateMonthlyPayment(scenario);
                    const totalPiti = monthlyPayment + 200 + 150;
                    return (
                      <TableCell key={index} className="text-center">
                        {formatCurrency(totalPiti)}
                      </TableCell>
                    );
                  })}
                </TableRow>

                {/* CASH FLOW ANALYSIS */}
                <TableRow>
                  <TableCell colSpan={editableScenarios.length + 1} className="bg-gray-100 font-bold uppercase text-sm">
                    Cash Flow Analysis
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="bg-blue-50 font-bold sticky left-0 z-5">Monthly Rental Income</TableCell>
                  {editableScenarios.map((scenario, index) => {
                    const formData = scenario.form_data || scenario;
                    return (
                      <TableCell key={index} className="text-center">
                        {formatCurrency(formData.monthlyRent || 4500)}
                      </TableCell>
                    );
                  })}
                </TableRow>

                <TableRow>
                  <TableCell className="bg-blue-50 font-bold sticky left-0 z-5">Net Cash Flow</TableCell>
                  {editableScenarios.map((scenario, index) => {
                    const cashFlow = calculateCashFlow(scenario);
                    return (
                      <TableCell key={index} className={`text-center ${getCashFlowClass(cashFlow)}`}>
                        {formatCurrency(cashFlow)}
                      </TableCell>
                    );
                  })}
                </TableRow>

                <TableRow>
                  <TableCell className="bg-blue-50 font-bold sticky left-0 z-5">DSCR</TableCell>
                  {editableScenarios.map((scenario, index) => {
                    const formData = scenario.form_data || scenario;
                    return (
                      <TableCell key={index} className={getCellClass(scenario, 'dscr')}>
                        <EditableCell 
                          value={(formData.dscr || 0).toFixed(2)} 
                          scenarioIndex={index} 
                          field="dscr"
                        />
                      </TableCell>
                    );
                  })}
                </TableRow>

                {/* CASH TO CLOSE */}
                <TableRow>
                  <TableCell colSpan={editableScenarios.length + 1} className="bg-gray-100 font-bold uppercase text-sm">
                    Cash to Close
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="bg-blue-50 font-bold sticky left-0 z-5">Down Payment</TableCell>
                  {editableScenarios.map((scenario, index) => {
                    const downPayment = calculateDownPayment(scenario);
                    return (
                      <TableCell key={index} className="text-center">
                        {formatCurrency(downPayment)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-xl text-slate-800">AI Analysis</h3>
                <p className="text-sm text-slate-600">Powered by Advanced Analytics</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 border border-slate-100">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-4">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Coming Soon
                </div>
                <h4 className="text-lg font-semibold text-slate-800 mb-3">
                  Enterprise Intelligence Features
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <h5 className="font-medium text-slate-700 text-sm">Recoup Analysis</h5>
                    <p className="text-xs text-slate-500 mt-1">Cost recovery insights</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h5 className="font-medium text-slate-700 text-sm">NTB Analytics</h5>
                    <p className="text-xs text-slate-500 mt-1">Net tangible benefit tracking</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                      </svg>
                    </div>
                    <h5 className="font-medium text-slate-700 text-sm">Quote Comparison</h5>
                    <p className="text-xs text-slate-500 mt-1">Competitive analysis engine</p>
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Our AI-powered analysis engine will provide comprehensive insights on cost recovery strategies, 
                  net tangible benefits, and automated competitor quote comparisons to optimize your lending decisions.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  );
};

export default ComparisonGridPreview;
import { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow, WidthType, AlignmentType, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

interface LoanQuoteData {
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
}

export const generateLoanQuote = async (data: LoanQuoteData) => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Compact Header
        new Paragraph({
          children: [
            new TextRun({
              text: "DOMINION FINANCIAL",
              bold: true,
              size: 36,
              color: "1E40AF",
              font: "Segoe UI"
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "THE LENDER FOR REAL ESTATE INVESTORS",
              size: 20,
              color: "64748B",
              font: "Segoe UI"
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 }
        }),

        // Date and Borrower Info (Compact)
        new Paragraph({
          children: [
            new TextRun({ text: `Date: ${data.date}`, size: 20 }),
            new TextRun({ text: `     Hi ${data.borrowerName},`, size: 20 })
          ],
          spacing: { after: 150 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Below is a quote based on the information you provided, and the loan program that I identified with the best terms to match your needs.",
              size: 20
            })
          ],
          spacing: { after: 100 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "NEXT STEP: ",
              bold: true,
              size: 20,
              color: "1E40AF"
            }),
            new TextRun({
              text: "If the quote works for you, attached is a credit card authorization form - once you complete & submit, I will patch in my team to order the appraisal.",
              size: 20
            })
          ],
          spacing: { after: 200 }
        }),

        // Product Header (Compact)
        new Paragraph({
          children: [
            new TextRun({
              text: `Product K DSCR 30 Year Fixed`,
              bold: true,
              size: 22,
              color: "FFFFFF"
            })
          ],
          alignment: AlignmentType.CENTER,
          shading: {
            fill: "1E40AF"
          },
          spacing: { after: 100 }
        }),

        // Loan Officer Info (Compact)
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Prepared For:", bold: true, size: 18 })] })],
                  width: { size: 25, type: WidthType.PERCENTAGE },
                  margins: { top: 100, bottom: 100, left: 100, right: 100 }
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: data.borrowerName, size: 18 })] })],
                  width: { size: 25, type: WidthType.PERCENTAGE },
                  margins: { top: 100, bottom: 100, left: 100, right: 100 }
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Loan Officer:", bold: true, size: 18 })] })],
                  width: { size: 25, type: WidthType.PERCENTAGE },
                  margins: { top: 100, bottom: 100, left: 100, right: 100 }
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: data.loanOfficer, size: 18 })] })],
                  width: { size: 25, type: WidthType.PERCENTAGE },
                  margins: { top: 100, bottom: 100, left: 100, right: 100 }
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Property Address:", bold: true, size: 18 })] })],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 }
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: data.propertyAddress, size: 18 })] })],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 }
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Phone Number:", bold: true, size: 18 })] })],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 }
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: data.phoneNumber, size: 18 })] })],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 }
                })
              ]
            })
          ]
        }),

        // Quote Header
        new Paragraph({
          children: [
            new TextRun({
              text: "Quote",
              bold: true,
              size: 20,
              color: "FFFFFF"
            })
          ],
          shading: {
            fill: "1E40AF"
          },
          spacing: { before: 200, after: 50 }
        }),

        // Compact Quote Details Table
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            // Row 1
            new TableRow({
              children: [
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "# of Properties Quoted:", bold: true, size: 16 })] })],
                  margins: { top: 50, bottom: 50, left: 100, right: 100 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "1", size: 16 })] })],
                  margins: { top: 50, bottom: 50, left: 100, right: 100 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "LTV:", bold: true, size: 16 })] })],
                  margins: { top: 50, bottom: 50, left: 100, right: 100 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: `${data.ltv}%`, size: 16 })] })],
                  margins: { top: 50, bottom: 50, left: 100, right: 100 }
                })
              ]
            }),
            // Row 2
            new TableRow({
              children: [
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "Property Type:", bold: true, size: 16 })] })],
                  margins: { top: 50, bottom: 50, left: 100, right: 100 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: data.propertyType, size: 16 })] })],
                  margins: { top: 50, bottom: 50, left: 100, right: 100 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "Loan Amount:", bold: true, size: 16 })] })],
                  margins: { top: 50, bottom: 50, left: 100, right: 100 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: `$${data.loanAmount.toLocaleString()}`, size: 16, bold: true })] })],
                  margins: { top: 50, bottom: 50, left: 100, right: 100 }
                })
              ]
            }),
            // Row 3
            new TableRow({
              children: [
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "Term:", bold: true, size: 16 })] })],
                  margins: { top: 50, bottom: 50, left: 100, right: 100 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: `${data.loanTerm} months`, size: 16 })] })],
                  margins: { top: 50, bottom: 50, left: 100, right: 100 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "Appraised Value:", bold: true, size: 16 })] })],
                  margins: { top: 50, bottom: 50, left: 100, right: 100 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: `$${Math.round(data.loanAmount / (data.ltv / 100)).toLocaleString()}`, size: 16, bold: true })] })],
                  margins: { top: 50, bottom: 50, left: 100, right: 100 }
                })
              ]
            }),
            // Row 4
            new TableRow({
              children: [
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "Amortization:", bold: true, size: 16 })] })],
                  margins: { top: 50, bottom: 50, left: 100, right: 100 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: `${data.loanTerm} months Fixed`, size: 16 })] })],
                  margins: { top: 50, bottom: 50, left: 100, right: 100 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "Interest Rate:", bold: true, size: 16 })] })],
                  margins: { top: 50, bottom: 50, left: 100, right: 100 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: `${data.interestRate.toFixed(3)}%`, size: 16, bold: true })] })],
                  margins: { top: 50, bottom: 50, left: 100, right: 100 }
                })
              ]
            }),
            // Row 5
            new TableRow({
              children: [
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "Interest Only:", bold: true, size: 16 })] })],
                  margins: { top: 50, bottom: 50, left: 100, right: 100 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "No", size: 16 })] })],
                  margins: { top: 50, bottom: 50, left: 100, right: 100 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "Origination Fee:", bold: true, size: 16 })] })],
                  margins: { top: 50, bottom: 50, left: 100, right: 100 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: `${data.points.toFixed(3)}%`, size: 16, bold: true })] })],
                  margins: { top: 50, bottom: 50, left: 100, right: 100 }
                })
              ]
            }),
            // Row 6
            new TableRow({
              children: [
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "Prepayment:", bold: true, size: 16 })] })],
                  margins: { top: 50, bottom: 50, left: 100, right: 100 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "5/4/3/2/1", size: 16 })] })],
                  margins: { top: 50, bottom: 50, left: 100, right: 100 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "Interest Reserve:", bold: true, size: 16 })] })],
                  margins: { top: 50, bottom: 50, left: 100, right: 100 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "$0", size: 16 })] })],
                  margins: { top: 50, bottom: 50, left: 100, right: 100 }
                })
              ]
            }),
            // Row 7
            new TableRow({
              children: [
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "Monthly Payment (PITIA):", bold: true, size: 16 })] })],
                  margins: { top: 50, bottom: 50, left: 100, right: 100 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: `$${data.monthlyPayment.toLocaleString()}`, size: 16, bold: true })] })],
                  margins: { top: 50, bottom: 50, left: 100, right: 100 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "", size: 16 })] })],
                  margins: { top: 50, bottom: 50, left: 100, right: 100 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "", size: 16 })] })],
                  margins: { top: 50, bottom: 50, left: 100, right: 100 }
                })
              ]
            })
          ]
        }),

        // Property Details Header (Compact)
        new Paragraph({
          children: [
            new TextRun({
              text: "PROPERTY DETAILS",
              bold: true,
              size: 20,
              color: "FFFFFF"
            })
          ],
          shading: {
            fill: "1E40AF"
          },
          spacing: { before: 150, after: 50 }
        }),

        // Compact Property Details Table
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "Loan Purpose:", bold: true, size: 16 })] })],
                  margins: { top: 50, bottom: 50, left: 100, right: 100 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ 
                    children: [new TextRun({ 
                      text: data.loanPurpose,
                      size: 16
                    })] 
                  })],
                  margins: { top: 50, bottom: 50, left: 100, right: 100 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "DSCR Ratio:", bold: true, size: 16 })] })],
                  margins: { top: 50, bottom: 50, left: 100, right: 100 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: data.dscr.toFixed(3), size: 16, bold: true })] })],
                  margins: { top: 50, bottom: 50, left: 100, right: 100 }
                })
              ]
            }),
            // Add Refinance Type row only if it's a refinance loan
            ...(data.refinanceType ? [
              new TableRow({
                children: [
                  new TableCell({ 
                    children: [new Paragraph({ children: [new TextRun({ text: "Refinance Type:", bold: true, size: 16 })] })],
                    margins: { top: 50, bottom: 50, left: 100, right: 100 }
                  }),
                  new TableCell({ 
                    children: [new Paragraph({ 
                      children: [new TextRun({ 
                        text: data.refinanceType,
                        size: 16
                      })] 
                    })],
                    margins: { top: 50, bottom: 50, left: 100, right: 100 }
                  }),
                  new TableCell({ 
                    children: [new Paragraph({ children: [new TextRun({ text: "", size: 16 })] })],
                    margins: { top: 50, bottom: 50, left: 100, right: 100 }
                  }),
                  new TableCell({ 
                    children: [new Paragraph({ children: [new TextRun({ text: "", size: 16 })] })],
                    margins: { top: 50, bottom: 50, left: 100, right: 100 }
                  })
                ]
              })
            ] : [])
          ]
        }),

        // Compact Footer
        new Paragraph({
          children: [
            new TextRun({
              text: "www.DominionFinancialServices.com NMLS# 898795",
              size: 16
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 200 }
        })
      ]
    }]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Loan_Quote_${data.borrowerName.replace(/\s+/g, '_')}_${data.date.replace(/\//g, '-')}.docx`);
};
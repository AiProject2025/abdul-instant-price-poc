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
        // Header
        new Paragraph({
          children: [
            new TextRun({
              text: "DOMINION FINANCIAL SERVICES",
              bold: true,
              size: 32,
              color: "1E40AF"
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        }),

        // Date and Borrower Info
        new Paragraph({
          children: [new TextRun({ text: `Date: ${data.date}`, size: 24 })],
          alignment: AlignmentType.RIGHT,
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [new TextRun({ text: `Hi ${data.borrowerName},`, size: 24 })],
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Below is a quote based on the information you provided, and the loan program that I identified with the best terms to match your needs.",
              size: 24
            })
          ],
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "NEXT STEP: ",
              bold: true,
              size: 24,
              color: "1E40AF"
            }),
            new TextRun({
              text: "If the quote works for you, attached is a credit card authorization form - once you complete & submit, I will patch in my team to order the appraisal. They will also begin gathering documents and coordinate with title.",
              size: 24
            })
          ],
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Don't hesitate to contact me with any questions. I look forward to working with you on this loan!",
              size: 24
            })
          ],
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Please note, the property must be owned by an entity (LLC, corporation, etc.). It cannot be owned by an individual at the time of closing, or it must be transferred to an entity at closing.",
              size: 24
            })
          ],
          spacing: { after: 400 }
        }),

        // DSCR Price Beat Notice
        new Paragraph({
          children: [
            new TextRun({
              text: "***DSCR Price-Beat: ",
              bold: true,
              size: 24,
              color: "DC2626"
            }),
            new TextRun({
              text: "The Dominion Financial Services team is committed to providing the most competitive rates available for DSCR Rental Loans. That is why so many top real estate investors choose DFS! In the unlikely event that you receive a term sheet that is better than what we offer, let us review and beat it.",
              size: 24
            })
          ],
          spacing: { after: 400 }
        }),

        // Product Header
        new Paragraph({
          children: [
            new TextRun({
              text: `Product K DSCR 30 Year Fixed`,
              bold: true,
              size: 28,
              color: "FFFFFF"
            })
          ],
          alignment: AlignmentType.CENTER,
          shading: {
            fill: "1E40AF"
          },
          spacing: { after: 200 }
        }),

        // Loan Officer Info
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Prepared For:", bold: true })] })],
                  width: { size: 25, type: WidthType.PERCENTAGE }
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: data.borrowerName })] })],
                  width: { size: 25, type: WidthType.PERCENTAGE }
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Loan Officer:", bold: true })] })],
                  width: { size: 25, type: WidthType.PERCENTAGE }
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: data.loanOfficer })] })],
                  width: { size: 25, type: WidthType.PERCENTAGE }
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Property Address:", bold: true })] })]
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: data.propertyAddress })] })]
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Phone Number:", bold: true })] })]
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: data.phoneNumber })] })]
                })
              ]
            })
          ],
          margins: { top: 100, bottom: 100, left: 100, right: 100 }
        }),

        // Quote Table Header
        new Paragraph({
          children: [
            new TextRun({
              text: "Quote",
              bold: true,
              size: 24,
              color: "FFFFFF"
            })
          ],
          shading: {
            fill: "1E40AF"
          },
          spacing: { before: 400, after: 200 }
        }),

        // Quote Details Table
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            // Row 1
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "# of Properties Quoted:" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "1" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "LTV:" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `${data.ltv}%` })] })] })
              ]
            }),
            // Row 2
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Property Type:" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: data.propertyType })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Loan Amount:" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `$${data.loanAmount.toLocaleString()}` })] })] })
              ]
            }),
            // Row 3
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Term:" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `${data.loanTerm} months` })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Appraised Value:" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `$${Math.round(data.loanAmount / (data.ltv / 100)).toLocaleString()}` })] })] })
              ]
            }),
            // Row 4
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Amortization:" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `${data.loanTerm} months Fixed` })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Interest Rate:" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `${data.interestRate.toFixed(3)}%` })] })] })
              ]
            }),
            // Row 5
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Interest Only:" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "No" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Origination Fee:" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `${data.points.toFixed(3)}%` })] })] })
              ]
            }),
            // Row 6
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Prepayment:" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "5/4/3/2/1" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Interest Reserve:" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "$0" })] })] })
              ]
            }),
            // Row 7
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Monthly Payment (PITIA):" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `$${data.monthlyPayment.toLocaleString()}` })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "" })] })] })
              ]
            })
          ]
        }),

        // Property Details Header
        new Paragraph({
          children: [
            new TextRun({
              text: "PROPERTY DETAILS",
              bold: true,
              size: 24,
              color: "FFFFFF"
            })
          ],
          shading: {
            fill: "1E40AF"
          },
          spacing: { before: 400, after: 200 }
        }),

        // Property Details Table
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Loan Purpose:" })] })] }),
                new TableCell({ 
                  children: [new Paragraph({ 
                    children: [new TextRun({ 
                      text: data.refinanceType ? `${data.loanPurpose} - ${data.refinanceType}` : data.loanPurpose 
                    })] 
                  })] 
                }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "DSCR Ratio:" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: data.dscr.toFixed(3) })] })] })
              ]
            })
          ]
        }),

        // Footer
        new Paragraph({
          children: [
            new TextRun({
              text: "www.DominionFinancialServices.com NMLS# 898795",
              size: 20
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 800 }
        })
      ]
    }]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Loan_Quote_${data.borrowerName.replace(/\s+/g, '_')}_${data.date.replace(/\//g, '-')}.docx`);
};
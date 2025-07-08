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
        // Modern Header with Gradient Effect
        new Paragraph({
          children: [
            new TextRun({
              text: "DOMINION FINANCIAL SERVICES",
              bold: true,
              size: 40,
              color: "1E40AF",
              font: "Segoe UI"
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          shading: {
            fill: "F8FAFC"
          },
          border: {
            bottom: {
              color: "1E40AF",
              size: 4,
              style: "single"
            }
          }
        }),

        // Elegant Tagline
        new Paragraph({
          children: [
            new TextRun({
              text: "Professional Lending Solutions",
              italics: true,
              size: 22,
              color: "64748B"
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 }
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

        // Modern Loan Officer Info Table
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Prepared For:", bold: true, size: 22, color: "1E40AF" })] })],
                  width: { size: 25, type: WidthType.PERCENTAGE },
                  shading: { fill: "F1F5F9" },
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: data.borrowerName, size: 22 })] })],
                  width: { size: 25, type: WidthType.PERCENTAGE },
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Loan Officer:", bold: true, size: 22, color: "1E40AF" })] })],
                  width: { size: 25, type: WidthType.PERCENTAGE },
                  shading: { fill: "F1F5F9" },
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: data.loanOfficer, size: 22 })] })],
                  width: { size: 25, type: WidthType.PERCENTAGE },
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Property Address:", bold: true, size: 22, color: "1E40AF" })] })],
                  shading: { fill: "F1F5F9" },
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: data.propertyAddress, size: 22 })] })],
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Phone Number:", bold: true, size: 22, color: "1E40AF" })] })],
                  shading: { fill: "F1F5F9" },
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: data.phoneNumber, size: 22 })] })],
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                })
              ]
            })
          ],
          borders: {
            top: { style: "single", size: 1, color: "E2E8F0" },
            bottom: { style: "single", size: 1, color: "E2E8F0" },
            left: { style: "single", size: 1, color: "E2E8F0" },
            right: { style: "single", size: 1, color: "E2E8F0" },
            insideHorizontal: { style: "single", size: 1, color: "E2E8F0" },
            insideVertical: { style: "single", size: 1, color: "E2E8F0" }
          }
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

        // Modern Quote Details Table
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            // Row 1
            new TableRow({
              children: [
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "# of Properties Quoted:", bold: true, size: 22, color: "1E40AF" })] })],
                  shading: { fill: "F1F5F9" },
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "1", size: 22 })] })],
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "LTV:", bold: true, size: 22, color: "1E40AF" })] })],
                  shading: { fill: "F1F5F9" },
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: `${data.ltv}%`, size: 22 })] })],
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                })
              ]
            }),
            // Row 2
            new TableRow({
              children: [
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "Property Type:", bold: true, size: 22, color: "1E40AF" })] })],
                  shading: { fill: "F1F5F9" },
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: data.propertyType, size: 22 })] })],
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "Loan Amount:", bold: true, size: 22, color: "1E40AF" })] })],
                  shading: { fill: "F1F5F9" },
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: `$${data.loanAmount.toLocaleString()}`, size: 22, bold: true, color: "059669" })] })],
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                })
              ]
            }),
            // Row 3
            new TableRow({
              children: [
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "Term:", bold: true, size: 22, color: "1E40AF" })] })],
                  shading: { fill: "F1F5F9" },
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: `${data.loanTerm} months`, size: 22 })] })],
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "Appraised Value:", bold: true, size: 22, color: "1E40AF" })] })],
                  shading: { fill: "F1F5F9" },
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: `$${Math.round(data.loanAmount / (data.ltv / 100)).toLocaleString()}`, size: 22, bold: true, color: "059669" })] })],
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                })
              ]
            }),
            // Row 4
            new TableRow({
              children: [
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "Amortization:", bold: true, size: 22, color: "1E40AF" })] })],
                  shading: { fill: "F1F5F9" },
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: `${data.loanTerm} months Fixed`, size: 22 })] })],
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "Interest Rate:", bold: true, size: 22, color: "1E40AF" })] })],
                  shading: { fill: "F1F5F9" },
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: `${data.interestRate.toFixed(3)}%`, size: 22, bold: true, color: "DC2626" })] })],
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                })
              ]
            }),
            // Row 5
            new TableRow({
              children: [
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "Interest Only:", bold: true, size: 22, color: "1E40AF" })] })],
                  shading: { fill: "F1F5F9" },
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "No", size: 22 })] })],
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "Origination Fee:", bold: true, size: 22, color: "1E40AF" })] })],
                  shading: { fill: "F1F5F9" },
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: `${data.points.toFixed(3)}%`, size: 22, bold: true, color: "DC2626" })] })],
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                })
              ]
            }),
            // Row 6
            new TableRow({
              children: [
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "Prepayment:", bold: true, size: 22, color: "1E40AF" })] })],
                  shading: { fill: "F1F5F9" },
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "5/4/3/2/1", size: 22 })] })],
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "Interest Reserve:", bold: true, size: 22, color: "1E40AF" })] })],
                  shading: { fill: "F1F5F9" },
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "$0", size: 22 })] })],
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                })
              ]
            }),
            // Row 7
            new TableRow({
              children: [
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "Monthly Payment (PITIA):", bold: true, size: 22, color: "1E40AF" })] })],
                  shading: { fill: "F1F5F9" },
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: `$${data.monthlyPayment.toLocaleString()}`, size: 22, bold: true, color: "059669" })] })],
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "", size: 22 })] })],
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "", size: 22 })] })],
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                })
              ]
            })
          ],
          borders: {
            top: { style: "single", size: 1, color: "E2E8F0" },
            bottom: { style: "single", size: 1, color: "E2E8F0" },
            left: { style: "single", size: 1, color: "E2E8F0" },
            right: { style: "single", size: 1, color: "E2E8F0" },
            insideHorizontal: { style: "single", size: 1, color: "E2E8F0" },
            insideVertical: { style: "single", size: 1, color: "E2E8F0" }
          }
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

        // Modern Property Details Table
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "Loan Purpose:", bold: true, size: 22, color: "1E40AF" })] })],
                  shading: { fill: "F1F5F9" },
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ 
                    children: [new TextRun({ 
                      text: data.refinanceType ? `${data.loanPurpose} - ${data.refinanceType}` : data.loanPurpose,
                      size: 22
                    })] 
                  })],
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: "DSCR Ratio:", bold: true, size: 22, color: "1E40AF" })] })],
                  shading: { fill: "F1F5F9" },
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                }),
                new TableCell({ 
                  children: [new Paragraph({ children: [new TextRun({ text: data.dscr.toFixed(3), size: 22, bold: true, color: "059669" })] })],
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                })
              ]
            })
          ],
          borders: {
            top: { style: "single", size: 1, color: "E2E8F0" },
            bottom: { style: "single", size: 1, color: "E2E8F0" },
            left: { style: "single", size: 1, color: "E2E8F0" },
            right: { style: "single", size: 1, color: "E2E8F0" },
            insideHorizontal: { style: "single", size: 1, color: "E2E8F0" },
            insideVertical: { style: "single", size: 1, color: "E2E8F0" }
          }
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
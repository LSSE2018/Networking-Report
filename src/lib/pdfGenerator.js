// src/lib/pdfGenerator.js
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateReportPDF = (reportData) => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(20);
  doc.text('Smart Networking Report', 105, 20, { align: 'center' });
  doc.setFontSize(14);
  doc.text('LAXMI SECURITY SYSTEMS AND ELECTRICALS', 105, 30, { align: 'center' });
  
  // Add basic information
  doc.setFontSize(12);
  doc.text('Basic Information', 14, 40);
  
  // Create tables for connections and tests
  autoTable(doc, {
    head: [['S.N', 'Particulars', 'Remark']],
    body: reportData.connections.map((item, index) => [
      index + 1,
      item.particulars,
      item.remark
    ]),
    startY: 100,
  });
  
  // Add signatures
  if (reportData.customerSignature) {
    doc.addImage(reportData.customerSignature, 'PNG', 30, doc.lastAutoTable.finalY + 20, 60, 30);
  }
  
  // Save the PDF
  doc.save('networking-report.pdf');
};

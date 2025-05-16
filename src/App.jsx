// src/App.jsx
import { useState } from 'react';
import { ReportForm } from './components/ReportForm';
import { generateReportPDF } from './lib/pdfGenerator';

export function App() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signatures, setSignatures] = useState({
    customer: null,
    engineer: null
  });

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const reportData = {
        ...data,
        customerSignature: signatures.customer,
        engineerSignature: signatures.engineer
      };
      console.log('Report submitted:', reportData);
      alert('Report submitted successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGeneratePDF = () => {
    // Collect all form data and generate PDF
    generateReportPDF(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <header className="bg-gray-900 text-white px-6 py-4">
          <h1 className="text-2xl font-bold">Smart Networking Report</h1>
          <p className="font-semibold">LAXMI SECURITY SYSTEMS AND ELECTRICALS</p>
        </header>
        
        <ReportForm 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting}
          onGeneratePDF={handleGeneratePDF}
        />
      </div>
    </div>
  );
}

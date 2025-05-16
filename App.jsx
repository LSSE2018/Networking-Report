// App.jsx
import React, { useState, useRef } from 'react';
import SignaturePad from 'signature_pad';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { Label } from './components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table';

// Zod schema for form validation
const reportSchema = z.object({
  serviceSupportMobile: z.string().regex(/^[0-9]{10}$/, "Invalid mobile number"),
  reportDate: z.string().min(1, "Required"),
  startingDate: z.string().min(1, "Required"),
  completionDate: z.string().min(1, "Required"),
  customerNameAddress: z.string().min(10, "Address too short"),
  spocName: z.string().min(1, "Required"),
  spocDesignation: z.string().min(1, "Required"),
  spocContact: z.string().regex(/^[0-9]{10}$/, "Invalid contact number"),
  poCode: z.string().min(1, "Required"),
  lsseRemark: z.string().min(50, "Minimum 50 characters required"),
  customerName: z.string().min(1, "Required"),
  customerSignDate: z.string().min(1, "Required"),
  engineerName: z.string().min(1, "Required"),
  engineerSignDate: z.string().min(1, "Required"),
});

export function App() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const customerSigPadRef = useRef(null);
  const engineerSigPadRef = useRef(null);
  const customerSigPad = useRef(null);
  const engineerSigPad = useRef(null);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    resolver: zodResolver(reportSchema),
  });

  // Initialize signature pads
  React.useEffect(() => {
    if (customerSigPadRef.current && engineerSigPadRef.current) {
      customerSigPad.current = new SignaturePad(customerSigPadRef.current);
      engineerSigPad.current = new SignaturePad(engineerSigPadRef.current);
      
      // Handle window resize
      const resizeObserver = new ResizeObserver(() => {
        customerSigPad.current.clear();
        engineerSigPad.current.clear();
      });
      
      resizeObserver.observe(customerSigPadRef.current);
      resizeObserver.observe(engineerSigPadRef.current);
      
      return () => resizeObserver.disconnect();
    }
  }, []);

  // Auto-generate PO code when date changes
  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'reportDate' && value.reportDate) {
        const date = new Date(value.reportDate);
        const datePart = `${String(date.getDate()).padStart(2, '0')}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getFullYear()).slice(-2)}`;
        setValue('poCode', `PO${datePart}SE01`);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  const onSubmit = async (data) => {
    if (customerSigPad.current.isEmpty() || engineerSigPad.current.isEmpty()) {
      alert('Please provide both signatures');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Convert signatures to data URLs
      const customerSignature = customerSigPad.current.toDataURL();
      const engineerSignature = engineerSigPad.current.toDataURL();
      
      const reportData = {
        ...data,
        customerSignature,
        engineerSignature,
        // Include all other form data
      };
      
      console.log('Report data:', reportData);
      alert('Report submitted successfully!');
      
      // In production: Send to backend API
      // await fetch('/api/reports', { method: 'POST', body: JSON.stringify(reportData) });
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error submitting report');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generatePDF = () => {
    alert('PDF generation would be implemented with jsPDF or Puppeteer');
    // In production: Implement PDF generation logic
  };

  const clearSignatures = () => {
    customerSigPad.current.clear();
    engineerSigPad.current.clear();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <header className="bg-gray-900 text-white px-6 py-4">
          <h1 className="text-2xl font-bold">Smart Networking Report</h1>
          <p className="font-semibold">LAXMI SECURITY SYSTEMS AND ELECTRICALS</p>
        </header>

        {/* Main Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
          {/* Basic Information Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serviceSupportMobile" className="required">Service Support Mobile No:</Label>
                <Input 
                  id="serviceSupportMobile" 
                  {...register("serviceSupportMobile")} 
                  placeholder="9876543210"
                />
                {errors.serviceSupportMobile && (
                  <p className="text-red-500 text-sm">{errors.serviceSupportMobile.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reportDate" className="required">Date:</Label>
                <Input 
                  id="reportDate" 
                  type="date" 
                  {...register("reportDate")} 
                />
                {errors.reportDate && (
                  <p className="text-red-500 text-sm">{errors.reportDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="startingDate" className="required">Starting Date:</Label>
                <Input 
                  id="startingDate" 
                  type="date" 
                  {...register("startingDate")} 
                />
                {errors.startingDate && (
                  <p className="text-red-500 text-sm">{errors.startingDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="completionDate" className="required">Completion Date:</Label>
                <Input 
                  id="completionDate" 
                  type="date" 
                  {...register("completionDate")} 
                />
                {errors.completionDate && (
                  <p className="text-red-500 text-sm">{errors.completionDate.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerNameAddress" className="required">Customer Name & Address:</Label>
              <Textarea 
                id="customerNameAddress" 
                {...register("customerNameAddress")} 
                rows={3}
              />
              {errors.customerNameAddress && (
                <p className="text-red-500 text-sm">{errors.customerNameAddress.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="spocName" className="required">SPOC Name:</Label>
                <Input 
                  id="spocName" 
                  {...register("spocName")} 
                />
                {errors.spocName && (
                  <p className="text-red-500 text-sm">{errors.spocName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="spocDesignation" className="required">Designation:</Label>
                <Input 
                  id="spocDesignation" 
                  {...register("spocDesignation")} 
                />
                {errors.spocDesignation && (
                  <p className="text-red-500 text-sm">{errors.spocDesignation.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="spocContact" className="required">Contact No:</Label>
                <Input 
                  id="spocContact" 
                  {...register("spocContact")} 
                  placeholder="9876543210"
                />
                {errors.spocContact && (
                  <p className="text-red-500 text-sm">{errors.spocContact.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="poCode" className="required">PO Code:</Label>
              <Input 
                id="poCode" 
                {...register("poCode")} 
                readOnly
                className="bg-gray-100"
              />
              <div className="bg-gray-50 p-3 rounded-md text-sm">
                <p className="font-medium">PO Code Format: PO160525SE01</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li><span className="font-medium">PO</span>: Purchase Order prefix</li>
                  <li><span className="font-medium">160525</span>: Date (16th May 2025)</li>
                  <li><span className="font-medium">SE</span>: Service Engineer initials</li>
                  <li><span className="font-medium">01</span>: Sequence number</li>
                </ul>
              </div>
            </div>
          </section>

          {/* System Connections Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Position/Location/Type of Connections of the System</h2>
            
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">S.N</TableHead>
                    <TableHead>Particulars</TableHead>
                    <TableHead>Remark</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    "Network equipment was installed in a standard network rack",
                    "Patch panels are labelled and organised for easy access",
                    "Cable management accessories are used for proper routing",
                    "Devices are mounted securely with proper ventilation",
                    "Power is provided via UPS and tested for failover",
                    "Structured cabling completed with labelling",
                    "Backbone uplinks are configured between switches",
                    "Suggest periodic backup of configurations",
                    "Guest WiFi isolation is enabled for security"
                  ].map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item}</TableCell>
                      <TableCell>
                        <Input 
                          type="text" 
                          {...register(`connectionRemark${index}`)} 
                          className="w-full"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          {/* Technical Parameters Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Technical Parameters of the System</h2>
            
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">S.N</TableHead>
                    <TableHead>Particulars</TableHead>
                    <TableHead>Remark</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>1</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        WAN IP: 
                        <Input 
                          type="text" 
                          {...register("wanIpType")} 
                          placeholder="Static IP/DHCP"
                          className="w-32"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input type="text" {...register("wanIpRemark")} />
                    </TableCell>
                  </TableRow>
                  
                  {/* More technical parameters rows... */}
                  {/* Simplified for brevity - would include all 12 rows in production */}
                  
                </TableBody>
              </Table>
            </div>
          </section>

          {/* Testing Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Testing & Commissioning of User Experience</h2>
            
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">S.N</TableHead>
                    <TableHead>Testing</TableHead>
                    <TableHead>Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    "Speed test and latency checks performed",
                    "Internet access was tested from multiple devices",
                    "Wireless coverage checked using signal strength tools",
                    "Ping and traceroute verified for LAN/WAN connectivity",
                    "Failover tested (if redundant equipment is used)"
                  ].map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item}</TableCell>
                      <TableCell>
                        <Input 
                          type="text" 
                          {...register(`testResult${index}`)} 
                          className="w-full"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          {/* LSSE Remark and Signatures */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">LSSE Remark</h2>
            
            <div className="space-y-2">
              <Label htmlFor="lsseRemark" className="required">Detailed Observations and Actions Taken:</Label>
              <Textarea 
                id="lsseRemark" 
                {...register("lsseRemark")} 
                rows={4}
              />
              {errors.lsseRemark && (
                <p className="text-red-500 text-sm">{errors.lsseRemark.message}</p>
              )}
              <p className="text-sm text-gray-500">Minimum 50 characters required</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-4">
                <Label>Customer Signature & Stamp</Label>
                <div 
                  ref={customerSigPadRef} 
                  className="border-2 border-dashed border-gray-300 rounded-md h-32 w-full"
                ></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName" className="required">Customer Name</Label>
                    <Input 
                      id="customerName" 
                      {...register("customerName")} 
                    />
                    {errors.customerName && (
                      <p className="text-red-500 text-sm">{errors.customerName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerSignDate" className="required">Date</Label>
                    <Input 
                      id="customerSignDate" 
                      type="date" 
                      {...register("customerSignDate")} 
                    />
                    {errors.customerSignDate && (
                      <p className="text-red-500 text-sm">{errors.customerSignDate.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Engineer Signature</Label>
                <div 
                  ref={engineerSigPadRef} 
                  className="border-2 border-dashed border-gray-300 rounded-md h-32 w-full"
                ></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="engineerName" className="required">Engineer Name</Label>
                    <Input 
                      id="engineerName" 
                      {...register("engineerName")} 
                    />
                    {errors.engineerName && (
                      <p className="text-red-500 text-sm">{errors.engineerName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="engineerSignDate" className="required">Date</Label>
                    <Input 
                      id="engineerSignDate" 
                      type="date" 
                      {...register("engineerSignDate")} 
                    />
                    {errors.engineerSignDate && (
                      <p className="text-red-500 text-sm">{errors.engineerSignDate.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Form Actions */}
          <div className="flex flex-wrap gap-4 pt-6">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Save Report"}
            </Button>
            <Button type="button" variant="secondary" onClick={generatePDF}>
              Generate PDF
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={clearSignatures}
            >
              Clear Signatures
            </Button>
            <Button type="reset" variant="destructive">
              Reset Form
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

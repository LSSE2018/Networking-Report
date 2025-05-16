// src/components/ReportForm.jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reportSchema, connectionItems, testItems } from '../lib/schema';
import { SignatureCanvas } from './SignaturePad';

export function ReportForm({ onSubmit, isSubmitting }) {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    resolver: zodResolver(reportSchema),
  });

  // Auto-generate PO code effect
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'reportDate' && value.reportDate) {
        const date = new Date(value.reportDate);
        const datePart = `${String(date.getDate()).padStart(2, '0')}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getFullYear()).slice(-2)}`;
        setValue('poCode', `PO${datePart}SE01`);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
      {/* Basic Information Section */}
      <BasicInformationSection register={register} errors={errors} />
      
      {/* System Connections Section */}
      <TableSection 
        title="Position/Location/Type of Connections of the System"
        items={connectionItems}
        register={register}
        remarkField="connectionRemark"
      />
      
      {/* Testing Section */}
      <TableSection
        title="Testing & Commissioning of User Experience"
        items={testItems}
        register={register}
        remarkField="testResult"
      />
      
      {/* Signatures Section */}
      <SignatureSection register={register} errors={errors} />
      
      {/* Form Actions */}
      <FormActions isSubmitting={isSubmitting} />
    </form>
  );
}

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import InputRadio from '../../../../ui/forms/InputRadio';
import { PrintExportFilterFormData } from '../../../../../validations/print-export-schema';

type PrintExportFilterFormProps = {
  loading: boolean;
  form: UseFormReturn<PrintExportFilterFormData>;
  type?: string

};

const PrintExportOptionForm = ({ form, loading }: PrintExportFilterFormProps) => {
  return (
    <div className="space-y-4 mt-4">
      <div className="border p-3 rounded-md border-slate-300">
        <p className="m-0 mb-3 text-sm !font-medium">Options</p>
        <InputRadio
          control={form.control}
          name="option"
          disabled={loading}
          clearErrors={form.clearErrors}
          options={[
            { label: 'Summary', value: 'summary' },
            { label: 'Detailed', value: 'detailed' },
          ]}
        />
      </div>
    </div>
  );
};

export default PrintExportOptionForm;

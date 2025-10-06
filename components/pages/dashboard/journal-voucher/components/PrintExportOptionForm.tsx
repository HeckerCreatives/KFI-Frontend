import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import InputRadio from '../../../../ui/forms/InputRadio';
import { PrintExportFilterFormData } from '../../../../../validations/print-export-schema';

type PrintExportFilterFormProps = {
  loading: boolean;
  form: UseFormReturn<PrintExportFilterFormData>;
};

const PrintExportOptionForm = ({ form, loading }: PrintExportFilterFormProps) => {
  return (
    <div className="space-y-4">
      <div className="border p-3 rounded-md border-slate-300">
        <p className="m-0 mb-2 !font-semibold text-sm">Options</p>
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

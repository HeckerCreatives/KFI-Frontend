import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import InputRadio from '../../../../ui/forms/InputRadio';
import { AcknowledgementOptionFormData } from '../modals/prints/PrintAcknowledgement';

type PrintExportFilterFormProps = {
  loading: boolean;
  form: UseFormReturn<AcknowledgementOptionFormData>;
};

const PrintExportOptionForm = ({ form, loading }: PrintExportFilterFormProps) => {
  return (
    <div className="space-y-4">
      <div className="border p-3 rounded-md border-slate-300">
        <p className="mb-2 text-sm !font-semibold">Options</p>
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

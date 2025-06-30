import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import InputRadio from '../../../../ui/forms/InputRadio';
import { JournalVoucherOptionFormData } from '../modals/prints/PrintJournalVoucher';

type PrintExportFilterFormProps = {
  loading: boolean;
  form: UseFormReturn<JournalVoucherOptionFormData>;
};

const PrintExportOptionForm = ({ form, loading }: PrintExportFilterFormProps) => {
  return (
    <div className="space-y-4">
      <div className="border p-3 rounded-md border-slate-300">
        <h6 className="m-0 mb-1">Options</h6>
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

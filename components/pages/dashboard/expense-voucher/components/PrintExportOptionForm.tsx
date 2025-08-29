import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import InputRadio from '../../../../ui/forms/InputRadio';
import { ExpenseVoucherOptionFormData } from '../modals/prints/PrintExpenseVoucher';

type PrintExportFilterFormProps = {
  loading: boolean;
  form: UseFormReturn<ExpenseVoucherOptionFormData>;
};

const PrintExportOptionForm = ({ form, loading }: PrintExportFilterFormProps) => {
  return (
    <div className="space-y-4 mt-4">
      <div className="border p-3 rounded-md border-slate-300">
        <h6 className="m-0 mb-2 text-sm !font-semibold">Options</h6>
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

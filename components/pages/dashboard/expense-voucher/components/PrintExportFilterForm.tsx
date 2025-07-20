import React from 'react';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import InputText from '../../../../ui/forms/InputText';
import { UseFormReturn } from 'react-hook-form';
import InputRadio from '../../../../ui/forms/InputRadio';
import { IonIcon } from '@ionic/react';
import { close } from 'ionicons/icons';
import { ExpenseVoucherFilterFormData } from '../modals/prints/PrintAllExpenseVoucher';
import ExpenseVoucherSelection from '../../../../ui/selections/ExpenseVoucherSelection';

type PrintExportFilterFormProps = {
  loading: boolean;
  form: UseFormReturn<ExpenseVoucherFilterFormData>;
};

const PrintExportFilterForm = ({ form, loading }: PrintExportFilterFormProps) => {
  const clearDoc = (type: 'from' | 'to') => {
    if (type === 'from') {
      form.setValue('docNoFrom', '');
      form.setValue('docNoFromLabel', '');
    }

    if (type === 'to') {
      form.setValue('docNoTo', '');
      form.setValue('docNoToLabel', '');
    }
  };

  return (
    <div className="space-y-1">
      <div className="border p-3 rounded-md border-slate-300">
        <h6 className="m-0 mb-1">Document No.</h6>
        <div className="flex flex-col gap-1 flex-wrap">
          <div className="flex items-start gap-2">
            <div className="flex-1 relative">
              <FormIonItem className="flex-1 min-w-64">
                <InputText
                  disabled={loading}
                  name="docNoFromLabel"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="From"
                  placeholder="Type here"
                  className="!px-2 !py-2 rounded-md"
                  readOnly
                />
              </FormIonItem>
              {form.watch('docNoFrom') && (
                <IonIcon
                  onClick={() => clearDoc('from')}
                  icon={close}
                  className="absolute top-3 right-2 z-50 h-6 w-6 cursor-pointer hover:text-slate-600 text-slate-500 active:text-slate-400"
                />
              )}
            </div>
            <div className="mt-1.5">
              <ExpenseVoucherSelection expenseVoucherLabel="docNoFromLabel" expenseVoucherValue="docNoFrom" clearErrors={form.clearErrors} setValue={form.setValue} />
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="flex-1 relative">
              <FormIonItem className="flex-1 min-w-64">
                <InputText
                  disabled={loading}
                  name="docNoToLabel"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="To"
                  placeholder="Type here"
                  className="!px-2 !py-2 rounded-md"
                  readOnly
                />
              </FormIonItem>
              {form.watch('docNoTo') && (
                <IonIcon
                  onClick={() => clearDoc('to')}
                  icon={close}
                  className="absolute top-3 right-2 z-50 h-6 w-6 cursor-pointer hover:text-slate-600 text-slate-500 active:text-slate-400"
                />
              )}
            </div>
            <div className="mt-1.5">
              <ExpenseVoucherSelection expenseVoucherLabel="docNoToLabel" expenseVoucherValue="docNoTo" clearErrors={form.clearErrors} setValue={form.setValue} />
            </div>
          </div>
        </div>
      </div>
      <div className="border p-3 rounded-md border-slate-300">
        <h6 className="m-0 mb-1">Options</h6>
        <InputRadio
          control={form.control}
          name="option"
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

export default PrintExportFilterForm;

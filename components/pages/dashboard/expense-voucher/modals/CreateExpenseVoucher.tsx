import React, { useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, useIonToast } from '@ionic/react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { ExpenseVoucherFormData, expenseVoucherSchema, UpdateExpenseVoucherFormData } from '../../../../../validations/expense-voucher.schema';
import ExpenseVoucherFormTable from '../components/ExpenseVoucherFormTable';
import ExpenseVoucherForm from '../components/ExpenseVoucherForm';
import kfiAxios from '../../../../utils/axios';
import { TErrorData, TFormError } from '../../../../../types/types';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';
import { formatDateInput } from '../../../../utils/date-utils';
import { removeAmountComma } from '../../../../ui/utils/formatNumber';
import Signatures from '../../../../ui/common/Signatures';

type CreateExpenseVoucherProps = {
  getExpenseVouchers: (page: number, keyword?: string, sort?: string) => void;
};

const CreateExpenseVoucher = ({ getExpenseVouchers }: CreateExpenseVoucherProps) => {
  const [present] = useIonToast();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<ExpenseVoucherFormData>({
    resolver: zodResolver(expenseVoucherSchema),
    defaultValues: {
      code: '',
      supplier: '',
      supplierId: '',
      refNo: '',
      date: formatDateInput(new Date().toISOString()),
      acctMonth: `${new Date().getMonth() + 1}`,
      acctYear: `${new Date().getFullYear()}`,
      checkNo: '',
      checkDate: formatDateInput(new Date().toISOString()),
      bank: '',
      bankLabel: '',
      amount: '0',
      remarks: '',
      entries: [],
    },
  });

  function dismiss() {
    form.reset();
    setIsOpen(false);
  }

  console.log(form.formState.errors)

  async function onSubmit(data: ExpenseVoucherFormData) {
    setLoading(true);
    try {
      data.amount = removeAmountComma(data.amount);
      data.entries = data.entries.map((entry, index) => ({ ...entry, debit: removeAmountComma(entry.debit), credit: removeAmountComma(entry.credit), line: index + 1}));
      const result = await kfiAxios.post('expense-voucher', data);
      const { success } = result.data;
      if (success) {
        getExpenseVouchers(1);
        present({
          message: 'Expense voucher successfully added.',
          duration: 1000,
        });
        dismiss();
        return;
      }
      present({
        message: 'Failed to add a new expense voucher. Please try again.',
        duration: 1000,
      });
    } catch (error: any) {
      const errs: TErrorData | string = error?.response?.data?.error || error?.response?.data?.msg || error.message;
      const errors: TFormError[] | string = checkError(errs);
      const fields: string[] = Object.keys(form.formState.defaultValues as Object);
      formErrorHandler(errors, form.setError, fields);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <IonButton onClick={() => setIsOpen(true)} fill="clear" className="max-h-10 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
        + Add Record
      </IonButton>
      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className=" [--border-radius:0.7rem] auto-height [--max-width:74rem] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader title="Expense Voucher - Add Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6 max-h-[85%] h-full flex flex-col">
            <ModalHeader title="Expense Voucher - Add Record" sub="Manage expense voucher records." dismiss={dismiss} />

          <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col mt-4">
            <div>
              <ExpenseVoucherForm form={form as UseFormReturn<ExpenseVoucherFormData | UpdateExpenseVoucherFormData>} loading={loading} />
            </div>
            <div className="flex-1 mt-2">
              <ExpenseVoucherFormTable form={form} loading={loading} />
            </div>
              <Signatures open={isOpen} type={'expense voucher'}/>
            
              {form.formState.errors.root && <div className="text-sm text-red-600 italic text-center">{form.formState.errors.root.message}</div>}

            <div className="text-end mt-6 px-3">
              <IonButton disabled={loading} type="submit" fill="clear" className="!text-sm capitalize !bg-[#FA6C2F] text-white rounded-[4px]" strong={true}>
                {loading ? 'Saving...' : 'Save'}
              </IonButton>
              <IonButton disabled={loading} onClick={dismiss} color="danger" type="button" className="!text-sm capitalize" strong={true}>
                Cancel
              </IonButton>
            </div>
          </form>
        </div>
      </IonModal>
    </>
  );
};

export default CreateExpenseVoucher;

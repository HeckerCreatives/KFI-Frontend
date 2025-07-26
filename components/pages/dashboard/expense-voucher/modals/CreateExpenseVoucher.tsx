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
      date: '',
      acctMonth: '',
      acctYear: '',
      checkNo: '',
      checkDate: '',
      bank: '',
      bankLabel: '',
      amount: '',
      remarks: '',
      entries: [],
    },
  });

  function dismiss() {
    form.reset();
    setIsOpen(false);
  }

  async function onSubmit(data: ExpenseVoucherFormData) {
    setLoading(true);
    try {
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
      <IonModal isOpen={isOpen} backdropDismiss={false} className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:95%] lg:[--width:95%]">
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader title="Expense Voucher - Add Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content !px-0">
          <div>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <ExpenseVoucherForm form={form as UseFormReturn<ExpenseVoucherFormData | UpdateExpenseVoucherFormData>} loading={loading} />
              <ExpenseVoucherFormTable form={form} loading={loading} />
              <div className="text-end border-t pt-1 space-x-2 px-3">
                <IonButton disabled={loading} type="submit" fill="clear" className="!text-sm capitalize !bg-[#FA6C2F] text-white rounded-[4px]" strong={true}>
                  {loading ? 'Saving...' : 'Save'}
                </IonButton>
                <IonButton disabled={loading} onClick={dismiss} color="danger" type="button" className="!text-sm capitalize" strong={true}>
                  Cancel
                </IonButton>
              </div>
            </form>
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default CreateExpenseVoucher;

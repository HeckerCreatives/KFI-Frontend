import React, { useEffect, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, IonIcon, useIonToast } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { createSharp } from 'ionicons/icons';
import { ExpenseVoucherFormData, expenseVoucherSchema, UpdateExpenseVoucherFormData, updateExpenseVoucherSchema } from '../../../../../validations/expense-voucher.schema';
import { ExpenseVoucher, TErrorData, TFormError } from '../../../../../types/types';
import { TData } from '../ExpenseVoucher';
import { formatDateInput } from '../../../../utils/date-utils';
import ExpenseVoucherForm from '../components/ExpenseVoucherForm';
import UpdateExpenseVoucherEntries from '../components/UpdateExpenseVoucherEntries';
import kfiAxios from '../../../../utils/axios';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';

type UpdateExpenseVoucherProps = {
  expenseVoucher: ExpenseVoucher;
  setData: React.Dispatch<React.SetStateAction<TData>>;
};

const UpdateExpenseVoucher = ({ expenseVoucher, setData }: UpdateExpenseVoucherProps) => {
  const [present] = useIonToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<UpdateExpenseVoucherFormData>({
    resolver: zodResolver(updateExpenseVoucherSchema),
    defaultValues: {
      code: '',
      supplier: '',
      supplierId: '',
      refNo: '',
      remarks: '',
      date: '',
      acctMonth: '',
      acctYear: '',
      checkNo: '',
      checkDate: '',
      bank: '',
      bankLabel: '',
      amount: '',
    },
  });

  useEffect(() => {
    if (expenseVoucher) {
      form.reset({
        code: expenseVoucher.code,
        supplier: `${expenseVoucher.supplier.code} - ${expenseVoucher.supplier.description}`,
        supplierId: expenseVoucher.supplier._id,
        refNo: expenseVoucher.refNo,
        remarks: expenseVoucher.remarks,
        date: formatDateInput(expenseVoucher.date),
        acctMonth: `${expenseVoucher.acctMonth}`,
        acctYear: `${expenseVoucher.acctYear}`,
        checkNo: `${expenseVoucher.checkNo}`,
        checkDate: formatDateInput(expenseVoucher.checkDate),
        bank: expenseVoucher.bankCode._id,
        bankLabel: `${expenseVoucher.bankCode.code} - ${expenseVoucher.bankCode.description}`,
        amount: `${expenseVoucher.amount}`,
      });
    }
  }, [expenseVoucher, form]);

  function dismiss() {
    form.reset();
    setIsOpen(false);
  }

  async function onSubmit(data: UpdateExpenseVoucherFormData) {
    setLoading(true);
    try {
      const result = await kfiAxios.put(`expense-voucher/${expenseVoucher._id}`, data);
      const { success, expenseVoucher: updatedExpenseVoucher } = result.data;
      if (success) {
        setData(prev => {
          const index = prev.expenseVouchers.findIndex(expenseVoucher => expenseVoucher._id === updatedExpenseVoucher._id);
          if (index < 0) return prev;
          prev.expenseVouchers[index] = { ...updatedExpenseVoucher };
          return { ...prev };
        });
        present({
          message: 'Expense voucher successfully updated.',
          duration: 1000,
        });
        return;
      }
      present({
        message: 'Failed to update the expense voucher',
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
      <div className="text-end">
        <div
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={createSharp} className="text-[1rem]" /> Edit
        </div>
      </div>
      <IonModal isOpen={isOpen} backdropDismiss={false} className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:95%] lg:[--width:95%]">
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader title="Expense Voucher - Edit Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content !px-0">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <ExpenseVoucherForm form={form} loading={loading} />
            </div>
            <div className="text-end space-x-1 px-2 pb-2">
              <IonButton disabled={loading} color="tertiary" type="submit" className="!text-sm capitalize" strong={true}>
                {loading ? 'Saving...' : 'Save Changes'}
              </IonButton>
            </div>
          </form>
          <div className="border-t border-t-slate-400 mx-2 pt-5">
            <UpdateExpenseVoucherEntries isOpen={isOpen} expenseVoucher={expenseVoucher} />
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default UpdateExpenseVoucher;

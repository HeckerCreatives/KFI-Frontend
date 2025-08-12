import React, { useEffect, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, IonIcon, IonGrid, IonRow, IonCol, useIonToast } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { UpdateLoanReleaseFormData, updateLoanReleaseSchema } from '../../../../../validations/loan-release.schema';
import { createSharp } from 'ionicons/icons';
import { TErrorData, TFormError, Transaction } from '../../../../../types/types';
import { formatDateTable } from '../../../../utils/date-utils';
import LoanReleaseViewCard from '../components/LoanReleaseViewCard';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import InputText from '../../../../ui/forms/InputText';
import UpdateEntries from '../components/UpdateEntries';
import kfiAxios from '../../../../utils/axios';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';
import { TData } from '../LoanRelease';
import { formatAmount, removeAmountComma } from '../../../../ui/utils/formatNumber';

type UpdateLoanReleaseProps = {
  transaction: Transaction;
  setData: React.Dispatch<React.SetStateAction<TData>>;
};

const UpdateLoanRelease = ({ transaction, setData }: UpdateLoanReleaseProps) => {
  const [present] = useIonToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<UpdateLoanReleaseFormData>({
    resolver: zodResolver(updateLoanReleaseSchema),
    defaultValues: {
      amount: '0',
      cycle: '',
      interestRate: '',
    },
  });

  useEffect(() => {
    if (transaction) {
      form.reset({
        amount: `${formatAmount(transaction.amount)}`,
        cycle: `${transaction.cycle}`,
        interestRate: `${transaction.interest}`,
      });
    }
  }, [transaction, form]);

  function dismiss() {
    form.reset();
    setIsOpen(false);
  }

  async function onSubmit(data: UpdateLoanReleaseFormData) {
    setLoading(true);
    try {
      data.amount = removeAmountComma(data.amount);
      const result = await kfiAxios.put(`transaction/loan-release/${transaction._id}`, data);
      const { success, transaction: updatedTransaction } = result.data;
      if (success) {
        setData(prev => {
          const index = prev.transactions.findIndex(transaction => transaction._id === updatedTransaction._id);
          if (index < 0) return prev;
          prev.transactions[index] = { ...updatedTransaction };
          return { ...prev };
        });
        present({
          message: 'Loan release successfully updated.',
          duration: 1000,
        });
        return;
      }
      present({
        message: 'Failed to update the loan release',
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
      {/* <div
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
      >
        <IonIcon icon={createSharp} className="text-[1rem]" /> Edit
      </div> */}
      <IonButton
        onClick={() => setIsOpen(true)}
        type="button"
        fill="clear"
        className="space-x-1 rounded-lg w-16 h-6 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-[#ff9a00] text-slate-700 capitalize min-h-4 text-xs"
      >
        <IonIcon icon={createSharp} className="text-xs" />
        <span>Edit</span>
      </IonButton>
      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:95%] md:[--width:100%] lg:[--max-width:95%] lg:[--width:95%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Loan Release - Edit Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content h-screen flex flex-col gap-3 !p-2">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <LoanReleaseViewCard label="CV#" value={`${transaction.code}`} labelClassName="min-w-20 text-end !text-slate-600" />
                <LoanReleaseViewCard label="Center Code" value={transaction.center.centerNo} labelClassName="min-w-20 text-end !text-slate-600" />
                <LoanReleaseViewCard label="Name" value={transaction.center.description} labelClassName="min-w-20 text-end !text-slate-600" />
              </div>
              <div className="space-y-1">
                <LoanReleaseViewCard label="Date" value={formatDateTable(transaction.date)} labelClassName="min-w-28 text-end !text-slate-600" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  <LoanReleaseViewCard label="Account Month" value={`${transaction.acctMonth}`} labelClassName="min-w-28 text-end !text-slate-600" containerClassName="w-full" />
                  <LoanReleaseViewCard label="Account Year" value={`${transaction.acctYear}`} labelClassName="min-w-28 text-end !text-slate-600" />
                </div>
                <LoanReleaseViewCard label="Number of Weeks" value={`${transaction.noOfWeeks}`} labelClassName="min-w-28 text-end !text-slate-600" />
                <LoanReleaseViewCard label="Type of Loan" value={`${transaction.loan.code}`} labelClassName="min-w-28 text-end !text-slate-600" />
              </div>
              <div className="space-y-1">
                <LoanReleaseViewCard label="Check Number" value={transaction.checkNo} labelClassName="min-w-28 text-end !text-slate-600" />
                <LoanReleaseViewCard label="Check Date" value={formatDateTable(transaction.checkDate)} labelClassName="min-w-28 text-end !text-slate-600" />
                <LoanReleaseViewCard label="Bank Code" value={transaction.bank.code} labelClassName="min-w-28 text-end !text-slate-600" />
                <FormIonItem className=" [--min-height:0]">
                  <InputText
                    disabled={loading}
                    name="amount"
                    control={form.control}
                    clearErrors={form.clearErrors}
                    label="Amount"
                    placeholder="Type here"
                    className="!px-1 !py-1 rounded-md !text-[0.7rem]"
                    labelClassName="truncate min-w-28 !text-[0.7rem] !text-slate-600 text-end"
                    isAmount
                  />
                </FormIonItem>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <LoanReleaseViewCard label="Particular" value={transaction.remarks} labelClassName="min-w-20 text-end !text-slate-600" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                <FormIonItem className="flex-1 [--min-height:0]">
                  <InputText
                    disabled={loading}
                    name="cycle"
                    control={form.control}
                    clearErrors={form.clearErrors}
                    label="Cycle"
                    placeholder="Type here"
                    className="!px-1 !py-1 rounded-md !text-[0.7rem]"
                    labelClassName="truncate min-w-28 !text-[0.7rem] !text-slate-600 text-end"
                  />
                </FormIonItem>

                <FormIonItem className="flex-1 [--min-height:0]">
                  <InputText
                    disabled={loading}
                    name="interestRate"
                    control={form.control}
                    clearErrors={form.clearErrors}
                    label="Interest Rate (%)"
                    placeholder="Type here"
                    className="!px-1 !py-1 rounded-md !text-[0.7rem]"
                    labelClassName="truncate min-w-28 !text-[0.7rem] !text-slate-600 text-end"
                  />
                </FormIonItem>
              </div>
            </div>

            <div>
              <LoanReleaseViewCard label="Encoded By" value={transaction.encodedBy.username} labelClassName="min-w-20 text-end !text-slate-600" containerClassName="max-w-32" />
            </div>

            <div className="text-end space-x-1 px-0 pb-2">
              <IonButton disabled={loading} type="submit" fill="clear" className="!text-sm capitalize !bg-[#FA6C2F] text-white rounded-[4px]" strong={true}>
                {loading ? 'Saving...' : 'Save Changes'}
              </IonButton>
            </div>
          </form>
          <div className="border-t border-t-slate-400 pt-5 flex-1">
            <UpdateEntries isOpen={isOpen} transaction={transaction} currentAmount={`${transaction.amount}`} />
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default UpdateLoanRelease;

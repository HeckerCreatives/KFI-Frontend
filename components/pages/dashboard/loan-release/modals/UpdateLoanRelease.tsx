import React, { useEffect, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, IonIcon, IonGrid, IonRow, IonCol, useIonToast } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { UpdateLoanReleaseFormData, updateLoanReleaseSchema } from '../../../../../validations/loan-release.schema';
import { createSharp } from 'ionicons/icons';
import { Entry, TErrorData, TFormError, Transaction } from '../../../../../types/types';
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
  const [entries, setEntries] = useState<Entry[]>(transaction.entries || []);
  const [prevEntries, setPrevEntries] = useState<Entry[]>(transaction.entries || []);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  

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
    setDeletedIds([])
    setIsOpen(false);
  }

  async function onSubmit(data: UpdateLoanReleaseFormData) {
    setLoading(true);
  
    try {
      const prevIds = new Set(prevEntries.map((e) => e._id));

      const formattedEntries = entries.map((entry, index) => {
        const isExisting = prevIds.has(entry._id);
        return {
          _id: isExisting ? entry._id : undefined,
          line: index + 1,
          clientId: entry.client?._id ?? "",
          client: entry.client?.name ?? "",
          particular: `${entry.center?.centerNo ?? ""} - ${entry.client?.name ?? ""}`,
          acctCodeId: entry.acctCode?._id ?? "",
          acctCode: entry.acctCode?.code ?? "",
          description: entry.acctCode?.description ?? "",
          debit: entry.debit?.toString() ?? "",
          credit: entry.credit?.toString() ?? "",
          interest: entry.interest?.toString() ?? "",
          cycle: entry.cycle?.toString() ?? "",
          checkNo: entry.checkNo ?? "",
        };
      });

     const finalDeletedIds = deletedIds.filter((id) =>
      prevEntries.some((e) => e._id === id)
    );



      data.amount = removeAmountComma(data.amount);
      const result = await kfiAxios.put(`/transaction/loan-release/${transaction._id}`, {...data, entries: formattedEntries, deletedIds: finalDeletedIds});
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

        dismiss()
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

  console.log('New Prev', entries, prevEntries)



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
        className="space-x-1 rounded-md w-16 h-7 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-blue-50 text-blue-900 capitalize min-h-4 text-xs"
      >
        <IonIcon icon={createSharp} className="text-xs" />
        <span>Edit</span>
      </IonButton>
      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className=" [--border-radius:0.7rem] auto-height [--max-width:84rem] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Loan Release - Edit Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content h-screen flex flex-col gap-3 !p-6">
          <ModalHeader disabled={loading} title="Loan Release - Edit Record" sub="Manage loan release records." dismiss={dismiss} />

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
              <div className="space-y-1">
                <LoanReleaseViewCard label="CV#" value={`${transaction.code}`} labelClassName="" />
                <LoanReleaseViewCard label="Center Code" value={transaction.center.centerNo} labelClassName="" />
                <LoanReleaseViewCard label="Name" value={transaction.center.description} labelClassName="" />
              </div>
              <div className="space-y-1">
                <LoanReleaseViewCard label="Date" value={formatDateTable(transaction.date)} labelClassName="" />
                 <LoanReleaseViewCard label="Account Month" value={`${transaction.acctMonth}`} labelClassName="" containerClassName="w-full" />
                  <LoanReleaseViewCard label="Account Year" value={`${transaction.acctYear}`} labelClassName="" />
                {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  <LoanReleaseViewCard label="Account Month" value={`${transaction.acctMonth}`} labelClassName="" containerClassName="w-full" />
                  <LoanReleaseViewCard label="Account Year" value={`${transaction.acctYear}`} labelClassName="" />
                </div> */}
                <LoanReleaseViewCard label="Number of Weeks" value={`${transaction.noOfWeeks}`} labelClassName="" />
                <LoanReleaseViewCard label="Type of Loan" value={`${transaction.loan.code}`} labelClassName="" />
              </div>
              <div className="space-y-1">
                <LoanReleaseViewCard label="Check Number" value={transaction.checkNo} labelClassName="" />
                <LoanReleaseViewCard label="Check Date" value={formatDateTable(transaction.checkDate)} labelClassName="" />
                <LoanReleaseViewCard label="Bank Code" value={transaction.bank.code} labelClassName="" />
                <FormIonItem className=" [--min-height:0]">
                  <InputText
                    disabled={loading}
                    name="amount"
                    control={form.control}
                    clearErrors={form.clearErrors}
                    label="Amount"
                    placeholder="Type here"
                    className="!p-2 rounded-md !text-[0.7rem] w-full"
                    labelClassName="truncate min-w-28 !text-[0.7rem] !text-slate-600"
                    isAmount
                  />
                </FormIonItem>
              </div>

              <div className=" lg:hidden space-y-1">
                <LoanReleaseViewCard label="Particular" value={transaction.remarks} labelClassName=" text-end !text-slate-600" />
                 <FormIonItem className=" [--min-height:0]">
                  <InputText
                    disabled={loading}
                    name="cycle"
                    control={form.control}
                    clearErrors={form.clearErrors}
                    label="Cycle"
                    placeholder="Type here"
                    className="!p-2 rounded-md !text-[0.7rem] "
                    labelClassName="truncate !text-[0.7rem] !text-slate-600 !w-24"
                  />
                </FormIonItem>

                <FormIonItem className=" [--min-height:0]">
                  <InputText
                    disabled={loading}
                    name="interestRate"
                    control={form.control}
                    clearErrors={form.clearErrors}
                    label="Interest Rate (%)"
                    placeholder="Type here"
                    className="!p-2 rounded-md !text-[0.7rem]"
                    labelClassName="truncate !text-[0.7rem] !text-slate-600"
                  />
                </FormIonItem>
              </div>
            </div>

            <div className=" hidden lg:grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <LoanReleaseViewCard label="Particular" value={transaction.remarks} labelClassName=" text-end !text-slate-600" />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <FormIonItem className=" [--min-height:0]">
                  <InputText
                    disabled={loading}
                    name="cycle"
                    control={form.control}
                    clearErrors={form.clearErrors}
                    label="Cycle"
                    placeholder="Type here"
                    className="!p-2 rounded-md !text-[0.7rem] "
                    labelClassName="truncate min-w-28 !text-[0.7rem] !text-slate-600 !w-24"
                  />
                </FormIonItem>

                <FormIonItem className=" [--min-height:0]">
                  <InputText
                    disabled={loading}
                    name="interestRate"
                    control={form.control}
                    clearErrors={form.clearErrors}
                    label="Interest Rate (%)"
                    placeholder="Type here"
                    className="!p-2 rounded-md !text-[0.7rem]"
                    labelClassName="truncate min-w-28 !text-[0.7rem] !text-slate-600"
                  />
                </FormIonItem>
              </div>
            </div>

            <div>
              <LoanReleaseViewCard label="Encoded By" value={transaction.encodedBy.username} labelClassName="" containerClassName="" />
            </div>

            <div className="text-end space-x-1 px-0 pb-2">
              <IonButton disabled={loading} type="submit" fill="clear" className="!text-sm capitalize !bg-[#FA6C2F] text-white rounded-[4px]" strong={true}>
                {loading ? 'Saving...' : 'Save Changes'}
              </IonButton>
            </div>
          </form>
          <div className="border-t border-t-slate-400 pt-5 flex-1">
            <UpdateEntries isOpen={isOpen} transaction={transaction} currentAmount={`${transaction.amount}`} entries={entries} setEntries={setEntries} deletedIds={deletedIds} setDeletedIds={setDeletedIds} setPrevEntries={setPrevEntries}/>
          </div>

          {form.formState.errors.root && <div className="text-sm text-red-600 italic text-center">{form.formState.errors.root.message}</div>}

        </div>
      </IonModal>
    </>
  );
};

export default UpdateLoanRelease;

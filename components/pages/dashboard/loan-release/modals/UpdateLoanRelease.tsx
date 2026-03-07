import React, { useEffect, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, IonIcon, IonGrid, IonRow, IonCol, useIonToast } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { LoanReleaseFormData, loanReleaseSchema, UpdateLoanReleaseFormData, updateLoanReleaseSchema } from '../../../../../validations/loan-release.schema';
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
import { formatAmount, formatNumber, removeAmountComma } from '../../../../ui/utils/formatNumber';
import Signatures from '../../../../ui/common/Signatures';
import { useOnlineStore } from '../../../../../store/onlineStore';
import { db } from '../../../../../database/db';
import { formatLREntries } from '../../../../ui/utils/fomatData';
import LoanReleaseFormTable from '../components/LoanReleaseFormTable';
import LoanReleaseFormTableUpdate from '../components/LoanReleaseFormTableUpdate';

type UpdateLoanReleaseProps = {
  transaction: Transaction;
  setData: React.Dispatch<React.SetStateAction<TData>>;
  getTransactions: (page: number, keyword?: string, sort?: string) => void;
  currentPage: number
};

const UpdateLoanRelease = ({ transaction, setData, currentPage, getTransactions }: UpdateLoanReleaseProps) => {
  const [present] = useIonToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<Entry[]>(transaction.entries || []);
  const [prevEntries, setPrevEntries] = useState<Entry[]>(transaction.entries || []);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const online = useOnlineStore((state) => state.online);
  
  const formattedEntries = transaction.entries.map((item) => ({
    ...item,
    _id: item._id,
    id: item._id,
    line: item.line,
    clientId: item.client?._id,
    client: item.client?.name,
    particular: item.particular,
    acctCodeId: item.acctCode._id,
    acctCode: item.acctCode.code,
    description: item.acctCode.description,
    debit: String(item.debit) ?? '0' ,
    credit: String(item.credit) ?? '0' ,
    interest: String(item.interest ?? '0') || String(item.interestRate ?? '0'),
    interestRate: String(item.interest ?? '0') || String(item.interestRate ?? '0') ,
    cycle: String(item.cycle ?? '0'),
    checkNo: String(item.checkNo ?? '0'),
    typeOfLoan: '',
  }))
  

  const form = useForm<UpdateLoanReleaseFormData>({
    resolver: zodResolver(updateLoanReleaseSchema),
    defaultValues: {
      amount: '0',
      cycle: '',
      interestRate: '',
      entries: formattedEntries
    },
  });


  useEffect(() => {
    if (transaction) {
      form.reset({
        amount: `${formatAmount(transaction.amount)}`,
        centerLabel: transaction.center.centerNo,
        cycle: `${transaction.cycle}`,
        interestRate: `${transaction.interest || transaction.interestRate}`,
        entries: formattedEntries
      });
    }
  }, [transaction, form]);

  const difference = `${formatNumber(Math.abs(form.watch('entries').reduce((acc, current) => acc + Number(removeAmountComma(current.debit || '')), 0) - form.watch('entries').reduce((acc, current) => acc + Number(removeAmountComma(current.credit || 0)), 0)))}`

  

  function dismiss() {
    form.reset();
    setDeletedIds([])
    setIsOpen(false);
  }

  async function onSubmit(data: UpdateLoanReleaseFormData) {

     if (Number(removeAmountComma(difference)) !== 0) {
      form.setError('root', { message: `Debit and Credit must be balanced` });
      return;
    }

    const entriesPayload = data.entries.map((item) => ({
        ...item,
        debit: Number(removeAmountComma(item.debit || '0')) ?? '0' ,
        credit: Number(removeAmountComma(item.credit || '0')) ?? '0' ,
        interest: Number(removeAmountComma(item.interest || '0')) ?? '0',
        action: item._id ? 'update' : 'create',
        _synced: false,
      }))


    if(online){
      setLoading(true);
  
      try {
       
        data.amount = removeAmountComma(data.amount);
        const result = await kfiAxios.put(`/transaction/loan-release/${transaction._id}`, {...data, 
          entries: entriesPayload });
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
    } else {
      try {
       const existing = await db.loanReleases.get(transaction.id);
        if (!existing) {
          console.warn("Data not found");
          return;
        }
        const partialUpdate = {
          amount: Number(removeAmountComma(data.amount)),
          cycle: Number(data.cycle),
          interestRate: Number(data.interestRate),
        };
        const updated = {
          ...existing,
          ...partialUpdate, 
          entries: data.entries?.map((item) => ({
            ...item,
            interest: item.interest || '0',
            acctCode: {
              _id: item.acctCodeId,
              code: item.acctCode,
              description: item.description
            },
            client:{
              name: item.client,
              _id: item.clientId
            }
          })),
          bank:{
            code: transaction.bank.code,
            description: transaction.bank.description,
            _id: transaction.bank._id
          },
          // deletedIds: finalDeletedIds,
          action: existing.isOldData ? 'update' : 'create',
          _synced: false,
        };
        await db.loanReleases.update(transaction.id, updated);
        getTransactions(currentPage)
        dismiss();
        present({
          message: "Data successfully updated!",
          duration: 1000,
        });
      } catch (error) {
        console.log(error)
        present({
          message: "Failed to save record. Please try again.",
          duration: 1200,
        });

      }
    }
    
  }

  return (
    <>
     
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
               
                <LoanReleaseViewCard label="Number of Weeks" value={`${transaction.noOfWeeks}`} labelClassName="" />
                <LoanReleaseViewCard label="Type of Loan" value={`${transaction.loan?.code}`} labelClassName="" />
              </div>
              <div className="space-y-1">
                <LoanReleaseViewCard label="Check Number" value={transaction.checkNo} labelClassName="" />
                <LoanReleaseViewCard label="Check Date" value={formatDateTable(transaction.checkDate)} labelClassName="" />
                <LoanReleaseViewCard label="Bank Code" value={transaction.bank?.code} labelClassName="" />
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
              <LoanReleaseViewCard label="Encoded By" value={transaction.encodedBy?.username} labelClassName="" containerClassName="" />
            </div>

            <div className="text-end space-x-1 px-0 pb-2">
              <IonButton disabled={loading} type="submit" fill="clear" className="!text-sm capitalize !bg-[#FA6C2F] text-white rounded-[4px]" strong={true}>
                {loading ? 'Saving...' : 'Save Changes'}
              </IonButton>
            </div>
          </form>
          <div className="border-t border-t-slate-400 pt-5 flex-1">
            <LoanReleaseFormTableUpdate form={form}/>

            {/* <UpdateEntries isOpen={isOpen} transaction={transaction} currentAmount={`${transaction.amount}`} entries={entries} setEntries={setEntries} deletedIds={deletedIds} setDeletedIds={setDeletedIds} setPrevEntries={setPrevEntries}/> */}
          </div>

          {form.formState.errors.root && <div className="text-sm text-red-600 italic text-center">{form.formState.errors.root.message}</div>}

          <div className="px-3">
                <div className="grid grid-cols-3">
                  <div className="flex items-center justify-start gap-2 text-sm border-4 px-2 py-1 [&>div]:!font-semibold">
                    <div>Diff: </div>
                    <div>{difference}</div>
                  </div>

                  <div className="flex items-center justify-start gap-2 text-sm border-4 px-2 py-1 [&>div]:!font-semibold col-span-2">
                    <div>Total: </div>
                    <div>{`${transaction.amount.toLocaleString()}`}</div>
                  </div>
                  
                </div>
              </div>

          <Signatures open={isOpen} type={'loan release'} preparedBy={transaction.encodedBy.username} recieveByorDate={transaction.createdAt?.split('T')[0] || ''}/>
          

        </div>
      </IonModal>
    </>
  );
};

export default UpdateLoanRelease;

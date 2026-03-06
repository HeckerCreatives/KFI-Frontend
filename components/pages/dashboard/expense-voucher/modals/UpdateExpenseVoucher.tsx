import React, { useEffect, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, IonIcon, useIonToast } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { createSharp } from 'ionicons/icons';
import { ExpenseVoucherFormData, expenseVoucherSchema, UpdateExpenseVoucherFormData, updateExpenseVoucherSchema } from '../../../../../validations/expense-voucher.schema';
import { ExpenseVoucher, ExpenseVoucherEntry, TErrorData, TFormError } from '../../../../../types/types';
import { TData } from '../ExpenseVoucher';
import { formatDateInput } from '../../../../utils/date-utils';
import ExpenseVoucherForm from '../components/ExpenseVoucherForm';
import UpdateExpenseVoucherEntries from '../components/UpdateExpenseVoucherEntries';
import kfiAxios from '../../../../utils/axios';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';
import { formatAmount, formatNumber, removeAmountComma } from '../../../../ui/utils/formatNumber';
import Signatures from '../../../../ui/common/Signatures';
import { useOnlineStore } from '../../../../../store/onlineStore';
import { db } from '../../../../../database/db';
import ExpenseVoucherFormTable from '../components/ExpenseVoucherFormTable';

type UpdateExpenseVoucherProps = {
  expenseVoucher: ExpenseVoucher;
  setData: React.Dispatch<React.SetStateAction<TData>>;
  currentPage: number,
  getExpenseVouchers: (page: number, keyword?: string, sort?: string) => void;
};

const UpdateExpenseVoucher = ({ expenseVoucher, setData, getExpenseVouchers, currentPage }: UpdateExpenseVoucherProps) => {
  const [present] = useIonToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<ExpenseVoucherEntry[]>(expenseVoucher.entries || []);
  const [preventries, setPrevEntries] = useState<ExpenseVoucherEntry[]>(expenseVoucher.entries || []);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const online = useOnlineStore((state) => state.online);
  const user = localStorage.getItem('user')


  const fomattedEntries = expenseVoucher.entries.map((item) => ({
    ...item,
     line: item.line,
      _id: item._id,
      id: item._id,
      client: item.client?._id,
      clientLabel: item.client?.name,
      particular: item.particular,
      acctCodeId: item.acctCode._id,
      acctCode: item.acctCode.code,
      description: item.acctCode.description,
      debit: String(item.debit) ?? '0' ,
      credit: String(item.credit) ?? '0' ,
      interest: (item.interest || item.interestRate) === null ? '0' : String(item.interest || item.interestRate),
      cycle: item.cycle ?? '',
      checkNo: item.cycle ?? '' ,
      typeOfLoan: '',
      cvForRecompute: item.cvForRecompute,
    

  }))
  
  const form = useForm<ExpenseVoucherFormData>({
    resolver: zodResolver(expenseVoucherSchema),
    defaultValues: {
      code: '',
      supplier: '',
      supplierId: '',
      refNo: '',
      remarks: '',
      date: formatDateInput(new Date().toISOString()),
      acctMonth: `${new Date().getMonth() + 1}`,
      acctYear: `${new Date().getFullYear()}`,
      checkNo: '',
      checkDate: '',
      bank: '',
      bankLabel: '',
      amount: '0',
    },
  });

  useEffect(() => {
    if (expenseVoucher) {
      form.reset({
        code: expenseVoucher.code,
        supplier: `${expenseVoucher.supplier.code}`,
        supplierId: expenseVoucher.supplier._id,
        refNo: expenseVoucher.refNo,
        remarks: expenseVoucher.remarks,
        date: formatDateInput(expenseVoucher.date),
        acctMonth: `${expenseVoucher.acctMonth}`,
        acctYear: `${expenseVoucher.acctYear}`,
        checkNo: `${expenseVoucher.checkNo}`,
        checkDate: formatDateInput(expenseVoucher.checkDate),
        bank: expenseVoucher.bank._id,
        bankLabel: `${expenseVoucher.bank.code}`,
        amount: `${formatAmount(expenseVoucher.amount)}`,
        entries: fomattedEntries
        
      });
    }
  }, [expenseVoucher, form]);

  function dismiss() {
    form.reset();
    setIsOpen(false);
    setDeletedIds([])
  }

  const difference = `${formatNumber(Math.abs(form.watch('entries')?.reduce((acc, current) => acc + Number(removeAmountComma(current.debit || '')), 0) - form.watch('entries')?.reduce((acc, current) => acc + Number(removeAmountComma(current.credit || 0)), 0)))}`

  async function onSubmit(data: ExpenseVoucherFormData) {
        data.amount = removeAmountComma(data.amount);


      if (Number(removeAmountComma(difference)) !== 0) {
        form.setError('root', { message: `Debit and Credit must be balanced.` });
        return;
      }

       const entriesPayload = data.entries.map((item) => ({
              ...item,
              debit: Number(removeAmountComma(item.debit || '0')) ?? '0' ,
              credit: Number(removeAmountComma(item.credit || '0')) ?? '0' ,
              // interest: Number(removeAmountComma(item.interest || 0)) ?? '0',
              action: item._id ? 'update' : 'create',
              _synced: false,
            }))
      


   if(online){
     setLoading(true);
      try {

      
        const result = await kfiAxios.put(`/expense-voucher/${expenseVoucher._id}`, {...data, entries: entriesPayload});
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
          dismiss()
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
   } else {
    try {

       const existing = await db.expenseVouchers.get(expenseVoucher.id);
        if (!existing) {
          console.log("Data not found");
          return;
        }
        const updated = {
          ...data,
          entries: data.entries.map((item, index) => ({
            ...item,
            line: index + 1,
            acctCode: {
              _id: item.acctCodeId,
              code: item.acctCode,
              description: item.description
            },
            client:{
              center: item.particular,
              name: item.clientLabel,
              _id: item.client,
            },
           action: item._id ? 'update' : 'create',
          _synced: false,
          })), 
          bank:{
            code: data.bankLabel,
            description: data.bankLabel,
            _id: data.bank
          },
           supplier:{
              code: data.supplier,
              description: data.supplier,
              _id: data.supplierId,
            },
          encodedBy:{
            username: user
          },
          action: existing.isOldData ? 'update' : 'create',
          _synced: false,
        };

        await db.expenseVouchers.update(expenseVoucher.id, updated);
        getExpenseVouchers(currentPage)
  
        dismiss();
        present({
          message: "Data successfully updated!",
          duration: 1000,
        });
      } catch (error: any) {
        console.log(error)
         const errs: TErrorData | string = error?.response?.data?.error || error?.response?.data?.msg || error.message;
        const errors: TFormError[] | string = checkError(errs);
        const fields: string[] = Object.keys(form.formState.defaultValues as Object);
        formErrorHandler(errors, form.setError, fields);
        present({
          message: "Failed to save record. Please try again.",
          duration: 1200,
        });

      }
   }
  }

  return (
    <>
      {/* <div className="text-end">
        <div
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={createSharp} className="text-[1rem]" /> Edit
        </div>
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
        className=" [--border-radius:0.35rem] auto-height [--max-width:74rem] [--width:100%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader title="Expense Voucher - Edit Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content max-h-[90%] h-full !p-6 flex flex-col">
            <ModalHeader title="Expense Voucher - Edit Record" sub="Manage expense voucher." dismiss={dismiss} />

          <form onSubmit={form.handleSubmit(onSubmit)} className=' mt-4'>
            <div>
              <ExpenseVoucherForm form={form} loading={loading} />
            </div>

            <div className="text-end space-x-1 px-2 pb-2">
              <IonButton disabled={loading} type="submit" fill="clear" className="!text-sm capitalize !bg-[#FA6C2F] text-white rounded-[4px]" strong={true}>
                {loading ? 'Saving...' : 'Save Changes'}
              </IonButton>
            </div>

            

          </form>
          <div className="border-t border-t-slate-200 mt-2 flex-1 py-2">
            <ExpenseVoucherFormTable form={form} loading={loading} />
            
            {/* <UpdateExpenseVoucherEntries isOpen={isOpen} expenseVoucher={expenseVoucher} entries={entries} setEntries={setEntries} deletedIds={deletedIds} setDeletedIds={setDeletedIds} setPrevEntries={setPrevEntries}/> */}
          </div>

          {form.formState.errors.root && <div className="text-sm text-red-600 italic text-center">{form.formState.errors.root.message}</div>}

           <div className="px-3">
              <div className="grid grid-cols-3">
                <div className="flex items-center justify-start gap-2 text-sm border-4 px-2 py-1 [&>div]:!font-semibold">
                  <div className="flex items-center justify-start gap-2 text-sm border-4 px-2 py-1 [&>div]:!font-semibold">
                    <div>Diff: </div>
                    <div>{difference}</div>
                  </div>
                </div>
                <div className="flex items-center justify-start gap-2 text-sm border-4 px-2 py-1 [&>div]:!font-semibold col-span-2">
                  <div>Total: </div>
                  <div>{`${expenseVoucher.amount.toLocaleString()}`}</div>
                </div>
              </div>
            </div>
          <Signatures open={isOpen} type={'expense voucher'} preparedBy={expenseVoucher.encodedBy.username} recieveByorDate={expenseVoucher.createdAt?.split('T')[0] || ''}/>
          
        </div>
      </IonModal>
    </>
  );
};

export default UpdateExpenseVoucher;

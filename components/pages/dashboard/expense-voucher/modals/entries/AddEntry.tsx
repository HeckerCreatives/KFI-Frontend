import { IonButton, IonHeader, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useState } from 'react';
import ModalHeader from '../../../../../ui/page/ModalHeader';
import { ExpenseVoucher, ExpenseVoucherEntry, TErrorData, TFormError, Transaction } from '../../../../../../types/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { entriesSchema, EntryFormData } from '../../../../../../validations/loan-release.schema';

import kfiAxios from '../../../../../utils/axios';
import checkError from '../../../../../utils/check-error';
import formErrorHandler from '../../../../../utils/form-error-handler';
import { ExpenseVoucherEntryFormData, expenseVoucherEntrySchema } from '../../../../../../validations/expense-voucher.schema';
import EntryForm from '../../components/EVEntryForm';
import { removeAmountComma } from '../../../../../ui/utils/formatNumber';
import { TData } from '../../components/UpdateExpenseVoucherEntries';

type AddEntryProps = {
  expenseVoucherId: string;
  getEntries: (page: number) => void;
  transaction: ExpenseVoucher;
  entries: ExpenseVoucherEntry[] 
  setEntries: React.Dispatch<React.SetStateAction<ExpenseVoucherEntry[]>>;
  setData: React.Dispatch<React.SetStateAction<TData>>;
  
};

const AddEntry = ({ expenseVoucherId, getEntries, entries, setEntries, transaction, setData }: AddEntryProps) => {
  const [present] = useIonToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<ExpenseVoucherEntryFormData>({
    resolver: zodResolver(expenseVoucherEntrySchema),
    defaultValues: {
      client: '',
      clientLabel: '',
      particular: '',
      acctCodeId: '',
      acctCode: '',
      description: '',
      debit: '0',
      credit: '0',
      cvForRecompute: '',
    },
  });

  function dismiss() {
    form.reset();
    setIsOpen(false);
  }

  function generateObjectId(): string {
    const timestamp = Math.floor(Date.now() / 1000).toString(16);
    const random = 'xxxxxxxxxxxxxxxx'.replace(/x/g, () =>
      Math.floor(Math.random() * 16).toString(16)
    ); 
    return timestamp + random; 
  }



  const onSubmit = async (data: ExpenseVoucherEntryFormData) => {
      if (data.debit === '' && data.credit === '') {
        form.setError('root', { message: 'No data to save. Please add a debit/credit.' });
        return;
      }
  
      setLoading(true);
      try {
        data.debit = removeAmountComma(data.debit as string);
        data.credit = removeAmountComma(data.credit as string);
  
        console.log(data)
  
        const debit = Number(removeAmountComma(data.debit));
        const credit = Number(removeAmountComma(data.credit));
  
        setEntries((prev: ExpenseVoucherEntry[]) => {
      
  
        const newEntry: ExpenseVoucherEntry = {
          _id: generateObjectId(),
          expenseVoucher: transaction._id,
          acctCode: {
            _id: data.acctCodeId ?? "",
            code: data.acctCode ?? "",
            description: data.description ?? ""
          },

          debit,
          credit,
          particular: data.particular ?? "",
          cvForRecompute: data.cvForRecompute ?? '',
          // encodedBy: "685f9b8702d3d375e40529c1",
          createdAt: new Date().toISOString(),
          client: {
            _id: data.client ?? '',
            name: data.clientLabel ?? '',
            center: {
              _id: '',
              centerNo: ''
            }
          }
        };
  
        return [...prev, newEntry];
      });
  
      
      setData((prev: any) => {
     
  
       const newEntry: ExpenseVoucherEntry = {
          _id: generateObjectId(),
          expenseVoucher: transaction._id,
          acctCode: {
            _id: data.acctCodeId ?? "",
            code: data.acctCode ?? "",
            description: data.description ?? ""
          },

          debit,
          credit,
          particular: data.particular ?? "",
          cvForRecompute: data.cvForRecompute ?? '',
          // encodedBy: "685f9b8702d3d375e40529c1",
          createdAt: new Date().toISOString(),
          client: {
            _id: data.client ?? '',
            name: data.clientLabel ?? '',
            center: {
              _id: '',
              centerNo: ''
            }
          }
        };
  
        return {
          ...prev,
          entries: [...prev.entries, newEntry],
        };
      });
  
  
  
        present({ message: 'Entry added successfully', duration: 1200 });
        dismiss();
      } catch (err) {
        present({ message: 'Failed to add entry locally', duration: 1200 });
      } finally {
        setLoading(false);
      }
    };
  return (
    <>
      <IonButton onClick={() => setIsOpen(true)} type="button" fill="clear" className="max-h-10 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
        + Add Entries
      </IonButton>
      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:30rem] md:[--width:100%] lg:[--max-width:30rem] lg:[--width:50%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader title="Expense Voucher - Add Entry" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6">
            <ModalHeader title="Expense Voucher - Add Entry" sub="Transaction" dismiss={dismiss} />

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <EntryForm form={form} loading={loading} />
            {form.formState.errors.root && <div className="text-sm text-center italic text-red-600">{form.formState.errors.root.message}</div>}
            <div className="text-end space-x-1 px-2">
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

export default AddEntry;

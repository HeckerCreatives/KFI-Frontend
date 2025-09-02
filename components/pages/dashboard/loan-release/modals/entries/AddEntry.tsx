import { IonButton, IonHeader, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useState } from 'react';
import ModalHeader from '../../../../../ui/page/ModalHeader';
import {Entry, TErrorData, TFormError, Transaction } from '../../../../../../types/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { entriesSchema, EntryFormData } from '../../../../../../validations/loan-release.schema';
import EntryForm from '../../components/EntryForm';
import kfiAxios from '../../../../../utils/axios';
import checkError from '../../../../../utils/check-error';
import formErrorHandler from '../../../../../utils/form-error-handler';
import { removeAmountComma } from '../../../../../ui/utils/formatNumber';
import { TData } from '../../components/UpdateEntries';


type AddEntryProps = {
  transactionId: string;
  centerNo: string;
  centerId: string;
  getEntries: (page: number) => void;
  currentAmount: string;
  entries: Entry[];
  setData: React.Dispatch<React.SetStateAction<any>>; 
  transaction: Transaction;
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>;

};





const AddEntry = ({ transactionId, centerNo, centerId, getEntries, currentAmount, entries, setData, transaction, setEntries }: AddEntryProps) => {
  const [present] = useIonToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<EntryFormData>({
    resolver: zodResolver(entriesSchema),
    defaultValues: {
      clientId: '',
      client: '',
      particular: '',
      acctCodeId: '',
      acctCode: '',
      description: '',
      debit: '',
      credit: '',
      interest: '',
      cycle: '',
      checkNo: '',
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

 const onSubmit = async (data: EntryFormData) => {
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

      setEntries((prev: Entry[]) => {
      const nextLine = prev.length > 0 
        ? Math.max(...prev.map(e => e.line)) + 1 
        : 1;

      const newEntry: Entry = {
        _id: generateObjectId(),
        acctCode: { 
          _id: data.acctCodeId ?? "", 
          code: data.acctCode ?? "", 
          description: data.description ?? "" 
        },
        client: { 
          _id: data.clientId ?? "", 
          name: data.client ?? "" 
        },
        product: { 
          _id: transaction.bank._id, 
          code: transaction.bank.code 
        }, 
        center: { 
          _id: centerId, 
          centerNo: centerNo, 
          description: transaction.center.description 
        }, 
        debit,
        credit,
        checkNo: data.checkNo ?? "",
        cycle: Number(data.cycle),
        interest: Number(data.interest) || null,
        particular: data.particular ?? "",
        transaction: "",
        createdAt: new Date().toISOString(),
        line: nextLine,
      };

      return [...prev, newEntry];
    });

    
    setData((prev: any) => {
    const nextLine =
        prev.entries.length > 0
          ? Math.max(...prev.entries.map((e: Entry) => e.line)) + 1
          : 1;

      const newEntry: Entry = {
        _id: generateObjectId(),
        acctCode: {
          _id: data.acctCodeId ?? "",
          code: data.acctCode ?? "",
          description: data.description ?? "",
        },
        client: {
          _id: data.clientId ?? "",
          name: data.client ?? "",
        },
        product: {
          _id: transaction.bank._id,
          code: transaction.bank.code,
        },
        center: {
          _id: centerId,
          centerNo: centerNo,
          description: transaction.center.description,
        },
        debit,
        credit,
        checkNo: data.checkNo ?? "",
        cycle: Number(data.cycle),
        interest: Number(data.interest) || null,
        particular: data.particular ?? "",
        transaction: "",
        createdAt: new Date().toISOString(),
        line: nextLine,
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
        className=" [--border-radius:0.35rem] auto-height [--max-width:30rem] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader title="Loan Release - Add Entry" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6">
            <ModalHeader title="Loan Release - Add Entry" sub="Transaction" dismiss={dismiss} />

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <EntryForm form={form} center={centerId} centerNo={centerNo} loading={loading} />
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

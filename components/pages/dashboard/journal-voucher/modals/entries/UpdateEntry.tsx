import { IonButton, IonHeader, IonIcon, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import ModalHeader from '../../../../../ui/page/ModalHeader';
import { ExpenseVoucherEntry, JournalVoucher, JournalVoucherEntry, TErrorData, TFormError } from '../../../../../../types/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import kfiAxios from '../../../../../utils/axios';
import checkError from '../../../../../utils/check-error';
import formErrorHandler from '../../../../../utils/form-error-handler';
import EntryForm from '../../components/JVEntryForm';

import { create } from 'ionicons/icons';
import { TData } from '../../components/UpdateJVEntries';
import { JournalVoucherEntryFormData, journalVoucherEntrySchema } from '../../../../../../validations/journal-voucher.schema';
import { formatAmount, removeAmountComma } from '../../../../../ui/utils/formatNumber';

type UpdateEntryProps = {
  entry: JournalVoucherEntry;
  setData: React.Dispatch<React.SetStateAction<TData>>;
  transaction: JournalVoucher;
  entries: JournalVoucherEntry[];
  setEntries: React.Dispatch<React.SetStateAction<JournalVoucherEntry[]>>;
};

const UpdateEntry = ({ entry, setData, setEntries }: UpdateEntryProps) => {
  const [present] = useIonToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<JournalVoucherEntryFormData>({
    resolver: zodResolver(journalVoucherEntrySchema),
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

  useEffect(() => {
    if (entry) {
      form.reset({
        client: entry?.client?._id || '',
        clientLabel: entry?.client?.name || '',
        particular: entry.particular || '',
        acctCodeId: entry.acctCode._id,
        acctCode: entry.acctCode.code,
        description: entry.acctCode.description,
        debit: `${formatAmount(entry.debit as number)}`,
        credit: `${formatAmount(entry.credit as number)}`,
        cvForRecompute: entry.cvForRecompute,
      });
    }
  }, [form, entry]);

  function dismiss() {
    form.reset();
    setIsOpen(false);
  }

  const onSubmit = async (data: JournalVoucherEntryFormData) => {
     setLoading(true);
     try {
       const debitStr = removeAmountComma(data.debit as string);
       const creditStr = removeAmountComma(data.credit as string);
 
       const debit = Number(debitStr);
       const credit = Number(creditStr);
 
       if (isNaN(debit) || isNaN(credit)) {
         form.setError("root", { message: "Debit and Credit must be valid numbers." });
         setLoading(false);
         return;
       }
 
       const updatedEntry: JournalVoucherEntry = {
         ...entry,
         ...data,
         journalVoucher: '',
         acctCode: {
           _id: data.acctCodeId ?? '',
           code: data.acctCode ?? '',
           description: data.description ?? '',
         },
         debit,
         credit,
         particular: data.particular ?? '',
         cvForRecompute: data.cvForRecompute ?? '',
         createdAt: new Date().toISOString(),
         client: {
           _id: data.client ?? '',
           name: data.clientLabel ?? '',
           center: {
             _id: '',
             centerNo: '',
           },
         },
       };
 
       setData((prev: TData) => {
         const updatedEntries = prev.entries.map((e) =>
           e._id === entry._id ? updatedEntry : e
         );
 
        setEntries(updatedEntries);
         return { ...prev, entries: updatedEntries };
       });
 
       present({ message: 'Entry successfully updated', duration: 1000 });
       dismiss();
     } catch (error: any) {
       present({ message: 'Failed to update entry locally', duration: 1000 });
     } finally {
       setLoading(false);
     }
   };

  return (
    <>
      <IonButton onClick={() => setIsOpen(true)} fill="clear" className="text-blue-700 [--padding-start:0] [--padding-end:0] [--padding-top:0] [--padding-bottom:0] min-h-5">
        <IonIcon icon={create} />
      </IonButton>
      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:30rem] md:[--width:100%] lg:[--max-width:30rem] lg:[--width:50%] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader title="Journal Voucher - Edit Entry" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6">
            <ModalHeader title="Journal Voucher - Edit Entry" sub="Transaction" dismiss={dismiss} />

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

export default UpdateEntry;

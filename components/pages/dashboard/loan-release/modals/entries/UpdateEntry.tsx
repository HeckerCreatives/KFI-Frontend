import { IonButton, IonHeader, IonIcon, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import ModalHeader from '../../../../../ui/page/ModalHeader';
import { create } from 'ionicons/icons';
import { Entry, TErrorData, TFormError, Transaction } from '../../../../../../types/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { entriesSchema, EntryFormData } from '../../../../../../validations/loan-release.schema';
import EntryForm from '../../components/EntryForm';
import kfiAxios from '../../../../../utils/axios';
import { TData } from '../../components/UpdateEntries';
import formErrorHandler from '../../../../../utils/form-error-handler';
import checkError from '../../../../../utils/check-error';
import { formatAmount, removeAmountComma } from '../../../../../ui/utils/formatNumber';

type UpdateEntryProps = {
  entry: Entry;
  setData: React.Dispatch<React.SetStateAction<TData>>;
  transaction: Transaction;
  entries: Entry[];
    setEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
  
};

const UpdateEntry = ({ entry, setData, setEntries }: UpdateEntryProps) => {
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

  useEffect(() => {
    if (entry) {
      form.reset({
        clientId: entry?.client?._id || '',
        client: entry?.client?.name || '',
        particular: entry?.particular || '',
        acctCodeId: entry?.acctCode?._id || '',
        acctCode: entry?.acctCode?.code || '',
        description: entry?.acctCode?.description,
        debit: entry.debit ? `${formatAmount(entry.debit)}` : '',
        credit: entry.credit ? `${formatAmount(entry.credit)}` : '',
        interest: entry.interest ? `${entry.interest}` : '',
        cycle: entry.cycle ? `${entry.cycle}` : '',
        checkNo: entry.checkNo ? `${entry.checkNo}` : '',
      });
    }
  }, [entry, form]);

  function dismiss() {
    form.reset();
    setIsOpen(false);
  }

  const onSubmit = async (data: EntryFormData) => {
  if (
    data.debit === '' &&
    data.credit === '' &&
    data.checkNo === '' &&
    data.cycle === ''
  ) {
    form.setError('root', {
      message: 'No data to save. Please fill necessary fields.',
    });
    return;
  }

  setLoading(true);
  try {
    data.debit = removeAmountComma(data.debit as string);
    data.credit = removeAmountComma(data.credit as string);

    const updatedEntry: Entry = {
      ...entry,
      ...data,
      transaction: entry.transaction,
      center: entry.center,
      client: {
        ...entry.client,
        _id: data.clientId || entry.client._id,
        name: data.client || entry.client.name,
      },
      acctCode: {
        ...entry.acctCode,
        _id: data.acctCodeId || entry.acctCode?._id,
        code: data.acctCode || entry.acctCode?.code,
        description: data.description || entry.acctCode?.description,
      },
      debit: data.debit ? Number(data.debit) : 0,
      credit: data.credit ? Number(data.credit) : 0,
      interest: data.interest ? Number(data.interest) : 0,
      cycle: data.cycle ? Number(data.cycle) : 0,
      checkNo: data.checkNo || '',
    };

      setData((prev: TData) => {
        const index = prev.entries.findIndex((e: Entry) => e._id === entry._id);
        if (index < 0) return prev;
        const updatedEntries = [...prev.entries];
        updatedEntries[index] = updatedEntry;

        setEntries(updatedEntries);

        return { ...prev, entries: updatedEntries };
      });


    // setEntries((prev: Entry[]) => {
    //   const index = prev.findIndex((e) => e._id === entry._id);
    //   if (index < 0) return prev;
    //   const updatedEntries = [...prev];
    //   updatedEntries[index] = updatedEntry;
    //   return updatedEntries;
    // });


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
            <ModalHeader disabled={loading} title="Loan Release - Edit Entry" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6">
            <ModalHeader disabled={loading} title="Loan Release - Edit Entry" sub="Transaction" dismiss={dismiss} />

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <EntryForm form={form} center={entry.center._id} centerNo={entry.center.centerNo} loading={loading} />
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

import { IonButton, IonHeader, IonIcon, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import ModalHeader from '../../../../../ui/page/ModalHeader';
import { ExpenseVoucherEntry, JournalVoucherEntry, TErrorData, TFormError } from '../../../../../../types/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import kfiAxios from '../../../../../utils/axios';
import checkError from '../../../../../utils/check-error';
import formErrorHandler from '../../../../../utils/form-error-handler';
import EntryForm from '../../components/JVEntryForm';

import { create } from 'ionicons/icons';
import { TData } from '../../components/UpdateJVEntries';
import { JournalVoucherEntryFormData, journalVoucherEntrySchema } from '../../../../../../validations/journal-voucher.schema';

type UpdateEntryProps = {
  entry: JournalVoucherEntry;
  setData: React.Dispatch<React.SetStateAction<TData>>;
};

const UpdateEntry = ({ entry, setData }: UpdateEntryProps) => {
  const [present] = useIonToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<JournalVoucherEntryFormData>({
    resolver: zodResolver(journalVoucherEntrySchema),
    defaultValues: {
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
        particular: entry.particular,
        acctCodeId: entry.acctCode._id,
        acctCode: entry.acctCode.code,
        description: entry.acctCode.description,
        debit: `${entry.debit}`,
        credit: `${entry.credit}`,
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
    setLoading(true);
    try {
      const result = await kfiAxios.put(`/journal-voucher/entries/${entry.journalVoucher}/${entry._id}`, data);
      const { success, entry: updatedEntry } = result.data;
      if (success) {
        setData((prev: TData) => {
          const index = prev.entries.findIndex((entry: JournalVoucherEntry) => entry._id === updatedEntry._id);
          if (index < 0) return prev;
          prev.entries[index] = { ...updatedEntry };
          return { ...prev };
        });
        present({ message: 'Entry successfully updated', duration: 1000 });
        dismiss();
        return;
      }
      present({ message: 'Failed to update the entry', duration: 1000 });
    } catch (error: any) {
      const errs: TErrorData | string = error?.response?.data?.error || error?.response?.data?.msg || error.message;
      const errors: TFormError[] | string = checkError(errs);
      const fields: string[] = Object.keys(form.formState.defaultValues as Object);
      formErrorHandler(errors, form.setError, fields);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <IonButton onClick={() => setIsOpen(true)} fill="clear" className="text-blue-700 [--padding-start:0] [--padding-end:0] [--padding-top:0] [--padding-bottom:0] min-h-5">
        <IonIcon icon={create} />
      </IonButton>
      <IonModal isOpen={isOpen} backdropDismiss={false} className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:50%] lg:[--width:50%]">
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader title="Journal Voucher - Edit Entry" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content !px-0">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <EntryForm form={form} loading={loading} />
            {form.formState.errors.root && <div className="text-sm text-center italic text-red-600">{form.formState.errors.root.message}</div>}
            <div className="text-end space-x-1 px-2">
              <IonButton disabled={loading} color="tertiary" type="submit" className="!text-sm capitalize" strong={true}>
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

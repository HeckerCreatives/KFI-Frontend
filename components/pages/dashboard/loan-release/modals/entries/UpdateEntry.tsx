import { IonButton, IonHeader, IonIcon, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import ModalHeader from '../../../../../ui/page/ModalHeader';
import { create } from 'ionicons/icons';
import { Entry, TErrorData, TFormError } from '../../../../../../types/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { entriesSchema, EntryFormData } from '../../../../../../validations/loan-release.schema';
import EntryForm from '../../components/EntryForm';
import kfiAxios from '../../../../../utils/axios';
import { TData } from '../../components/UpdateEntries';
import formErrorHandler from '../../../../../utils/form-error-handler';
import checkError from '../../../../../utils/check-error';

type UpdateEntryProps = {
  entry: Entry;
  setData: React.Dispatch<React.SetStateAction<TData>>;
};

const UpdateEntry = ({ entry, setData }: UpdateEntryProps) => {
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
        debit: entry.debit ? `${entry.debit}` : '',
        credit: entry.credit ? `${entry.credit}` : '',
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
    if (data.debit === '' && data.credit === '' && data.checkNo === '' && data.cycle === '') {
      form.setError('root', { message: 'No data to save. Please fill necessary fields.' });
      return;
    }
    setLoading(true);
    try {
      const result = await kfiAxios.put(`transaction/loan-release/entries/${entry.transaction}/${entry._id}`, data);
      const { success, entry: updatedEntry } = result.data;
      if (success) {
        setData((prev: TData) => {
          const index = prev.entries.findIndex((entry: Entry) => entry._id === updatedEntry._id);
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
      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:30rem] md:[--width:100%] lg:[--max-width:30rem] lg:[--width:50%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Loan Release - Edit Entry" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content !px-0">
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

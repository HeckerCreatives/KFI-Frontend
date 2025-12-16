import { IonButton, IonHeader, IonIcon, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import ModalHeader from '../../../../../ui/page/ModalHeader';
import { Release, ReleaseEntry, TErrorData, TFormError } from '../../../../../../types/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import kfiAxios from '../../../../../utils/axios';
import checkError from '../../../../../utils/check-error';
import formErrorHandler from '../../../../../utils/form-error-handler';
import { create } from 'ionicons/icons';
import { TData } from '../../components/UpdateReleaseEntries';
import AcknowledgementEntryForm from '../../components/ReleaseEntryForm';
import { formatDateTable } from '../../../../../utils/date-utils';
import { ReleaseEntryFormData, releaseEntrySchema } from '../../../../../../validations/release.schema';
import { formatAmount, removeAmountComma } from '../../../../../ui/utils/formatNumber';

type UpdateEntryProps = {
  entry: ReleaseEntry;
  setData: React.Dispatch<React.SetStateAction<TData>>;
   transaction: Release;
    entries: ReleaseEntry[];
    setEntries: React.Dispatch<React.SetStateAction<ReleaseEntry[]>>;
};

const UpdateEntry = ({ entry, setData, transaction, entries, setEntries }: UpdateEntryProps) => {
  const [present] = useIonToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<ReleaseEntryFormData>({
    resolver: zodResolver(releaseEntrySchema),
    defaultValues: {
      loanReleaseEntryId: '',
      cvNo: '',
      dueDate: '',
      noOfWeeks: '',
      name: '',
      particular: '',
      acctCodeId: '',
      acctCode: '',
      description: '',
      debit: '0',
      credit: '0',
    },
  });

  useEffect(() => {
    if (entry) {
      form.reset({
        loanReleaseEntryId: entry.loanReleaseEntryId ? entry.loanReleaseEntryId._id : '',
        cvNo: entry.loanReleaseEntryId ? entry.loanReleaseEntryId.transaction.code : '',
        dueDate: entry.loanReleaseEntryId ? formatDateTable(entry.loanReleaseEntryId.transaction.dueDate) : '',
        noOfWeeks: entry.loanReleaseEntryId ? `${entry.loanReleaseEntryId.transaction.noOfWeeks}` : '',
        name: entry.loanReleaseEntryId ? `${entry.loanReleaseEntryId.client.name}` : '',
        particular: entry.particular,
        acctCodeId: entry.acctCode._id,
        acctCode: entry.acctCode.code,
        description: entry.acctCode.description,
        debit: `${formatAmount(entry.debit as number)}`,
        credit: `${formatAmount(entry.credit as number)}`,
      });
    }
  }, [form, entry]);

  function dismiss() {
    form.reset();
    setIsOpen(false);
  }

  const onSubmit = async (data: ReleaseEntryFormData) => {
     setLoading(true);
     try {
       const debitStr = removeAmountComma(data.debit as string);
       const creditStr = removeAmountComma(data.credit as string);
 
       const debit = Number(debitStr);
       const credit = Number(creditStr);
 
       if (isNaN(debit) || isNaN(credit)) {
         form.setError("root", {
           message: "Debit and Credit must be valid numbers.",
         });
         setLoading(false);
         return;
       }
 
       const updatedEntry: ReleaseEntry = {
         ...entry, 
         ...data,
         
          loanReleaseEntryId: {
                _id: data.loanReleaseEntryId ?? '',
                transaction: {
                  _id: "",
                  code: data.cvNo ?? '',
                 dueDate: data.dueDate ?? '',
 
                  noOfWeeks: 20
                },
                client: {
                  _id: data.client ?? '',
                  name: data.name ?? ''
                }},
         acctCode: {
           _id: data.acctCodeId,
           code: data.acctCode,
           description: data.description ?? "",
         },
         debit,
         credit,
         particular: data.particular ?? "",
         createdAt: new Date().toISOString(),
          _synced: false,
        action: "update",
       };
 
       setData((prev: TData) => {
         const updatedEntries = prev.entries.map((e) =>
           e._id === entry._id ? updatedEntry : e
         );
 
         setEntries(updatedEntries);
         return { ...prev, entries: updatedEntries };
       });
 
       present({ message: "Entry successfully updated", duration: 1000 });
       dismiss();
     } catch (error: any) {
       present({ message: "Failed to update entry locally", duration: 1000 });
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
            <ModalHeader title="Acknowledgement - Edit Entry" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6">
          <ModalHeader title="Acknowledgement - Edit Entry" sub="Manage acknowledgement record." dismiss={dismiss} />
                  
          <form onSubmit={form.handleSubmit(onSubmit)} className=' mt-4'>
            <AcknowledgementEntryForm form={form} loading={loading} />
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

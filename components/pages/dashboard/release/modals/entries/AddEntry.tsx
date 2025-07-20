import { IonButton, IonHeader, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useState } from 'react';
import ModalHeader from '../../../../../ui/page/ModalHeader';
import { TErrorData, TFormError } from '../../../../../../types/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EntryFormData } from '../../../../../../validations/loan-release.schema';
import kfiAxios from '../../../../../utils/axios';
import checkError from '../../../../../utils/check-error';
import formErrorHandler from '../../../../../utils/form-error-handler';
import { AcknowledgementEntryFormData, acknowledgementEntrySchema } from '../../../../../../validations/acknowledgement.schema';
import AcknowledgementEntryForm from '../../components/ReleaseEntryForm';
import { ReleaseEntryFormData, releaseEntrySchema } from '../../../../../../validations/release.schema';

type AddEntryProps = {
  releaseId: string;
  getEntries: (page: number) => void;
};

const AddEntry = ({ releaseId, getEntries }: AddEntryProps) => {
  const [present] = useIonToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<ReleaseEntryFormData>({
    resolver: zodResolver(releaseEntrySchema),
    defaultValues: {
      loanReleaseEntryId: '',
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

  function dismiss() {
    form.reset();
    setIsOpen(false);
  }

  const onSubmit = async (data: ReleaseEntryFormData) => {
    setLoading(true);
    try {
      const result = await kfiAxios.post(`/release/entries/${releaseId}`, data);
      const { success } = result.data;
      if (success) {
        getEntries(1);
        present({ message: 'Entry successfully added', duration: 1000 });
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
      <IonButton onClick={() => setIsOpen(true)} type="button" fill="clear" className="max-h-10 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
        + Add Entries
      </IonButton>
      <IonModal isOpen={isOpen} backdropDismiss={false} className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:50%] lg:[--width:50%]">
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader title="Release - Add Entry" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content !px-0">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <AcknowledgementEntryForm form={form} loading={loading} />
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

export default AddEntry;

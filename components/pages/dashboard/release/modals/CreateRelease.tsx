import React, { useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, useIonToast } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import kfiAxios from '../../../../utils/axios';
import { TErrorData, TFormError } from '../../../../../types/types';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';
import { ReleaseFormData, releaseSchema } from '../../../../../validations/release.schema';
import ReleaseForm from '../components/ReleaseForm';
import ReleaseFormTable from '../components/ReleaseFormTable';
import { formatDateInput } from '../../../../utils/date-utils';
import { removeAmountComma } from '../../../../ui/utils/formatNumber';

type CreateReleaseProps = {
  getReleases: (page: number, keyword?: string, sort?: string) => void;
};

const CreateRelease = ({ getReleases }: CreateReleaseProps) => {
  const [present] = useIonToast();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<ReleaseFormData>({
    resolver: zodResolver(releaseSchema),
    defaultValues: {
      code: '',
      center: '',
      centerLabel: '',
      centerName: '',
      refNo: '',
      remarks: '',
      date: formatDateInput(new Date().toISOString()),
      acctMonth: `${new Date().getMonth() + 1}`,
      acctYear: `${new Date().getFullYear()}`,
      acctOfficer: '',
      checkNo: '',
      checkDate: '',
      type: '',
      bankCode: '',
      bankCodeLabel: '',
      amount: '',
      cashCollection: '',
      entries: [],
      mode: 'create',
    },
  });

  function dismiss() {
    form.reset();
    setIsOpen(false);
  }

  async function onSubmit(data: ReleaseFormData) {
    setLoading(true);
    try {
      data.amount = removeAmountComma(data.amount);
      data.cashCollection = removeAmountComma(data.cashCollection as string);
      data.entries = data.entries ? data.entries.map(entry => ({ ...entry, debit: removeAmountComma(entry.debit), credit: removeAmountComma(entry.credit) })) : [];
      const result = await kfiAxios.post('release', data);
      const { success } = result.data;
      if (success) {
        getReleases(1);
        present({
          message: 'Acknowledgement successfully added.',
          duration: 1000,
        });
        dismiss();
        return;
      }
      present({
        message: 'Failed to add a new acknowledgement. Please try again.',
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
  }

  return (
    <>
      <div className="text-end">
        <IonButton
          fill="clear"
          onClick={() => setIsOpen(true)}
          className="max-h-10 min-h-6 min-w-32 max-w-32 w-32 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md"
          strong
        >
          + Add Record
        </IonButton>
      </div>
      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height [--max-width:84rem] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Acknowledgement - Add Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content max-h-[90%] h-full !p-6">
            <ModalHeader disabled={loading} title="Acknowledgement - Add Record" sub="Manage acknowledgement record." dismiss={dismiss} />

          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full mt-4">
            <div className="mb-3 flex-1">
              <ReleaseForm form={form} loading={loading} />
              <ReleaseFormTable form={form} />
            </div>
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

export default CreateRelease;

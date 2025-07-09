import React, { useEffect, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, IonIcon, useIonToast } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { createSharp } from 'ionicons/icons';
import { Release, TErrorData, TFormError } from '../../../../../types/types';
import { formatDateInput } from '../../../../utils/date-utils';
import kfiAxios from '../../../../utils/axios';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';
import { TData } from '../Release';
import AcknowledgementForm from '../components/ReleaseForm';
import { ReleaseFormData, releaseSchema } from '../../../../../validations/release.schema';
import UpdateReleaseEntries from '../components/UpdateReleaseEntries';

type UpdateReleaseProps = {
  release: Release;
  setData: React.Dispatch<React.SetStateAction<TData>>;
};

const UpdateRelease = ({ release, setData }: UpdateReleaseProps) => {
  const [present] = useIonToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<ReleaseFormData>({
    resolver: zodResolver(releaseSchema),
    defaultValues: {
      code: '',
      center: '',
      centerLabel: '',
      centerName: '',
      refNo: '',
      remarks: '',
      date: '',
      acctMonth: '',
      acctYear: '',
      acctOfficer: '',
      checkNo: '',
      checkDate: '',
      type: '',
      bankCode: '',
      bankCodeLabel: '',
      amount: '',
      cashCollection: '',
      mode: 'update',
    },
  });

  useEffect(() => {
    if (release) {
      form.reset({
        code: release.code,
        center: release.center._id,
        centerLabel: release.center.centerNo,
        centerName: release.center.description,
        refNo: release.refNo,
        remarks: release.remarks,
        date: formatDateInput(release.date),
        acctMonth: `${release.acctMonth}`,
        acctYear: `${release.acctYear}`,
        acctOfficer: release.acctOfficer,
        checkNo: release.checkNo,
        checkDate: formatDateInput(release.checkDate),
        type: release.type,
        bankCode: release.bankCode._id,
        bankCodeLabel: `${release.bankCode.code} - ${release.bankCode.description}`,
        amount: `${release.amount}`,
        cashCollection: `${release.cashCollectionAmount || 0}`,
        mode: 'update',
      });
    }
  }, [release, form]);

  function dismiss() {
    form.reset();
    setIsOpen(false);
  }

  async function onSubmit(data: ReleaseFormData) {
    setLoading(true);
    try {
      const result = await kfiAxios.put(`release/${release._id}`, data);
      const { success, release: updatedRelease } = result.data;
      if (success) {
        setData(prev => {
          const index = prev.releases.findIndex(release => release._id === updatedRelease._id);
          if (index < 0) return prev;
          prev.releases[index] = { ...updatedRelease };
          return { ...prev };
        });
        present({
          message: 'Release successfully updated.',
          duration: 1000,
        });
        return;
      }
      present({
        message: 'Failed to update the release',
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
        <div
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={createSharp} className="text-[1rem]" /> Edit
        </div>
      </div>
      <IonModal isOpen={isOpen} backdropDismiss={false} className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:70%] lg:[--width:70%]">
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader title="Release - Edit Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content !px-0">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <AcknowledgementForm form={form} loading={loading} />
            </div>
            <div className="text-end space-x-1 px-2 pb-2">
              <IonButton disabled={loading} color="tertiary" type="submit" className="!text-sm capitalize" strong={true}>
                {loading ? 'Saving...' : 'Save Changes'}
              </IonButton>
            </div>
          </form>
          <div className="border-t border-t-slate-400 mx-2 pt-5">
            <UpdateReleaseEntries isOpen={isOpen} release={release} />
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default UpdateRelease;

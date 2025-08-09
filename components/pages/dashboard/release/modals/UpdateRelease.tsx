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
import { formatAmount, removeAmountComma } from '../../../../ui/utils/formatNumber';

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
        bankCodeLabel: `${release.bankCode.code}`,
        amount: `${formatAmount(release.amount)}`,
        cashCollection: `${formatAmount(release.cashCollectionAmount || 0)}`,
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
      data.amount = removeAmountComma(data.amount);
      data.cashCollection = removeAmountComma(data.cashCollection as string);
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
          message: 'Acknowledgement successfully updated.',
          duration: 1000,
        });
        return;
      }
      present({
        message: 'Failed to update the acknowledgement',
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
      {/* <div className="text-end">
        <div
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={createSharp} className="text-[1rem]" /> Edit
        </div>
      </div> */}
      <IonButton
        onClick={() => setIsOpen(true)}
        type="button"
        fill="clear"
        className="space-x-1 rounded-lg w-16 h-6 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-[#ff9a00] text-slate-700 capitalize min-h-4 text-xs"
      >
        <IonIcon icon={createSharp} className="text-xs" />
        <span>Edit</span>
      </IonButton>
      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:95%] lg:[--width:95%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader title="Acknowledgement - Edit Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content h-screen !px-0 flex flex-col">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <AcknowledgementForm form={form} loading={loading} />
            </div>
            <div className="text-end space-x-1 px-2 pb-2">
              <IonButton disabled={loading} type="submit" fill="clear" className="!text-sm capitalize !bg-[#FA6C2F] text-white rounded-[4px]" strong={true}>
                {loading ? 'Saving...' : 'Save Changes'}
              </IonButton>
            </div>
          </form>
          <div className="border-t border-t-slate-400 mx-2 pt-5 flex-1">
            <UpdateReleaseEntries isOpen={isOpen} release={release} />
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default UpdateRelease;

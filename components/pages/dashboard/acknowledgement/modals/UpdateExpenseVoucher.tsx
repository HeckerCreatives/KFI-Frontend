import React, { useEffect, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, IonIcon, useIonToast } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { createSharp } from 'ionicons/icons';
import { Acknowledgement, TErrorData, TFormError } from '../../../../../types/types';
import { formatDateInput } from '../../../../utils/date-utils';
import kfiAxios from '../../../../utils/axios';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';
import { TData } from '../Acknowledgement';
import { AcknowledgementFormData, acknowledgementSchema } from '../../../../../validations/acknowledgement.schema';
import AcknowledgementForm from '../components/AcknowledgementForm';
import UpdateAcknowledgementEntries from '../components/UpdateAcknowledgementEntries';
import { formatAmount, removeAmountComma } from '../../../../ui/utils/formatNumber';

type UpdateAcknowledgementProps = {
  acknowledgement: Acknowledgement;
  setData: React.Dispatch<React.SetStateAction<TData>>;
};

const UpdateAcknowledgement = ({ acknowledgement, setData }: UpdateAcknowledgementProps) => {
  const [present] = useIonToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<AcknowledgementFormData>({
    resolver: zodResolver(acknowledgementSchema),
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
    if (acknowledgement) {
      form.reset({
        code: acknowledgement.code,
        center: acknowledgement.center._id,
        centerLabel: acknowledgement.center.centerNo,
        centerName: acknowledgement.center.description,
        refNo: acknowledgement.refNo,
        remarks: acknowledgement.remarks,
        date: formatDateInput(acknowledgement.date),
        acctMonth: `${acknowledgement.acctMonth}`,
        acctYear: `${acknowledgement.acctYear}`,
        acctOfficer: acknowledgement.acctOfficer,
        checkNo: acknowledgement.checkNo,
        checkDate: formatDateInput(acknowledgement.checkDate),
        type: acknowledgement.type,
        bankCode: acknowledgement.bankCode._id,
        bankCodeLabel: `${acknowledgement.bankCode.code}`,
        amount: `${formatAmount(acknowledgement.amount)}`,
        cashCollection: `${acknowledgement.cashCollectionAmount || 0}`,
        mode: 'update',
      });
    }
  }, [acknowledgement, form]);

  function dismiss() {
    form.reset();
    setIsOpen(false);
  }

  async function onSubmit(data: AcknowledgementFormData) {
    setLoading(true);
    try {
      data.amount = removeAmountComma(data.amount);
      data.cashCollection = data.cashCollection !== '' ? removeAmountComma(data.cashCollection as string) : data.cashCollection;
      const result = await kfiAxios.put(`acknowledgement/${acknowledgement._id}`, data);
      const { success, acknowledgement: updatedAcknowledgement } = result.data;
      if (success) {
        setData(prev => {
          const index = prev.acknowledgements.findIndex(acknowledgement => acknowledgement._id === updatedAcknowledgement._id);
          if (index < 0) return prev;
          prev.acknowledgements[index] = { ...updatedAcknowledgement };
          return { ...prev };
        });
        present({
          message: 'Official Receipt successfully updated.',
          duration: 1000,
        });
        return;
      }
      present({
        message: 'Failed to update the official receipt',
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
            <ModalHeader title="Official Receipt - Edit Record" sub="Transaction" dismiss={dismiss} />
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
            <UpdateAcknowledgementEntries isOpen={isOpen} acknowledgement={acknowledgement} />
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default UpdateAcknowledgement;

import React, { useEffect, useRef, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, IonIcon, useIonToast } from '@ionic/react';
import { createSharp } from 'ionicons/icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import BusinessTypeForm from '../components/BusinessTypeForm';
import { BusinessTypeFormData, businessTypeSchema } from '../../../../../validations/business-type.schema';
import { BusinessType, TErrorData, TFormError } from '../../../../../types/types';
import { TBusinessType } from '../BusinessType';
import kfiAxios from '../../../../utils/axios';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';

const UpdateBusinessType = ({ businessType, setData }: { businessType: BusinessType; setData: React.Dispatch<React.SetStateAction<TBusinessType>> }) => {
  const [loading, setLoading] = useState(false);
  const modal = useRef<HTMLIonModalElement>(null);
  const [present] = useIonToast();

  const form = useForm<BusinessTypeFormData>({
    resolver: zodResolver(businessTypeSchema),
    defaultValues: {
      type: businessType.type,
    },
  });

  useEffect(() => {
    if (businessType) {
      form.reset({ type: businessType.type });
    }
  }, [businessType, form]);

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }

  async function onSubmit(data: BusinessTypeFormData) {
    setLoading(true);
    try {
      const result = await kfiAxios.put(`/business-type/${businessType._id}`, data);
      const { success } = result.data;
      if (success) {
        setData(prev => {
          let clone = [...prev.businessTypes];
          let index = clone.findIndex(e => e._id === result.data.businessType._id);
          clone[index] = { ...result.data.businessType };
          return { ...prev, businessTypes: clone };
        });
        dismiss();
        present({
          message: 'Business type successfully updated!.',
          duration: 1000,
        });
        return;
      }
    } catch (error: any) {
      const errs: TErrorData | string = error?.response?.data?.error || error.message;
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
          id={`update-business-type-modal-${businessType._id}`}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={createSharp} className="text-[1rem]" /> Edit
        </div>
      </div> */}
      <IonButton
        id={`update-business-type-modal-${businessType._id}`}
        type="button"
        fill="clear"
        className="space-x-1 rounded-md w-16 h-7 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-blue-50 text-blue-900 capitalize min-h-4 text-xs"
      >
        <IonIcon icon={createSharp} className="text-xs" />
        <span>Edit</span>
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`update-business-type-modal-${businessType._id}`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:30rem] md:[--width:100%] lg:[--max-width:30rem] lg:[--width:50%] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Business Type - Edit Record" sub="System" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6">
          <ModalHeader disabled={loading} title="Business Type - Edit Record" sub="Manage business type records." dismiss={dismiss} />

          <div>
            <form onSubmit={form.handleSubmit(onSubmit)} className=' mt-4'>
              <BusinessTypeForm form={form} loading={loading} />
              <div className="text-end mt-6 space-x-2">
                <IonButton disabled={loading} type="submit" fill="clear" className="!text-sm capitalize !bg-[#FA6C2F] text-white rounded-[4px]" strong={true}>
                  Save
                </IonButton>
                <IonButton disabled={loading} onClick={dismiss} color="danger" type="button" className="!text-sm capitalize" strong={true}>
                  Cancel
                </IonButton>
              </div>
            </form>
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default UpdateBusinessType;

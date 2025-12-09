import React, { useRef, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, useIonToast } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { BusinessTypeFormData, businessTypeSchema } from '../../../../../validations/business-type.schema';
import BusinessTypeForm from '../components/BusinessTypeForm';
import kfiAxios from '../../../../utils/axios';
import { TErrorData, TFormError } from '../../../../../types/types';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';
import { useOnlineStore } from '../../../../../store/onlineStore';
import { db } from '../../../../../database/db';

type CreateBusinessTypeProps = {
  getBusinessTypes: (page: number) => void;
};

const CreateBusinessType = ({ getBusinessTypes }: CreateBusinessTypeProps) => {
  const [loading, setLoading] = useState(false);
  const [present] = useIonToast();

  const modal = useRef<HTMLIonModalElement>(null);
  const online = useOnlineStore((state) => state.online);
  

  const form = useForm<BusinessTypeFormData>({
    resolver: zodResolver(businessTypeSchema),
    defaultValues: {
      type: '',
    },
  });

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }

  async function onSubmit(data: BusinessTypeFormData) {
   if(online){
     setLoading(true);
      try {
        const result = await kfiAxios.post('/business-type', data);
        const { success } = result.data;
        if (success) {
          getBusinessTypes(1);
          dismiss();
          present({
            message: 'Business type successfully created',
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
   } else {
     await db.businessTypes.add({
            ...data, 
            _synced: false,
            action: "create"
          });
          getBusinessTypes(1);
          dismiss()
          present({
            message: 'Business types successfully updated!.',
            duration: 1000,
          });
          return;
   }
  }

  return (
    <>
      <div className="text-end">
        <IonButton fill="clear" id="create-business-type-modal" className="max-h-10 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
          + Add Record
        </IonButton>
      </div>
      <IonModal
        ref={modal}
        trigger="create-business-type-modal"
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:30rem] md:[--width:100%] lg:[--max-width:30rem] lg:[--width:50%] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Business Type - Add Record" sub="System" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6">
            <ModalHeader disabled={loading} title="Business Type - Add Record" sub="Manage business type records." dismiss={dismiss} />

          <div>
            <form onSubmit={form.handleSubmit(onSubmit)} className='mt-4'>
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

export default CreateBusinessType;

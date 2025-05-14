import React, { useRef, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { BusinessTypeFormData, businessTypeSchema } from '../../../../../validations/business-type.schema';
import BusinessTypeForm from '../components/BusinessTypeForm';
import kfiAxios from '../../../../utils/axios';
import { TErrorData, TFormError } from '../../../../../types/types';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';

type CreateBusinessTypeProps = {
  getBusinessTypes: (page: number) => void;
};

const CreateBusinessType = ({ getBusinessTypes }: CreateBusinessTypeProps) => {
  const [loading, setLoading] = useState(false);

  const modal = useRef<HTMLIonModalElement>(null);

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
    setLoading(true);
    try {
      const result = await kfiAxios.post('/business-type', data);
      const { success } = result.data;
      if (success) {
        getBusinessTypes(1);
        dismiss();
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
      <div className="text-end">
        <IonButton fill="clear" id="create-business-type-modal" className="max-h-10 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
          + Add Record
        </IonButton>
      </div>
      <IonModal
        ref={modal}
        trigger="create-business-type-modal"
        backdropDismiss={false}
        className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:50%] lg:[--width:50%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader disabled={loading} title="Business Type - Add Record" sub="All Files" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content">
          <div>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <BusinessTypeForm form={form} loading={loading} />
              <div className="text-end border-t mt-2 pt-1 space-x-2">
                <IonButton disabled={loading} color="tertiary" type="submit" className="!text-sm capitalize" strong={true}>
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

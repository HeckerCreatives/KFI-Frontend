import React, { useRef, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, useIonToast } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { NatureFormData, natureSchema } from '../../../../../validations/nature.schema';
import kfiAxios from '../../../../utils/axios';
import { TErrorData, TFormError } from '../../../../../types/types';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';
import { useOnlineStore } from '../../../../../store/onlineStore';
import { db } from '../../../../../database/db';
import FinancialStatementForm from './financial-statement-form';
import { fschema, FSFormData } from '../../../../../validations/financialstatement.schema';

type CreateProps = {
  getList: (page: number) => void;
};

const CreateFS = ({ getList }: CreateProps) => {
  const [loading, setLoading] = useState(false);

  const modal = useRef<HTMLIonModalElement>(null);
  const online = useOnlineStore((state) => state.online);
  const [present] = useIonToast();
  
  
  const form = useForm<FSFormData>({
    resolver: zodResolver(fschema),
    defaultValues: {
    
    },
  });

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }

  async function onSubmit(data: FSFormData) {
      setLoading(true);
      try {
        const result = await kfiAxios.post('/financial-statement', data);
        const { success } = result.data;
        if (success) {
          getList(1);
           present({
          message: 'Financial Statement successfully created. ',
          duration: 1000,
        });
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
        <IonButton fill="clear" id="create-nature-modal" className="max-h-10 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
          + Add
        </IonButton>
      </div>
      <IonModal
        ref={modal}
        trigger="create-nature-modal"
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height [--width:95%] [--max-width:32rem]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader disabled={loading} title="Nature - Add Record" sub="System" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="p-6 flex flex-col gap-6">
           <ModalHeader disabled={loading} title="Financial Statement - Add Record" sub="Manage financial data." dismiss={dismiss} />
          <div>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FinancialStatementForm form={form} loading={loading} />
              <div className="text-end border-t mt-2 pt-1 space-x-2">
                <IonButton disabled={loading} color="tertiary" type="submit" className="!text-sm capitalize" strong={true}>
                  {loading ? 'Saving...' : 'Save'}
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

export default CreateFS;

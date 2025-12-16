import React, { useEffect, useRef, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, IonIcon, useIonToast } from '@ionic/react';
import { createSharp } from 'ionicons/icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { NatureFormData, natureSchema } from '../../../../../validations/nature.schema';
import { Nature, TErrorData, TFormError } from '../../../../../types/types';
import kfiAxios from '../../../../utils/axios';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';
import { TNature } from '../../nature/Nature';
import NatureForm from '../../nature/components/NatureForm';
import { Signatures } from '../../../../ui/common/Signatures';
import { SystemParamsFormData, systemparamsSchema } from '../../../../../validations/systemparameters';
import SystemParamsForm from '../components/NatureForm';
import { useOnlineStore } from '../../../../../store/onlineStore';
import { db } from '../../../../../database/db';

type UpdateParamaters = {
  signatures: Signatures;
  fetchData: (page: number) => void;
};

const UpdateSystemParameters = ({ signatures, fetchData }: UpdateParamaters) => {
  const [loading, setLoading] = useState(false);
  const modal = useRef<HTMLIonModalElement>(null);
  const [present] = useIonToast();
  const online = useOnlineStore((state) => state.online);
  
  

  const form = useForm<SystemParamsFormData>({
    resolver: zodResolver(systemparamsSchema),
    defaultValues: {
     type: signatures.type,
     approvedBy: signatures.approvedBy,
     preparedBy: signatures.preparedBy,
     checkedBy: signatures.checkedBy,
     receivedBy: ''
    },
  });

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }

   async function onSubmit(data: SystemParamsFormData) {
     if(online){
      setLoading(true);
      try {
        const result = await kfiAxios.put(`system-params/signature/${signatures._id}`, data);
        const { success } = result.data;
      
          dismiss();
          fetchData(1)
          present({
          message: 'System parameters successfully updated. ',
          duration: 1000,
        });
      } catch (error: any) {
        const errs: TErrorData | string = error?.response?.data?.error || error.message;
        const errors: TFormError[] | string = checkError(errs);
        const fields: string[] = Object.keys(form.formState.defaultValues as Object);
        formErrorHandler(errors, form.setError, fields);
      } finally {
        setLoading(false);
      }
     } else {
      try {
             const existing = await db.systemParameters.get(signatures.id);
      
              if (!existing) {
                console.warn("Data not found");
                return;
              }
              const updated = {
                ...existing,
                ...data, 
                _synced: false,
                action: "update",
              };
              await db.systemParameters.update(signatures.id, updated);
              dismiss();
              present({
                message: "Data successfully updated!",
                duration: 1000,
              });
             fetchData(1)

            } catch (error) {
              console.log(error)
              present({
                message: "Failed to save record. Please try again.",
                duration: 1200,
              });
      
            }
     }
   }


  return (
    <>
      
       <IonButton
         id={`update-params-modal-${signatures._id}`}
         type="button"
         fill="clear"
         className="space-x-1 rounded-md w-24 min-h-7 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0] bg-blue-100 text-blue-900 capitalize text-xs"
       >
         <IonIcon icon={createSharp} className="text-[1rem] mr-1" /> Edit
       </IonButton>
      <IonModal
        ref={modal}
        trigger={`update-params-modal-${signatures._id}`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height [--width:95%] [--max-width:32rem]"
      >
       
         <div className="p-6 flex flex-col gap-6">
           <ModalHeader disabled={loading} title="System Parameters - Update Record" sub="Manage system parameters data." dismiss={dismiss} />
          <div>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <SystemParamsForm form={form} loading={loading} />
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

export default UpdateSystemParameters;

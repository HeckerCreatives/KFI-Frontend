import React, { useEffect, useRef, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, IonIcon } from '@ionic/react';
import { createSharp } from 'ionicons/icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { NatureFormData, natureSchema } from '../../../../../validations/nature.schema';
import NatureForm from '../components/NatureForm';
import { Nature, TErrorData, TFormError } from '../../../../../types/types';
import { TNature } from '../Nature';
import kfiAxios from '../../../../utils/axios';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';

type UpdateNatureProps = {
  nature: Nature;
  setData: React.Dispatch<React.SetStateAction<TNature>>;
};

const UpdateNature = ({ nature, setData }: UpdateNatureProps) => {
  const [loading, setLoading] = useState(false);
  const modal = useRef<HTMLIonModalElement>(null);

  const form = useForm<NatureFormData>({
    resolver: zodResolver(natureSchema),
    defaultValues: {
      nature: nature.nature,
      description: nature.description
    },
  });

  useEffect(() => {
    if (nature) {
      form.reset({ nature: nature.nature, description: nature.description });
    }
  }, [nature, form]);

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }

  async function onSubmit(data: NatureFormData) {
    setLoading(true);
    try {
      const result = await kfiAxios.put(`/nature/${nature._id}`, data);
      const { success } = result.data;
      if (success) {
        setData(prev => {
          let clone = [...prev.natures];
          let index = clone.findIndex(e => e._id === result.data.nature._id);
          clone[index] = { ...result.data.nature };
          return { ...prev, natures: clone };
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
      
       <IonButton
         id={`update-nature-modal-${nature._id}`}
         type="button"
         fill="clear"
         className="space-x-1 rounded-md w-24 min-h-7 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0] bg-blue-100 text-blue-900 capitalize text-xs"
       >
         <IonIcon icon={createSharp} className="text-[1rem] mr-1" /> Edit
       </IonButton>
      <IonModal
        ref={modal}
        trigger={`update-nature-modal-${nature._id}`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height [--width:95%] [--max-width:32rem]"
      >
       
         <div className="p-6 flex flex-col gap-6">
           <ModalHeader disabled={loading} title="Nature - Update Record" sub="Manage nature data." dismiss={dismiss} />
          <div>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <NatureForm form={form} loading={loading} />
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

export default UpdateNature;

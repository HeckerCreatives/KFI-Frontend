import React, { useEffect, useRef, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, IonIcon } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import kfiAxios from '../../../../utils/axios';
import { Child, ClientMasterFile, TErrorData, TFormError } from '../../../../../types/types';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';
import { TClientMasterFile } from '../ClientMasterFile';
import { createSharp } from 'ionicons/icons';
import { ChildrenFormData, childrenSchema } from '../../../../../validations/children.schema';
import ChildrenForm from '../components/ChildrenForm';

type UpdateChildrenProps = {
  child: Child;
  setData: React.Dispatch<React.SetStateAction<TClientMasterFile>>;
};

const UpdateChildren = ({ child, setData }: UpdateChildrenProps) => {
  const [loading, setLoading] = useState(false);

  const modal = useRef<HTMLIonModalElement>(null);

  const form = useForm<ChildrenFormData>({
    resolver: zodResolver(childrenSchema),
    defaultValues: {
      name: child.name,
    },
  });

  useEffect(() => {
    if (child) {
      form.reset({
        name: child.name,
      });
    }
  }, [child, form.reset]);

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }

  async function onSubmit(data: ChildrenFormData) {
    setLoading(true);
    try {
      const result = await kfiAxios.put(`/children/${child._id}`, { ...data, owner: child.owner });
      const { success, child: childData } = result.data;
      if (success) {
        setData(prev => {
          const clone = [...prev.clients];
          const index = clone.findIndex((e: ClientMasterFile) => e._id === childData.owner);
          const childIndex = clone[index].children.findIndex(e => e._id === childData._id);
          clone[index].children[childIndex] = childData;
          return { ...prev, clients: clone };
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
        <div
          id={`update-child-modal-${child._id}`}
          className=" flex items-center w-fit text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-blue-600"
          title="Edit Beneficiary"
        >
          <IonIcon icon={createSharp} className="text-[1rem]" />
        </div>
      </div>
      <IonModal
        ref={modal}
        trigger={`update-child-modal-${child._id}`}
        backdropDismiss={false}
        className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:50%] lg:[--width:50%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader disabled={loading} title="Client Master File - Edit Child" sub="Manage Account" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content">
          <div>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <ChildrenForm form={form} loading={loading} />
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

export default UpdateChildren;

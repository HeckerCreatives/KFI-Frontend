import React, { useEffect, useRef, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, IonIcon } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import kfiAxios from '../../../../utils/axios';
import { Beneficiary, ClientMasterFile, TErrorData, TFormError } from '../../../../../types/types';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';
import BeneficiaryForm from '../components/BeneficiaryForm';
import { BeneficiaryFormData, beneficiarySchema } from '../../../../../validations/beneficiary.schema';
import { TClientMasterFile } from '../ClientMasterFile';
import { createOutline, createSharp } from 'ionicons/icons';

type UpdateBeneficiary = {
  beneficiary: Beneficiary;
  setData: React.Dispatch<React.SetStateAction<TClientMasterFile>>;
};

const UpdateBeneficiary = ({ beneficiary, setData }: UpdateBeneficiary) => {
  const [loading, setLoading] = useState(false);

  const modal = useRef<HTMLIonModalElement>(null);

  const form = useForm<BeneficiaryFormData>({
    resolver: zodResolver(beneficiarySchema),
    defaultValues: {
      name: beneficiary.name,
      relationship: beneficiary.relationship,
    },
  });

  useEffect(() => {
    if (beneficiary) {
      form.reset({
        name: beneficiary.name,
        relationship: beneficiary.relationship,
      });
    }
  }, [beneficiary, form.reset]);

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }

  async function onSubmit(data: BeneficiaryFormData) {
    setLoading(true);
    try {
      const result = await kfiAxios.put(`/beneficiary/${beneficiary._id}`, { ...data, owner: beneficiary.owner });
      const { success, beneficiary: benef } = result.data;
      if (success) {
        setData(prev => {
          const clone = [...prev.clients];
          const index = clone.findIndex((e: ClientMasterFile) => e._id === benef.owner);
          const beneIndex = clone[index].beneficiaries.findIndex(e => e._id === benef._id);
          clone[index].beneficiaries[beneIndex] = benef;
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
          id={`update-beneficiary-modal-${beneficiary._id}`}
          className=" flex items-center w-fit text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-blue-600"
          title="Update Beneficiary"
        >
          <IonIcon icon={createSharp} className="text-[1rem]" />
        </div>
      </div>
      <IonModal
        ref={modal}
        trigger={`update-beneficiary-modal-${beneficiary._id}`}
        backdropDismiss={false}
        className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:50%] lg:[--width:50%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader disabled={loading} title="Client Master File - Edit Beneficiary" sub="All Files" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content">
          <div>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <BeneficiaryForm form={form} loading={loading} />
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

export default UpdateBeneficiary;

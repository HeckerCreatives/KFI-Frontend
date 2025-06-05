import React, { useEffect, useRef, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, IonIcon } from '@ionic/react';
import { createSharp } from 'ionicons/icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { UpdateProductLoanFormData, updateProductSchema } from '../../../../../validations/loan.schema';
import { Loan, TErrorData, TFormError } from '../../../../../types/types';
import kfiAxios from '../../../../utils/axios';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';
import { TLoan } from '../Loans';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import InputText from '../../../../ui/forms/InputText';
import UpdateLoanCodes from '../components/UpdateLoanCodes';

const UpdateLoan = ({ loan, setData }: { loan: Loan; setData: React.Dispatch<React.SetStateAction<TLoan>> }) => {
  const [loading, setLoading] = useState(false);
  const modal = useRef<HTMLIonModalElement>(null);

  const form = useForm<UpdateProductLoanFormData>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      code: loan.code,
    },
  });

  useEffect(() => {
    if (loan) {
      form.reset({
        code: loan.code,
      });
    }
  }, [loan, form.reset]);

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }

  useEffect(() => {
    console.log(form.formState.errors);
  }, [form.formState.errors]);

  async function onSubmit(data: UpdateProductLoanFormData) {
    setLoading(true);
    try {
      const result = await kfiAxios.put(`/loan/${loan._id}`, data);
      const { success } = result.data;
      if (success) {
        setData(prev => {
          let clone = [...prev.loans];
          let index = clone.findIndex(e => e._id === result.data.loan._id);
          clone[index] = { ...result.data.loan };
          return { ...prev, loans: clone };
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
          id={`update-loan-modal-${loan._id}`}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={createSharp} className="text-[1rem]" /> Edit
        </div>
      </div>
      <IonModal
        ref={modal}
        trigger={`update-loan-modal-${loan._id}`}
        backdropDismiss={false}
        className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:70%] lg:[--width:70%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader disabled={loading} title="Product - Edit Record" sub="System" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content">
          <div>
            <FormIonItem>
              <InputText
                disabled={loading}
                name="code"
                control={form.control}
                clearErrors={form.clearErrors}
                label="Code"
                placeholder="Type here"
                className="!px-2 !py-2 rounded-md"
              />
            </FormIonItem>
            <UpdateLoanCodes loan={loan} setData={setData} />
            <div className="text-end border-t mt-2 pt-1 space-x-2">
              <IonButton disabled={loading} color="tertiary" type="button" onClick={form.handleSubmit(onSubmit)} className="!text-sm capitalize" strong={true}>
                {loading ? 'Saving...' : 'Save'}
              </IonButton>
              <IonButton disabled={loading} onClick={dismiss} color="danger" type="button" className="!text-sm capitalize" strong={true}>
                Cancel
              </IonButton>
            </div>
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default UpdateLoan;

import React, { useEffect, useRef, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, IonIcon, useIonToast } from '@ionic/react';
import { createSharp, save } from 'ionicons/icons';
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

  const [present] = useIonToast();

  const form = useForm<UpdateProductLoanFormData>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      code: loan.code,
      description: loan.description,
    },
  });

  useEffect(() => {
    if (loan) {
      form.reset({
        code: loan.code,
        description: loan.description,
      });
    }
  }, [loan, form]);

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }

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
        present({
          message: 'Product successfully updated!.',
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
          id={`update-loan-modal-${loan._id}`}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={createSharp} className="text-[1rem]" /> Edit
        </div>
      </div> */}
      <IonButton
        type="button"
        id={`update-loan-modal-${loan._id}`}
        fill="clear"
        className="space-x-1 rounded-lg w-16 h-6 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-[#ff9a00] text-slate-700 capitalize min-h-4 text-xs"
      >
        <IonIcon icon={createSharp} className="text-xs" />
        <span>Edit</span>
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`update-loan-modal-${loan._id}`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:95%] lg:[--width:95%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Product - Edit Record" sub="System" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content">
          <div>
            <div className="flex items-start gap-2">
              <FormIonItem className="flex-1">
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
              <FormIonItem className="flex-1">
                <InputText
                  disabled={loading}
                  name="description"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="Description"
                  placeholder="Type here"
                  className="!px-2 !py-2 rounded-md"
                />
              </FormIonItem>
              <IonButton
                onClick={form.handleSubmit(onSubmit)}
                disabled={loading}
                type="button"
                title="Save changes"
                fill="clear"
                className="max-h-10 min-h-9 mt-1.5 !p-0 bg-green-600 text-white capitalize font-semibold rounded-md m-0"
                strong
              >
                <IonIcon icon={save} className="text-sm" />
              </IonButton>
            </div>

            <UpdateLoanCodes loan={loan} setData={setData} />

            <div className="text-end border-t mt-2 pt-1 space-x-2">
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

import React, { useEffect, useRef, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, IonIcon, useIonToast } from '@ionic/react';
import { createSharp, save } from 'ionicons/icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { ProductLoanFormData, productSchema, UpdateProductLoanFormData, updateProductSchema } from '../../../../../validations/loan.schema';
import { Loan, TErrorData, TFormError } from '../../../../../types/types';
import kfiAxios from '../../../../utils/axios';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';
import { TLoan } from '../Loans';
import { useOnlineStore } from '../../../../../store/onlineStore';
import { db } from '../../../../../database/db';
import LoanForm from '../components/LoanForm';

const UpdateLoan = ({ loan, setData, getLoans }: { loan: Loan; setData: React.Dispatch<React.SetStateAction<TLoan>>, getLoans: (currentage: number) => void }) => {
  const [loading, setLoading] = useState(false);
  const modal = useRef<HTMLIonModalElement>(null);
  const online = useOnlineStore((state) => state.online);

 const formatLoans = loan.loanCodes.map((item) => ({
    _id: item._id || "",
    id: item._id || "",
    module: item.module || "",
    loanType: item.loanType || "",
    acctCode: item.acctCode?._id || "",
    sortOrder: item.sortOrder?.toString() || "",
    acctCodeLabel: `${item.acctCode.code} - ${item.acctCode?.description}` || ""
  }))

  const [present] = useIonToast();

  const form = useForm<ProductLoanFormData>({
      resolver: zodResolver(productSchema),
      defaultValues: {
        _id: loan._id,
        id: loan._id,
        code: loan.code,
        description: loan.description,
        loanCodes:  formatLoans
      },
    });

  useEffect(() => {
    if (loan) {
      form.reset({
         _id: loan._id,
        id: loan._id,
        code: loan.code,
        description: loan.description,
        loanCodes:  formatLoans
      });
    }
  }, [loan]);

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }

  async function onSubmit(data: UpdateProductLoanFormData) {
    if(online){
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
    } else {
      try {
         const existing = await db.productLoans.get(loan.id);
  
          if (!existing) {
            console.warn("Data not found");
            return;
          }
          const updated = {
            ...existing,
            ...data,
            acctCode:{
              _id: data.code,
              description: data.description

            } ,
            action: existing.isOldData ? 'update' : 'create',
            _synced: false,
          };
          await db.productLoans.update(loan.id, updated);
          setData(prev => {
            const clone = [...prev.loans];
            const index = clone.findIndex(c => c.id === loan.id);
            if (index !== -1) {
              clone[index] = updated;
            }
            return { ...prev, loans: clone };
          });
          getLoans(1)
          dismiss();
          present({
            message: "Data successfully updated!",
            duration: 1000,
          });
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
        className="space-x-1 rounded-md w-16 h-7 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-blue-50 text-blue-900 capitalize min-h-4 text-xs"
      >
        <IonIcon icon={createSharp} className="text-xs" />
        <span>Edit</span>
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`update-loan-modal-${loan._id}`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height [--max-width:84rem] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Product - Edit Record" sub="System" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
       
        <div className="inner-content !p-6">
            <ModalHeader disabled={loading} title="Product - Edit Record" sub="Manage product records." dismiss={dismiss} />

              <form onSubmit={form.handleSubmit(onSubmit)} className=' mt-4'>
              <LoanForm form={form} loading={loading} />
              <div className="text-end mt-6 space-x-2">
                <IonButton disabled={loading} type="submit" fill="clear" className="!text-sm capitalize !bg-[#FA6C2F] text-white rounded-[4px]" strong={true}>
                  {loading ? 'Saving...' : 'Save'}
                </IonButton>
                <IonButton disabled={loading} onClick={dismiss} color="danger" type="button" className="!text-sm capitalize" strong={true}>
                  Cancel
                </IonButton>
              </div>
            </form>

         
        </div>
      </IonModal>
    </>
  );
};

export default UpdateLoan;

import React, { useEffect, useRef, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, IonIcon, useIonToast } from '@ionic/react';
import { createSharp } from 'ionicons/icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import BankForm from '../components/BankForm';
import { BankFormData, bankSchema } from '../../../../../validations/bank.schema';
import { TBank } from '../Bank';
import { Bank, TErrorData, TFormError } from '../../../../../types/types';
import kfiAxios from '../../../../utils/axios';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';
import { useOnlineStore } from '../../../../../store/onlineStore';
import { db } from '../../../../../database/db';

const UpdateBank = ({ bank, setData }: { bank: Bank; setData: React.Dispatch<React.SetStateAction<TBank>> }) => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);
  const modal = useRef<HTMLIonModalElement>(null);
  const online = useOnlineStore((state) => state.online);
  

  const form = useForm<BankFormData>({
    resolver: zodResolver(bankSchema),
    defaultValues: {
      code: bank.code,
      description: bank.description,
    },
  });

  useEffect(() => {
    if (bank) {
      form.reset({
        code: bank.code,
        description: bank.description,
      });
    }
  }, [bank, form]);

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }

  async function onSubmit(data: BankFormData) {
   if(online){
     setLoading(true);
    try {
      const result = await kfiAxios.put(`/bank/${bank._id}`, data);
      const { success } = result.data;
      if (success) {
        setData(prev => {
          let clone = [...prev.banks];
          let index = clone.findIndex(e => e._id === result.data.bank._id);
          clone[index] = { ...result.data.bank };
          present({
            message: 'Successfully updated!.',
            duration: 1000,
          });
          return { ...prev, banks: clone };
        });
        dismiss();
        return;
      }
    } catch (error: any) {
      const errs: TErrorData | string = error?.response?.data?.error || error?.response?.data?.msg || error.message;
      const errors: TFormError[] | string = checkError(errs);
      const fields: string[] = Object.keys(form.formState.defaultValues as Object);
      formErrorHandler(errors, form.setError, fields);
    } finally {
      setLoading(false);
    }
   } else {
      try {
           const existing = await db.banks.get(bank.id);
                  
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
            await db.banks.update(bank.id, updated);
            setData(prev => {
              const clone = [...prev.banks];
              const index = clone.findIndex(c => c.id === bank.id);
              if (index !== -1) {
                clone[index] = updated;
              }
              return { ...prev, banks: clone };
            });
            dismiss();
            present({
              message: "Data successfully updated!",
              duration: 1000,
            });
    
          } catch (error) {
    
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
          id={`update-bank-modal-${bank._id}`}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={createSharp} className="text-[1rem]" /> Edit
        </div>
      </div> */}
      <IonButton
        id={`update-bank-modal-${bank._id}`}
        type="button"
        fill="clear"
        className="space-x-1 rounded-md w-16 h-7 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-blue-50 text-blue-900 capitalize min-h-4 text-xs"
      >
        <IonIcon icon={createSharp} className="text-xs" />
        <span>Edit</span>
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`update-bank-modal-${bank._id}`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:30rem] md:[--width:100%] lg:[--max-width:30rem] lg:[--width:50%] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Bank - Edit Record" sub="System" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6">
            <ModalHeader disabled={loading} title="Bank - Edit Record" sub="Manage bank records." dismiss={dismiss} />

          <div>
            <form onSubmit={form.handleSubmit(onSubmit)} className=' mt-4'>
              <BankForm form={form} loading={loading} />
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
        </div>
      </IonModal>
    </>
  );
};

export default UpdateBank;

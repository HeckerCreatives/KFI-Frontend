import React, { useEffect, useRef, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, IonIcon, useIonToast } from '@ionic/react';
import { createSharp } from 'ionicons/icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import BankForm from '../components/SupplierForm';
import { SupplierFormData, supplierSchema } from '../../../../../validations/supplier.schema';
import { Supplier, TErrorData, TFormError } from '../../../../../types/types';
import { TSupplier } from '../Supplier';
import kfiAxios from '../../../../utils/axios';
import formErrorHandler from '../../../../utils/form-error-handler';
import checkError from '../../../../utils/check-error';
import { useOnlineStore } from '../../../../../store/onlineStore';
import { db } from '../../../../../database/db';

const UpdateSupplier = ({ supplier, setData }: { supplier: Supplier; setData: React.Dispatch<React.SetStateAction<TSupplier>> }) => {
  const [loading, setLoading] = useState(false);
  const modal = useRef<HTMLIonModalElement>(null);
  const [present] = useIonToast();
  const online = useOnlineStore((state) => state.online);
  

  const form = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      code: supplier.code,
      description: supplier.description,
    },
  });

  useEffect(() => {
    if (supplier) {
      form.reset({
        code: supplier.code,
        description: supplier.description,
      });
    }
  }, [supplier, form]);

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }

  async function onSubmit(data: SupplierFormData) {
   if(online){
     setLoading(true);
    try {
      const result = await kfiAxios.put(`/supplier/${supplier._id}`, data);
      const { success } = result.data;
      if (success) {
        setData(prev => {
          let clone = [...prev.suppliers];
          let index = clone.findIndex(e => e._id === result.data.supplier._id);
          clone[index] = { ...result.data.supplier };
          return { ...prev, suppliers: clone };
        });
        dismiss();
        present({
          message: 'Supplier successfully updated!.',
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
      console.log(supplier.id, supplier)
       const existing = await db.suppliers.get(supplier.id);

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
        await db.suppliers.update(supplier.id, updated);
        setData(prev => {
          const clone = [...prev.suppliers];
          const index = clone.findIndex(c => c.id === supplier.id);
          if (index !== -1) {
            clone[index] = updated;
          }
          return { ...prev, suppliers: clone };
        });
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
          id={`update-supplier-modal-${supplier._id}`}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={createSharp} className="text-[1rem]" /> Edit
        </div>
      </div> */}
      <IonButton
        id={`update-supplier-modal-${supplier._id}`}
        type="button"
        fill="clear"
        className="space-x-1 rounded-md w-16 h-7 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-blue-50 text-blue-900 capitalize min-h-4 text-xs"
      >
        <IonIcon icon={createSharp} className="text-xs" />
        <span>Edit</span>
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`update-supplier-modal-${supplier._id}`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:30rem] md:[--width:100%] lg:[--max-width:30rem] lg:[--width:50%] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Supplier - Edit Record" sub="System" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6">
            <ModalHeader disabled={loading} title="Supplier - Edit Record" sub="Manage supplier records." dismiss={dismiss} />

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

export default UpdateSupplier;

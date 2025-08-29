import { IonButton, IonHeader, IonIcon, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import { trashBin } from 'ionicons/icons';
import React, { useRef, useState } from 'react';
import { Supplier } from '../../../../../types/types';
import kfiAxios from '../../../../utils/axios';
import ModalHeader from '../../../../ui/page/ModalHeader';

type DeleteSupplierLoans = {
  supplier: Supplier;
  getSuppliers: (page: number, keyword?: string, sort?: string) => void;
  searchkey: string;
  sortKey: string;
  currentPage: number;
  rowLength: number;
};

const DeleteSupplier = ({ supplier, getSuppliers, searchkey, sortKey, currentPage, rowLength }: DeleteSupplierLoans) => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);

  const modal = useRef<HTMLIonModalElement>(null);

  function dismiss() {
    modal.current?.dismiss();
  }

  async function handleDelete() {
    setLoading(true);
    try {
      const result = await kfiAxios.delete(`/supplier/${supplier._id}`);
      const { success } = result.data;
      if (success) {
        const page = rowLength - 1 === 0 && currentPage > 1 ? currentPage - 1 : currentPage;
        getSuppliers(page, searchkey, sortKey);
        dismiss();
        present({
          message: 'Supplier successfully deleted!.',
          duration: 1000,
        });
        return;
      }
    } catch (error: any) {
      present({
        message: 'Failed to delete the supplier record. Please try again',
        duration: 1000,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* <div className="text-end">
        <div
          id={`delete-supplier-modal-${supplier._id}`}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={trashBin} className="text-[1rem]" /> Delete
        </div>
      </div> */}
      <IonButton
        id={`delete-supplier-modal-${supplier._id}`}
        type="button"
        fill="clear"
        className="space-x-1 w-20 h-7 rounded-md ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-red-100 text-red-900 capitalize min-h-4 text-xs"
      >
        <IonIcon icon={trashBin} className="text-xs" />
        <span>Delete</span>
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`delete-supplier-modal-${supplier._id}`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:30rem] md:[--width:100%] lg:[--max-width:30rem] lg:[--width:40%] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Supplier - Delete Record" sub="System" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6">
            <ModalHeader disabled={loading} title="Supplier - Delete Record" sub="Are you sure you want to delete this record?" dismiss={dismiss} />

          {/* <p className="text-lg text-center py-5">Are you sure you want to delete this record?</p> */}
          <div className="text-end mt-6 space-x-2">
            <IonButton onClick={handleDelete} disabled={loading} type="submit" fill="clear" className="!text-sm capitalize !bg-[#FA6C2F] text-white rounded-[4px]" strong={true}>
              {loading ? 'Deleting...' : 'Yes'}
            </IonButton>
            <IonButton disabled={loading} onClick={dismiss} color="tertiary" type="button" className="!text-sm capitalize" strong={true}>
              No
            </IonButton>
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default DeleteSupplier;

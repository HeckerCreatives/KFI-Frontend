import { IonButton, IonHeader, IonIcon, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import { trashBin } from 'ionicons/icons';
import React, { useRef, useState } from 'react';
import { Nature } from '../../../../../types/types';
import kfiAxios from '../../../../utils/axios';
import ModalHeader from '../../../../ui/page/ModalHeader';

type DeleteNatureProps = {
  nature: Nature;
  getNatures: (page: number, keyword?: string, sort?: string) => void;
  searchkey: string;
  sortKey: string;
  currentPage: number;
  rowLength: number;
};

const DeleteNature = ({ nature, getNatures, searchkey, sortKey, currentPage, rowLength }: DeleteNatureProps) => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);

  const modal = useRef<HTMLIonModalElement>(null);

  function dismiss() {
    modal.current?.dismiss();
  }

  async function handleDelete() {
    setLoading(true);
    try {
      const result = await kfiAxios.delete(`/nature/${nature._id}`);
      const { success } = result.data;
      if (success) {
        const page = rowLength - 1 === 0 && currentPage > 1 ? currentPage - 1 : currentPage;
        getNatures(page, searchkey, sortKey);
        dismiss();
        return;
      }
    } catch (error: any) {
      present({
        message: 'Failed to delete the nature record. Please try again',
        duration: 1000,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="text-end">
        <div
          id={`delete-nature-modal-${nature._id}`}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={trashBin} className="text-[1rem]" /> Delete
        </div>
      </div>
      <IonModal
        ref={modal}
        trigger={`delete-nature-modal-${nature._id}`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:50%] lg:[--width:50%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader disabled={loading} title="Nature - Delete Record" sub="System" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content">
          <p className="text-lg text-center py-5">Are you sure you want to delete this record?</p>
          <div className="text-end border-t mt-2 pt-1 space-x-2">
            <IonButton onClick={handleDelete} disabled={loading} color="danger" type="submit" className="!text-sm capitalize" strong={true}>
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

export default DeleteNature;

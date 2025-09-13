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
      
        <IonButton
               id={`delete-nature-modal-${nature._id}`}
               type="button"
               fill="clear"
               className="space-x-1 rounded-md w-24 min-h-7 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0] bg-red-100 text-red-900 capitalize text-xs"
             >
               <IonIcon icon={trashBin} className="text-[1rem] mr-1" /> Delete
             </IonButton>
      <IonModal
        ref={modal}
        trigger={`delete-nature-modal-${nature._id}`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height [--width:95%] [--max-width:32rem]"
      >
         <div className="p-6 flex flex-col gap-6">
           <ModalHeader disabled={loading} title="Nature - Update Record" sub="Are you sure you want to delete this record?" dismiss={dismiss} />
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

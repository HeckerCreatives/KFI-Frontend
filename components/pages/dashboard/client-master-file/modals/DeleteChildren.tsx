import { IonButton, IonHeader, IonIcon, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import { trashBin } from 'ionicons/icons';
import React, { useRef, useState } from 'react';
import { Child, ClientMasterFile } from '../../../../../types/types';
import kfiAxios from '../../../../utils/axios';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { TClientMasterFile } from '../ClientMasterFile';

type DeleteChildrenProps = {
  child: Child;
  setData: React.Dispatch<React.SetStateAction<TClientMasterFile>>;
};

const DeleteChildren = ({ child, setData }: DeleteChildrenProps) => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);

  const modal = useRef<HTMLIonModalElement>(null);

  function dismiss() {
    modal.current?.dismiss();
  }

  async function handleDelete() {
    setLoading(true);
    try {
      const result = await kfiAxios.delete(`/children/${child._id}`);
      const { success, child: childId } = result.data;
      if (success) {
        setData(prev => {
          const clone = [...prev.clients];
          const index = clone.findIndex((e: ClientMasterFile) => e._id === child.owner);
          clone[index].children = clone[index].children.filter((e: Child) => e._id !== childId);
          return { ...prev, clients: clone };
        });
        dismiss();
        return;
      }
    } catch (error: any) {
      present({
        message: 'Failed to delete the child record. Please try again',
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
          id={`delete-child-modal-${child._id}`}
          className=" flex items-center w-fit text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-red-600"
          title="Delete Child"
        >
          <IonIcon icon={trashBin} className="text-[1rem]" />
        </div>
      </div>
      <IonModal
        ref={modal}
        trigger={`delete-child-modal-${child._id}`}
        backdropDismiss={false}
        className="auto-height md:[--max-width:50%] md:[--width:100%] lg:[--max-width:30%] lg:[--width:50%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader disabled={loading} title="Client Master File - Delete Beneficiary" sub="Manage Account" dismiss={dismiss} />
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

export default DeleteChildren;

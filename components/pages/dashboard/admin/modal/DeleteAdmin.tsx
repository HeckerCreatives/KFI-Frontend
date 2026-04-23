import { IonButton, IonHeader, IonIcon, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import { trashBin } from 'ionicons/icons';
import React, { useRef, useState } from 'react';
import { ClientMasterFile, User } from '../../../../../types/types';
import kfiAxios from '../../../../utils/axios';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { useOnlineStore } from '../../../../../store/onlineStore';
import { db } from '../../../../../database/db';
import { Trash } from 'lucide-react';
import { get } from 'http';

type DeleteCenterProps = {
  admin: User;
  getList: (page: number, keyword?: string, sort?: string) => void;
  
};

const DeleteAdmin = ({ admin, getList }: DeleteCenterProps) => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);

  const modal = useRef<HTMLIonModalElement>(null);

  //online checker
  const online = useOnlineStore((state) => state.online);

  function dismiss() {
    modal.current?.dismiss();
  }

  async function handleDelete() {
    setLoading(true);
    if(online){
       try {
        const result = await kfiAxios.delete(`/user/${admin._id}`);
        const { success } = result.data;
        if (success) {
          
         getList(1);
          dismiss();
          return;
        }

         present({
          message: 'Deleted successfully',
          duration: 1000,
        });
      } catch (error: any) {
        present({
          message: 'Failed to delete the client record. Please try again',
          duration: 1000,
        });
      } finally {
        setLoading(false);
      }
    }else {
      dismiss()
   
  }
}


  return (
    <>
      {/* <div className="text-end">
        <div
          id={`delete-cmf-modal-${client._id}`}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={trashBin} className="text-[1rem]" /> Delete
        </div>
      </div> */}
      <IonButton
        type="button"
        fill="clear"
        id={`delete-cmf-modal-${admin._id}`}
         className=" capitalize text-sm !text-zinc-700 w-fit"
      >
        <Trash size={20} className=' mr-1'/>
        <span>Delete</span>
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`delete-cmf-modal-${admin._id}`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height [--max-width:30rem] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Client - Delete Record" sub="Manage Account" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6">
            <ModalHeader disabled={loading} title="Client - Delete Record" sub="Are you sure you want to delete this record?" dismiss={dismiss} />

          {/* <p className="text-sm !font-medium text-center py-8 text-red-500">Are you sure you want to delete this record?</p> */}
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


export default DeleteAdmin

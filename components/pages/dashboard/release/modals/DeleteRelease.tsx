import { IonButton, IonHeader, IonIcon, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useState } from 'react';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { trashBin } from 'ionicons/icons';
import { Release } from '../../../../../types/types';
import kfiAxios from '../../../../utils/axios';
import { useOnlineStore } from '../../../../../store/onlineStore';
import { db } from '../../../../../database/db';

type DeleteReleaseProps = {
  release: Release;
  getRelease: (page: number, keyword?: string, sort?: string) => void;
  searchkey: string;
  sortKey: string;
  currentPage: number;
  rowLength: number;
};

const DeleteRelease = ({ release, getRelease, searchkey, sortKey, rowLength, currentPage }: DeleteReleaseProps) => {
  const [present] = useIonToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const online = useOnlineStore((state) => state.online);
  

  function dismiss() {
    setIsOpen(false);
  }

  async function handleDelete() {
    if(online){
      setLoading(true);
      try {
        const result = await kfiAxios.delete(`/release/${release._id}`);
        const { success } = result.data;
        if (success) {
          const page = rowLength - 1 === 0 && currentPage > 1 ? currentPage - 1 : currentPage;
          getRelease(page, searchkey, sortKey);
          present({
            message: 'Acknowledgement successfully deleted',
            duration: 1000,
          });
          dismiss();
          return;
        }
      } catch (error: any) {
        const message = error.response.data.error.message || error?.response?.data?.msg;
        present({
          message: message || 'Failed to delete the acknowledgement record. Please try again',
          duration: 1000,
        });
      } finally {
        setLoading(false);
      }
    } else {
      try{
      if (release._id) {
          await db.acknowledgementReceipts.update(release.id, {
            deletedAt: new Date().toISOString(),
            _synced: false,
            action: "delete",
          });
        } else {
          await db.acknowledgementReceipts.delete(release.id);
        }
      getRelease(currentPage);
      dismiss()
       present({
            message: 'Data successfully deleted!.',
            duration: 1000,
          });
        } catch (error: any) {
          present({
            message: `${error.response.data.error.message}`,
            duration: 1000,
          });
        }
    }
  }

  return (
    <>
      {/* <div
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
      >
        <IonIcon icon={trashBin} className="text-[1rem]" /> Delete
      </div> */}
      <IonButton
        onClick={() => setIsOpen(true)}
        type="button"
        fill="clear"
        className="space-x-1 w-20 h-7 rounded-md ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-red-100 text-red-900 capitalize min-h-4 text-xs"
      >
        <IonIcon icon={trashBin} className="text-xs" />
        <span>Delete</span>
      </IonButton>
      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:30rem] md:[--width:100%] lg:[--max-width:30rem] lg:[--width:50%] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Acknowledgement - Delete Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6">
          <ModalHeader disabled={loading} title="Acknowledgement - Delete Record" sub="Are you sure you want to delete this record?" dismiss={dismiss} />

          <div className="p-2">
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
        </div>
      </IonModal>
    </>
  );
};

export default DeleteRelease;

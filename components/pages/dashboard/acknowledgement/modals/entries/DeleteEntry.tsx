import { IonButton, IonHeader, IonIcon, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useState } from 'react';
import ModalHeader from '../../../../../ui/page/ModalHeader';
import { trash } from 'ionicons/icons';
import { AcknowledgementEntry } from '../../../../../../types/types';
import kfiAxios from '../../../../../utils/axios';
import { TData } from '../../components/UpdateAcknowledgementEntries';

type DeleteEntryProps = {
  entry: AcknowledgementEntry;
  getEntries: (page: number) => void;
  rowLength: number;
  currentPage: number;

  entries: AcknowledgementEntry[];
  setEntries: React.Dispatch<React.SetStateAction<AcknowledgementEntry[]>>;
  deletedIds: string[]
  setDeletedIds: React.Dispatch<React.SetStateAction<string[]>>
  setData: React.Dispatch<React.SetStateAction<TData>>;
};

const DeleteEntry = ({ entry, getEntries, rowLength, currentPage, entries, setEntries, setDeletedIds, deletedIds, setData }: DeleteEntryProps) => {
  const [present] = useIonToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  function dismiss() {
    setIsOpen(false);
  }

  const handleDelete = async () => {
      setLoading(true);
      try {
        setData((prev: TData) => {
          const updatedEntries = prev.entries.filter((e) => e._id !== entry._id);
          setEntries(updatedEntries);
          return {
            ...prev,
            entries: prev.entries.filter((e: AcknowledgementEntry) => e._id !== entry._id),
          };
        });
    
        setDeletedIds((prev: string[]) => [...prev, entry._id])
    
    
        present({
          message: 'Entry successfully deleted',
          duration: 1000,
        });
        dismiss();
      } catch (error: any) {
        present({
          message: 'Failed to delete the entry record. Please try again',
          duration: 1000,
        });
      } finally {
        setLoading(false);
      }
    };

  return (
    <>
      <IonButton
        disabled={loading}
        onClick={() => setIsOpen(true)}
        fill="clear"
        className="text-red-700 [--padding-start:0] [--padding-end:0] [--padding-top:0] [--padding-bottom:0] min-h-5"
      >
        <IonIcon icon={trash} />
      </IonButton>
      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:30rem] md:[--width:100%] lg:[--max-width:30rem] lg:[--width:50%] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Official Receipt - Delete Entry" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6">
            <ModalHeader disabled={loading} title="Official Receipt - Delete Entry" sub="Are you sure you want to delete this record?" dismiss={dismiss} />

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

export default DeleteEntry;

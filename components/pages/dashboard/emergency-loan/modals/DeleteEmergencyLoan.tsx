import { IonButton, IonHeader, IonIcon, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useState } from 'react';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { trashBin } from 'ionicons/icons';
import { EmergencyLoan } from '../../../../../types/types';
import kfiAxios from '../../../../utils/axios';

type DeleteEmergencyLoanProps = {
  emergencyLoan: EmergencyLoan;
  getEmergencyLoans: (page: number, keyword?: string, sort?: string) => void;
  searchkey: string;
  sortKey: string;
  currentPage: number;
  rowLength: number;
};

const DeleteEmergencyLoan = ({ emergencyLoan, getEmergencyLoans, searchkey, sortKey, rowLength, currentPage }: DeleteEmergencyLoanProps) => {
  const [present] = useIonToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  function dismiss() {
    setIsOpen(false);
  }

  async function handleDelete() {
    setLoading(true);
    try {
      const result = await kfiAxios.delete(`/emergency-loan/${emergencyLoan._id}`);
      const { success } = result.data;
      if (success) {
        const page = rowLength - 1 === 0 && currentPage > 1 ? currentPage - 1 : currentPage;
        getEmergencyLoans(page, searchkey, sortKey);
        present({
          message: 'Emergency loan successfully deleted',
          duration: 1000,
        });
        dismiss();
        return;
      }
    } catch (error: any) {
      const message = error.response.data.error.message || error?.response?.data?.msg;
      present({
        message: message || 'Failed to delete the emergency loan record. Please try again',
        duration: 1000,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
      >
        <IonIcon icon={trashBin} className="text-[1rem]" /> Delete
      </div>
      <IonModal isOpen={isOpen} backdropDismiss={false} className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:50%] lg:[--width:50%]">
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader disabled={loading} title="Emergency Loan - Delete Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content !px-0">
          <div className="p-2">
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
        </div>
      </IonModal>
    </>
  );
};

export default DeleteEmergencyLoan;

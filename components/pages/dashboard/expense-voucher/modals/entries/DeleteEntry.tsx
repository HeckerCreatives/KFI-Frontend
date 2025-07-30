import { IonButton, IonHeader, IonIcon, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useState } from 'react';
import ModalHeader from '../../../../../ui/page/ModalHeader';
import { trash } from 'ionicons/icons';
import { ExpenseVoucherEntry } from '../../../../../../types/types';
import kfiAxios from '../../../../../utils/axios';

type DeleteEntryProps = {
  entry: ExpenseVoucherEntry;
  getEntries: (page: number) => void;
  rowLength: number;
  currentPage: number;
};

const DeleteEntry = ({ entry, getEntries, rowLength, currentPage }: DeleteEntryProps) => {
  const [present] = useIonToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  function dismiss() {
    setIsOpen(false);
  }

  async function handleDelete() {
    setLoading(true);
    try {
      const result = await kfiAxios.delete(`/expense-voucher/entries/${entry.expenseVoucher}/${entry._id}`);
      const { success } = result.data;
      if (success) {
        const page = rowLength - 1 === 0 && currentPage > 1 ? currentPage - 1 : currentPage;
        getEntries(page);
        present({
          message: 'Entry successfully deleted',
          duration: 1000,
        });
        dismiss();
        return;
      }
    } catch (error: any) {
      const message = error.response.data.error.message || error?.response?.data?.msg;
      present({
        message: message || 'Failed to delete the entry record. Please try again',
        duration: 1000,
      });
    } finally {
      setLoading(false);
    }
  }

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
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:30rem] md:[--width:100%] lg:[--max-width:30rem] lg:[--width:50%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Expense Voucher - Delete Entry" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content !px-0">
          <div className="p-2">
            <p className="text-lg text-center py-5">Are you sure you want to delete this record?</p>
            <div className="text-end border-t mt-2 pt-1 space-x-2">
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

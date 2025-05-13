import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';

import { ellipsisVertical } from 'ionicons/icons';
import UpdateLoan from '../modals/UpdateLoan';
import DeleteLoan from '../modals/DeleteLoan';
import SetUpCodeLoan from '../modals/SetUpCodeLoan';
import { Loan } from '../../../../../types/types';
import { TLoan } from '../Loans';

type LoanActionsProps = {
  loan: Loan;
  setData: React.Dispatch<React.SetStateAction<TLoan>>;
  getLoans: (page: number, keyword?: string, sort?: string) => {};
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  rowLength: number;
};

const LoanActions = ({ loan, setData, currentPage, setCurrentPage, getLoans, searchKey, sortKey, rowLength }: LoanActionsProps) => {
  return (
    <>
      <IonButton fill="clear" id={`loan-${loan._id}`} className="[--padding-start:0] [--padding-end:0] [--padding-top:0] [--padding-bottom:0] min-h-5">
        <IonIcon icon={ellipsisVertical} className="text-[#FA6C2F]" />
      </IonButton>
      <IonPopover showBackdrop={false} trigger={`loan-${loan._id}`} triggerAction="click" className="[--max-width:10rem]">
        <IonContent>
          <UpdateLoan loan={loan} setData={setData} />
          <DeleteLoan loan={loan} getLoans={getLoans} searchkey={searchKey} sortKey={sortKey} currentPage={currentPage} rowLength={rowLength} />
          <SetUpCodeLoan loan={loan} />
        </IonContent>
      </IonPopover>
    </>
  );
};

export default LoanActions;

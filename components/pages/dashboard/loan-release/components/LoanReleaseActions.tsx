import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical, print } from 'ionicons/icons';
import UpdateLoanRelease from '../modals/UpdateLoanRelease';
import DeleteLoanRelease from '../modals/DeleteLoanRelease';
import UpdateCVLoanRelease from '../modals/UpdateCVLoanRelease';
import ViewLoanRelease from '../modals/ViewLoanRelease';
import { AccessToken, Transaction } from '../../../../../types/types';
import { TData } from '../LoanRelease';
import { canDoAction } from '../../../../utils/permissions';
import { jwtDecode } from 'jwt-decode';

type LoanReleaseActionsProps = {
  transaction: Transaction;
  setData: React.Dispatch<React.SetStateAction<TData>>;
  getTransactions: (page: number, keyword?: string, sort?: string, to?: string, from?: string) => {};
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  to: string;
  from: string;
  rowLength: number;
};

const LoanReleaseActions = ({ transaction, setData, getTransactions, searchKey, sortKey, currentPage, rowLength }: LoanReleaseActionsProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);

  return (
    <>
      <IonButton fill="clear" id={`loanRelease-${transaction._id}`} className="[--padding-start:0] [--padding-end:0] [--padding-top:0] [--padding-bottom:0] min-h-5">
        <IonIcon icon={ellipsisVertical} className="text-[#FA6C2F]" />
      </IonButton>
      <IonPopover showBackdrop={false} trigger={`loanRelease-${transaction._id}`} triggerAction="click" className="[--max-width:11rem]">
        <IonContent class="[--padding-top:0.5rem] [--padding-bottom:0.5rem]">
          {/* <ViewLoanRelease transaction={transaction} /> */}
          {canDoAction(token.role, token.permissions, 'loan release', 'update') && <UpdateLoanRelease transaction={transaction} setData={setData} />}
          {canDoAction(token.role, token.permissions, 'loan release', 'delete') && (
            <DeleteLoanRelease
              transaction={transaction}
              getTransactions={getTransactions}
              searchkey={searchKey}
              sortKey={sortKey}
              currentPage={currentPage}
              rowLength={rowLength}
            />
          )}
          {/* <div
            id={`present-alert-${transaction._id}`}
            className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
          >
            <IonIcon icon={print} className="text-[1rem]" /> Print
          </div> */}
          {/* <UpdateCVLoanRelease transaction={index} /> */}
        </IonContent>
      </IonPopover>
    </>
  );
};

export default LoanReleaseActions;

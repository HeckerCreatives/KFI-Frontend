import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical, fileTrayFullOutline, fileTrayFullSharp, print } from 'ionicons/icons';
import UpdateLoanRelease from '../modals/UpdateLoanRelease';
import DeleteLoanRelease from '../modals/DeleteLoanRelease';
import UpdateCVLoanRelease from '../modals/UpdateCVLoanRelease';
import ViewLoanRelease from '../modals/ViewLoanRelease';
import { AccessToken, Transaction } from '../../../../../types/types';
import { TData } from '../LoanRelease';
import { canDoAction } from '../../../../utils/permissions';
import { jwtDecode } from 'jwt-decode';
import PrintLoanRelease from '../modals/PrintLoanRelease';
import ExportLoanRelease from '../modals/ExportLoanRelease';

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
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')

  return (
    <div className="flex items-center gap-1">
      <ViewLoanRelease transaction={transaction} />
      {canDoAction(token.role, permissions, 'loan release', 'update') && <UpdateLoanRelease transaction={transaction} setData={setData} getTransactions={getTransactions} currentPage={currentPage} />}
      {canDoAction(token.role, permissions, 'loan release', 'delete') && (
        <DeleteLoanRelease transaction={transaction} getTransactions={getTransactions} searchkey={searchKey} sortKey={sortKey} currentPage={currentPage} rowLength={rowLength} />
      )}
      {canDoAction(token.role, permissions, 'loan release', 'print') && <PrintLoanRelease transaction={transaction} />}
      {canDoAction(token.role, permissions, 'loan release', 'export') && <ExportLoanRelease transaction={transaction} />}
    </div>
   
  );
};

export default LoanReleaseActions;

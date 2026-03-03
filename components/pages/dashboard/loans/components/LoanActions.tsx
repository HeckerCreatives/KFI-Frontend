import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical } from 'ionicons/icons';
import UpdateLoan from '../modals/UpdateLoan';
import DeleteLoan from '../modals/DeleteLoan';
import { AccessToken, Loan } from '../../../../../types/types';
import { TLoan } from '../Loans';
import { jwtDecode } from 'jwt-decode';
import { canDoAction } from '../../../../utils/permissions';
import ViewLoanCodes from '../modals/ViewLoanCodes';

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
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')


  return (
    <div>
      {canDoAction(token.role, permissions, 'product', 'visible') && <ViewLoanCodes loan={loan} />}
      {canDoAction(token.role, permissions, 'product', 'update') && <UpdateLoan loan={loan} setData={setData} />}
      {canDoAction(token.role, permissions, 'product', 'delete') && (
        <DeleteLoan loan={loan} getLoans={getLoans} searchkey={searchKey} sortKey={sortKey} currentPage={currentPage} rowLength={rowLength} />
      )}
    </div>
    
  );
};

export default LoanActions;

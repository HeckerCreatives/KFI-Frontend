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
import { Ellipsis } from 'lucide-react';

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
  const triggerId = `loanrelease-action-trigger-${loan._id}`;



  return (
     <>
     <button
        className=" !p-2 bg-zinc-100 rounded-xl text-zinc-800"
        id={triggerId}
      >
       <Ellipsis size={20}/>
      </button>

      <IonPopover
       showBackdrop={false}
       trigger={triggerId}
       triggerAction="click"
       className="[--max-width:12rem] !p-6 !rounded-xl"
     >
       <IonContent class="[--padding-top:0.25rem] [--padding-bottom:0.25rem] !p-6 !rounded-xl">
       <div className=' w-full flex flex-col p-4'>
        <p className=' text-sm text-zinc-400 mb-2'>Actions</p>
        {canDoAction(token.role, permissions, 'product', 'visible') && <ViewLoanCodes loan={loan} />}
        {canDoAction(token.role, permissions, 'product', 'update') && <UpdateLoan loan={loan} setData={setData} getLoans={getLoans} currentPage={currentPage} />}
        {canDoAction(token.role, permissions, 'product', 'delete') && (
          <DeleteLoan loan={loan} getLoans={getLoans} searchkey={searchKey} sortKey={sortKey} currentPage={currentPage} rowLength={rowLength} />
        )}
       </div>
       </IonContent>
     </IonPopover>
    </>
   
    
  );
};

export default LoanActions;

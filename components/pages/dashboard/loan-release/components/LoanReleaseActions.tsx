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
import { Ellipsis } from 'lucide-react';

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
   const triggerId = `loanrelease-action-trigger-${transaction._id}`;


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
         <ViewLoanRelease transaction={transaction} />
           {canDoAction(token.role, permissions, 'loan release', 'update') && <UpdateLoanRelease transaction={transaction} setData={setData} getTransactions={getTransactions} currentPage={currentPage} />}
           {canDoAction(token.role, permissions, 'loan release', 'delete') && (
             <DeleteLoanRelease transaction={transaction} getTransactions={getTransactions} searchkey={searchKey} sortKey={sortKey} currentPage={currentPage} rowLength={rowLength} />
           )}
           {canDoAction(token.role, permissions, 'loan release', 'print') && <PrintLoanRelease transaction={transaction} />}
           {canDoAction(token.role, permissions, 'loan release', 'export') && <ExportLoanRelease transaction={transaction} />}
       </div>
       </IonContent>
     </IonPopover>
    </>
   
   
  );
};

export default LoanReleaseActions;

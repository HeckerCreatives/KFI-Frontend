import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical } from 'ionicons/icons';
import UpdateBank from '../modals/UpdateBank';
import DeleteBank from '../modals/DeleteBank';
import { AccessToken, Bank } from '../../../../../types/types';
import { TBank } from '../Bank';
import { canDoAction } from '../../../../utils/permissions';
import { jwtDecode } from 'jwt-decode';
import ViewBank from '../modals/ViewBank';
import { Ellipsis } from 'lucide-react';

type BankActionsProps = {
  bank: Bank;
  setData: React.Dispatch<React.SetStateAction<TBank>>;
  getBanks: (page: number, keyword?: string, sort?: string) => {};
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  rowLength: number;
};

const BankActions = ({ bank, setData, currentPage, setCurrentPage, getBanks, searchKey, sortKey, rowLength }: BankActionsProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')
  const triggerId = `loanrelease-action-trigger-${bank._id}`;



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
             {canDoAction(token.role, permissions, 'bank', 'view') && <ViewBank bank={bank} />}
              {canDoAction(token.role, permissions, 'bank', 'update') && <UpdateBank bank={bank} setData={setData} />}
              {canDoAction(token.role, permissions, 'bank', 'delete') && (
                <DeleteBank bank={bank} getBanks={getBanks} searchkey={searchKey} sortKey={sortKey} currentPage={currentPage} rowLength={rowLength} />
              )}
           </div>
           </IonContent>
         </IonPopover>
        </>
   
    
  );
};

export default BankActions;

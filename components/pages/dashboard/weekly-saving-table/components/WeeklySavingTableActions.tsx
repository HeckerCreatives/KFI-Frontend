import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical } from 'ionicons/icons';
import UpdateWeeklySavingTable from '../modals/UpdateWeeklySavingTable';
import DeleteWeeklySavingTable from '../modals/DeleteWeeklySavingTable';
import { AccessToken, WeeklySavings } from '../../../../../types/types';
import { TWeeklySavingsTable } from '../WeeklySavingTable';
import { canDoAction } from '../../../../utils/permissions';
import { jwtDecode } from 'jwt-decode';
import { Ellipsis } from 'lucide-react';

type WeeklySavingTableActionsProps = {
  saving: WeeklySavings;
  setData: React.Dispatch<React.SetStateAction<TWeeklySavingsTable>>;
  getWeeklySavings: (page: number, keyword?: string, sort?: string) => {};
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  rowLength: number;
};

const WeeklySavingTableActions = ({ saving, setData, getWeeklySavings, currentPage, setCurrentPage, searchKey, sortKey, rowLength }: WeeklySavingTableActionsProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')
  const triggerId = `loanrelease-action-trigger-${saving._id}`;



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
                  {canDoAction(token.role, permissions, 'weekly savings', 'update') && <UpdateWeeklySavingTable saving={saving} setData={setData} />}
                  {canDoAction(token.role, permissions, 'weekly savings', 'delete') && (
                    <DeleteWeeklySavingTable saving={saving} getWeeklySavings={getWeeklySavings} searchkey={searchKey} sortKey={sortKey} currentPage={currentPage} rowLength={rowLength} />
                  )}
               </div>
               </IonContent>
             </IonPopover>
            </>
    
  );
};

export default WeeklySavingTableActions;

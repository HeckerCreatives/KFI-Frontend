import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical } from 'ionicons/icons';
import UpdateNature from '../modals/UpdateNature';
import DeleteNature from '../modals/DeleteNature';
import { AccessToken, Nature } from '../../../../../types/types';
import { TNature } from '../Nature';
import { jwtDecode } from 'jwt-decode';
import { canDoAction } from '../../../../utils/permissions';
import { Ellipsis } from 'lucide-react';

type NatureActionsProps = {
  nature: Nature;
  setData: React.Dispatch<React.SetStateAction<TNature>>;
  getNatures: (page: number, keyword?: string, sort?: string) => {};
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  rowLength: number;
};

const NatureActions = ({ nature, setData, currentPage, setCurrentPage, getNatures, searchKey, sortKey, rowLength }: NatureActionsProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')
  const triggerId = `loanrelease-action-trigger-${nature._id}`;


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
                 {canDoAction(token.role, permissions, 'nature', 'update') && (
                    <UpdateNature nature={nature} setData={setData} />
                  )}
                  {canDoAction(token.role, permissions, 'nature', 'delete') && (
                    <DeleteNature nature={nature} getNatures={getNatures} searchkey={searchKey} sortKey={sortKey} currentPage={currentPage} rowLength={rowLength} />
                  )}  
               </div>
               </IonContent>
             </IonPopover>
            </>
   
  );
};

export default NatureActions;

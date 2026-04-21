import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';

import { ellipsisVertical } from 'ionicons/icons';
import UpdateCenter from '../modals/UpdateCenter';
import DeleteCenter from '../modals/DeleteCenter';
import { AccessToken, Center } from '../../../../../types/types';
import { TCenter } from '../Center';
import { jwtDecode } from 'jwt-decode';
import { canDoAction } from '../../../../utils/permissions';
import ViewCenter from '../modals/ViewCenter';
import { Ellipsis } from 'lucide-react';

type CenterActionsProps = {
  center: Center;
  setData: React.Dispatch<React.SetStateAction<TCenter>>;
  getCenters: (page: number, keyword?: string, sort?: string) => {};
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  rowLength: number;
};

const CenterActions = ({ center, setData, getCenters, currentPage, setCurrentPage, searchKey, sortKey, rowLength }: CenterActionsProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')
  const triggerId = `loanrelease-action-trigger-${center._id || center.id}`;


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
             {canDoAction(token.role, permissions, 'center', 'visible') && <ViewCenter center={center} />}
              {canDoAction(token.role, permissions, 'center', 'update') && <UpdateCenter center={center} setData={setData} />}
              {canDoAction(token.role, permissions, 'center', 'delete') && (
                <DeleteCenter center={center} getCenters={getCenters} searchkey={searchKey} sortKey={sortKey} currentPage={currentPage} rowLength={rowLength} />
              )}
           </div>
           </IonContent>
         </IonPopover>
        </>
    
   
  );
};

export default CenterActions;

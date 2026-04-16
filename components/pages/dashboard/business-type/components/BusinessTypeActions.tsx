import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical } from 'ionicons/icons';
import UpdateBusinessType from '../modals/UpdateBusinessType';
import DeleteBusinessType from '../modals/DeleteBusinessType';
import { AccessToken, BusinessType } from '../../../../../types/types';
import { TBusinessType } from '../BusinessType';
import { jwtDecode } from 'jwt-decode';
import { canDoAction } from '../../../../utils/permissions';
import ViewBusinessType from '../modals/ViewBusinessType';
import { Ellipsis } from 'lucide-react';

type BusinessTypeActionsProps = {
  businessType: BusinessType;
  setData: React.Dispatch<React.SetStateAction<TBusinessType>>;
  getBusinessTypes: (page: number, keyword?: string, sort?: string) => {};
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  rowLength: number;
};

const BusinessTypeActions = ({ businessType, setData, currentPage, setCurrentPage, getBusinessTypes, searchKey, sortKey, rowLength }: BusinessTypeActionsProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')
  const triggerId = `loanrelease-action-trigger-${businessType._id}`;


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
              {canDoAction(token.role, permissions, 'business type', 'view') && <ViewBusinessType businessType={businessType} />}
              {canDoAction(token.role, permissions, 'business type', 'update') && <UpdateBusinessType businessType={businessType} setData={setData} />}
              {canDoAction(token.role, permissions, 'business type', 'delete') && (
                <DeleteBusinessType
                  businessType={businessType}
                  getBusinessTypes={getBusinessTypes}
                  searchkey={searchKey}
                  sortKey={sortKey}
                  currentPage={currentPage}
                  rowLength={rowLength}
                />
              )}
           </div>
           </IonContent>
         </IonPopover>
        </>
  
  );
};

export default BusinessTypeActions;

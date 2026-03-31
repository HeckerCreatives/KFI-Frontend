import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical } from 'ionicons/icons';
import UpdateSupplier from '../modals/UpdateSupplier';
import DeleteSupplier from '../modals/DeleteSupplier';
import { AccessToken, Supplier } from '../../../../../types/types';
import { TSupplier } from '../Supplier';
import { jwtDecode } from 'jwt-decode';
import { canDoAction } from '../../../../utils/permissions';
import ViewSupplier from '../modals/ViewSupplier';
import { Ellipsis } from 'lucide-react';

type SupplierActionsProps = {
  supplier: Supplier;
  setData: React.Dispatch<React.SetStateAction<TSupplier>>;
  getSuppliers: (page: number, keyword?: string, sort?: string) => {};
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  rowLength: number;
};

const SupplierActions = ({ supplier, setData, currentPage, setCurrentPage, getSuppliers, searchKey, sortKey, rowLength }: SupplierActionsProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')
  const triggerId = `loanrelease-action-trigger-${supplier._id}`;


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
            {canDoAction(token.role, permissions, 'business supplier', 'visible') && <ViewSupplier supplier={supplier} />}
              {canDoAction(token.role, permissions, 'business supplier', 'update') && <UpdateSupplier supplier={supplier} setData={setData} />}
              {canDoAction(token.role, permissions, 'business supplier', 'delete') && (
                <DeleteSupplier supplier={supplier} getSuppliers={getSuppliers} searchkey={searchKey} sortKey={sortKey} currentPage={currentPage} rowLength={rowLength} />
              )}
           </div>
           </IonContent>
         </IonPopover>
        </>
    
   
  );
};

export default SupplierActions;

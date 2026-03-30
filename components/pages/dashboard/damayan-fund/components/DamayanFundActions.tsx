import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical } from 'ionicons/icons';
import { AccessToken, DamayanFund } from '../../../../../types/types';
import { jwtDecode } from 'jwt-decode';
import { TData } from '../DamayanFund';
import { canDoAction } from '../../../../utils/permissions';
import ExportEmergencyLoan from '../modals/prints/ExportEmergencyLoan';
import ViewDamayanFund from '../modals/ViewEmergencyLoan';
import UpdateDamayanFund from '../modals/UpdateEmergencyLoan';
import DeleteDamayanFund from '../modals/DeleteEmergencyLoan';
import PrintDamayanFund from '../modals/prints/PrintDamayanFund';
import { Ellipsis } from 'lucide-react';

type DamayanFundActionsProps = {
  damayanFund: DamayanFund;
  setData: React.Dispatch<React.SetStateAction<TData>>;
  getDamayanFunds: (page: number, keyword?: string, sort?: string, to?: string, from?: string) => {};
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  to: string;
  from: string;
  rowLength: number;
};

const DamayanFundActions = ({ damayanFund, setData, getDamayanFunds, currentPage, setCurrentPage, searchKey, sortKey, to, from, rowLength }: DamayanFundActionsProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')
   const triggerId = `expensevoucher-action-trigger-${damayanFund._id}`;



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
          {canDoAction(token.role, permissions, 'damayan fund', 'visible') && <ViewDamayanFund damayanFund={damayanFund} />}
          {canDoAction(token.role, permissions, 'damayan fund', 'update') && <UpdateDamayanFund damayanFund={damayanFund} setData={setData} getDamayanFunds={getDamayanFunds} currentPage={currentPage} />}
          {canDoAction(token.role, permissions, 'damayan fund', 'delete') && (
            <DeleteDamayanFund damayanFund={damayanFund} getDamayanFunds={getDamayanFunds} searchkey={searchKey} sortKey={sortKey} currentPage={currentPage} rowLength={rowLength} />
          )}
          {canDoAction(token.role, permissions, 'damayan fund', 'print') && <PrintDamayanFund damayanFund={damayanFund} />}
          {canDoAction(token.role, permissions, 'damayan fund', 'export') && <ExportEmergencyLoan damayanFund={damayanFund} />}
          </div>
          </IonContent>
        </IonPopover>
        </>
        
    
  );
};

export default DamayanFundActions;

import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical, print } from 'ionicons/icons';
import { AccessToken, Acknowledgement, ExpenseVoucher } from '../../../../../types/types';
import { canDoAction } from '../../../../utils/permissions';
import { jwtDecode } from 'jwt-decode';
import { TData } from '../Acknowledgement';
import ViewAcknowledgement from '../modals/ViewAcknowledgement';
import UpdateAcknowledgement from '../modals/UpdateExpenseVoucher';
import PrintAcknowledgement from '../modals/prints/PrintAcknowledgement';
import ExportAcknowledgement from '../modals/prints/ExportAcknowledgement';
import DeleteAcknowledgement from '../modals/DeleteAcknowledgement';
import { Ellipsis } from 'lucide-react';

type AcknowledgementActionsProps = {
  acknowledgement: Acknowledgement;
  setData: React.Dispatch<React.SetStateAction<TData>>;
  getAcknowledgements: (page: number, keyword?: string, sort?: string, to?: string, from?: string) => {};
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  to: string;
  from: string;
  rowLength: number;
};

const AcknowledgementActions = ({
  acknowledgement,
  setData,
  getAcknowledgements,
  currentPage,
  setCurrentPage,
  searchKey,
  sortKey,
  to,
  from,
  rowLength,
}: AcknowledgementActionsProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')
   const triggerId = `expensevoucher-action-trigger-${acknowledgement._id}`;



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

          {canDoAction(token.role, permissions, 'acknowledgement', 'view') && <ViewAcknowledgement acknowledgement={acknowledgement} />}
          {canDoAction(token.role, permissions, 'acknowledgement', 'update') && <UpdateAcknowledgement acknowledgement={acknowledgement} setData={setData} getAcknowledgement={getAcknowledgements} currentPage={currentPage} />}
          {canDoAction(token.role, permissions, 'acknowledgement', 'delete') && (
            <DeleteAcknowledgement
              acknowledgement={acknowledgement}
              getAcknowledgements={getAcknowledgements}
              searchkey={searchKey}
              sortKey={sortKey}
              currentPage={currentPage}
              rowLength={rowLength}
            />
          )}
          {canDoAction(token.role, permissions, 'acknowledgement', 'print') && <PrintAcknowledgement acknowledgement={acknowledgement} />}
          {canDoAction(token.role, permissions, 'acknowledgement', 'export') && <ExportAcknowledgement acknowledgement={acknowledgement} />}
       </div>
       </IonContent>
     </IonPopover>
    </>
   
    
  );
};

export default AcknowledgementActions;

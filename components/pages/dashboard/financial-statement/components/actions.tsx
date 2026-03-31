import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical, fileTrayFullOutline, fileTrayFullSharp, print } from 'ionicons/icons';
import { AccessToken, FinancialStatements, Transaction } from '../../../../../types/types';

import { canDoAction } from '../../../../utils/permissions';
import { jwtDecode } from 'jwt-decode';

import { Ellipsis } from 'lucide-react';
import UpdateFS from '../modals/update';
import DeleteFS from '../modals/delete';
import UpdateFSEntries from '../modals/entries';

type LoanReleaseActionsProps = {
  data: FinancialStatements;
getList: (page: number) => void;
currentPage: number;

};

const FSActions = ({ data, getList, currentPage }: LoanReleaseActionsProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')
   const triggerId = `loanrelease-action-trigger-${data._id}`;


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
          {canDoAction(token.role, permissions, 'financial statement', 'update') && (
          <UpdateFS key={data._id} item={data} getList={getList} currentPage={currentPage}/>
                
          )}
          {canDoAction(token.role, permissions, 'financial statement', 'delete') && (
          <DeleteFS item={data} getList={getList} currentPage={currentPage}/>
          )}
          {canDoAction(token.role, permissions, 'financial statement', 'update') && (
          <UpdateFSEntries item={data} getList={getList} currentPage={currentPage} key={0}/>
          )}
       </div>
       </IonContent>
     </IonPopover>
    </>
   
   
  );
};

export default FSActions;

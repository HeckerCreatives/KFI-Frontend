import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical, fileTrayFullOutline, fileTrayFullSharp, print } from 'ionicons/icons';
import { AccessToken, BegBalance, FinancialStatements, Transaction } from '../../../../../types/types';

import { canDoAction } from '../../../../utils/permissions';
import { jwtDecode } from 'jwt-decode';

import { Ellipsis } from 'lucide-react';
import UpdateFS from '../modals/update';
import DeleteFS from '../modals/delete';
import Update from '../modals/update';
import Delete from '../modals/delete';

type LoanReleaseActionsProps = {
  data: BegBalance;
getList: (page: number) => void;
currentPage: number;

};

const BBActions = ({ data, getList, currentPage }: LoanReleaseActionsProps) => {
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
         {canDoAction(token.role, permissions, 'beginning balance', 'update') && (
            <Update item={data} getList={getList} currentPage={currentPage}/>
          )}
          {canDoAction(token.role, permissions, 'beginning balance', 'delete') && (
            <Delete item={data} getList={getList} currentPage={currentPage}/>
          )}
       </div>
       </IonContent>
     </IonPopover>
    </>
   
   
  );
};

export default BBActions;

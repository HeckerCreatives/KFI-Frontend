import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { AccessToken, FinancialStatements, Transaction } from '../../../../../types/types';
import { canDoAction } from '../../../../utils/permissions';
import { jwtDecode } from 'jwt-decode';
import { Ellipsis } from 'lucide-react';
import UpdateFSEntries from '../modals/entries';
import UpdateTB from '../modals/update';
import DeleteTB from '../modals/delete';

type LoanReleaseActionsProps = {
  data: any;
getList: (page: number) => void;
currentPage: number;

};

const TBActions = ({ data, getList, currentPage }: LoanReleaseActionsProps) => {
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
          {canDoAction(token.role, permissions, 'trial balance', 'update') && (
              <UpdateTB item={data} getList={getList} currentPage={currentPage}/>
            )}
            {canDoAction(token.role, permissions, 'trial balance', 'delete') && (
               <DeleteTB item={data} getList={getList} currentPage={currentPage}/>
            )}
            {canDoAction(token.role, permissions, 'trial balance', 'update') && (
               <UpdateFSEntries item={data} getList={getList} currentPage={currentPage}/>
            )}
                          
       </div>
       </IonContent>
     </IonPopover>
    </>
   
   
  );
};

export default TBActions;

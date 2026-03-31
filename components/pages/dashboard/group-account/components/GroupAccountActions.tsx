import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical } from 'ionicons/icons';
import UpdateGroupAccount from '../modals/UpdateGroupAccount';
import DeleteGroupAccount from '../modals/DeleteGroupAccount';
import { AccessToken, GroupAccount } from '../../../../../types/types';
import { TGroupAccount } from '../GroupAccount';
import { jwtDecode } from 'jwt-decode';
import { canDoAction } from '../../../../utils/permissions';
import ViewGroupAccount from '../modals/ViewGroupAccount';
import ViewLoanRelease from '../../loan-release/modals/ViewLoanRelease';
import { Ellipsis } from 'lucide-react';

type GroupAccountActionsProps = {
  groupAccount: GroupAccount;
  setData: React.Dispatch<React.SetStateAction<TGroupAccount>>;
  getGroupAccounts: (page: number, keyword?: string, sort?: string) => {};
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  rowLength: number;
};

const GroupAccountActions = ({ groupAccount, setData, currentPage, setCurrentPage, getGroupAccounts, searchKey, sortKey, rowLength }: GroupAccountActionsProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')
  const triggerId = `loanrelease-action-trigger-${groupAccount._id}`;


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
        {canDoAction(token.role, permissions, 'group of account', 'visible') && <ViewGroupAccount groupAccount={groupAccount} />}
          {canDoAction(token.role, permissions, 'group of account', 'update') && <UpdateGroupAccount groupAccount={groupAccount} setData={setData} getGroupAccounts={getGroupAccounts} currentPage={currentPage} />}
          {canDoAction(token.role, permissions, 'group of account', 'delete') && (
            <DeleteGroupAccount
              groupAccount={groupAccount}
              getGroupAccounts={getGroupAccounts}
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

export default GroupAccountActions;

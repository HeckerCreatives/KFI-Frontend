import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical } from 'ionicons/icons';
import UpdateGroupAccount from '../modals/UpdateGroupAccount';
import DeleteGroupAccount from '../modals/DeleteGroupAccount';
import { GroupAccount } from '../../../../../types/types';
import { TGroupAccount } from '../GroupAccount';

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
  return (
    <>
      <IonButton fill="clear" id={`ga-${groupAccount._id}`} className="[--padding-start:0] [--padding-end:0] [--padding-top:0] [--padding-bottom:0] min-h-5">
        <IonIcon icon={ellipsisVertical} className="text-[#FA6C2F]" />
      </IonButton>
      <IonPopover showBackdrop={false} trigger={`ga-${groupAccount._id}`} triggerAction="click" className="[--max-width:10rem]">
        <IonContent>
          <UpdateGroupAccount groupAccount={groupAccount} setData={setData} />
          <DeleteGroupAccount
            groupAccount={groupAccount}
            getGroupAccounts={getGroupAccounts}
            searchkey={searchKey}
            sortKey={sortKey}
            currentPage={currentPage}
            rowLength={rowLength}
          />
        </IonContent>
      </IonPopover>
    </>
  );
};

export default GroupAccountActions;

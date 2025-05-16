import React from 'react';
import { User } from '../../../../../types/types';
import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import { ellipsisVertical } from 'ionicons/icons';
import { TUser } from '../Admin';
import AddPermission from '../modal/AddPermission';

type UserActionsProps = {
  user: User;
  setData: React.Dispatch<React.SetStateAction<TUser>>;
};

const UserActions = ({ user, setData }: UserActionsProps) => {
  return (
    <>
      <IonButton fill="clear" id={`user-${user._id}`} className="[--padding-start:0] [--padding-end:0] [--padding-top:0] [--padding-bottom:0] min-h-5">
        <IonIcon icon={ellipsisVertical} className="text-[#FA6C2F]" />
      </IonButton>
      <IonPopover showBackdrop={false} trigger={`user-${user._id}`} triggerAction="click" className="[--max-width:13rem]">
        <IonContent>
          <AddPermission user={user} setData={setData} />
        </IonContent>
      </IonPopover>
    </>
  );
};

export default UserActions;

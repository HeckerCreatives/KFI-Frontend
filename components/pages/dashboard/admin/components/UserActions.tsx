import React from 'react';
import { AccessToken, User } from '../../../../../types/types';
import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import { ellipsisVertical, list, logIn } from 'ionicons/icons';
import { TUser } from '../Admin';
import AddPermission from '../modal/AddPermission';
import ChangePassword from '../modal/ChangePassword';
import ActivityLogs from '../modal/ActivityLogs';
import ViewAdmin from '../modal/ViewAdmin';
import LoginLogs from '../modal/LoginLogs';
import { jwtDecode } from 'jwt-decode';
import { canDoAction } from '../../../../utils/permissions';

type UserActionsProps = {
  user: User;
  setData: React.Dispatch<React.SetStateAction<TUser>>;
};

const UserActions = ({ user, setData }: UserActionsProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')


  return (
    <div>
      {canDoAction(token.role, permissions,'admin', 'visible') && (
       <ViewAdmin user={user} setData={setData}/>
      )}
      {canDoAction(token.role, permissions,'admin', 'update') && (
       <AddPermission user={user} setData={setData} />
      )}
      {canDoAction(token.role, permissions,'admin', 'update') && (
       <ChangePassword user={user} />
      )}
      {canDoAction(token.role, permissions,'admin', 'visible') && (
        <ActivityLogs user={user} />
      )}
      {canDoAction(token.role, permissions,'admin', 'visible') && (
        <LoginLogs user={user}/>
      )}
    </div>
    
  );
};

export default UserActions;

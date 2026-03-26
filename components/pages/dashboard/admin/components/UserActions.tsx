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
import { MoreHorizontalIcon } from 'hugeicons-react';
import { Ellipsis } from 'lucide-react';

type UserActionsProps = {
  user: User;
  setData: React.Dispatch<React.SetStateAction<TUser>>;
};

const UserActions = ({ user, setData }: UserActionsProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')
   const triggerId = `admin-action-trigger-${user._id}`;


  return (
    <>
    <button
        className=" !p-2 bg-zinc-100 rounded-xl text-zinc-800"
        id={triggerId}
      >
       <Ellipsis size={25}/>
      </button>

          <IonPopover
                      showBackdrop={false}
                      trigger={triggerId}
                      triggerAction="click"
                      className="[--max-width:16rem] !p-6 !rounded-xl"
                    >
                      <IonContent class="[--padding-top:0.25rem] [--padding-bottom:0.25rem] !p-6 !rounded-xl">
      
                  <div className=' w-full p-4'>
                    <p className=' text-sm text-zinc-400 mb-2'>Actions</p>
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
                        
                        
      
                  
                      </IonContent>
                    </IonPopover>

    
    </>
   
    
  );
};

export default UserActions;

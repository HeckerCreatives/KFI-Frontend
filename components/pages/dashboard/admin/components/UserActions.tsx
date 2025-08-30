import React from 'react';
import { User } from '../../../../../types/types';
import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import { ellipsisVertical, list, logIn } from 'ionicons/icons';
import { TUser } from '../Admin';
import AddPermission from '../modal/AddPermission';
import ChangePassword from '../modal/ChangePassword';
import ActivityLogs from '../modal/ActivityLogs';
import ViewAdmin from '../modal/ViewAdmin';

type UserActionsProps = {
  user: User;
  setData: React.Dispatch<React.SetStateAction<TUser>>;
};

const UserActions = ({ user, setData }: UserActionsProps) => {
  return (
    <div>
      <ViewAdmin user={user} setData={setData}/>
      <AddPermission user={user} setData={setData} />
      <ChangePassword user={user} />
      <ActivityLogs user={user} />
      {/* <div className="text-end">
        <div
          id={`update-permissions-modal-${user._id}`}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={logIn} className="text-[1rem]" /> Login Logs
        </div>
      </div> */}
      <IonButton
        fill="clear"
        className="space-x-1 rounded-md w-28 h-7 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-pink-50 text-pink-900 capitalize min-h-4 text-xs"
      >
        <IonIcon icon={logIn} className="text-xs" />
        <span>Login Logs</span>
      </IonButton>
    </div>
    // <>
    //   <IonButton fill="clear" id={`user-${user._id}`} className="[--padding-start:0] [--padding-end:0] [--padding-top:0] [--padding-bottom:0] min-h-5">
    //     <IonIcon icon={ellipsisVertical} className="text-[#FA6C2F]" />
    //   </IonButton>
    //   <IonPopover showBackdrop={false} trigger={`user-${user._id}`} triggerAction="click" className="[--max-width:13rem]">
    //     <IonContent>
    //       <AddPermission user={user} setData={setData} />
    //       <ChangePassword user={user} />
    //       <ActivityLogs user={user} />
    //       <div className="text-end">
    //         <div
    //           id={`update-permissions-modal-${user._id}`}
    //           className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
    //         >
    //           <IonIcon icon={logIn} className="text-[1rem]" /> Login Logs
    //         </div>
    //       </div>
    //     </IonContent>
    //   </IonPopover>
    // </>
  );
};

export default UserActions;

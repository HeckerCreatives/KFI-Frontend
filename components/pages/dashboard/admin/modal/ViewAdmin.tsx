import { IonButton, IonHeader, IonIcon, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import { eye, shieldCheckmarkSharp } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { TUser } from '../Admin';
import { User } from '../../../../../types/types';
import classNames from 'classnames';
import { CheckmarkBadge01Icon, Clock01Icon, Key01Icon, Key02Icon, Tick01Icon, UserSettings01Icon } from 'hugeicons-react';

type AddPermissionProps = {
  user: User;
  setData: React.Dispatch<React.SetStateAction<TUser>>;
};


const ViewAdmin = ({ user, setData }: AddPermissionProps) => {
 const [isOpen, setIsOpen] = useState(false);

  const dismiss = () => setIsOpen(false);

  return (
    <>
      {/* <div className="text-end">
        <div
          id={`update-permissions-modal-${user._id}`}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={shieldCheckmarkSharp} className="text-[1rem]" /> Manage Permissions
        </div>
      </div> */}
      <IonButton
        type="button"
        fill="clear"
        onClick={() => setIsOpen(true)}
        className="space-x-1 rounded-md px-4 min-h-7 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0] bg-orange-100 text-orange-900 capitalize text-xs"
      >
        <IonIcon icon={eye} className="text-xs" />
        <span>View</span>
      </IonButton>
      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className=" [--border-radius:0.7rem] auto-height [--max-width:58rem] [--width:95%]"
      >
        
        <div className="inner-content space-y-4 !p-6">
            <ModalHeader title="Admin - Details" sub="Manage admin details." dismiss={dismiss} />
            <div className=' w-full flex items-center justify-between bg-zinc-50 p-4 rounded-md'>
                <div className=' flex items-center gap-4 w-full '>
                    <div className='!font-semibold text-xl '>{user.name}</div>
                    <div className={classNames('!font-medium px-2 py-1 text-[.7rem] w-fit rounded-full', user.status === 'banned' ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50')}>{user.status}</div>
                </div>

                <p className="text-xs text-muted-foreground flex gap-2">
                    <Clock01Icon size={15} stroke='.8'/>
                    Created at: {new Date(user.createdAt).toLocaleString()}
                </p>
            </div>

            <p className=' flex items-center gap-2 text-lg !font-medium'><UserSettings01Icon size={25} stroke='.8' className=' p-1 bg-orange-50 text-orange-500 rounded-md'/>Permissions</p>

            <div className=' w-full flex items-center justify-between  rounded-md'>
                <div className="w-full">
                {user.permissions.filter((perm) =>
                    Object.values(perm.actions).some((val) => val)
                ).length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground py-6 rounded-lg bg-zinc-50">
                    No permissions assigned
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 w-full">
                    {user.permissions
                        .filter((perm) => Object.values(perm.actions).some((val) => val))
                        .map((perm) => (
                        <div
                            key={perm._id}
                            className="shadow-sm border rounded-lg p-3 bg-white"
                        >
                            <p className="!font-medium text-sm mb-2 capitalize">
                            {perm.resource}
                            </p>
                            <div className="flex flex-wrap gap-2">
                            {Object.entries(perm.actions).map(([key, value]) =>
                                value ? (
                                <div
                                    key={key}
                                    className="px-2 py-1 bg-green-50 text-green-500 rounded-full text-xs capitalize flex items-center gap-1"
                                >
                                    <Tick01Icon size={15} stroke=".8" /> {key}
                                </div>
                                ) : null
                            )}
                            </div>
                        </div>
                        ))}
                    </div>
                )}
                </div>


            </div>


           

        </div>
      </IonModal>
    </>
  );
};

export default ViewAdmin;

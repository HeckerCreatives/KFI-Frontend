import { IonButton, IonHeader, IonIcon, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import { shieldCheckmarkSharp } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { Permission, User } from '../../../../../types/types';
import { TUser } from '../Admin';
import { Table, TableBody, TableHead, TableHeader, TableHeadRow } from '../../../../ui/table/Table';
import UserTableRow from '../components/UserTableRow';
import kfiAxios from '../../../../utils/axios';
import { allFilesResource, manageAccountResource, transactionResource } from '../../../../utils/constants';

type AddPermissionProps = {
  user: User;
  setData: React.Dispatch<React.SetStateAction<TUser>>;
};

const AddPermission = ({ user, setData }: AddPermissionProps) => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<Permission[]>(user.permissions);

  useEffect(() => {
    if (user) setPermissions(user.permissions);
  }, [user]);

  const modal = useRef<HTMLIonModalElement>(null);

  function dismiss() {
    modal.current?.dismiss();
  }

  async function handleAddPermission() {
    setLoading(true);
    try {
      const result = await kfiAxios.put(`/user/permissions/${user._id}`, { permissions: permissions });
      const { success } = result.data;
      if (success) {
        setData(prev => {
          let clone = [...prev.users];
          let index = clone.findIndex(e => e._id === result.data.user._id);
          clone[index] = { ...result.data.user };
          return { ...prev, users: clone };
        });
        dismiss();
        return;
      }
    } catch (error: any) {
      present({
        message: 'Failed to update the user permissions. Please try again',
        duration: 1000,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="text-end">
        <div
          id={`update-permissions-modal-${user._id}`}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={shieldCheckmarkSharp} className="text-[1rem]" /> Manage Permissions
        </div>
      </div>
      <IonModal
        ref={modal}
        trigger={`update-permissions-modal-${user._id}`}
        backdropDismiss={false}
        className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:50%] lg:[--width:50%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader disabled={loading} title="Admin - Manage Permissions" sub="Manage Account" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content space-y-4">
          <div>
            <h6 className="font-bold m-0 mt-2">Manage Account</h6>
            <div className="relative overflow-auto">
              <Table>
                <TableHeader>
                  <TableHeadRow className="border-b-0 bg-slate-100">
                    <TableHead className="max-w-32">Page</TableHead>
                    <TableHead className="text-center">Visible</TableHead>
                    <TableHead className="text-center">Create</TableHead>
                    <TableHead className="text-center">Read</TableHead>
                    <TableHead className="text-center">Update</TableHead>
                    <TableHead className="text-center">Delete</TableHead>
                    <TableHead className="text-center">Print</TableHead>
                  </TableHeadRow>
                </TableHeader>
                <TableBody>
                  {permissions
                    .filter((e: Permission) => manageAccountResource.includes(e.resource))
                    .map((permission: Permission) => (
                      <UserTableRow key={permission._id} permission={permission} setPermissions={setPermissions} />
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div>
            <h6 className="font-bold m-0 mt-2">All Files</h6>
            <div className="relative overflow-auto">
              <Table>
                <TableHeader>
                  <TableHeadRow className="border-b-0 bg-slate-100">
                    <TableHead className="max-w-32">Page</TableHead>
                    <TableHead className="text-center">Visible</TableHead>
                    <TableHead className="text-center">Create</TableHead>
                    <TableHead className="text-center">Read</TableHead>
                    <TableHead className="text-center">Update</TableHead>
                    <TableHead className="text-center">Delete</TableHead>
                    <TableHead className="text-center">Print</TableHead>
                  </TableHeadRow>
                </TableHeader>
                <TableBody>
                  {permissions
                    .filter((e: Permission) => allFilesResource.includes(e.resource))
                    .map((permission: Permission) => (
                      <UserTableRow key={permission._id} permission={permission} setPermissions={setPermissions} />
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div>
            <h6 className="font-bold m-0 mt-2">Transactions</h6>
            <div className="relative overflow-auto">
              <Table>
                <TableHeader>
                  <TableHeadRow className="border-b-0 bg-slate-100">
                    <TableHead className="max-w-32">Page</TableHead>
                    <TableHead className="text-center">Visible</TableHead>
                    <TableHead className="text-center">Create</TableHead>
                    <TableHead className="text-center">Read</TableHead>
                    <TableHead className="text-center">Update</TableHead>
                    <TableHead className="text-center">Delete</TableHead>
                    <TableHead className="text-center">Print</TableHead>
                  </TableHeadRow>
                </TableHeader>
                <TableBody>
                  {permissions
                    .filter((e: Permission) => transactionResource.includes(e.resource))
                    .map((permission: Permission) => (
                      <UserTableRow key={permission._id} permission={permission} setPermissions={setPermissions} />
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="text-end border-t pt-1 space-x-2">
            <IonButton onClick={handleAddPermission} disabled={loading} color="tertiary" type="submit" className="!text-sm capitalize" strong={true}>
              {loading ? 'Saving...' : 'Save'}
            </IonButton>
            <IonButton disabled={loading} onClick={dismiss} color="danger" type="button" className="!text-sm capitalize" strong={true}>
              Cancel
            </IonButton>
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default AddPermission;

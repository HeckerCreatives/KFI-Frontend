import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import { ellipsisVertical, print } from 'ionicons/icons';
import React from 'react';
import { AccessToken, ClientMasterFile } from '../../../../../types/types';
import { TClientMasterFile } from '../ClientMasterFile';
import UpdateClientMasterFile from '../modals/UpdateClientMasterFile';
import DeleteClientMasterFile from '../modals/DeleteClientMasterFile';
import ViewBeneficiaries from '../modals/ViewBeneficiaries';
import ViewChildrens from '../modals/ViewChildrens';
import { canDoAction } from '../../../../utils/permissions';
import { jwtDecode } from 'jwt-decode';

type ClientMasterFileActionsProps = {
  client: ClientMasterFile;
  setData: React.Dispatch<React.SetStateAction<TClientMasterFile>>;
  getClients: (page: number, keyword?: string, sort?: string) => {};
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  rowLength: number;
};

const ClientMasterFileActions = ({ client, getClients, setData, currentPage, setCurrentPage, searchKey, sortKey, rowLength }: ClientMasterFileActionsProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  return (
    <>
      <IonButton fill="clear" id={`cmf-${client._id}`} className="[--padding-start:0] [--padding-end:0] [--padding-top:0] [--padding-bottom:0] min-h-5">
        <IonIcon icon={ellipsisVertical} className="text-[#FA6C2F]" />
      </IonButton>
      <IonPopover showBackdrop={false} trigger={`cmf-${client._id}`} triggerAction="click" className="[--max-width:13rem]">
        <IonContent>
          {canDoAction(token.role, token.permissions, 'client master file', 'update') && (
            <>
              <UpdateClientMasterFile client={client} setData={setData} />
              <ViewBeneficiaries client={client} setData={setData} />
              <ViewChildrens client={client} setData={setData} />
            </>
          )}
          {canDoAction(token.role, token.permissions, 'client master file', 'delete') && (
            <DeleteClientMasterFile client={client} getClients={getClients} searchkey={searchKey} sortKey={sortKey} currentPage={currentPage} rowLength={rowLength} />
          )}
          {canDoAction(token.role, token.permissions, 'client master file', 'print') && (
            <div className="text-end">
              <div className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1">
                <IonIcon icon={print} className="text-[1rem]" /> Print
              </div>
            </div>
          )}
        </IonContent>
      </IonPopover>
    </>
  );
};

export default ClientMasterFileActions;

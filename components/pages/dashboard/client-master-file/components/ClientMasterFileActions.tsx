import React from 'react';
import { AccessToken, ClientMasterFile } from '../../../../../types/types';
import { TClientMasterFile } from '../ClientMasterFile';
import UpdateClientMasterFile from '../modals/UpdateClientMasterFile';
import DeleteClientMasterFile from '../modals/DeleteClientMasterFile';
import { canDoAction } from '../../../../utils/permissions';
import { jwtDecode } from 'jwt-decode';
import PrintClient from '../modals/PrintClient';
import ExportClient from '../modals/ExportClient';
import ViewClientMasterFile from '../modals/ViewClientMasterFile';
import { Ellipsis } from 'lucide-react';
import { IonPopover, IonContent } from '@ionic/react';
import ActivityLogs from '../../admin/modal/ActivityLogs';
import AddPermission from '../../admin/modal/AddPermission';
import ChangePassword from '../../admin/modal/ChangePassword';
import ViewAdmin from '../../admin/modal/ViewAdmin';
import LoginLogs from '../../login-logs/LoginLogs';

type ClientMasterFileActionsProps = {
  client: ClientMasterFile;
  setData: React.Dispatch<React.SetStateAction<TClientMasterFile>>;
  getClients: (page: number, keyword?: string, sort?: string) => {};
  getClientsOffline: (page: number, keyword?: string, sort?: string) => void;

  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  rowLength: number;
};

const ClientMasterFileActions = ({ client, getClients, setData, currentPage, setCurrentPage, searchKey, sortKey, rowLength, getClientsOffline }: ClientMasterFileActionsProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')
   const triggerId = `client-action-trigger-${client._id}`;


  
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
         <div className=' w-full p-4 flex flex-col'>
           <p className=' text-sm text-zinc-400 mb-2'>Actions</p>
           {canDoAction(token.role, permissions, 'clients', 'visible') && <ViewClientMasterFile member={client} />}
             {canDoAction(token.role, permissions, 'clients', 'update') && <UpdateClientMasterFile getClientsOffline={getClientsOffline} client={client} setData={setData} />}
             {canDoAction(token.role, permissions, 'clients', 'delete') && (
               <DeleteClientMasterFile getClientsOffline={getClientsOffline} client={client} getClients={getClients} searchkey={searchKey} sortKey={sortKey} currentPage={currentPage} rowLength={rowLength} />
             )}
             {canDoAction(token.role, permissions, 'clients', 'print') && <PrintClient client={client} />}
             {canDoAction(token.role, permissions, 'clients', 'export') && <ExportClient client={client} />}
         </div>
       </IonContent>
     </IonPopover>

    </>
   
  );
};

export default ClientMasterFileActions;

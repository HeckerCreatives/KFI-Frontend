import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical } from 'ionicons/icons';
import { AccessToken, Release } from '../../../../../types/types';
import { canDoAction } from '../../../../utils/permissions';
import { jwtDecode } from 'jwt-decode';
import { TData } from '../Release';
import UpdateRelease from '../modals/UpdateRelease';
import ViewRelease from '../modals/ViewRelease';
import PrintRelease from '../modals/prints/PrintRelease';
import ExportRelease from '../modals/prints/ExportRelease';
import DeleteRelease from '../modals/DeleteRelease';
import { Ellipsis } from 'lucide-react';

type ReleaseActionsProps = {
  release: Release;
  setData: React.Dispatch<React.SetStateAction<TData>>;
  getReleases: (page: number, keyword?: string, sort?: string, to?: string, from?: string) => {};
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  to: string;
  from: string;
  rowLength: number;
};

const ReleaseActions = ({ release, setData, getReleases, currentPage, setCurrentPage, searchKey, sortKey, to, from, rowLength }: ReleaseActionsProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')
  const triggerId = `loanrelease-action-trigger-${release._id}`;



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
           {canDoAction(token.role, permissions, 'release', 'view') && <ViewRelease release={release} />}
            {canDoAction(token.role, permissions, 'release', 'update') && <UpdateRelease release={release} setData={setData} getReleases={getReleases} currentPage={currentPage} />}
            {canDoAction(token.role, permissions, 'release', 'delete') && (
              <DeleteRelease release={release} getRelease={getReleases} searchkey={searchKey} sortKey={sortKey} currentPage={currentPage} rowLength={rowLength} />
            )}
            {canDoAction(token.role, permissions, 'release', 'print') && <PrintRelease release={release} />}
            {canDoAction(token.role, permissions, 'release', 'export') && <ExportRelease release={release} />}
       </div>
       </IonContent>
     </IonPopover>
    </>
   
   
  );
};

export default ReleaseActions;

import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical } from 'ionicons/icons';
import UpdateNature from '../modals/UpdateNature';
import DeleteNature from '../modals/DeleteNature';
import { AccessToken, Nature } from '../../../../../types/types';
import { TNature } from '../Nature';
import { jwtDecode } from 'jwt-decode';
import { canDoAction } from '../../../../utils/permissions';

type NatureActionsProps = {
  nature: Nature;
  setData: React.Dispatch<React.SetStateAction<TNature>>;
  getNatures: (page: number, keyword?: string, sort?: string) => {};
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  rowLength: number;
};

const NatureActions = ({ nature, setData, currentPage, setCurrentPage, getNatures, searchKey, sortKey, rowLength }: NatureActionsProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')

  return (
    <div className=' flex items-center gap-2'>
      {canDoAction(token.role, permissions, 'nature', 'update') && (
        <UpdateNature nature={nature} setData={setData} />
      )}
      {canDoAction(token.role, permissions, 'nature', 'delete') && (
        <DeleteNature nature={nature} getNatures={getNatures} searchkey={searchKey} sortKey={sortKey} currentPage={currentPage} rowLength={rowLength} />
      )}  
    </div>
  );
};

export default NatureActions;

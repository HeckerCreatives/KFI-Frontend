import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical } from 'ionicons/icons';
import UpdateBank from '../modals/UpdateBank';
import DeleteBank from '../modals/DeleteBank';
import { AccessToken, Bank } from '../../../../../types/types';
import { TBank } from '../Bank';
import { canDoAction } from '../../../../utils/permissions';
import { jwtDecode } from 'jwt-decode';
import ViewBank from '../modals/ViewBank';

type BankActionsProps = {
  bank: Bank;
  setData: React.Dispatch<React.SetStateAction<TBank>>;
  getBanks: (page: number, keyword?: string, sort?: string) => {};
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  rowLength: number;
};

const BankActions = ({ bank, setData, currentPage, setCurrentPage, getBanks, searchKey, sortKey, rowLength }: BankActionsProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')


  return (
    <div>
      {canDoAction(token.role, permissions, 'bank', 'visible') && <ViewBank bank={bank} />}
      {canDoAction(token.role, permissions, 'bank', 'update') && <UpdateBank bank={bank} setData={setData} />}
      {canDoAction(token.role, permissions, 'bank', 'delete') && (
        <DeleteBank bank={bank} getBanks={getBanks} searchkey={searchKey} sortKey={sortKey} currentPage={currentPage} rowLength={rowLength} />
      )}
    </div>
    
  );
};

export default BankActions;

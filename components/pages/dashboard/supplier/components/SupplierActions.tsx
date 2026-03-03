import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical } from 'ionicons/icons';
import UpdateSupplier from '../modals/UpdateSupplier';
import DeleteSupplier from '../modals/DeleteSupplier';
import { AccessToken, Supplier } from '../../../../../types/types';
import { TSupplier } from '../Supplier';
import { jwtDecode } from 'jwt-decode';
import { canDoAction } from '../../../../utils/permissions';
import ViewSupplier from '../modals/ViewSupplier';

type SupplierActionsProps = {
  supplier: Supplier;
  setData: React.Dispatch<React.SetStateAction<TSupplier>>;
  getSuppliers: (page: number, keyword?: string, sort?: string) => {};
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  rowLength: number;
};

const SupplierActions = ({ supplier, setData, currentPage, setCurrentPage, getSuppliers, searchKey, sortKey, rowLength }: SupplierActionsProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')

  return (
    <div>
      {canDoAction(token.role, permissions, 'business supplier', 'visible') && <ViewSupplier supplier={supplier} />}
      {canDoAction(token.role, permissions, 'business supplier', 'update') && <UpdateSupplier supplier={supplier} setData={setData} />}
      {canDoAction(token.role, permissions, 'business supplier', 'delete') && (
        <DeleteSupplier supplier={supplier} getSuppliers={getSuppliers} searchkey={searchKey} sortKey={sortKey} currentPage={currentPage} rowLength={rowLength} />
      )}
    </div>
   
  );
};

export default SupplierActions;

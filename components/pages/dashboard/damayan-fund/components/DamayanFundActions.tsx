import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical } from 'ionicons/icons';
import { AccessToken, DamayanFund } from '../../../../../types/types';
import { jwtDecode } from 'jwt-decode';
import { TData } from '../DamayanFund';
import { canDoAction } from '../../../../utils/permissions';
import ExportEmergencyLoan from '../modals/prints/ExportEmergencyLoan';
import ViewDamayanFund from '../modals/ViewEmergencyLoan';
import UpdateDamayanFund from '../modals/UpdateEmergencyLoan';
import DeleteDamayanFund from '../modals/DeleteEmergencyLoan';
import PrintDamayanFund from '../modals/prints/PrintDamayanFund';

type DamayanFundActionsProps = {
  damayanFund: DamayanFund;
  setData: React.Dispatch<React.SetStateAction<TData>>;
  getDamayanFunds: (page: number, keyword?: string, sort?: string, to?: string, from?: string) => {};
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  to: string;
  from: string;
  rowLength: number;
};

const DamayanFundActions = ({ damayanFund, setData, getDamayanFunds, currentPage, setCurrentPage, searchKey, sortKey, to, from, rowLength }: DamayanFundActionsProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')


  return (
    <div>
      {canDoAction(token.role, permissions, 'damayan fund', 'visible') && <ViewDamayanFund damayanFund={damayanFund} />}
      {canDoAction(token.role, permissions, 'damayan fund', 'update') && <UpdateDamayanFund damayanFund={damayanFund} setData={setData} getDamayanFunds={getDamayanFunds} currentPage={currentPage} />}
      {canDoAction(token.role, permissions, 'damayan fund', 'delete') && (
        <DeleteDamayanFund damayanFund={damayanFund} getDamayanFunds={getDamayanFunds} searchkey={searchKey} sortKey={sortKey} currentPage={currentPage} rowLength={rowLength} />
      )}
      {canDoAction(token.role, permissions, 'damayan fund', 'print') && <PrintDamayanFund damayanFund={damayanFund} />}
      {canDoAction(token.role, permissions, 'damayan fund', 'export') && <ExportEmergencyLoan damayanFund={damayanFund} />}
    </div>
    
  );
};

export default DamayanFundActions;

import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical, print } from 'ionicons/icons';
import { AccessToken, Acknowledgement, ExpenseVoucher } from '../../../../../types/types';
import { canDoAction } from '../../../../utils/permissions';
import { jwtDecode } from 'jwt-decode';
import { TData } from '../Acknowledgement';
import ViewAcknowledgement from '../modals/ViewAcknowledgement';
import UpdateAcknowledgement from '../modals/UpdateExpenseVoucher';
import PrintAcknowledgement from '../modals/prints/PrintAcknowledgement';
import ExportAcknowledgement from '../modals/prints/ExportAcknowledgement';
import DeleteAcknowledgement from '../modals/DeleteAcknowledgement';

type AcknowledgementActionsProps = {
  acknowledgement: Acknowledgement;
  setData: React.Dispatch<React.SetStateAction<TData>>;
  getAcknowledgements: (page: number, keyword?: string, sort?: string, to?: string, from?: string) => {};
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  to: string;
  from: string;
  rowLength: number;
};

const AcknowledgementActions = ({
  acknowledgement,
  setData,
  getAcknowledgements,
  currentPage,
  setCurrentPage,
  searchKey,
  sortKey,
  to,
  from,
  rowLength,
}: AcknowledgementActionsProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')


  return (
    <div>
      {canDoAction(token.role, permissions, 'acknowledgement', 'visible') && <ViewAcknowledgement acknowledgement={acknowledgement} />}
      {canDoAction(token.role, permissions, 'acknowledgement', 'update') && <UpdateAcknowledgement acknowledgement={acknowledgement} setData={setData} getAcknowledgement={getAcknowledgements} currentPage={currentPage} />}
      {canDoAction(token.role, permissions, 'acknowledgement', 'delete') && (
        <DeleteAcknowledgement
          acknowledgement={acknowledgement}
          getAcknowledgements={getAcknowledgements}
          searchkey={searchKey}
          sortKey={sortKey}
          currentPage={currentPage}
          rowLength={rowLength}
        />
      )}
      {canDoAction(token.role, permissions, 'acknowledgement', 'print') && <PrintAcknowledgement acknowledgement={acknowledgement} />}
      {canDoAction(token.role, permissions, 'acknowledgement', 'export') && <ExportAcknowledgement acknowledgement={acknowledgement} />}
    </div>
    
  );
};

export default AcknowledgementActions;

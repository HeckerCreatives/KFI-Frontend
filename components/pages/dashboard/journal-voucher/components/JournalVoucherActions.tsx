import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical } from 'ionicons/icons';
import ViewJournalVoucher from '../modals/ViewJournalVoucher';
import UpdateJournalVoucher from '../modals/UpdateJournalVoucher';
import DeleteJournalVoucher from '../modals/DeleteJournalVoucher';
import { AccessToken, JournalVoucher } from '../../../../../types/types';
import { jwtDecode } from 'jwt-decode';
import { canDoAction } from '../../../../utils/permissions';
import { TData } from '../JournalVoucher';
import PrintJournalVoucher from '../modals/prints/PrintJournalVoucher';
import ExportJournalVoucher from '../modals/prints/ExportJournalVoucher';
import { Ellipsis } from 'lucide-react';

type JournalVoucherActionsProps = {
  journalVoucher: JournalVoucher;
  setData: React.Dispatch<React.SetStateAction<TData>>;
  getJournalVouchers: (page: number, keyword?: string, sort?: string, to?: string, from?: string) => {};
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  to: string;
  from: string;
  rowLength: number;
};

const JournalVoucherActions = ({
  journalVoucher,
  setData,
  getJournalVouchers,
  currentPage,
  setCurrentPage,
  searchKey,
  sortKey,
  to,
  from,
  rowLength,
}: JournalVoucherActionsProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')
    const triggerId = `expensevoucher-action-trigger-${journalVoucher._id}`;

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

          {canDoAction(token.role, permissions, 'journal voucher', 'visible') && <ViewJournalVoucher journalVoucher={journalVoucher} />}
          {canDoAction(token.role, permissions, 'journal voucher', 'update') && <UpdateJournalVoucher journalVoucher={journalVoucher} setData={setData} getList={getJournalVouchers} currentPage={currentPage} />}
          {canDoAction(token.role, permissions, 'journal voucher', 'delete') && (
            <DeleteJournalVoucher
              journalVoucher={journalVoucher}
              getJournalVouchers={getJournalVouchers}
              searchkey={searchKey}
              sortKey={sortKey}
              currentPage={currentPage}
              rowLength={rowLength}
            />
          )}
          {canDoAction(token.role, permissions, 'journal voucher', 'print') && <PrintJournalVoucher journalVoucher={journalVoucher} />}
          {canDoAction(token.role, permissions, 'expense voucher', 'export') && <ExportJournalVoucher journalVoucher={journalVoucher} />}
       </div>
       </IonContent>
     </IonPopover>
    </>
  
   
  );
};

export default JournalVoucherActions;

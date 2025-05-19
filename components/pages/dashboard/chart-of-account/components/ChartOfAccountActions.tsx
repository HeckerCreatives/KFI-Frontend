import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import UpdateChartOfAccount from '../modals/UpdateChartOfAccount';
import DeleteChartOfAccount from '../modals/DeleteChartOfAccount';
import { ellipsisVertical, print } from 'ionicons/icons';
import { AccessToken, ChartOfAccount } from '../../../../../types/types';
import { TChartOfAccount } from '../ChartOfAccount';
import { jwtDecode } from 'jwt-decode';
import { canDoAction } from '../../../../utils/permissions';

type ChartOfAccountActionsProps = {
  chartAccount: ChartOfAccount;
  setData: React.Dispatch<React.SetStateAction<TChartOfAccount>>;
  getChartOfAccounts: (page: number, keyword?: string, sort?: string) => {};
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  rowLength: number;
};

const ChartOfAccountActions = ({ chartAccount, setData, getChartOfAccounts, currentPage, setCurrentPage, searchKey, sortKey, rowLength }: ChartOfAccountActionsProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  return (
    <>
      <IonButton fill="clear" id={`coa-${chartAccount._id}`} className="[--padding-start:0] [--padding-end:0] [--padding-top:0] [--padding-bottom:0] min-h-5">
        <IonIcon icon={ellipsisVertical} className="text-[#FA6C2F]" />
      </IonButton>
      <IonPopover showBackdrop={false} trigger={`coa-${chartAccount._id}`} triggerAction="click" className="[--max-width:10rem]">
        <IonContent>
          {canDoAction(token.role, token.permissions, 'chart of account', 'update') && <UpdateChartOfAccount chartAccount={chartAccount} setData={setData} />}
          {canDoAction(token.role, token.permissions, 'chart of account', 'delete') && (
            <DeleteChartOfAccount
              chartAccount={chartAccount}
              getChartOfAccounts={getChartOfAccounts}
              searchkey={searchKey}
              sortKey={sortKey}
              currentPage={currentPage}
              rowLength={rowLength}
            />
          )}
          {canDoAction(token.role, token.permissions, 'chart of account', 'print') && (
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

export default ChartOfAccountActions;

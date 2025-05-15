import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import UpdateChartOfAccount from '../modals/UpdateChartOfAccount';
import DeleteChartOfAccount from '../modals/DeleteChartOfAccount';
import { ellipsisVertical } from 'ionicons/icons';
import { ChartOfAccount } from '../../../../../types/types';
import { TChartOfAccount } from '../ChartOfAccount';

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
  return (
    <>
      <IonButton fill="clear" id={`coa-${chartAccount._id}`} className="[--padding-start:0] [--padding-end:0] [--padding-top:0] [--padding-bottom:0] min-h-5">
        <IonIcon icon={ellipsisVertical} className="text-[#FA6C2F]" />
      </IonButton>
      <IonPopover showBackdrop={false} trigger={`coa-${chartAccount._id}`} triggerAction="click" className="[--max-width:10rem]">
        <IonContent>
          <UpdateChartOfAccount chartAccount={chartAccount} setData={setData} />
          <DeleteChartOfAccount
            chartAccount={chartAccount}
            getChartOfAccounts={getChartOfAccounts}
            searchkey={searchKey}
            sortKey={sortKey}
            currentPage={currentPage}
            rowLength={rowLength}
          />
        </IonContent>
      </IonPopover>
    </>
  );
};

export default ChartOfAccountActions;

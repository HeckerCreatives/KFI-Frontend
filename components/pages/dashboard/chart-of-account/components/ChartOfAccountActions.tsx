import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical, link, print } from 'ionicons/icons';
import { AccessToken, ChartOfAccount } from '../../../../../types/types';
import { TChartOfAccount } from '../ChartOfAccount';
import { jwtDecode } from 'jwt-decode';
import { canDoAction } from '../../../../utils/permissions';
import LinkChartOfAccount from '../modals/LinkChartOfAccount';

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
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')

  return (
    <div>{canDoAction(token.role, permissions, 'chart of account', 'update') && <LinkChartOfAccount chartAccount={chartAccount} setData={setData} getChartOfAccounts={getChartOfAccounts} currentPage={currentPage} />}</div>
    
  );
};

export default ChartOfAccountActions;

import { IonContent, IonPage, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import PageTitle from '../../../ui/page/PageTitle';
import CreateGroupAccount from './modals/CreateGroupAccount';
import GroupAccountFilter from './components/GroupAccountFilter';
import GroupAccountActions from './components/GroupAccountActions';
import { AccessToken, GroupAccount as GroupAccountType, TTableFilter } from '../../../../types/types';
import { TABLE_LIMIT } from '../../../utils/constants';
import kfiAxios from '../../../utils/axios';
import TablePagination from '../../../ui/forms/TablePagination';
import TableLoadingRow from '../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../ui/forms/TableNoRows';
import { jwtDecode } from 'jwt-decode';
import { canDoAction, haveActions } from '../../../utils/permissions';

export type TGroupAccount = {
  groupAccounts: GroupAccountType[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const GroupAccount = () => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const [present] = useIonToast();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKey, setSearchKey] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('');

  const [data, setData] = useState<TGroupAccount>({
    groupAccounts: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  const getGroupAccounts = async (page: number, keyword: string = '', sort: string = '') => {
    setData(prev => ({ ...prev, loading: true }));
    try {
      const filter: TTableFilter = { limit: TABLE_LIMIT, page };
      if (keyword) filter.search = keyword;
      if (sort) filter.sort = sort;
      const result = await kfiAxios.get('/group-account', { params: filter });
      const { success, groupAccounts, hasPrevPage, hasNextPage, totalPages } = result.data;
      if (success) {
        setData(prev => ({
          ...prev,
          groupAccounts: groupAccounts,
          totalPages: totalPages,
          nextPage: hasNextPage,
          prevPage: hasPrevPage,
        }));
        setCurrentPage(page);
        setSearchKey(keyword);
        setSortKey(sort);
        return;
      }
    } catch (error) {
      present({
        message: 'Failed to get group account records. Please try again',
        duration: 1000,
      });
    } finally {
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  const handlePagination = (page: number) => getGroupAccounts(page, searchKey, sortKey);

  useIonViewWillEnter(() => {
    getGroupAccounts(currentPage);
  });

  return (
    <IonPage className="">
      <IonContent className="[--background:#F1F1F1]" fullscreen>
        <div className="h-full flex flex-col items-stretch justify-start">
          <PageTitle pages={['System', 'Loan Products', 'Group Account']} />
          <div className="px-3 pb-3 flex-1 flex flex-col">
            <div className="flex items-center justify-center gap-3 bg-white px-3 py-2 rounded-2xl shadow-lg my-3">
              <div>{canDoAction(token.role, token.permissions, 'group of account', 'create') && <CreateGroupAccount getGroupAccounts={getGroupAccounts} />}</div>
              <GroupAccountFilter getGroupAccounts={getGroupAccounts} />
            </div>

            <div className="px-3 pt-3 pb-5 bg-white rounded-xl flex-1 shadow-lg">
              <div className="relative overflow-auto rounded-xl">
                <Table>
                  <TableHeader>
                    <TableHeadRow>
                      <TableHead>Group Account</TableHead>
                      {haveActions(token.role, 'group of account', token.permissions, ['update', 'delete']) && <TableHead>Actions</TableHead>}
                    </TableHeadRow>
                  </TableHeader>
                  <TableBody>
                    {data.loading && <TableLoadingRow colspan={2} />}
                    {!data.loading && data.groupAccounts.length < 1 && <TableNoRows label="No Group Account Record Found" colspan={2} />}
                    {!data.loading &&
                      data.groupAccounts.length > 0 &&
                      data.groupAccounts.map((groupAccount: GroupAccountType) => (
                        <TableRow key={groupAccount._id}>
                          <TableCell>{groupAccount.code}</TableCell>
                          {haveActions(token.role, 'group of account', token.permissions, ['update', 'delete']) && (
                            <TableCell>
                              <GroupAccountActions
                                groupAccount={groupAccount}
                                setData={setData}
                                getGroupAccounts={getGroupAccounts}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                searchKey={searchKey}
                                sortKey={sortKey}
                                rowLength={data.groupAccounts.length}
                              />
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
          <TablePagination currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePagination} disabled={data.loading} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default GroupAccount;

import { IonContent, IonPage, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import PageTitle from '../../../ui/page/PageTitle';
import { Activity, TTableFilter } from '../../../../types/types';
import { TABLE_LIMIT } from '../../../utils/constants';
import kfiAxios from '../../../utils/axios';
import TablePagination from '../../../ui/forms/TablePagination';
import TableLoadingRow from '../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../ui/forms/TableNoRows';
import { formatDateTable } from '../../../utils/date-utils';
import ActionLogFilter from './components/ActionLogFilter';

export type TActivity = {
  actions: Activity[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const ActionLogs = () => {
  const [present] = useIonToast();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKey, setSearchKey] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('');

  const [data, setData] = useState<TActivity>({
    actions: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  const getActions = async (page: number, keyword: string = '', sort: string = '') => {
    setData(prev => ({ ...prev, loading: true }));
    try {
      const filter: TTableFilter = { limit: TABLE_LIMIT, page };
      if (keyword) filter.search = keyword;
      if (sort) filter.sort = sort;
      const result = await kfiAxios.get('/activity-log', { params: filter });
      const { success, activities, hasPrevPage, hasNextPage, totalPages } = result.data;
      if (success) {
        setData(prev => ({
          ...prev,
          actions: activities,
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
        message: 'Failed to get bank records. Please try again',
        duration: 1000,
      });
    } finally {
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  const handlePagination = (page: number) => getActions(page, searchKey, sortKey);

  useIonViewWillEnter(() => {
    getActions(currentPage);
  });

  return (
    <IonPage className="w-full flex items-center justify-center h-full bg-zinc-100">
      <IonContent className="[--background:#F4F4F5] max-w-[1920px] h-full" fullscreen>
        <div className="h-full flex flex-col gap-4 py-6 items-stretch justify-start">
          <PageTitle pages={['Diagnostics', 'Action Logs']} />
          <div className="p-4 flex-1 bg-white rounded-xl shadow-lg">
            <div className="flex items-center justify-center">
              <ActionLogFilter getActions={getActions} />
            </div>
            <div className="relative overflow-auto mt-4">
              <Table>
                <TableHeader>
                  <TableHeadRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Execution Date</TableHead>
                  </TableHeadRow>
                </TableHeader>
                <TableBody>
                  {data.loading && <TableLoadingRow colspan={4} />}
                  {!data.loading && data.actions.length < 1 && <TableNoRows label="No Action Record Found" colspan={4} />}
                  {!data.loading &&
                    data.actions.length > 0 &&
                    data.actions.map((action: Activity) => (
                      <TableRow key={action._id}>
                        <TableCell>{action.username}</TableCell>
                        <TableCell>{action.activity}</TableCell>
                        <TableCell>{action.resource}</TableCell>
                        <TableCell>{formatDateTable(action.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <TablePagination currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePagination} disabled={data.loading} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ActionLogs;

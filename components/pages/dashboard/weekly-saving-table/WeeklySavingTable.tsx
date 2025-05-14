import { IonContent, IonPage, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import PageTitle from '../../../ui/page/PageTitle';
import CreateWeeklySavingTable from './modals/CreateWeeklySavingTable';
import WeeklySavingTableFilter from './components/WeeklySavingTableFilter';
import WeeklySavingTableActions from './components/WeeklySavingTableActions';
import { TTableFilter, WeeklySavings } from '../../../../types/types';
import { TABLE_LIMIT } from '../../../utils/constants';
import kfiAxios from '../../../utils/axios';
import TablePagination from '../../../ui/forms/TablePagination';
import TableLoadingRow from '../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../ui/forms/TableNoRows';
import { formatNumber } from '../../../ui/utils/formatNumber';

export type TWeeklySavingsTable = {
  savings: WeeklySavings[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const WeeklySavingTable = () => {
  const arrDummy: string[] = Array.from(Array(10)).fill('');

  const [present] = useIonToast();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKey, setSearchKey] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('');

  const [data, setData] = useState<TWeeklySavingsTable>({
    savings: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  const getWeeklySavings = async (page: number, keyword: string = '', sort: string = '') => {
    setData(prev => ({ ...prev, loading: true }));
    try {
      const filter: TTableFilter = { limit: TABLE_LIMIT, page };
      if (keyword) filter.search = keyword;
      if (sort) filter.sort = sort;
      const result = await kfiAxios.get('/weekly-saving', { params: filter });
      const { success, weelySavings, hasPrevPage, hasNextPage, totalPages } = result.data;
      if (success) {
        setData(prev => ({
          ...prev,
          savings: weelySavings,
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
        message: 'Failed to get weekly saving records. Please try again',
        duration: 1000,
      });
    } finally {
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  const handlePagination = (page: number) => getWeeklySavings(page, searchKey, sortKey);

  useIonViewWillEnter(() => {
    getWeeklySavings(currentPage);
  });

  return (
    <IonPage className="">
      <IonContent className="[--background:#F1F1F1]" fullscreen>
        <div className="h-full flex flex-col items-stretch justify-start">
          <PageTitle pages={['All Files', 'Weekly Saving Table']} />
          <div className="px-3 pb-3 flex-1">
            <div className="flex items-center justify-center gap-3 bg-white px-3 py-2 rounded-2xl shadow-lg mt-3 mb-4">
              <CreateWeeklySavingTable getWeeklySavings={getWeeklySavings} />
              <WeeklySavingTableFilter getWeeklySavings={getWeeklySavings} />
            </div>
            <div className="relative overflow-auto">
              <Table>
                <TableHeader>
                  <TableHeadRow>
                    <TableHead>Range Amount From</TableHead>
                    <TableHead>Range Amount To</TableHead>
                    <TableHead>WSF</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableHeadRow>
                </TableHeader>
                <TableBody>
                  {data.loading && <TableLoadingRow colspan={4} />}
                  {!data.loading && data.savings.length < 1 && <TableNoRows label="No Weekly Saving Record Found" colspan={4} />}
                  {!data.loading &&
                    data.savings.length > 0 &&
                    data.savings.map((saving: WeeklySavings) => (
                      <TableRow key={saving._id}>
                        <TableCell>{formatNumber(saving.rangeAmountFrom)}</TableCell>
                        <TableCell>{formatNumber(saving.rangeAmountTo)}</TableCell>
                        <TableCell>{formatNumber(saving.weeklySavingsFund)}</TableCell>
                        <TableCell>
                          <WeeklySavingTableActions
                            saving={saving}
                            setData={setData}
                            getWeeklySavings={getWeeklySavings}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            searchKey={searchKey}
                            sortKey={sortKey}
                            rowLength={data.savings.length}
                          />
                        </TableCell>
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

export default WeeklySavingTable;

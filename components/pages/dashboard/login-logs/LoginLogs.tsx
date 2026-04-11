import { IonContent, IonInput, IonPage, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import PageTitle from '../../../ui/page/PageTitle';
import { Activity, TTableFilter } from '../../../../types/types';
import { TABLE_LIMIT } from '../../../utils/constants';
import kfiAxios from '../../../utils/axios';
import TablePagination from '../../../ui/forms/TablePagination';
import TableLoadingRow from '../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../ui/forms/TableNoRows';
import { formatDateTable } from '../../../utils/date-utils';
import Paginations from '../../../ui/common/PaginationsV2';
import { ArrowDown, ArrowUp } from 'lucide-react';

export type TActivity = {
  logs: any[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const SORTS = {
  DATE_ASC: 'date-asc',
  DATE_DESC: 'date-desc',
}

const LoginLogs = () => {
  const [present] = useIonToast();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKey, setSearchKey] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('date-desc');
  const [date, setDate] = useState<string>('');

  const [data, setData] = useState<TActivity>({
    logs: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  const getActions = async (page: number, keyword: string = '', sort: string = 'date-desc') => {
    setData(prev => ({ ...prev, loading: true }));
    try {
      const filter: TTableFilter = { limit: TABLE_LIMIT, page };
      if (keyword) filter.search = keyword;
      if (sort) filter.sort = sort;
      if(date) filter.date = date;
      const result = await kfiAxios.get('/login-logs', { params: filter });
      const { success, logs, hasPrevPage, hasNextPage, totalPages } = result.data;
      if (success) {
        setData(prev => ({
          ...prev,
          logs: logs,
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
        message: 'Failed to get records. Please try again',
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

  useEffect(() => {
    setCurrentPage(1);
    const timer = setTimeout(() => {
      getActions(1, searchKey, sortKey);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchKey, sortKey, date]);


  return (
    <IonPage className="w-full flex items-center justify-center h-full bg-zinc-100">
      <IonContent className="[--background:#F4F4F5] max-w-[1920px] h-full" fullscreen>
        <div className="h-full flex flex-col gap-4 p-4 items-stretch justify-start">
           <div className=' space-y-1 mb-2'>
              <p className=' text-xl text-gray-700 !font-medium'>Login Logs</p>
              <p className=' text-sm text-gray-500 '>Manage login logs.</p>
            </div>
          <div className="p-4 flex-1 bg-white rounded-xl shadow-lg">

            <div className=' flex flex-wrap items-center gap-2'>
              <div className=' flex flex-col gap-1'>
                <p className=' text-xs text-zinc-600'>Date</p>
                <IonInput placeholder='Select Date' type='date' className='text-xs !bg-white ![--background:white] md:![--padding-bottom:0] ![--padding-top:0] ![--padding-start:0] border border-zinc-300 ![--min-height:0.75rem] !min-h-[0.75rem]  !p-2 !rounded-xl' onIonInput={(e) => setDate(e.detail.value || '')} />

              </div>
              
              <div className=' flex flex-col gap-1'>
                <p className=' text-xs text-zinc-600'>Search</p>
                <IonInput placeholder='Search' className=' text-xs !bg-white ![--background:white] md:![--padding-bottom:0] ![--padding-top:0] ![--padding-start:0] border border-zinc-300 ![--min-height:0.75rem] !min-h-[0.75rem] !p-2 !rounded-xl' onIonInput={(e) => setSearchKey(e.detail.value || '')} />


              </div>

            </div>

            <div className="relative overflow-auto mt-2">
              <Table>
                <TableHeader>
                  <TableHeadRow>
                    <TableHead>Username</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>
                        <div className="flex items-center gap-6">
                           Last login
                           {sortKey === SORTS.DATE_ASC ? (
                             <ArrowUp
                               size={15}
                               onClick={() => setSortKey(SORTS.DATE_DESC)}
                               className="cursor-pointer"
                             />
                           ) : sortKey === SORTS.DATE_DESC ? (
                             <ArrowDown
                               size={15}
                               onClick={() => setSortKey(SORTS.DATE_ASC)}
                               className="cursor-pointer"
                             />
                           ) : (
                             <ArrowUp
                               size={15}
                               onClick={() => setSortKey(SORTS.DATE_ASC)}
                               className="cursor-pointer opacity-30"
                             />
                           )}
                         </div>
                    </TableHead>
                  </TableHeadRow>
                </TableHeader>
                <TableBody>
                  {data.loading && <TableLoadingRow colspan={4} />}
                  {!data.loading && data.logs.length < 1 && <TableNoRows label="No Record Found" colspan={4} />}
                  {!data.loading &&
                    data.logs.length > 0 &&
                    data.logs.map((item: any) => (
                      <TableRow key={item._id}>
                        <TableCell>{item.user.username}</TableCell>
                        <TableCell>{item.ipAddress}</TableCell>
                        <TableCell>{formatDateTable(item.lastLogin)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
         
              {data.logs.length !== 0 && (
                <Paginations currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePagination} disabled={data.loading} />

              )}


            </div>
            <div className=' w-full h-[300px]'></div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginLogs;

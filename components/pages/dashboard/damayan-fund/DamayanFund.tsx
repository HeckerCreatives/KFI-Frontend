import { IonContent, IonPage, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
import PageTitle from '../../../ui/page/PageTitle';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import { canDoAction, haveActions } from '../../../utils/permissions';
import { AccessToken, DamayanFund as DamayanFundType, TTableFilter } from '../../../../types/types';
import { jwtDecode } from 'jwt-decode';
import TableLoadingRow from '../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../ui/forms/TableNoRows';
import { formatDateTable } from '../../../utils/date-utils';
import { formatMoney } from '../../../utils/number';
import TablePagination from '../../../ui/forms/TablePagination';
import { TABLE_LIMIT } from '../../../utils/constants';
import kfiAxios from '../../../utils/axios';
import DamayanFundFilter from './components/DamayanFundFilter';
import CreateDamayanFund from './modals/CreateDamayanFund';
import PrintAllDamayanFund from './modals/prints/PrintAllDamayanFund';
import ExportAllDamayanFund from './modals/prints/ExportAllDamayanFund';
import DamayanFundActions from './components/DamayanFundActions';

export type TData = {
  damayanFunds: DamayanFundType[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const DamayanFund = () => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);

  const [present] = useIonToast();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKey, setSearchKey] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('');
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');

  const [data, setData] = useState<TData>({
    damayanFunds: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  const getDamayanFunds = async (page: number, keyword: string = '', sort: string = '', to: string = '', from: string = '') => {
    setData(prev => ({ ...prev, loading: true }));
    try {
      const filter: TTableFilter & { to?: string; from?: string } = { limit: TABLE_LIMIT, page };
      if (keyword) filter.search = keyword;
      if (sort) filter.sort = sort;
      if (to) filter.to = to;
      if (from) filter.from = from;

      const result = await kfiAxios.get('/damayan-fund', { params: filter });
      const { success, damayanFunds, hasPrevPage, hasNextPage, totalPages } = result.data;
      if (success) {
        setData(prev => ({
          ...prev,
          damayanFunds,
          totalPages: totalPages,
          nextPage: hasNextPage,
          prevPage: hasPrevPage,
        }));
        setCurrentPage(page);
        setSearchKey(keyword);
        setSortKey(sort);
        setFrom(from);
        setTo(to);
        return;
      }
    } catch (error) {
      present({
        message: 'Failed to get damayan fund records. Please try again',
        duration: 1000,
      });
    } finally {
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  const handlePagination = (page: number) => getDamayanFunds(page, searchKey, sortKey);

  useIonViewWillEnter(() => {
    getDamayanFunds(currentPage);
  });

  return (
    <IonPage className="">
      <IonContent className="[--background:#F1F1F1]" fullscreen>
        <div className="h-full flex flex-col items-stretch justify-start">
          <PageTitle pages={['Transaction', 'Damayan Fund']} />
          <div className="px-3 pb-3 flex-1">
            <div className=" bg-white p-3 rounded-2xl shadow-lg mt-3 mb-4 flex flex-col items-end">
              <div className="w-full flex items-end">
                <DamayanFundFilter getDamayanFunds={getDamayanFunds} />
              </div>
              <div className="w-full flex items-start">
                <div>{canDoAction(token.role, token.permissions, 'damayan fund', 'create') && <CreateDamayanFund getDamayanFunds={getDamayanFunds} />}</div>
                <div>{canDoAction(token.role, token.permissions, 'damayan fund', 'print') && <PrintAllDamayanFund />}</div>
                <div>{canDoAction(token.role, token.permissions, 'damayan fund', 'export') && <ExportAllDamayanFund />}</div>
              </div>
            </div>

            <div className="relative overflow-auto">
              <Table>
                <TableHeader>
                  <TableHeadRow>
                    <TableHead>JV Number</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Bank</TableHead>
                    <TableHead>CHK. No.</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Encoded By</TableHead>
                    {haveActions(token.role, 'damayan fund', token.permissions, ['update', 'delete', 'visible', 'print', 'export']) && <TableHead>Actions</TableHead>}
                  </TableHeadRow>
                </TableHeader>
                <TableBody>
                  {data.loading && <TableLoadingRow colspan={8} />}
                  {!data.loading && data.damayanFunds.length < 1 && <TableNoRows label="No Damayan Fund Record Found" colspan={8} />}
                  {!data.loading &&
                    data.damayanFunds.length > 0 &&
                    data.damayanFunds.map((damayanFund: DamayanFundType, i: number) => (
                      <TableRow key={damayanFund._id}>
                        <TableCell>JV#{damayanFund.code}</TableCell>
                        <TableCell>{formatDateTable(damayanFund.date)}</TableCell>
                        <TableCell>{damayanFund.bankCode.description}</TableCell>
                        <TableCell>{damayanFund.checkNo}</TableCell>
                        <TableCell>{formatMoney(damayanFund.amount)}</TableCell>
                        <TableCell>{damayanFund.encodedBy.username}</TableCell>
                        {haveActions(token.role, 'damayan fund', token.permissions, ['update', 'delete', 'visible', 'print', 'export']) && (
                          <TableCell>
                            <DamayanFundActions
                              damayanFund={damayanFund}
                              getDamayanFunds={getDamayanFunds}
                              setData={setData}
                              searchKey={searchKey}
                              sortKey={sortKey}
                              to={to}
                              from={from}
                              currentPage={currentPage}
                              setCurrentPage={setCurrentPage}
                              rowLength={data.damayanFunds.length}
                            />
                          </TableCell>
                        )}
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

export default DamayanFund;

import { IonButton, IonContent, IonPage, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
import PageTitle from '../../../ui/page/PageTitle';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import CreateLoanRelease from './modals/CreateLoanRelease';
import LoanReleaseActions from './components/LoanReleaseActions';
import LoanReleaseFilter from './components/LoanReleaseFilter';
import { jwtDecode } from 'jwt-decode';
import { AccessToken, Transaction, TTableFilter } from '../../../../types/types';
import { canDoAction, haveActions } from '../../../utils/permissions';
import { TABLE_LIMIT } from '../../../utils/constants';
import kfiAxios from '../../../utils/axios';
import TableLoadingRow from '../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../ui/forms/TableNoRows';
import { formatDateTable } from '../../../utils/date-utils';
import { formatMoney } from '../../../utils/number';
import TablePagination from '../../../ui/forms/TablePagination';
import PrintAllLoanRelease from './modals/PrintAllLoanRelease';
import ExportAllLoanRelease from './modals/ExportAllLoanRelease';

export type TData = {
  transactions: Transaction[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const LoanRelease = () => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);

  const [present] = useIonToast();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKey, setSearchKey] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('');
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');

  const [data, setData] = useState<TData>({
    transactions: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  const getTransactions = async (page: number, keyword: string = '', sort: string = '', to: string = '', from: string = '') => {
    setData(prev => ({ ...prev, loading: true }));
    try {
      const filter: TTableFilter & { to?: string; from?: string } = { limit: TABLE_LIMIT, page };
      if (keyword) filter.search = keyword;
      if (sort) filter.sort = sort;
      if (to) filter.to = to;
      if (from) filter.from = from;

      const result = await kfiAxios.get('/transaction/loan-release', { params: filter });
      const { success, transactions, hasPrevPage, hasNextPage, totalPages } = result.data;
      if (success) {
        setData(prev => ({
          ...prev,
          transactions: transactions,
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
        message: 'Failed to get loan release records. Please try again',
        duration: 1000,
      });
    } finally {
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  const handlePagination = (page: number) => getTransactions(page, searchKey, sortKey);

  useIonViewWillEnter(() => {
    getTransactions(currentPage);
  });

  return (
    <IonPage className="">
      <IonContent className="[--background:#F1F1F1]" fullscreen>
        <div className="h-full flex flex-col items-stretch justify-start">
          <PageTitle pages={['Transaction', 'Loan Release']} />
          <div className="px-3 pb-3 flex-1">
            <div className=" bg-white p-3 rounded-2xl shadow-lg mt-3 mb-4 flex flex-col items-end">
              <div className="w-full flex items-end">
                <LoanReleaseFilter getTransactions={getTransactions} />
              </div>
              <div className="w-full flex items-start">
                <div>{canDoAction(token.role, token.permissions, 'loan release', 'create') && <CreateLoanRelease getTransactions={getTransactions} />}</div>
                <div>{canDoAction(token.role, token.permissions, 'loan release', 'print') && <PrintAllLoanRelease />}</div>
                <div>{canDoAction(token.role, token.permissions, 'loan release', 'export') && <ExportAllLoanRelease />}</div>
              </div>
            </div>

            <div className="relative overflow-auto">
              <Table>
                <TableHeader>
                  <TableHeadRow>
                    <TableHead>CV Number</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Bank</TableHead>
                    <TableHead>CHK. No.</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Encoded By</TableHead>
                    {haveActions(token.role, 'loan release', token.permissions, ['update', 'delete', 'visible', 'print', 'export']) && <TableHead>Actions</TableHead>}
                  </TableHeadRow>
                </TableHeader>
                <TableBody>
                  {data.loading && <TableLoadingRow colspan={8} />}
                  {!data.loading && data.transactions.length < 1 && <TableNoRows label="No Loan Release Record Found" colspan={8} />}
                  {!data.loading &&
                    data.transactions.length > 0 &&
                    data.transactions.map((transaction: Transaction, i: number) => (
                      <TableRow key={transaction._id}>
                        <TableCell>CV#{transaction.code}</TableCell>
                        <TableCell>{formatDateTable(transaction.date)}</TableCell>
                        <TableCell className="max-w-52 truncate">{transaction.bank.description}</TableCell>
                        <TableCell>{transaction.checkNo}</TableCell>
                        <TableCell>{formatMoney(transaction.amount)}</TableCell>
                        <TableCell>{transaction.encodedBy.username}</TableCell>
                        {haveActions(token.role, 'loan release', token.permissions, ['update', 'delete', 'visible', 'print', 'export']) && (
                          <TableCell>
                            <LoanReleaseActions
                              transaction={transaction}
                              getTransactions={getTransactions}
                              setData={setData}
                              searchKey={searchKey}
                              sortKey={sortKey}
                              to={to}
                              from={from}
                              currentPage={currentPage}
                              setCurrentPage={setCurrentPage}
                              rowLength={data.transactions.length}
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

export default LoanRelease;

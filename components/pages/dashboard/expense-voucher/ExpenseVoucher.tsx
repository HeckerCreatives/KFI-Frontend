import { IonContent, IonPage, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
import PageTitle from '../../../ui/page/PageTitle';
import CreateExpenseVoucher from './modals/CreateExpenseVoucher';
import ExpenseVoucherFilter from './components/ExpenseVoucherFilter';
import ExpenseVoucherActions from './components/ExpenseVoucherActions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import { AccessToken, ExpenseVoucher as ExpenseVoucherType, TTableFilter } from '../../../../types/types';
import { jwtDecode } from 'jwt-decode';
import { TABLE_LIMIT } from '../../../utils/constants';
import kfiAxios from '../../../utils/axios';
import { formatDateTable } from '../../../utils/date-utils';
import { formatNumber } from '../../../ui/utils/formatNumber';
import { canDoAction, haveActions } from '../../../utils/permissions';
import TableLoadingRow from '../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../ui/forms/TableNoRows';
import TablePagination from '../../../ui/forms/TablePagination';
import PrintAllExpenseVoucher from './modals/prints/PrintAllExpenseVoucher';
import ExportAllExpenseVoucher from './modals/prints/ExportAllExpenseVoucher';

export type TData = {
  expenseVouchers: ExpenseVoucherType[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const ExpenseVoucher = () => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);

  const [present] = useIonToast();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKey, setSearchKey] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('');
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');

  const [data, setData] = useState<TData>({
    expenseVouchers: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  const getExpenseVouchers = async (page: number, keyword: string = '', sort: string = '', to: string = '', from: string = '') => {
    setData(prev => ({ ...prev, loading: true }));
    try {
      const filter: TTableFilter & { to?: string; from?: string } = { limit: TABLE_LIMIT, page };
      if (keyword) filter.search = keyword;
      if (sort) filter.sort = sort;
      if (to) filter.to = to;
      if (from) filter.from = from;

      const result = await kfiAxios.get('/expense-voucher', { params: filter });
      const { success, expenseVouchers, hasPrevPage, hasNextPage, totalPages } = result.data;
      if (success) {
        setData(prev => ({
          ...prev,
          expenseVouchers: expenseVouchers,
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
        message: 'Failed to get expense voucher records. Please try again',
        duration: 1000,
      });
    } finally {
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  const handlePagination = (page: number) => getExpenseVouchers(page, searchKey, sortKey);

  useIonViewWillEnter(() => {
    getExpenseVouchers(currentPage);
  });
  return (
    <IonPage className="">
      <IonContent className="[--background:#F1F1F1]" fullscreen>
        <div className="h-full flex flex-col items-stretch justify-start">
          <PageTitle pages={['Transaction', 'Expense Voucher']} />
          <div className="px-3 pb-3 flex-1 flex flex-col">
            <div className=" bg-white p-3 rounded-2xl shadow-lg my-3 flex flex-col lg:flex-row-reverse gap-2 flex-wrap">
              <div className="w-full flex-1 flex items-center justify-end">
                <ExpenseVoucherFilter getExpenseVouchers={getExpenseVouchers} />
              </div>
              <div className="flex items-start w-fit">
                <div>{canDoAction(token.role, token.permissions, 'expense voucher', 'create') && <CreateExpenseVoucher getExpenseVouchers={getExpenseVouchers} />}</div>
                <div>{canDoAction(token.role, token.permissions, 'expense voucher', 'print') && <PrintAllExpenseVoucher />}</div>
                <div>{canDoAction(token.role, token.permissions, 'expense voucher', 'export') && <ExportAllExpenseVoucher />}</div>
              </div>
            </div>

            <div className="px-3 pt-3 pb-5 bg-white rounded-xl flex-1 shadow-lg">
              <div className="relative overflow-auto rounded-xl">
                <Table>
                  <TableHeader>
                    <TableHeadRow>
                      <TableHead>Doc. No.</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Bank</TableHead>
                      <TableHead>CHK. No.</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Encoded By</TableHead>
                      {haveActions(token.role, 'expense voucher', token.permissions, ['update', 'delete', 'visible', 'print', 'export']) && <TableHead>Actions</TableHead>}
                    </TableHeadRow>
                  </TableHeader>
                  <TableBody>
                    {data.loading && <TableLoadingRow colspan={8} />}
                    {!data.loading && data.expenseVouchers.length < 1 && <TableNoRows label="No Expense Voucher Record Found" colspan={8} />}
                    {!data.loading &&
                      data.expenseVouchers.map((expenseVoucher: ExpenseVoucherType, i: number) => (
                        <TableRow key={expenseVoucher._id}>
                          <TableCell>{expenseVoucher.code}</TableCell>
                          <TableCell>{formatDateTable(expenseVoucher.date)}</TableCell>
                          <TableCell>{expenseVoucher.bankCode.description}</TableCell>
                          <TableCell>{expenseVoucher.checkNo}</TableCell>
                          <TableCell>{formatNumber(expenseVoucher.amount)}</TableCell>
                          <TableCell>{expenseVoucher.encodedBy.username}</TableCell>
                          {haveActions(token.role, 'expense voucher', token.permissions, ['update', 'delete', 'visible', 'print', 'export']) && (
                            <TableCell>
                              <ExpenseVoucherActions
                                expenseVoucher={expenseVoucher}
                                getExpenseVouchers={getExpenseVouchers}
                                setData={setData}
                                searchKey={searchKey}
                                sortKey={sortKey}
                                to={to}
                                from={from}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                rowLength={data.expenseVouchers.length}
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

export default ExpenseVoucher;

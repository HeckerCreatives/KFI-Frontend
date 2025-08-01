import { IonContent, IonPage, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
import PageTitle from '../../../ui/page/PageTitle';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import CreateJournalVoucher from './modals/CreateJournalVoucher';
import JournalVoucherFilter from './components/JournalVoucherFilter';
import JournalVoucherActions from './components/JournalVoucherActions';
import kfiAxios from '../../../utils/axios';
import { AccessToken, JournalVoucher as JournalVoucherType, TTableFilter } from '../../../../types/types';
import { TABLE_LIMIT } from '../../../utils/constants';
import { jwtDecode } from 'jwt-decode';
import { canDoAction, haveActions } from '../../../utils/permissions';
import TableLoadingRow from '../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../ui/forms/TableNoRows';
import { formatDateTable } from '../../../utils/date-utils';
import { formatNumber } from '../../../ui/utils/formatNumber';
import PrintAllJournalVoucher from './modals/prints/PrintAllJournalVoucher';
import ExportAllJournalVoucher from './modals/prints/ExportAllJournalVoucher';
import TablePagination from '../../../ui/forms/TablePagination';

export type TData = {
  journalVouchers: JournalVoucherType[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const JournalVoucher = () => {
  const arrDummy: string[] = Array.from(Array(10)).fill('');

  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);

  const [present] = useIonToast();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKey, setSearchKey] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('');
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');

  const [data, setData] = useState<TData>({
    journalVouchers: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  const getJournalVouchers = async (page: number, keyword: string = '', sort: string = '', to: string = '', from: string = '') => {
    setData(prev => ({ ...prev, loading: true }));
    try {
      const filter: TTableFilter & { to?: string; from?: string } = { limit: TABLE_LIMIT, page };
      if (keyword) filter.search = keyword;
      if (sort) filter.sort = sort;
      if (to) filter.to = to;
      if (from) filter.from = from;

      const result = await kfiAxios.get('/journal-voucher', { params: filter });
      const { success, journalVouchers, hasPrevPage, hasNextPage, totalPages } = result.data;
      if (success) {
        setData(prev => ({
          ...prev,
          journalVouchers: journalVouchers,
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
        message: 'Failed to get journal voucher records. Please try again',
        duration: 1000,
      });
    } finally {
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  const handlePagination = (page: number) => getJournalVouchers(page, searchKey, sortKey);

  useIonViewWillEnter(() => {
    getJournalVouchers(currentPage);
  });

  return (
    <IonPage className="">
      <IonContent className="[--background:#F1F1F1]" fullscreen>
        <div className="h-full flex flex-col items-stretch justify-start">
          <PageTitle pages={['Transaction', 'Journal Voucher']} />

          <div className="px-3 pb-3 flex-1 flex flex-col">
            <div className=" bg-white p-3 rounded-2xl shadow-lg my-3 flex flex-col lg:flex-row-reverse gap-2 flex-wrap">
              <div className="w-full flex-1 flex items-center justify-end">
                <JournalVoucherFilter getJournalVouchers={getJournalVouchers} />
              </div>
              <div className="flex items-start">
                <div>{canDoAction(token.role, token.permissions, 'journal voucher', 'create') && <CreateJournalVoucher getJournalVouchers={getJournalVouchers} />}</div>
                <div>{canDoAction(token.role, token.permissions, 'journal voucher', 'print') && <PrintAllJournalVoucher />}</div>
                <div>{canDoAction(token.role, token.permissions, 'journal voucher', 'export') && <ExportAllJournalVoucher />}</div>
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
                      {haveActions(token.role, 'journal voucher', token.permissions, ['update', 'delete', 'visible', 'print', 'export']) && <TableHead>Actions</TableHead>}
                    </TableHeadRow>
                  </TableHeader>
                  <TableBody>
                    {data.loading && <TableLoadingRow colspan={8} />}
                    {!data.loading && data.journalVouchers.length < 1 && <TableNoRows label="No Journal Voucher Record Found" colspan={8} />}
                    {!data.loading &&
                      data.journalVouchers.map((journalVoucher: JournalVoucherType, i: number) => (
                        <TableRow key={journalVoucher._id}>
                          <TableCell>JV#{journalVoucher.code}</TableCell>
                          <TableCell>{formatDateTable(journalVoucher.date)}</TableCell>
                          <TableCell>{journalVoucher.bankCode.description}</TableCell>
                          <TableCell>{journalVoucher.checkNo}</TableCell>
                          <TableCell>{formatNumber(journalVoucher.amount)}</TableCell>
                          <TableCell>{journalVoucher.encodedBy.username}</TableCell>
                          {haveActions(token.role, 'expense voucher', token.permissions, ['update', 'delete', 'visible', 'print', 'export']) && (
                            <TableCell>
                              <JournalVoucherActions
                                journalVoucher={journalVoucher}
                                getJournalVouchers={getJournalVouchers}
                                setData={setData}
                                searchKey={searchKey}
                                sortKey={sortKey}
                                to={to}
                                from={from}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                rowLength={data.journalVouchers.length}
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

export default JournalVoucher;

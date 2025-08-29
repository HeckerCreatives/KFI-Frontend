import { IonButton, IonContent, IonIcon, IonPage, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import PageTitle from '../../../ui/page/PageTitle';
import CreateLoan from './modals/CreateLoan';
import LoanFilter from './components/LoanFilter';
import LoanActions from './components/LoanActions';
import kfiAxios from '../../../utils/axios';
import { AccessToken, Loan, TTableFilter } from '../../../../types/types';
import TablePagination from '../../../ui/forms/TablePagination';
import { TABLE_LIMIT } from '../../../utils/constants';
import TableNoRows from '../../../ui/forms/TableNoRows';
import TableLoadingRow from '../../../ui/forms/TableLoadingRow';
import { jwtDecode } from 'jwt-decode';
import { canDoAction, haveActions } from '../../../utils/permissions';

export type TLoan = {
  loans: Loan[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const Loans = () => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const [present] = useIonToast();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKey, setSearchKey] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('');

  const [data, setData] = useState<TLoan>({
    loans: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  const getLoans = async (page: number, keyword: string = '', sort: string = '') => {
    setData(prev => ({ ...prev, loading: true }));
    try {
      const filter: TTableFilter = { limit: TABLE_LIMIT, page };
      if (keyword) filter.search = keyword;
      if (sort) filter.sort = sort;
      const result = await kfiAxios.get('/loan', { params: filter });
      const { success, loans, hasPrevPage, hasNextPage, totalPages } = result.data;
      if (success) {
        setData(prev => ({
          ...prev,
          loans: loans,
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
        message: 'Failed to get loan records. Please try again',
        duration: 1000,
      });
    } finally {
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  const handlePagination = (page: number) => getLoans(page, searchKey, sortKey);

  useIonViewWillEnter(() => {
    getLoans(currentPage);
  });

  return (
    <IonPage className="w-full flex items-center justify-center h-full bg-zinc-100">
      <IonContent className="[--background:#F4F4F5] max-w-[1920px] h-full" fullscreen>
        <div className="h-full flex flex-col gap-4 py-6 items-stretch justify-start">
          <PageTitle pages={['System', 'Loan Product', 'Product']} />
          <div className="px-3 pb-3 flex-1 flex flex-col">
            

            <div className=" p-4 pb-5 bg-white rounded-xl flex-1 shadow-lg">

              <div className="flex flex-col lg:flex-row items-start justify-start flex-wrap gap-2">
                <div>{canDoAction(token.role, token.permissions, 'product', 'create') && <CreateLoan getLoans={getLoans} />}</div>
                <LoanFilter getLoans={getLoans} />
              </div>
              <div className="relative overflow-auto rounded-xl mt-4">
                <Table>
                  <TableHeader>
                    <TableHeadRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Description</TableHead>
                      {haveActions(token.role, 'product', token.permissions, ['update', 'delete', 'visible']) && <TableHead>Actions</TableHead>}
                    </TableHeadRow>
                  </TableHeader>
                  <TableBody>
                    {data.loading && <TableLoadingRow colspan={3} />}
                    {!data.loading && data.loans.length < 1 && <TableNoRows label="No Product Record Found" colspan={3} />}
                    {!data.loading &&
                      data.loans.length > 0 &&
                      data.loans.map((loan: Loan) => (
                        <TableRow key={loan._id}>
                          <TableCell>{loan.code}</TableCell>
                          <TableCell>{loan.description}</TableCell>
                          {haveActions(token.role, 'product', token.permissions, ['update', 'delete', 'visible']) && (
                            <TableCell>
                              <LoanActions
                                loan={loan}
                                setData={setData}
                                getLoans={getLoans}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                searchKey={searchKey}
                                sortKey={sortKey}
                                rowLength={data.loans.length}
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

export default Loans;

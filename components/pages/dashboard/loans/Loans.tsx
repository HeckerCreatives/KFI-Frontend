import { IonButton, IonContent, IonIcon, IonPage, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useEffect, useState } from 'react';
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
import { useOnlineStore } from '../../../../store/onlineStore';
import { db } from '../../../../database/db';
import { filterAndSortProducts } from '../../../ui/utils/sort';
import { ArrowDown, ArrowUp, Upload } from 'lucide-react';
import Paginations from '../../../ui/common/PaginationsV2';

export type TLoan = {
  loans: Loan[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const SORTS = {
  CODE_ASC: 'code-asc',
  CODE_DESC: 'code-desc',
}


const Loans = () => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')
  

  const [present] = useIonToast();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKey, setSearchKey] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('');
  const online = useOnlineStore((state) => state.online);
  const [uploading, setUploading] = useState<boolean>(false)

  const [data, setData] = useState<TLoan>({
    loans: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  const getLoans = async (page: number, keyword: string = '', sort: string = '') => {
   if(online){
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
   } else {
    setData(prev => ({ ...prev, loading: true }));
    try {
      const limit = TABLE_LIMIT;
      let data = await db.productLoans.toArray();
      console.log(data)
      const filteredData = data.filter(e => e.action !== 'delete');
      let allData = filterAndSortProducts(filteredData, keyword, sort);
      const totalItems = allData.length;
      const totalPages = Math.ceil(totalItems / limit);
      const start = (page - 1) * limit;
      const end = start + limit;
      const finalData = allData.slice(start, end);
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;
      setData(prev => ({
        ...prev,
        loans: finalData,
        totalPages,
        prevPage: hasPrevPage,
        nextPage: hasNextPage,
      }));
      setCurrentPage(page);
      setSearchKey(keyword);
      setSortKey(sort);
    } catch (error) {
      console.log(error)
      present({
        message: 'Failed to load records.',
        duration: 1000,
      });
    } finally {
      setData(prev => ({ ...prev, loading: false }));
    }
   }
  };


  const handlePagination = (page: number) => setCurrentPage(page);

  useIonViewWillEnter(() => {
    getLoans(currentPage);
  });

  useEffect(() => {
     setCurrentPage(1);
     getLoans(1, searchKey, sortKey);
   }, [searchKey, sortKey]);
   
   useEffect(() => {
     getLoans(currentPage, searchKey, sortKey);
   }, [currentPage]);
 

  return (
    <IonPage className="w-full flex items-center justify-center h-full bg-zinc-100">
      <IonContent className="[--background:#F4F4F5] max-w-[1920px] h-full" fullscreen>
        <div className="h-full flex flex-col gap-4 py-6 items-stretch justify-start">
          <div className="px-3 pb-3 flex-1 flex flex-col">

             <div className=' space-y-1 mb-6'>
              {/* <PageTitle pages={['Dashboard']} /> */}
              <p className=' text-xl text-gray-700 !font-medium'>Products</p>
              <p className=' text-sm text-gray-500 '>Manage product records.</p>

            </div>
            

            <div className=" p-4 pb-16 bg-white rounded-xl flex-1 shadow-lg">

              <div className="flex flex-col lg:flex-row items-start justify-start flex-wrap gap-2">
                <div className=' flex flex-wrap gap-2'>
                  {canDoAction(token.role, permissions, 'product', 'create') && <CreateLoan getLoans={getLoans} currentPage={currentPage} />}
               
                </div>
                <LoanFilter getLoans={getLoans} setSearchKey={setSearchKey} suggestion={data.loans.map((item) => item.code)} />
              </div>
              <div className="relative overflow-auto rounded-xl mt-4">
                <Table>
                  <TableHeader>
                    <TableHeadRow>
                      <TableHead>
                         <div className="flex items-center gap-6">
                         Code
                          {sortKey === SORTS.CODE_ASC ? (
                            <ArrowUp
                              size={15}
                              onClick={() => setSortKey(SORTS.CODE_DESC)}
                              className="cursor-pointer"
                            />
                          ) : sortKey === SORTS.CODE_DESC ? (
                            <ArrowDown
                              size={15}
                              onClick={() => setSortKey(SORTS.CODE_ASC)}
                              className="cursor-pointer"
                            />
                          ) : (
                            <ArrowUp
                              size={15}
                              onClick={() => setSortKey(SORTS.CODE_ASC)}
                              className="cursor-pointer opacity-30"
                            />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Description</TableHead>
                      {haveActions(token.role, 'product', permissions, ['update', 'delete', 'visible']) && <TableHead>Actions</TableHead>}
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
                          {haveActions(token.role, 'product', permissions, ['update', 'delete', 'visible']) && (
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

         
              {data.loans.length !== 0 && (
                <Paginations currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePagination} disabled={data.loading} />

              )}


            </div>
            <div className=' w-full h-[300px]'></div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Loans;

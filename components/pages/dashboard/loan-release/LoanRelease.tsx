import { IonButton, IonContent, IonPage, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useEffect, useState } from 'react';
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
import { useOnlineStore } from '../../../../store/onlineStore';
import { db } from '../../../../database/db';
import { filterAndSortLoanRelease } from '../../../ui/utils/sort';
import { formatLoanReleaseForUpload, formatLoanReleaseList } from '../../../ui/utils/fomatData';
import { ArrowDown, ArrowUp, Upload } from 'lucide-react';
import Reports from './modals/Reports';
import Paginations from '../../../ui/common/PaginationsV2';
import { set } from 'react-hook-form';

export type TData = {
  transactions: Transaction[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const SORTS = {
  CVNO_ASC: 'code-asc',
  CVNO_DESC: 'code-desc',
  DATE_ASC: 'date-asc',
  DATE_DESC: 'date-desc',
  BANK_ASC: 'bank-asc',
  BANK_DESC: 'bank-desc',
  CHECKNO_ASC: 'checkno-asc',
  CHECKNO_DESC: 'checkno-desc',
  AMOUNT_ASC: 'amount-asc',
  AMOUNT_DESC: 'amount-desc',
  ENCODEDBY_ASC: 'encodedby-asc',
  ENCODEDBY_DESC: 'encodedby-desc',

}


const LoanRelease = () => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')

  const [present] = useIonToast();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKey, setSearchKey] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('code-desc');
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false)
  const [showTooltip, setShowTooltip] = useState(false);
  const [hover, setHover] = useState<string | undefined>(undefined);
  const [hasMore, setasMore] = useState(false);
  const online = useOnlineStore((state) => state.online);
  

  const [data, setData] = useState<TData>({
    transactions: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  console.log(online)

  const getTransactions = async (page: number, keyword: string = '', sort: string = 'code-desc', to: string = '', from: string = '') => {
    console.log(online, 'Here lr')
    if(online){
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
    } else {
       setData(prev => ({ ...prev, loading: true }));
       try {
         const limit = TABLE_LIMIT;
         let data = await db.loanReleases.toArray();

         console.log('Loan Release Data:', data)

         const filteredData = data.filter(e => e.action !== 'delete');
         let allData = filterAndSortLoanRelease(filteredData, keyword, sort, from, to);
         const totalItems = allData.length;
         const totalPages = Math.ceil(totalItems / limit);
         const start = (page - 1) * limit;
         const end = start + limit;
         const finalData = allData.slice(start, end);
         const hasPrevPage = page > 1;
         const hasNextPage = page < totalPages;
         setData(prev => ({
           ...prev,
           transactions: finalData,
           totalPages,
           prevPage: hasPrevPage,
           nextPage: hasNextPage,
         }));
         setCurrentPage(page);
         setSearchKey(keyword);
         setSortKey(sort);
         setFrom(from);
         setTo(to);
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
    getTransactions(currentPage);
  });

  
  useEffect(() => {
    setCurrentPage(1);
    const timer = setTimeout(() => {
    getTransactions(currentPage, searchKey, sortKey, to, from);
    })
    return () => clearTimeout(timer);
  }, [searchKey, sortKey, to, from]);

  useEffect(() => {
    getTransactions(currentPage, searchKey, sortKey, to, from);
  }, [currentPage]);

  console.log(showTooltip, hover)




  return (
    <IonPage className=" w-full flex items-center justify-center h-full bg-zinc-100">
      <IonContent className="[--background:#F4F4F5] max-w-[1920px] h-full" fullscreen>
        <div className="h-full flex flex-col gap-4 items-stretch justify-start py-6">
          {/* <PageTitle pages={['Transaction', 'Loan Release']} /> */}
          <div className="px-3 pb-3 flex-1 flex flex-col">

            <div className=' space-y-1 mb-6'>
              {/* <PageTitle pages={['Dashboard']} /> */}
              <p className=' text-xl text-gray-700 !font-medium'>Loan Release</p>
              <p className=' text-sm text-gray-500 '>Manage loan release records.</p>

            </div>
          

            <div className=" p-4 bg-white rounded-xl flex-1 shadow-lg !pb-16">
                <div className=" bg-white flex flex-col gap-4 flex-wrap">
                 
                  <div className="flex items-center flex-wrap">
                    <div>{canDoAction(token.role, permissions, 'loan release', 'create') && <CreateLoanRelease getTransactions={getTransactions} />}</div>
                    <div>{canDoAction(token.role, permissions, 'loan release', 'print') && <PrintAllLoanRelease />}</div>
                    <div>{canDoAction(token.role, permissions, 'loan release', 'export') && <ExportAllLoanRelease />}</div>
                    <div>
                    {(canDoAction(token.role, permissions, 'loan release', 'export') || (canDoAction(token.role, permissions, 'loan release', 'print'))) && <Reports />}
                    </div>
                    
                  </div>

                   <div className="w-full flex-1 flex">
                    <LoanReleaseFilter getTransactions={getTransactions} setSearchKey={setSearchKey} suggestions={data.transactions.map((item) => item.code)} setTo={setTo} setFrom={setFrom} />
                  </div>
                </div>
              <div className={`relative ${hasMore ? ' !overflow-visible' : ' overflow-auto'} rounded-xl mt-4`}>
                <Table className={`${hasMore ? ' !overflow-visible' : ' overflow-auto'}`}>
                  <TableHeader>
                    <TableHeadRow>
                      <TableHead className="min-w-44 max-w-44 ">
                          <div className="flex items-center gap-6">
                           CV No.
                           {sortKey === SORTS.CVNO_ASC ? (
                             <ArrowUp
                               size={15}
                               onClick={() => setSortKey(SORTS.CVNO_DESC)}
                               className="cursor-pointer"
                             />
                           ) : sortKey === SORTS.CVNO_DESC ? (
                             <ArrowDown
                               size={15}
                               onClick={() => setSortKey(SORTS.CVNO_ASC)}
                               className="cursor-pointer"
                             />
                           ) : (
                             <ArrowUp
                               size={15}
                               onClick={() => setSortKey(SORTS.CVNO_ASC)}
                               className="cursor-pointer opacity-30"
                             />
                           )}
                         </div>
                      </TableHead>
                      <TableHead className="min-w-44 max-w-44 sticky left-0">
                        Clients
                      </TableHead>
                      <TableHead>
                         <div className="flex items-center gap-6">
                           Date
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
                      <TableHead>
                         <div className="flex items-center gap-6">
                           Bank
                           {sortKey === SORTS.BANK_ASC ? (
                             <ArrowUp
                               size={15}
                               onClick={() => setSortKey(SORTS.BANK_DESC)}
                               className="cursor-pointer"
                             />
                           ) : sortKey === SORTS.BANK_DESC ? (
                             <ArrowDown
                               size={15}
                               onClick={() => setSortKey(SORTS.BANK_ASC)}
                               className="cursor-pointer"
                             />
                           ) : (
                             <ArrowUp
                               size={15}
                               onClick={() => setSortKey(SORTS.BANK_ASC)}
                               className="cursor-pointer opacity-30"
                             />
                           )}
                         </div>
                      </TableHead>
                      <TableHead>
                         <div className="flex items-center gap-6">
                           Check No.
                           {sortKey === SORTS.CHECKNO_ASC ? (
                             <ArrowUp
                               size={15}
                               onClick={() => setSortKey(SORTS.CHECKNO_DESC)}
                               className="cursor-pointer"
                             />
                           ) : sortKey === SORTS.CHECKNO_DESC ? (
                             <ArrowDown
                               size={15}
                               onClick={() => setSortKey(SORTS.CHECKNO_ASC)}
                               className="cursor-pointer"
                             />
                           ) : (
                             <ArrowUp
                               size={15}
                               onClick={() => setSortKey(SORTS.CHECKNO_ASC)}
                               className="cursor-pointer opacity-30"
                             />
                           )}
                         </div>
                      </TableHead>
                      <TableHead>
                         <div className="flex items-center gap-6">
                           Amount
                           {sortKey === SORTS.AMOUNT_ASC ? (
                             <ArrowUp
                               size={15}
                               onClick={() => setSortKey(SORTS.AMOUNT_DESC)}
                               className="cursor-pointer"
                             />
                           ) : sortKey === SORTS.AMOUNT_DESC ? (
                             <ArrowDown
                               size={15}
                               onClick={() => setSortKey(SORTS.AMOUNT_ASC)}
                               className="cursor-pointer"
                             />
                           ) : (
                             <ArrowUp
                               size={15}
                               onClick={() => setSortKey(SORTS.AMOUNT_ASC)}
                               className="cursor-pointer opacity-30"
                             />
                           )}
                         </div>
                      </TableHead>
                      <TableHead>
                         <div className="flex items-center gap-6">
                           Encoded By
                           {sortKey === SORTS.ENCODEDBY_ASC ? (
                             <ArrowUp
                               size={15}
                               onClick={() => setSortKey(SORTS.ENCODEDBY_DESC)}
                               className="cursor-pointer"
                             />
                           ) : sortKey === SORTS.ENCODEDBY_DESC ? (
                             <ArrowDown
                               size={15}
                               onClick={() => setSortKey(SORTS.ENCODEDBY_ASC)}
                               className="cursor-pointer"
                             />
                           ) : (
                             <ArrowUp
                               size={15}
                               onClick={() => setSortKey(SORTS.ENCODEDBY_ASC)}
                               className="cursor-pointer opacity-30"
                             />
                           )}
                         </div>
                      </TableHead>
                      {haveActions(token.role, 'loan release', permissions, ['update', 'delete', 'visible', 'print', 'export']) && <TableHead>Actions</TableHead>}
                    </TableHeadRow>
                  </TableHeader>
                  <TableBody>
                    {data.loading && <TableLoadingRow colspan={8} />}
                    {!data.loading && data.transactions.length < 1 && <TableNoRows label="No Loan Release Record Found" colspan={8} />}
                    {!data.loading &&
                      data.transactions.length > 0 &&
                      data.transactions.map((transaction: Transaction, i: number) => (
                        <TableRow key={transaction._id}>
                          <TableCell className="min-w-44 max-w-44 sticky left-0 bg-white">{transaction.code ?? transaction.cvNo}</TableCell>
                          <TableCell>{(() => {
                              const uniqueNames = [...new Set(transaction.entries?.map((entry) => entry.client?.name).filter(Boolean) || [])];
                              const displayNames = uniqueNames.slice(0, 2);
                              const hasMore = uniqueNames.length > 2;
                              return (
                                <div className=' flex items-center gap-1'>
                                  {displayNames.join(', ')}
                                  {hasMore ? (
                                    <div className={`relative z-[99 + ${i}] group`}>
                                      <p 
                                        className=' text-xs text-orange-400 cursor-pointer hover:underline'
                                        onMouseEnter={() => {setShowTooltip(true), setHover(transaction?._id || transaction?.id), setasMore(true)}}
                                        onClick={() => {setShowTooltip(true), setHover(transaction?._id || transaction?.id), setasMore(true)}}
                                        onMouseLeave={() => {setShowTooltip(false), setHover(''), setasMore(false)}}
                                      >
                                        See all
                                      </p>
                                      {(showTooltip && hover === (transaction._id || transaction.id)) &&  (
                                        <div className='absolute top-full mb-2 bg-gray-800 text-white text-xs rounded-md p-4 whitespace-nowrap z-50 shadow-lg flex flex-col gap-1'>
                                          {uniqueNames.slice(0, 10).map((item) => (
                                            <p key={item}>{item}</p>
                                          ))}
                                         
                                        </div>
                                      )}
                                    </div>
                                  ): (
                                    ''
                                  )}

                                </div>
                              )
                            })()}</TableCell>
                          <TableCell>{formatDateTable(transaction.date)}</TableCell>
                          
                          <TableCell className="max-w-52 truncate">{transaction.bank?.description}</TableCell>
                          <TableCell>{transaction.checkNo}</TableCell>
                          <TableCell>{formatMoney(transaction.amount)}</TableCell>
                          <TableCell>{transaction.encodedBy?.username}</TableCell>
                          {haveActions(token.role, 'loan release', permissions, ['update', 'delete', 'visible', 'print', 'export']) && (
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

              {data.transactions.length !== 0 && (
                <Paginations currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePagination} disabled={data.loading} />

              )}


            </div>
            <div className=' w-full h-[300px]'></div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoanRelease;

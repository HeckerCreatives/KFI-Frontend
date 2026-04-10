import { IonButton, IonContent, IonPage, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useEffect, useState } from 'react';
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
import { useOnlineStore } from '../../../../store/onlineStore';
import { db } from '../../../../database/db';
import { formatJV, formatJVForUpload } from '../../../ui/utils/fomatData';
import { filterAndSortLoanRelease } from '../../../ui/utils/sort';
import { ArrowDown, ArrowUp, Upload } from 'lucide-react';
import Paginations from '../../../ui/common/PaginationsV2';

export type TData = {
  journalVouchers: JournalVoucherType[];
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

const JournalVoucher = () => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')


  const [present] = useIonToast();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKey, setSearchKey] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('');
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const online = useOnlineStore((state) => state.online);
  const [uploading, setUploading] = useState<boolean>(false)
  const [showTooltip, setShowTooltip] = useState(false);
  const [hover, setHover] = useState<string | undefined>(undefined);
  const [hasMore, setasMore] = useState(false);
  
  

  const [data, setData] = useState<TData>({
    journalVouchers: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  const getJournalVouchers = async (page: number, keyword: string = '', sort: string = '', to: string = '', from: string = '') => {
   if(online){
     setData(prev => ({ ...prev, loading: true }));
      try {
        const filter: TTableFilter & { to?: string; from?: string } = { limit: TABLE_LIMIT, page };
        if (keyword) filter.search = keyword;
        if (sort) filter.sort = sort;
        if (to) filter.dateTo = to;
        if (from) filter.dateFrom = from;

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
   } else {
     setData(prev => ({ ...prev, loading: true }));
     try {
       const limit = TABLE_LIMIT;
       let data = await db.journalVouchers.toArray();
       console.log(data)
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
          journalVouchers: finalData,
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
    getJournalVouchers(currentPage);
  });

  useEffect(() => {
     setCurrentPage(1);
     getJournalVouchers(1, searchKey, sortKey, to, from);
   }, [searchKey, sortKey, to, from]);
 
   useEffect(() => {
     getJournalVouchers(currentPage, searchKey, sortKey, to, from);
   }, [currentPage]);

  return (
    <IonPage className=" w-full flex items-center justify-center h-full bg-zinc-100">
      <IonContent className="[--background:#F4F4F5] max-w-[1920px] h-full" fullscreen>
        <div className="h-full flex flex-col gap-4 items-stretch justify-start py-6">

          <div className="px-3 pb-3 flex-1 flex flex-col">

            <div className=' space-y-1 mb-6'>
              {/* <PageTitle pages={['Dashboard']} /> */}
              <p className=' text-xl text-gray-700 !font-medium'>Journal Voucher</p>
              <p className=' text-sm text-gray-500 '>Manage journal voucher records.</p>

            </div>
         

            <div className=" p-4 bg-white rounded-xl flex-1 shadow-lg pb-16">
                 <div className=" bg-white flex flex-col gap-4 flex-wrap">
                 
                  <div className="flex items-start flex-wrap">
                    <div>{canDoAction(token.role, permissions, 'journal voucher', 'create') && <CreateJournalVoucher getJournalVouchers={getJournalVouchers} />}</div>
                    <div>{canDoAction(token.role, permissions, 'journal voucher', 'print') && <PrintAllJournalVoucher />}</div>
                    <div>{canDoAction(token.role, permissions, 'journal voucher', 'export') && <ExportAllJournalVoucher />}</div>
                  </div>

                   <div className="w-full flex-1 flex">
                    <JournalVoucherFilter getJournalVouchers={getJournalVouchers} setSearchKey={setSearchKey} setSortKey={setSortKey} setTo={setTo} setFrom={setFrom} suggestions={data.journalVouchers.map((item) => item.code)} />
                  </div>
              </div>
              <div className={`relative ${hasMore ? ' !overflow-visible' : ' overflow-auto'} rounded-xl mt-4`}>
                <Table className={`${hasMore ? ' !overflow-visible' : ' overflow-auto'}`}>
                  <TableHeader>
                    <TableHeadRow>
                       <TableHead className="min-w-44 max-w-44 sticky left-0">
                          <div className="flex items-center gap-6">
                           Code
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
                                           <TableHead className=' text-zinc-600'>Clients</TableHead>
                     
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
                      {haveActions(token.role, 'journal voucher', token.permissions, ['update', 'delete', 'visible', 'print', 'export']) && <TableHead>Actions</TableHead>}
                    </TableHeadRow>
                  </TableHeader>
                  <TableBody>
                    {data.loading && <TableLoadingRow colspan={8} />}
                    {!data.loading && data.journalVouchers.length < 1 && <TableNoRows label="No Journal Voucher Record Found" colspan={8} />}
                    {!data.loading &&
                      data.journalVouchers.map((journalVoucher: JournalVoucherType, i: number) => (
                        <TableRow key={journalVoucher._id}>
                          <TableCell>{journalVoucher.code}</TableCell>
                          <TableCell>{(() => {
                              const uniqueNames = [...new Set(journalVoucher.entries?.map((entry) => entry.client?.name).filter(Boolean) || [])];
                              const displayNames = uniqueNames.slice(0, 2);
                              const hasMore = uniqueNames.length > 2;
                              return (
                                <div className=' flex items-center gap-1'>
                                  {displayNames.join(', ')}
                                  {hasMore ? (
                                    <div className={`relative z-[99 + ${i}] group`}>
                                      <p 
                                        className=' text-xs text-orange-400 cursor-pointer hover:underline'
                                        onMouseEnter={() => {setShowTooltip(true), setHover(journalVoucher?._id || journalVoucher?.id), setasMore(true)}}
                                        onClick={() => {setShowTooltip(true), setHover(journalVoucher?._id || journalVoucher?.id), setasMore(true)}}
                                        onMouseLeave={() => {setShowTooltip(false), setHover(''), setasMore(false)}}
                                      >
                                        See all
                                      </p>
                                      {(showTooltip && hover === journalVoucher._id || journalVoucher.id) &&  (
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
                          <TableCell>{formatDateTable(journalVoucher.date)}</TableCell>
                          <TableCell>{journalVoucher.bank?.description}</TableCell>
                          <TableCell>{journalVoucher.checkNo}</TableCell>
                          <TableCell>{formatNumber(journalVoucher.amount)}</TableCell>
                          <TableCell>{journalVoucher.encodedBy.username}</TableCell>
                          {haveActions(token.role, 'expense voucher', permissions, ['update', 'delete', 'visible', 'print', 'export']) && (
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

              {data.journalVouchers.length !== 0 && (
          <Paginations currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePagination} disabled={data.loading} />

              )
              }


            </div>

            <div className=' w-full h-[300px]'>

            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default JournalVoucher;

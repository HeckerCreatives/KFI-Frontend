import React, { useEffect, useRef, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../../ui/table/Table';
import { IonButton, IonContent, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonInput, IonModal, IonPopover, IonSelect, IonSelectOption, IonSpinner, useIonToast, useIonViewWillEnter } from '@ionic/react';
import { list, search } from 'ionicons/icons';
import { TTableFilter } from '../../../../../types/types';
import { TABLE_LIMIT } from '../../../../utils/constants';
import kfiAxios from '../../../../utils/axios';
import TablePagination from '../../../../ui/forms/TablePagination';
import TableLoadingRow from '../../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../../ui/forms/TableNoRows';
import { formatNumber } from '../../../../ui/utils/formatNumber';
import { useForm } from 'react-hook-form';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import SearchInput from '../../../../ui/forms/InputSearch';
import { ArrowDown, ArrowUp, ChevronDownIcon, X } from 'lucide-react';
import Paginations from '../../../../ui/common/PaginationsV2';

type TSearch = {
  keyword: string;
  center: string
};

export type Loan = {
  createdAt: string
  _id: string;
  description: string;
  location: string;
  acctOfficer: string;
  acctOfficerName: string;
  members: number;
  loans: number;
};
export type TRecentMember = {
  loans: Loan[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const SORTS = {
  CENTER_ASC: 'name-asc',
  CENTER_DESC: 'name-desc',
  MEMBERS_ASC: 'members-asc',
  MEMBERS_DESC: 'members-desc',
  AMOUNT_ASC: 'amount-asc',
  AMOUNT_DESC: 'amount-desc',
}


const LoansPerCenter = () => {
  const arrDummy: string[] = Array.from(Array(10)).fill('');
  const ionInputRef = useRef<HTMLIonInputElement>(null);
  const [sortKey, setSortKey] = useState<string>('');
  

  const [present] = useIonToast();
  

  const form = useForm<TSearch>({
      defaultValues: {
        keyword: '',
        center: ''
      },
    });

  const code = form.watch('keyword')
  const [center, setCenter] = useState('')


  const [currentPage, setCurrentPage] = useState<number>(1);


  const [data, setData] = useState<TRecentMember>({
    loans: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });
  const [items, setItems] = useState<string[]>([])
  const [centers, setCenters] = useState<any[]>([])

  const getRecentLoans = async (page: number, centerData?: string) => {
    setData(prev => ({ ...prev, loading: true }));
    try {
      const filter: TTableFilter = { limit: TABLE_LIMIT, page };
      const result = await kfiAxios.get('/statistics/loans-per-center', { params: { ...filter, keyword: code, center: centerData, sort: sortKey } });
      const { success, loans, hasPrevPage, hasNextPage, totalPages } = result.data;
      if (success) {
        setData(prev => ({
          ...prev,
          loans: loans,
          totalPages: totalPages,
          nextPage: hasNextPage,
          prevPage: hasPrevPage,
          loading: false
        }));
        setCurrentPage(page);
        return;
      }
    } catch (error) {
      present({
        message: 'Failed to get recentt members records. Please try again',
        duration: 1000,
      });
      setData(prev => ({ ...prev, loading: false }));

    } finally {
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  const handlePagination = (page: number) => getRecentLoans(page, center);

  const onSubmit = (data: TSearch) => {
    getRecentLoans(currentPage, center)
  };

  useIonViewWillEnter(() => {
    getRecentLoans(currentPage, center);
  });


    useEffect(() => {

       const getData = async () => {

      try {
        const result = await kfiAxios.get('/statistics/loans-per-center', { params: { limit: 5, keyword: code, page: 1, center: center, sort: sortKey } });
        const { success, loans, hasPrevPage, hasNextPage, totalPages } = result.data;
        if (success) {
          setItems(loans.map((item: any) => item.acctOfficer));

        }
      } catch (error) {

        // handle error
      } finally {

      }
    };

    const timer = setTimeout(() => {
      getData();
      getRecentLoans(currentPage, center)
    }, 500);

    return () => clearTimeout(timer);
   
  }, [code, center, sortKey]);

  // state additions
const [centerSearch, setCenterSearch] = useState('');
const [centerPage, setCenterPage] = useState(1);
const [centerHasNext, setCenterHasNext] = useState(false);
const [loadingCenters, setLoadingCenters] = useState(false);
const [showCenterPicker, setShowCenterPicker] = useState(false);
const centerTriggerRef = useRef<HTMLButtonElement>(null);


// separate center fetcher
const fetchCenters = async (page: number, keyword: string, append = false) => {
  try {
    setLoadingCenters(true);
    const centers = await kfiAxios.get('/center/selection', {
      params: { limit: 10, page, keyword },
    });
    const { centers: list, hasNextPage } = centers.data;
    setCenters(prev => append ? [...prev, ...list] : list);
    setCenterHasNext(hasNextPage);
  } catch (error) {
    // handle
  } finally {
    setLoadingCenters(false);
  }
};


// on search change — reset to page 1
useEffect(() => {
  setCenterPage(1);
  fetchCenters(1, centerSearch, false);
}, [centerSearch]);

// on page increment — append
useEffect(() => {
  if (centerPage > 1) fetchCenters(centerPage, centerSearch, true);
}, [centerPage]);



  return (
    <div className=" relative h-fit flex-1 flex flex-col bg-white shadow-lg rounded-xl">
      <div className=" pb-2 flex-1 flex flex-col">
        <div className="flex flex-wrap items-center justify-between w-full h-fit bg-orange-50 p-4 px-8 rounded-t-xl">
          <h3 className="text-[0.9rem] pb-2 text-black !font-medium">Loans per Account Officer</h3>
           <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center flex-wrap lg:justify-end gap-2">

            <div className="min-w-56">
              <div className="relative w-full">
                <button
                    ref={centerTriggerRef}
                  id="center-picker-trigger"
                  type='button'
                  onClick={() => setShowCenterPicker(true)}
                 className="flex items-center justify-between px-3 py-3 rounded-xl bg-white text-[0.8rem] min-w-full border border-zinc-300"
                  style={{ border: '1px solid #d4d4d8' }}
                >
                  {center || 'Centers'}

                    <ChevronDownIcon size={14} className="text-gray-400" />

                </button>

                {center && (
                  <X
                    size={14}
                    onClick={() => setCenter('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 cursor-pointer"
                  />
                )}
              </div>

            

              <IonPopover
                trigger="center-picker-trigger"
                isOpen={showCenterPicker}
                onDidDismiss={() => {setShowCenterPicker(false)}}
                showBackdrop={false}
                side="bottom"
                alignment="start"
                className="[--width:220px] [--max-height:320px]"
              >
                <IonContent scrollY={true}>
                  {/* search */}
                  <div className="px-3 pt-3 pb-2 sticky top-0 bg-white z-10 border-b border-zinc-100">
                    <IonInput
                      placeholder="Search centers..."
                      value={centerSearch}
                      onIonInput={e => {
                        setCenterSearch(String(e.target.value ?? ''));
                        setCenterPage(1);
                      }}
                      clearInput
                      className="border border-zinc-300 rounded-xl ![--background:white] ![--padding-start:10px] ![--padding-end:10px] ![--min-height:1rem] !text-xs"
                    />
                  </div>

                  {/* list */}
                  <div className="flex flex-col py-1 overflow-y-auto max-h-[250px]">
                    
                    {centers.map(item => (
                      <button
                        key={item._id}
                        onClick={() => {
                          setCenter(item.description || item.centerNo);
                          setShowCenterPicker(false);
                        }}
                        className={`text-left px-4 py-2.5 text-xs text-black transition-colors ${
                          center === item.description || item.centerNo
                            ? ''
                            : 'text-gray-700'
                        }`}
                      >
                        {item.description || item.centerNo}
                      </button>
                    ))}

                    {loadingCenters && (
                      <div className="flex justify-center py-3">
                        <IonSpinner name="crescent" className="text-orange-400 w-5 h-5" />
                      </div>
                    )}

                    {centers.length === 0 && !loadingCenters && (
                      <p className="text-center text-xs text-gray-400 py-4">No centers found</p>
                    )}

                     {centerHasNext && (
                        <button
                          onClick={() => setCenterPage(prev => prev + 1)}
                          className="w-full py-2.5 text-xs text-zinc-500 font-medium border-t border-zinc-100 hover:bg-orange-50 transition-colors"
                        >
                          Load more
                        </button>
                      )}

                   
                  </div>

                  {/* infinite scroll */}
                  <IonInfiniteScroll
                    disabled={!centerHasNext}
                    onIonInfinite={async (e) => {
                      setCenterPage(prev => prev + 153);
                      await (e.target as HTMLIonInfiniteScrollElement).complete();
                    }}
                  >
                    <IonInfiniteScrollContent
                      loadingSpinner="crescent"
                      loadingText="Loading more..."
                    />
                  </IonInfiniteScroll>
                </IonContent>
              </IonPopover>
            </div>
          
            <div className="flex items-center min-w-20 overflow-visible!">
              <FormIonItem className="flex-1 overflow-visible!">
               

                <SearchInput
                  name="keyword"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  // label="Code"
                  placeholder="Search ..."
                  className="!px-3 !py-1 rounded-xl "
                  suggestions={items}
                />
              </FormIonItem>
              {/* <IonButton type="submit" fill="clear" className="max-h-8 min-h-[2rem] bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
                <IonIcon icon={search} />
              </IonButton> */}
            </div>
          </form>
         
        </div>

       
          
          <div className=" flex-1 p-4 ">
            <div className='relative overflow-auto max-h-[500px] '>
               <div className=' w-full sticky top-0 z-[9] bg-white'>
              <Table>
              <TableHeader>
                <TableHeadRow className="!bg-white !border-0">
                  <TableHead className=" !font-[600]">Account Officer</TableHead>
                  <TableHead className=" !font-[400] text-start">
                     <div className="flex items-center gap-6">
                           Center
                           {sortKey === SORTS.CENTER_ASC ? (
                             <ArrowUp
                               size={15}
                               onClick={() => setSortKey(SORTS.CENTER_DESC)}
                               className="cursor-pointer"
                             />
                           ) : sortKey === SORTS.CENTER_DESC ? (
                             <ArrowDown
                               size={15}
                               onClick={() => setSortKey(SORTS.CENTER_ASC)}
                               className="cursor-pointer"
                             />
                           ) : (
                             <ArrowUp
                               size={15}
                               onClick={() => setSortKey(SORTS.CENTER_ASC)}
                               className="cursor-pointer opacity-30"
                             />
                           )}
                         </div>
                  </TableHead>
                  <TableHead className=" !font-[400]">
                     <div className="flex items-center gap-6">
                           Total Members
                           {sortKey === SORTS.MEMBERS_ASC ? (
                             <ArrowUp
                               size={15}
                               onClick={() => setSortKey(SORTS.MEMBERS_DESC)}
                               className="cursor-pointer"
                             />
                           ) : sortKey === SORTS.MEMBERS_DESC ? (
                             <ArrowDown
                               size={15}
                               onClick={() => setSortKey(SORTS.MEMBERS_ASC)}
                               className="cursor-pointer"
                             />
                           ) : (
                             <ArrowUp
                               size={15}
                               onClick={() => setSortKey(SORTS.MEMBERS_ASC)}
                               className="cursor-pointer opacity-30"
                             />
                           )}
                         </div>
                  </TableHead>
                  <TableHead className=" !font-[400]">
                    <div className="flex items-center gap-6">
                           Total Loan Amount
                           {sortKey === SORTS.AMOUNT_ASC ? (
                             <ArrowUp
                               size={15}
                               onClick={() => setSortKey(SORTS.AMOUNT_DESC)}
                               className="cursor-pointer"
                             />
                           ) : sortKey === SORTS.AMOUNT_DESC ? (
                             <ArrowDown
                               size={15}
                               onClick={() => setSortKey(SORTS.AMOUNT_DESC)}
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
                  
                </TableHeadRow>
              </TableHeader>
              {/* <TableBody
                style={{ visibility: 'collapse' }}
              
              >
                {data.loading && <TableLoadingRow colspan={8} />}
                {!data.loading && data.loans.length < 1 && <TableNoRows label="No Record Found" colspan={8} />}
                {!data.loading &&
                  data.loans.length > 0 &&
                  data.loans.map((loan: Loan, i: number) => (
                    <TableRow key={`${loan._id}-${i}`} className="!border-1 [&>td]:text-[0.7rem] py-2">
                      <TableCell className="">{loan.acctOfficer} ({loan.acctOfficerName || ''})</TableCell>
                      <TableCell className="">{loan.description}</TableCell>
                      <TableCell className="">{loan.members}</TableCell>
                      <TableCell className="">{formatNumber(loan.loans)}</TableCell>

                    </TableRow>
                  ))}
              </TableBody> */}
              
            </Table>
            </div>
            <Table>
              <TableHeader
              >
                <TableHeadRow className="!bg-white !border-0"
                style={{ visibility: 'collapse' }}
                
                >
                   <TableHead className=" !font-[600]">Account Officer</TableHead>
                  <TableHead className=" !font-[400] text-start">
                     <div className="flex items-center gap-6">
                           Center
                           {sortKey === SORTS.CENTER_ASC ? (
                             <ArrowUp
                               size={15}
                               onClick={() => setSortKey(SORTS.CENTER_DESC)}
                               className="cursor-pointer"
                             />
                           ) : sortKey === SORTS.CENTER_DESC ? (
                             <ArrowDown
                               size={15}
                               onClick={() => setSortKey(SORTS.CENTER_ASC)}
                               className="cursor-pointer"
                             />
                           ) : (
                             <ArrowUp
                               size={15}
                               onClick={() => setSortKey(SORTS.CENTER_ASC)}
                               className="cursor-pointer opacity-30"
                             />
                           )}
                         </div>
                  </TableHead>
                  <TableHead className=" !font-[400]">
                     <div className="flex items-center gap-6">
                           Total Members
                           {sortKey === SORTS.MEMBERS_ASC ? (
                             <ArrowUp
                               size={15}
                               onClick={() => setSortKey(SORTS.MEMBERS_DESC)}
                               className="cursor-pointer"
                             />
                           ) : sortKey === SORTS.MEMBERS_DESC ? (
                             <ArrowDown
                               size={15}
                               onClick={() => setSortKey(SORTS.MEMBERS_ASC)}
                               className="cursor-pointer"
                             />
                           ) : (
                             <ArrowUp
                               size={15}
                               onClick={() => setSortKey(SORTS.MEMBERS_ASC)}
                               className="cursor-pointer opacity-30"
                             />
                           )}
                         </div>
                  </TableHead>
                  <TableHead className=" !font-[400]">
                    <div className="flex items-center gap-6">
                           Total Loan Amount
                           {sortKey === SORTS.AMOUNT_ASC ? (
                             <ArrowUp
                               size={15}
                               onClick={() => setSortKey(SORTS.AMOUNT_DESC)}
                               className="cursor-pointer"
                             />
                           ) : sortKey === SORTS.AMOUNT_DESC ? (
                             <ArrowDown
                               size={15}
                               onClick={() => setSortKey(SORTS.AMOUNT_DESC)}
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

                </TableHeadRow>
              </TableHeader>
              <TableBody>
                {data.loading && <TableLoadingRow colspan={4} />}
                {!data.loading && data.loans.length < 1 && <TableNoRows label="No Loans Found" colspan={4} />}
                {!data.loading &&
                  data.loans.length > 0 &&
                  data.loans.map((loan: Loan, i: number) => (
                    <TableRow key={`${loan._id}-${i}`} className="!border-1 [&>td]:text-[0.7rem] py-2">
                      <TableCell className="">{loan.acctOfficer} 

                        {loan.acctOfficerName ? `(${loan.acctOfficerName})` : ''}
                      </TableCell>
                      <TableCell className="">{loan.description}</TableCell>
                      <TableCell className="">{loan.members}</TableCell>
                      <TableCell className="">{formatNumber(loan.loans)}</TableCell>
                     {/* <TableCell>{loan.createdAt?.split('T')[0] || ''}</TableCell> */}

                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            </div>
           
          </div>
        
      </div>
      <div>
        <Paginations currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePagination} disabled={data.loading} />
      </div>
    </div>
  );
};

export default LoansPerCenter;

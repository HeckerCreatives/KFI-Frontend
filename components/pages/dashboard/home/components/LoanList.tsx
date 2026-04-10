import { IonButton, IonHeader, IonIcon, IonInput, IonModal, IonSelect, IonSelectOption, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { UserMultiple02Icon, ViewIcon} from 'hugeicons-react';
import DashboardCard from './DashboardCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from "../../../../ui/table/Table"
import TablePagination from '../../../../ui/forms/TablePagination';
import { ClientMasterFile, Transaction, TTableFilter } from '../../../../../types/types';
import { TABLE_LIMIT } from '../../../../utils/constants';
import kfiAxios from '../../../../utils/axios';
import TableNoRows from '../../../../ui/forms/TableNoRows';
import TableLoadingRow from '../../../../ui/forms/TableLoadingRow';
import Paginations from '../../../../ui/common/PaginationsV2';
import ViewLoans from './ViewLoans';
import { ArrowLeft, Plus } from 'lucide-react';
import ViewLoanRelease from './ViewLoanRelease';
import { eye } from 'ionicons/icons';

type DashboardCardProps = {
  title: string;
  icon: React.ReactElement; 
  value: string;
  loading?: boolean;
  details?: boolean
};

export type TData = {
  transactions: Transaction[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

type Props = {
  year: number,
  month: number,
  totalLoans: number,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  setOpenList: React.Dispatch<React.SetStateAction<boolean>>
  setView: React.Dispatch<React.SetStateAction<boolean>>
  view: boolean,
  openList: boolean,
}


const Loanlist = ({year, month, totalLoans, setOpen, setOpenList, setView, view, openList}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selected, setSelected] = useState<Transaction>()
  const [showTooltip, setShowTooltip] = useState(false);
  const [hover, setHover] = useState('');

  
     const [search, setSearch] = useState('')
       
       
        const [data, setData] = useState<TData>({
             transactions: [],
             loading: false,
             totalPages: 0,
             nextPage: false,
             prevPage: false,
           });
     
           const getClients = async (page: number, keyword: string = '',) => {
               setData(prev => ({ ...prev, loading: true }));
           
               try {
                 const filter: TTableFilter = { limit: TABLE_LIMIT, page };
                 if (keyword) filter.search = keyword;
                 if (year) filter.year = year;
                 if (month) filter.month = month;
                 if (search) filter.search = search
                 const result = await kfiAxios.get('/transaction/loans/transactions-by-month', { params: filter });
                 const { success, data } = result.data;
                 if (data.success) {
                   setData(prev => ({
                     ...prev,
                     transactions: data.transactions,
                     totalPages: data.totalPages,
                     nextPage: data.hasNextPage,
                     prevPage: data.hasPrevPage,
                   }));
                   setCurrentPage(page);
                   return;
                 }
               } catch (error) {
                 setData(prev => ({ ...prev, loading: false }));
         
                
               } finally {
                 setData(prev => ({ ...prev, loading: false }));
               }
             };
         
     
       const handlePagination = (page: number) => setCurrentPage(page);
     
         useEffect(() => {
              if(openList){
               const timer = setTimeout(() => {
                getClients(currentPage);
              }, 500);
              return () => clearTimeout(timer);
              }
            }, [openList, search, currentPage]);

            useEffect(() => {
              setCurrentPage(1)
            },[openList, search])


     const dismiss = () => {
       setOpenList(false);
       setSearch('')
     };

  



  return (
    <>
     
      <IonModal isOpen={openList} backdropDismiss={false} className=" [--border-radius:0.7rem] auto-height [--max-width:90rem] [--width:95%]">
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader title="Loan Details" sub="System" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6">
           <IonButton
                  onClick={() => {setOpen(true), setOpenList(false)}}
                  type="button"
                  fill="clear"
                  className=" bg-orange-50 mb-4 rounded-lg w-20 h-2! ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  capitalize text-xs"
                >
                 <ArrowLeft size={15} className=' mr-1'/>
                Back
          </IonButton>
            <ModalHeader title="Loan List" sub="" dismiss={dismiss} />

         <div className=' w-full flex flex-col'>
              <div className=" relative shadow-sm h-full! bg-orange-50 p-6 flex-1 w-full max-w-64 rounded-xl flex items-start justify-between overflow-hidden">
                  <div className=" relative z-10 space-y-2">
                    <div className="text-[0.8rem] truncate text-zinc-700 !font-medium ">Total Loans</div>
                    <div className="text-xl text-orange-600 !font-bold">{totalLoans.toLocaleString()}</div>
                  </div>
                 
                  <div className=' flex flex-col items-end justify-between'>
                    <div className=" relative z-10 bg-orange-50 w-10 h-10 rounded-full flex items-center justify-center text-orange-500">
                   <UserMultiple02Icon stroke='.8' size={20}/>
                    </div>
            
                 
                  </div>
                  
            
                 
                </div>
           

                <div className=' w-full flex items-end  justify-end mt-4'>
                    
                    
                    <div className=' flex items-center gap-2'>
                     <div className=' flex flex-col gap-1'>
                                             <p className=' text-xs'>Search</p>
                                              <IonInput
                                              name="search"
                                              value={search}
                                              onIonInput={(e) => setSearch(String(e.target.value))}
                                              type='text'
                                              placeholder="Search ..."
                                              className="text-xs !p-2 !min-h-[1rem] w-fit rounded-md !border-zinc-400 !bg-white ![--background:white] md:![--padding-bottom:2] ![--padding-top:2] ![--padding-start:2] border"
                                            />
                                          </div>
                    
                   </div>
                </div>

                 <div className=' w-full !overflow-visible'>
                  <Table className=" w-full border-collapse mt-4 !overflow-visible">
                    <TableHeader className=" bg-white backdrop-blur-sm shadow-sm">
                    <TableHeadRow>
                        <TableHead className="!font-[400] border-b border-gray-200">Code</TableHead>
                        <TableHead className="!font-[400] border-b border-gray-200">Clients</TableHead>
                        <TableHead className="!font-[400] border-b border-gray-200">Date</TableHead>
                        <TableHead className="!font-[400] border-b border-gray-200">Amount</TableHead>
                        <TableHead className="!font-[400] border-b border-gray-200">Action</TableHead>
                       
                    </TableHeadRow>
                    </TableHeader>

                    <TableBody>
                       {!data.loading && data.transactions.length < 1 && <TableNoRows label="No Record Found" colspan={8} />}

                      {!data.loading && data.transactions.length !== 0 && data.transactions.map((item) => (
                         <TableRow
                        key={item._id}
                            className="!border-1 [&>td]:text-[0.7rem]"
                        >
                            <TableCell>{item.code}</TableCell>
                            <TableCell>{(() => {
                              const uniqueNames = [...new Set(item.entries?.map((entry) => entry.client?.name).filter(Boolean) || [])];
                              const displayNames = uniqueNames.slice(0, 2);
                              const hasMore = uniqueNames.length > 2;
                              return (
                                <div className=' flex items-center gap-1'>
                                  {displayNames.join(', ')},
                                  {hasMore ? (
                                    <div className='relative z-[99] group'>
                                      <p 
                                        className=' text-xs text-orange-400 cursor-pointer hover:underline'
                                        onMouseEnter={() => {setShowTooltip(true), setHover(item.code)}}
                                        onClick={() => {setShowTooltip(true), setHover(item.code)}}
                                        onMouseLeave={() => setShowTooltip(false)}
                                      >
                                        See all
                                      </p>
                                      {(showTooltip && hover === item.code) &&  (
                                        <div className='absolute bottom-full left-0 mb-2 bg-gray-800 text-white text-xs rounded-md p-4 whitespace-nowrap z-50 shadow-lg flex flex-col gap-1'>
                                          {uniqueNames.slice(0, 15).map((item) => (
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
                            <TableCell>{item.date.split('T')[0]}</TableCell>
                            <TableCell>{Number(item?.amount).toLocaleString()}</TableCell>
                            <TableCell>
                                <IonButton
                                      type="button"
                                      fill="clear"
                                      className="space-x-1 rounded-md w-20 h-7 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-orange-100 text-orange-900 capitalize min-h-4 text-xs"
                                      onClick={() => {setView(true), setSelected(item), setOpenList(false)}}
                                    >
                                      <IonIcon icon={eye} className="text-xs" />
                                      <span>View</span>
                                    </IonButton>
                            </TableCell>

                        </TableRow>
                      )) }

                    {data.loading && <TableLoadingRow colspan={7} />}
                    </TableBody>
                </Table>
                 </div>

                 

                   {(!data.loading && data.transactions.length !== 0) && (
                 <Paginations currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePagination} disabled={data.loading} />

                )}
         </div>
        
        </div>
      </IonModal>

      {selected && (
      <ViewLoanRelease transaction={selected} view={view} setView={setView} setOpenList={setOpenList}/>

      )}




    </>
  );
};

export default Loanlist;

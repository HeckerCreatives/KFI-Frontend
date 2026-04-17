import { IonButton, IonHeader, IonIcon, IonInput, IonModal, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { UserMultiple02Icon, ViewIcon} from 'hugeicons-react';
import DashboardCard from './DashboardCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from "../../../../ui/table/Table"
import TablePagination from '../../../../ui/forms/TablePagination';
import ViewMemberListInfo from './memberListInfo';
import InactiveMemberlist from './InactiveMemberList';
import Loanlist from './LoanList';
import { ArrowRight } from 'lucide-react';
import kfiAxios from '../../../../utils/axios';
import TableLoadingRow from '../../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../../ui/forms/TableNoRows';

type DashboardCardProps = {
  title: string;
  icon: React.ReactElement; 
  value: string;
  loading?: boolean;
  details?: boolean
};

export type TData = {
  data: any[];
  loading: boolean;
   totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
};
const LoanDetails = ({ title, icon, value, loading = false, details = false }: DashboardCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openList, setOpenList] = useState(false);
  const [view, setView] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
   const [year, setYear] = useState<string>(new Date().getFullYear().toString())
   const [selected, setSelected] = useState<any>()
  
  
    const [data, setData] = useState<TData>({
      data: [],
      loading: false,
      totalPages: 0,
      nextPage: false,
      prevPage: false,
    });

     const getData = async () => {
      setData(prev => ({ ...prev, loading: true }));
    try {
      const result = await kfiAxios.get("/transaction/loans/list-by-year-month",{params: {year: Number(year)}})
        const { success, data, message} = result.data;
      console.log(result)
      if(data.success){
         setData((prev: any) => ({
            ...prev,
            data: data.loanMonths,
            loading: false
          }));

          return
      }
    } catch (error) {
        setData(prev => ({ ...prev, loading: false }));
     
    } finally {
        setData(prev => ({ ...prev, loading: false }));

    }
  }

   useEffect(() => {
  if(isOpen){
     const timer = setTimeout(() => {
     getData();
   }, 500);

   return () => clearTimeout(timer);
  }
 }, [year, isOpen]);

  const dismiss = () => {
    setIsOpen(false);
  };

  const handlePagination = (page: number) => (page);


  return (
    <>
      <IonButton
        onClick={() => setIsOpen(true)}
        type="button"
        fill="clear"
        className=" rounded-lg w-fit h-2! ![--padding-start:0] !gap-2  ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  capitalize text-xs !text-orange-700 hover:underline"
      >
        &nbsp;See Details <ArrowRight size={15}/>
      </IonButton>
      <IonModal isOpen={isOpen} backdropDismiss={false} className=" [--border-radius:0.7rem] auto-height [--max-width:104rem] [--width:95%]">
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader title="Loan Details" sub="System" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6">
            <ModalHeader title="Total Loan Amount" sub="" dismiss={dismiss} />

         <div className=' w-full flex flex-col'>
            <div className=" relative shadow-sm h-full! bg-orange-50 p-6 flex-1 w-full max-w-64 rounded-xl flex items-start justify-between overflow-hidden">
                  <div className=" relative z-10 space-y-2">
                    <div className="text-[0.8rem] truncate text-zinc-700 !font-medium ">{title}</div>
                    <div className="text-xl text-orange-600 !font-bold">{loading ? <div className=' h-6 bg-orange-100 w-full rounded-sm animate-pulse'></div> : value}</div>
                  </div>
                 
                  <div className=' flex flex-col items-end justify-between'>
                    <div className=" relative z-10 bg-orange-50 w-10 h-10 rounded-full flex items-center justify-center text-orange-500">
                    {icon}
                    </div>
            
                 
                  </div>
                  
            
                 
                </div>

                <div className=' w-full flex items-end justify-end mt-4'>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs">Year</p>

                    <select
                      value={year}
                      
                      onChange={(e) => setYear(e.target.value)}
                      className="text-xs p-2 rounded-md border border-zinc-400 bg-white w-[6rem]"
                    >
                     {Array.from(
                        { length: new Date().getFullYear() - 2000 + 1 },
                        (_, i) => {
                          const y = Number(new Date().getFullYear()) - i;
                          return (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          );
                        }
                      )}
                    </select>
                  </div>
                </div>

                <div className=' w-full overflow-x-auto'>
                  <Table className=" w-full border-collapse mt-4">
                    <TableHeader className=" bg-white backdrop-blur-sm shadow-sm">
                    <TableHeadRow>
                        <TableHead className="!font-[400] border-b border-gray-200">Year</TableHead>
                        <TableHead className="!font-[400] border-b border-gray-200">Month</TableHead>
                        <TableHead className="  !font-[600] bg-zinc-100">Number of Loans</TableHead>
                        <TableHead className="  !font-[600] bg-zinc-100">Total Loans</TableHead>
                        <TableHead className="!font-[400] border-b border-gray-200">Action</TableHead>
                    </TableHeadRow>
                    </TableHeader>

                    <TableBody>
                    {data.loading && <TableLoadingRow colspan={5} />}
                    {!data.loading && data.data.length < 1 && <TableNoRows label="No Record Found" colspan={8} />}



                      {!data.loading && data.data.length !== 0 && data.data.map((item, index) => (
                          <TableRow
                        key={item.month}
                            className="!border-1 [&>td]:text-[0.7rem]"
                        >
                            <TableCell>{item.year}</TableCell>
                            <TableCell>{item.monthLabel.split(' ')[0]}</TableCell>
                            <TableCell>{Number(item.memberCount).toLocaleString()}</TableCell>
                            <TableCell>{Number(item.totalAmount).toLocaleString()}</TableCell>
                            
                            <TableCell>
                               <IonButton
                                    onClick={() => {setOpenList(true), setSelected(item), setIsOpen(false)}}
                                    type="button"
                                    fill="clear"
                                    className=" bg-orange-50 rounded-lg w-20 h-2! ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  capitalize text-xs"
                                  >
                                    <ViewIcon size={25} stroke='.8' className="text-xs" />
                                    &nbsp;View
                                  </IonButton>
                            </TableCell>
                        </TableRow>
                      ))}

                      
                    
                      
                    </TableBody>
                </Table>
                </div>

                

                 {/* <TablePagination currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePagination} disabled={data.loading} /> */}
         </div>
        
        </div>
      </IonModal>

      <Loanlist year={selected?.year} month={selected?.month} totalLoans={Number(selected?.totalAmount || 0)} setOpen={setIsOpen} setOpenList={setOpenList} setView={setView} view={view} openList={openList} />

    </>
  );
};

export default LoanDetails;

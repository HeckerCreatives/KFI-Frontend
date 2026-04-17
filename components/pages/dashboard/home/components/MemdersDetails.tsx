import { IonButton, IonHeader, IonIcon, IonInput, IonModal, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { ArrowRight02Icon, UserMultiple02Icon, ViewIcon} from 'hugeicons-react';
import DashboardCard from './DashboardCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from "../../../../ui/table/Table"
import TablePagination from '../../../../ui/forms/TablePagination';
import ViewMemberListInfo from './memberListInfo';
import kfiAxios from '../../../../utils/axios';
import { search } from 'ionicons/icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight } from 'lucide-react';
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


const ViewMemberDetails = ({ title, icon, value, loading = false, details = false }: DashboardCardProps) => {
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

  const dismiss = () => {
    setIsOpen(false);
    setYear(new Date().getFullYear().toString())
  };

   const getData = async () => {
      setData(prev => ({ ...prev, loading: true }));
    try {
      const result = await kfiAxios.get("/customer/list-by-year-month",{params: {year: Number(year)}})
        const { success, data, message} = result.data;
      console.log(result)
      if(message === 'success'){
         setData((prev: any) => ({
            ...prev,
            data: data.yearMonths,
            
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
  

  const handlePagination = (page: number) => (page);

  const totalStatusCounts = data.data.reduce((acc, curr) => {
    const counts = curr.statusCounts || {};

    Object.entries(counts).forEach(([key, value]) => {
      acc[key] = (acc[key] || 0) + Number(value || 0);
    });

    return acc;
  }, {} as Record<string, number>);

  const activeTotal =
    totalStatusCounts["Active On-Leave"] +
    totalStatusCounts["Active-Existing"] +
    totalStatusCounts["Active-New"] +
    totalStatusCounts["Active-PastDue"] +
    totalStatusCounts["Active-Returnee"];

  const totalMembers =
    totalStatusCounts["Active On-Leave"] +
    totalStatusCounts["Active-Existing"] +
    totalStatusCounts["Active-New"] +
    totalStatusCounts["Active-PastDue"] +
    totalStatusCounts["Active-Returnee"] +
    totalStatusCounts["Resigned"]

  const resignedTotal = totalStatusCounts["Resigned"];


  return (
    <>
      <IonButton
        onClick={() => setIsOpen(true)}
        type="button"
        fill="clear"
        className=" rounded-lg w-fit h-2! ![--padding-start:0] !gap-2 !font-medium  ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  capitalize text-xs !text-orange-700 hover:underline"
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
            <ModalHeader title="Total Members" sub="" dismiss={dismiss} />

         <div className=' w-full flex flex-col gap-4'>

          <div className=' w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 '>
             <div className=" relative shadow-sm h-full! bg-orange-50 p-6 flex-1 w-full rounded-xl flex items-start justify-between overflow-hidden">
                  <div className=" relative z-10 space-y-2">
                    <div className="text-[0.8rem] truncate text-zinc-700 !font-medium ">{title}</div>
                    <div className="text-xl text-orange-600 !font-bold">{loading ? <div className=' h-6 bg-orange-100 w-full rounded-sm animate-pulse'></div> : Number(totalMembers || 0).toLocaleString()}</div>
                  </div>
                 
                  <div className=' flex flex-col items-end justify-between'>
                    <div className=" relative z-10 bg-orange-50 w-10 h-10 rounded-full flex items-center justify-center text-orange-500">
                    {icon}
                    </div>
            
                 
                  </div>
                  
            
                 
              </div>

               <div className=" relative shadow-sm h-full! bg-orange-50 p-6 flex-1 w-full  rounded-xl flex items-start justify-between overflow-hidden">
                  <div className=" relative z-10 space-y-2">
                    <div className="text-[0.8rem] truncate text-zinc-700 !font-medium ">Total Inactive</div>
                    <div className="text-xl text-orange-600 !font-bold">{loading ? <div className=' h-6 bg-orange-100 w-full rounded-sm animate-pulse'></div> : Number(resignedTotal || 0).toLocaleString()}</div>
                  </div>
                 
                  <div className=' flex flex-col items-end justify-between'>
                    <div className=" relative z-10 bg-orange-50 w-10 h-10 rounded-full flex items-center justify-center text-orange-500">
                    {icon}
                    </div>
            
                 
                  </div>
                  
            
                 
                </div>

                <div className=" relative shadow-sm h-full! bg-orange-50 p-6 flex-1 w-full rounded-xl flex items-start justify-between overflow-hidden">
                  <div className=" relative z-10 space-y-2">
                    <div className="text-[0.8rem] truncate text-zinc-700 !font-medium ">Total Resigned</div>
                    <div className="text-xl text-orange-600 !font-bold">{loading ? <div className=' h-6 bg-orange-100 w-full rounded-sm animate-pulse'></div> : Number(resignedTotal ?? 0).toLocaleString()}</div>
                  </div>
                 
                  <div className=' flex flex-col items-end justify-between'>
                    <div className=" relative z-10 bg-orange-50 w-10 h-10 rounded-full flex items-center justify-center text-orange-500">
                    {icon}
                    </div>
            
                 
                  </div>
                  
            
                 
                </div>

                <div className=" relative shadow-sm h-full! bg-orange-50 p-6 flex-1 w-full rounded-xl flex items-start justify-between overflow-hidden">
                  <div className=" relative z-10 space-y-2">
                    <div className="text-[0.8rem] truncate text-zinc-700 !font-medium ">Total On-Leave</div>
                    <div className="text-xl text-orange-600 !font-bold">{loading ? <div className=' h-6 bg-orange-100 w-full rounded-sm animate-pulse'></div> : Number(totalStatusCounts['Active On-Leave'] ?? 0).toLocaleString()}</div>
                  </div>
                 
                  <div className=' flex flex-col items-end justify-between'>
                    <div className=" relative z-10 bg-orange-50 w-10 h-10 rounded-full flex items-center justify-center text-orange-500">
                    {icon}
                    </div>
                  </div>
                </div>

                 <div className=" relative shadow-sm h-full! bg-orange-50 p-6 flex-1 w-full rounded-xl flex items-start justify-between overflow-hidden">
                  <div className=" relative z-10 space-y-2">
                    <div className="text-[0.8rem] truncate text-zinc-700 !font-medium ">Total Returnee</div>
                    <div className="text-xl text-orange-600 !font-bold">{loading ? <div className=' h-6 bg-orange-100 w-full rounded-sm animate-pulse'></div> : Number(totalStatusCounts['Active-Returnee'] ?? 0).toLocaleString()}</div>
                  </div>
                 
                  <div className=' flex flex-col items-end justify-between'>
                    <div className=" relative z-10 bg-orange-50 w-10 h-10 rounded-full flex items-center justify-center text-orange-500">
                    {icon}
                    </div>
                  </div>
                </div>

                <div className=" relative shadow-sm h-full! bg-orange-50 p-6 flex-1 w-full rounded-xl flex items-start justify-between overflow-hidden">
                  <div className=" relative z-10 space-y-2">
                    <div className="text-[0.8rem] truncate text-zinc-700 !font-medium ">Total Pastdue</div>
                    <div className="text-xl text-orange-600 !font-bold">{loading ? <div className=' h-6 bg-orange-100 w-full rounded-sm animate-pulse'></div> : Number(totalStatusCounts['Active-PastDue'] ?? 0).toLocaleString()}</div>
                  </div>
                 
                  <div className=' flex flex-col items-end justify-between'>
                    <div className=" relative z-10 bg-orange-50 w-10 h-10 rounded-full flex items-center justify-center text-orange-500">
                    {icon}
                    </div>
                  </div>
                </div>
          </div>
           

                <div className=' w-full flex flex-col items-end justify-end'>
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
                   <Table className=" w-full border-collapse mt-4 ">
                    <TableHeader className=" bg-white backdrop-blur-sm shadow-sm">
                    <TableHeadRow>
                        <TableHead className="!font-[400] border-b border-gray-200">Year</TableHead>
                        <TableHead className="!font-[400] border-b border-gray-200">Month</TableHead>
                        <TableHead className="  !font-[600] bg-zinc-100">No. of Members</TableHead>
                        <TableHead className="  !font-[600] bg-zinc-100">No. of Active New</TableHead>
                        <TableHead className="  !font-[600] bg-zinc-100">No. of Active Existing</TableHead>
                        <TableHead className="  !font-[600] bg-zinc-100">No. of Resigned</TableHead>
                        <TableHead className="  !font-[600] bg-zinc-100">No. of On-Leave</TableHead>
                        <TableHead className="  !font-[600] bg-zinc-100">No. of Returnee</TableHead>
                        <TableHead className="  !font-[600] bg-zinc-100">No. of Pastdue</TableHead>
                        <TableHead className="!font-[400] border-b border-gray-200">Action</TableHead>

                    </TableHeadRow>
                    </TableHeader>

                    <TableBody>
                    {data.loading && <TableLoadingRow colspan={16} />}
                    {!data.loading && data.data.length < 1 && <TableNoRows label="No Record Found" colspan={16} />}
                    


                      {!data.loading && data.data.length !== 0 && data.data.map((item, index) => (
                          <TableRow
                        key={item.month}
                            className="!border-1 [&>td]:text-[0.7rem]"
                        >
                            <TableCell>{item.year}</TableCell>
                            <TableCell>{item.monthLabel.split(' ')[0]}</TableCell>
                            <TableCell>{Number(item.memberCount).toLocaleString()}</TableCell>
                            <TableCell>
                              {Number(item.statusCounts["Active-New"]).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {Number(item.statusCounts["Active-Existing"]).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {Number(item.statusCounts["Resigned"]).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {Number(item.statusCounts["Active On-Leave"]).toLocaleString()}
                            </TableCell>
                             <TableCell>
                              {Number(item.statusCounts["Active-Returnee"]).toLocaleString()}
                            </TableCell>
                             <TableCell>
                              {Number(item.statusCounts["Active-PastDue"]).toLocaleString()}
                            </TableCell>


                            <TableCell>
                              <IonButton
                                  onClick={() => {setSelected(item), setOpenList(true), setIsOpen(false)}}
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

      <ViewMemberListInfo year={selected?.year} month={selected?.month} openList={openList} setOpenList={setOpenList} setIsOpen={setIsOpen} view={view} setView={setView}/>



    </>
  );
};

export default ViewMemberDetails;

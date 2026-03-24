import { IonButton, IonHeader, IonIcon, IonInput, IonModal, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { UserMultiple02Icon, ViewIcon} from 'hugeicons-react';
import DashboardCard from './DashboardCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from "../../../../ui/table/Table"
import TablePagination from '../../../../ui/forms/TablePagination';
import ViewMemberListInfo from './memberListInfo';
import kfiAxios from '../../../../utils/axios';
import { search } from 'ionicons/icons';

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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [year, setYear] = useState(2026)
  
    const [data, setData] = useState<TData>({
      data: [],
      loading: false,
       totalPages: 0,
      nextPage: false,
      prevPage: false,
     
    });

  const dismiss = () => {
    setIsOpen(false);
  };

   const getData = async () => {
    try {
      const result = await kfiAxios.get("/customer/by-year",{params: {year: year}})
        const { success, data} = result.data;
      console.log(result)
      if(success){
         setData((prev: any) => ({
            ...prev,
            data: data,
            
          }));

          return
      }
    } catch (error) {
     
    } finally {
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


  return (
    <>
      <IonButton
        onClick={() => setIsOpen(true)}
        type="button"
        fill="clear"
        className=" rounded-lg w-20 h-2! ![--padding-start:0]  ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  capitalize text-xs"
      >
        &nbsp;See Details
      </IonButton>
      <IonModal isOpen={isOpen} backdropDismiss={false} className=" [--border-radius:0.7rem] auto-height [--max-width:104rem] [--width:95%]">
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader title="Loan Details" sub="System" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6">
            <ModalHeader title="Total Members" sub="" dismiss={dismiss} />

         <div className=' w-full flex flex-col'>
            <div className=" relative shadow-sm h-full! bg-orange-50 p-6 flex-1 w-full max-w-64 rounded-xl flex items-start justify-between overflow-hidden">
                  <div className=" relative z-10 space-y-2">
                    <div className="text-[0.8rem] truncate text-zinc-700 !font-medium ">{title}</div>
                    <div className="text-3xl text-orange-600 !font-bold">{loading ? <div className=' h-6 bg-orange-100 w-full rounded-sm animate-pulse'></div> : value}</div>
                  </div>
                 
                  <div className=' flex flex-col items-end justify-between'>
                    <div className=" relative z-10 bg-orange-50 w-10 h-10 rounded-full flex items-center justify-center text-orange-500">
                    {icon}
                    </div>
            
                 
                  </div>
                  
            
                 
                </div>

                <div className=' w-full flex items-end justify-end'>
                    <IonInput
                      name="year"
                      type="number"
                      value={year}
                      onIonChange={(e) => setYear(Number(e.detail.value))}
                      placeholder="Search year ..."
                      className="text-xs !p-2 !min-h-[1rem] w-fit rounded-md !border-zinc-400 !bg-white ![--background:white] md:![--padding-bottom:2] ![--padding-top:2] ![--padding-start:2] border"
                    />
                </div>

                 <Table className=" w-full border-collapse mt-4">
                    <TableHeader className=" bg-white backdrop-blur-sm shadow-sm">
                    <TableHeadRow>
                        <TableHead className="!font-[400] border-b border-gray-200">Year</TableHead>
                        <TableHead className="!font-[400] border-b border-gray-200">Month</TableHead>
                        <TableHead className="  !font-[600] bg-zinc-100">No. of Members</TableHead>
                        <TableHead className="!font-[400] border-b border-gray-200">Action</TableHead>
                    </TableHeadRow>
                    </TableHeader>

                    <TableBody>

                      {data.data.length !== 0 && data.data.map((item, index) => (
                          <TableRow
                        key={item.month}
                            className="!border-1 [&>td]:text-[0.7rem]"
                        >
                            <TableCell>{item.year}</TableCell>
                            <TableCell>{item.month}</TableCell>
                            <TableCell>{Number(item.count).toLocaleString()}</TableCell>

                            <TableCell>
                                <ViewMemberListInfo year={item.year} month={index + 1}/>
                            </TableCell>
                        </TableRow>
                      ))}
                    
                      
                    </TableBody>
                </Table>

                 {/* <TablePagination currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePagination} disabled={data.loading} /> */}
         </div>
        
        </div>
      </IonModal>
    </>
  );
};

export default ViewMemberDetails;

import { IonButton, IonHeader, IonIcon, IonInput, IonModal, IonSelect, IonSelectOption, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { UserMultiple02Icon, ViewIcon} from 'hugeicons-react';
import DashboardCard from './DashboardCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from "../../../../ui/table/Table"
import TablePagination from '../../../../ui/forms/TablePagination';

type DashboardCardProps = {
  title: string;
  icon: React.ReactElement; 
  value: string;
  loading?: boolean;
  details?: boolean
};
const Loanlist = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  
    const [data, setData] = useState<any>({
      loans: [],
      loading: false,
      totalPages: 0,
      nextPage: false,
      prevPage: false,
    });

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
        className=" bg-orange-50 rounded-lg w-20 h-2! ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  capitalize text-xs"
      >
        <ViewIcon size={25} stroke='.8' className="text-xs" />
        &nbsp;View
      </IonButton>
      <IonModal isOpen={isOpen} backdropDismiss={false} className=" [--border-radius:0.7rem] auto-height [--max-width:90rem] [--width:95%]">
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader title="Loan Details" sub="System" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6">
            <ModalHeader title="Loan List" sub="" dismiss={dismiss} />

         <div className=' w-full flex flex-col'>
              <div className=" relative shadow-sm h-full! bg-orange-50 p-6 flex-1 w-full max-w-64 rounded-xl flex items-start justify-between overflow-hidden">
                  <div className=" relative z-10 space-y-2">
                    <div className="text-[0.8rem] truncate text-zinc-700 !font-medium ">Total Loans</div>
                    <div className="text-3xl text-orange-600 !font-bold">0</div>
                  </div>
                 
                  <div className=' flex flex-col items-end justify-between'>
                    <div className=" relative z-10 bg-orange-50 w-10 h-10 rounded-full flex items-center justify-center text-orange-500">
                   <UserMultiple02Icon stroke='.8' size={20}/>
                    </div>
            
                 
                  </div>
                  
            
                 
                </div>
           

                <div className=' w-full flex items-end  justify-between mt-4'>
                    <div className=' flex items-center gap-2'>
                        <IonInput
                        name="year"
                        type='number'
                        placeholder="Year..."
                        className=" text-xs !p-2 !min-h-[1rem] w-fit rounded-md !border-zinc-400  !bg-white ![--background:white] md:![--padding-bottom:2] ![--padding-top:2] ![--padding-start:2] border "
                        />

                       <IonSelect
                        placeholder="Month"
                        labelPlacement="stacked"
                        interface="popover"
                        className="!border border-zinc-400 rounded-md !min-h-[1rem] [--highlight-color-focused:none] !px-2 !py-2 text-xs !overflow-y-auto w-[12rem] !max-w-[24rem] !max-h-[18rem]"
                        >
                        <IonSelectOption value="January" className="text-xs">January</IonSelectOption>
                        <IonSelectOption value="February" className="text-xs">February</IonSelectOption>
                        <IonSelectOption value="March" className="text-xs">March</IonSelectOption>
                        <IonSelectOption value="April" className="text-xs">April</IonSelectOption>
                        <IonSelectOption value="May" className="text-xs">May</IonSelectOption>
                        <IonSelectOption value="June" className="text-xs">June</IonSelectOption>
                        <IonSelectOption value="July" className="text-xs">July</IonSelectOption>
                        <IonSelectOption value="August" className="text-xs">August</IonSelectOption>
                        <IonSelectOption value="September" className="text-xs">September</IonSelectOption>
                        <IonSelectOption value="October" className="text-xs">October</IonSelectOption>
                        <IonSelectOption value="November" className="text-xs">November</IonSelectOption>
                        <IonSelectOption value="December" className="text-xs">December</IonSelectOption>
                        </IonSelect>
                    </div>
                    
                     <IonInput
                      name="search"
                      type='text'
                      placeholder="Search ..."
                      className=" text-xs !p-2 !min-h-[1rem] w-fit rounded-md !border-zinc-400  !bg-white ![--background:white] md:![--padding-bottom:2] ![--padding-top:2] ![--padding-start:2] border "
                    />
                </div>

                 <Table className=" w-full border-collapse mt-4">
                    <TableHeader className=" bg-white backdrop-blur-sm shadow-sm">
                    <TableHeadRow>
                        <TableHead className="!font-[400] border-b border-gray-200">Name</TableHead>
                        <TableHead className="!font-[400] border-b border-gray-200">Date</TableHead>
                        <TableHead className="!font-[400] border-b border-gray-200">Amount</TableHead>
                       
                    </TableHeadRow>
                    </TableHeader>

                    <TableBody>
                    
                        <TableRow
                        
                            className="!border-1 [&>td]:text-[0.7rem]"
                        >
                            <TableCell>Grace</TableCell>
                            <TableCell>3/15/26</TableCell>
                            <TableCell>15,000</TableCell>
                         
                        </TableRow>
                    </TableBody>
                </Table>

                 <TablePagination currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePagination} disabled={data.loading} />
         </div>
        
        </div>
      </IonModal>
    </>
  );
};

export default Loanlist;

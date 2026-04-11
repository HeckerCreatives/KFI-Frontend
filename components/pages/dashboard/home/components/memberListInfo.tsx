import { IonButton, IonHeader, IonIcon, IonInput, IonModal, IonSelect, IonSelectOption, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { UserMultiple02Icon, ViewIcon} from 'hugeicons-react';
import DashboardCard from './DashboardCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from "../../../../ui/table/Table"
import TablePagination from '../../../../ui/forms/TablePagination';
import { ClientMasterFile, TTableFilter } from '../../../../../types/types';
import { TABLE_LIMIT } from '../../../../utils/constants';
import kfiAxios from '../../../../utils/axios';
import TableNoRows from '../../../../ui/forms/TableNoRows';
import TableLoadingRow from '../../../../ui/forms/TableLoadingRow';
import Paginations from '../../../../ui/common/PaginationsV2';
import { ArrowDown, ArrowLeft, ArrowUp, Eye } from 'lucide-react';
import ViewClientMasterFile from './ViewClientMasterFile';
import UpdateClientMasterFile from './UpdateClientMasterFile';


export type TClientMasterFile = {
  clients: ClientMasterFile[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

 type Props = {
  year: number,
  month: number,
  openList: boolean,
  view: boolean,
  setOpenList: React.Dispatch<React.SetStateAction<boolean>>
  setView: React.Dispatch<React.SetStateAction<boolean>>
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
 }

 const SORTS = {
  ACCTNO_ASC: 'acctno-asc',
  ACCTNO_DESC: 'acctno-desc',
  NAME_ASC: 'name-asc',
  NAME_DESC: 'name-desc',
  CENTER_DESC: 'center-desc',
  CENTER_ASC: 'center-asc',
}



const ViewMemberListInfo = ({year, month, openList, setOpenList, setIsOpen, view, setView}: Props) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState('')
  const [gender, setGender] = useState('all')
  const [status, setStatus] = useState('all')
  const [date, setDate] = useState('')
  const [sortKey, setSortKey] = useState<string[]>(['name-asc']);
  const [selected, setSelected] = useState<any>()
  
  
    const [data, setData] = useState<TClientMasterFile>({
      clients: [],
      loading: false,
      totalPages: 0,
      nextPage: false,
      prevPage: false,
    });

  const dismiss = () => {
    setOpenList(false);
    setSearch('')
    setDate('')
    setStatus('all')
    setGender('all')
    setCurrentPage(1)
  };

    const getClients = async (page: number, keyword: string = '',) => {
      setData(prev => ({ ...prev, loading: true }));
  
      try {
        const filter: any = { limit: TABLE_LIMIT, page };
        if (keyword) filter.search = keyword;
        if (year) filter.year = year;
        if (month) filter.month = month;
        if (search) filter.search = search;
        if (gender) filter.gender = gender === 'all' ? '' : gender;
        if (status) filter.status = status === 'all' ? '' : status;
        if (date) filter.dateRelease = date;
        if (sortKey) filter.sort = sortKey;
        const result = await kfiAxios.get('/customer/members-by-month', { params: filter });
        const { success, customers, hasPrevPage, hasNextPage, totalPages, data } = result.data;
        if (data.success) {
          setData(prev => ({
            ...prev,
            clients: data.members,
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

      useEffect(() => {

       if(openList){
        const timer = setTimeout(() => {
         getClients(currentPage, search);
       }, 500);
       return () => clearTimeout(timer);
       }
     }, [openList, search, gender, date, status, sortKey, currentPage]);

       useEffect(() => {

      setCurrentPage(1)
     }, [openList, search, gender, date, status, sortKey]);
  
  

  const handlePagination = (page: number) => setCurrentPage(page);


  const toggleSort = (asc: string, desc: string) => {
    setSortKey((prev) => {
      if (prev.includes(asc)) {
        return [desc];
      }
      if (prev.includes(desc)) {
        return [asc];
      }
      return [asc];
    });
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
                  onClick={() => {setIsOpen(true), setOpenList(false)}}
                  type="button"
                  fill="clear"
                  className=" bg-orange-50 mb-4 rounded-lg w-20 h-2! ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  capitalize text-xs"
                >
                 <ArrowLeft size={15} className=' mr-1'/>
                Back
          </IonButton>

            <ModalHeader title="Members List" sub="" dismiss={dismiss} />

            
         <div className=' w-full flex flex-col'>
           

                <div className=' w-full flex items-end  justify-between'>
                    <div className=' flex items-center gap-2'>
                      
                    </div>

                    <div className=' flex items-center gap-2'>
                         <div className=' flex flex-col gap-1'>
                         <p className=' text-xs'>Gender</p>
                          <IonSelect
                          name="search"
                          value={gender}
                           interface="popover"
                          onIonChange={(e) => setGender(String(e.detail.value))}
                          placeholder="Select Gender"
                          className="!text-xs !border border-zinc-400 rounded-md !min-h-[1rem] [--highlight-color-focused:none] !px-2 !py-2 !overflow-y-auto w-[6rem]  !max-h-[18rem]"
                        >
                          <IonSelectOption value="all" className="text-xs">All</IonSelectOption>
                          <IonSelectOption value="male" className="text-xs">Male</IonSelectOption>
                          <IonSelectOption value="female" className="text-xs">Female</IonSelectOption>
                        </IonSelect>
                      </div>

                       <div className=' flex flex-col gap-1'>
                         <p className=' text-xs'>Status</p>
                           <IonSelect
                            name="status"
                            value={status}
                            interface="popover"
                            onIonChange={(e) => setStatus(String(e.detail.value))}
                  
                            className="!text-xs !border border-zinc-400 rounded-md !min-h-[1rem] [--highlight-color-focused:none] !px-2 !py-2 !overflow-y-auto w-[9rem]  !max-h-[18rem]"
                            >
                            <IonSelectOption value={'all'} className=' !text-xs'>All</IonSelectOption>
                            <IonSelectOption value={'Active On-Leave'} className=' !text-xs'>Active On-Leave</IonSelectOption>
                            <IonSelectOption value={'Active-Existing'} className=' !text-xs'>Active-Existing</IonSelectOption>
                            <IonSelectOption value={'Active-New'} className=' !text-xs'>Active-New</IonSelectOption>
                            <IonSelectOption value={'Active-PastDue'} className=' !text-xs'>Active-PastDue</IonSelectOption>
                            <IonSelectOption value={'Active-Returnee'} className=' !text-xs'>Active-Returnee</IonSelectOption>
                            <IonSelectOption value={'Resigned'} className=' !text-xs'>Resigned</IonSelectOption>

                          </IonSelect>
                      </div>

                       <div className=' flex flex-col gap-1'>
                         <p className=' !text-xs'>Date Release</p>
                          <IonInput
                            name="date"
                            value={date}
                            onIonInput={(e) => setDate(String(e.target.value))}
                            type='date'
                            className="text-xs !p-2 !min-h-[1rem] w-fit rounded-md !border-zinc-400 !bg-white ![--background:white] md:![--padding-bottom:2] ![--padding-top:2] ![--padding-start:2] border"
                          />
                      </div>

                     

                       
                     
                        
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

                <div className=' w-full overflow-x-auto'>
                    <Table className=" w-full border-collapse mt-4">
                    <TableHeader className=" bg-white backdrop-blur-sm shadow-sm">
                    <TableHeadRow>
                        <TableHead className="!font-[400] border-b border-gray-200">
                          <div className="flex items-center gap-6">
                            Name
                            {sortKey.includes(SORTS.NAME_ASC) ? (
                              <ArrowUp
                                size={15}
                                onClick={() => toggleSort(SORTS.NAME_ASC, SORTS.NAME_DESC)}
                                className="cursor-pointer"
                              />
                            ) : sortKey.includes(SORTS.NAME_DESC) ? (
                              <ArrowDown
                                size={15}
                                onClick={() => toggleSort(SORTS.NAME_ASC, SORTS.NAME_DESC)}
                                className="cursor-pointer"
                              />
                            ) : (
                              <ArrowUp
                                size={15}
                                onClick={() => toggleSort(SORTS.NAME_ASC, SORTS.NAME_DESC)}
                                className="cursor-pointer opacity-30"
                              />
                            )}
                          </div>
                        </TableHead>
                         <TableHead className="  !font-[600] bg-zinc-100">
                          <div className="flex items-center gap-6">
                            Acct. No
                            {sortKey.includes(SORTS.ACCTNO_ASC) ? (
                              <ArrowUp
                                size={15}
                                onClick={() => toggleSort(SORTS.ACCTNO_ASC, SORTS.ACCTNO_DESC)}
                                className="cursor-pointer"
                              />
                            ) : sortKey.includes(SORTS.ACCTNO_DESC) ? (
                              <ArrowDown
                                size={15}
                                onClick={() => toggleSort(SORTS.ACCTNO_ASC, SORTS.ACCTNO_DESC)}
                                className="cursor-pointer"
                              />
                            ) : (
                              <ArrowUp
                                size={15}
                                onClick={() => toggleSort(SORTS.ACCTNO_ASC, SORTS.ACCTNO_DESC)}
                                className="cursor-pointer opacity-30"
                              />
                            )}
                          </div>
                        </TableHead>
                         <TableHead className="  !font-[600] bg-zinc-100">
                           <div className="flex items-center gap-6">
                            Center
                            {sortKey.includes(SORTS.CENTER_ASC) ? (
                              <ArrowUp
                                size={15}
                                onClick={() => toggleSort(SORTS.CENTER_ASC, SORTS.CENTER_DESC)}
                                className="cursor-pointer"
                              />
                            ) : sortKey.includes(SORTS.CENTER_DESC) ? (
                              <ArrowDown
                                size={15}
                                onClick={() => toggleSort(SORTS.CENTER_ASC, SORTS.CENTER_DESC)}
                                className="cursor-pointer"
                              />
                            ) : (
                              <ArrowUp
                                size={15}
                                onClick={() => toggleSort(SORTS.CENTER_ASC, SORTS.CENTER_DESC)}
                                className="cursor-pointer opacity-30"
                              />
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="!font-[400] border-b border-gray-200">Sex</TableHead>
                       
                        <TableHead className="  !font-[600] bg-zinc-100">Date Release</TableHead>
                       
                        <TableHead className="  !font-[600] bg-zinc-100">Acct. Officer</TableHead>
                        <TableHead className="  !font-[600] bg-zinc-100">Status</TableHead>
                        <TableHead className="  !font-[600] bg-zinc-100">Action</TableHead>
                    </TableHeadRow>
                    </TableHeader>

                    <TableBody>

                       {!data.loading && data.clients.length < 1 && <TableNoRows label="No Record Found" colspan={8} />}

                      {!data.loading && data.clients.length !== 0 && data.clients.map((item) => (
                         <TableRow
                        key={item._id}
                            className="!border-1 [&>td]:text-[0.7rem]"
                        >
                            <TableCell>{item?.name}</TableCell>
                            <TableCell>{item?.acctNumber}</TableCell>
                            <TableCell>{item.center?.centerNo}</TableCell>
                            <TableCell className=' capitalize'>{item?.sex}</TableCell>
                            <TableCell>{item?.dateRelease?.split('T')[0] || ''}</TableCell>
                            <TableCell>{item?.acctOfficer}</TableCell>
                            <TableCell>{item?.status}</TableCell>
                            <TableCell>
                               <IonButton
                               onClick={() => {setView(true), setOpenList(false), setSelected(item)}}
                               type="button"
                               fill="clear"
                              className=" capitalize text-sm !text-zinc-700 w-fit bg-orange-50"
                             >
                               <Eye size={20} className=' mr-1'/>
                               <span>View</span>
                             </IonButton>
                              {/* <ViewClientMasterFile member={item}/> */}
                            </TableCell>
                        </TableRow>
                      )) }

                    {data.loading && <TableLoadingRow colspan={7} />}

                    
                      
                    </TableBody>
                </Table>
                </div>

               

                   {(!data.loading && data.clients.length !== 0) && (
                 <Paginations currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePagination} disabled={data.loading} />

                )}
         </div>
        
        </div>
      </IonModal>
      {selected && (
      <UpdateClientMasterFile client={selected} view={view} setView={setView} setOpenList={setOpenList}/>

      )}


    </>
  );
};

export default ViewMemberListInfo;

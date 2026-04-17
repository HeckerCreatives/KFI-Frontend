import { IonButton, IonContent, IonIcon, IonPage, IonSpinner, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import PageTitle from '../../../ui/page/PageTitle';
import CreateClientMasterFile from './modals/CreateClientMasterFile';
import ClientMasterFileFilter from './components/ClientMasterFileFilter';
import { AccessToken, ClientMasterFile as ClientMasterFileType, TTableFilter } from '../../../../types/types';
import { TABLE_LIMIT } from '../../../utils/constants';
import kfiAxios from '../../../utils/axios';
import TablePagination from '../../../ui/forms/TablePagination';
import { formatDateTable } from '../../../utils/date-utils';
import ClientMasterFileActions from './components/ClientMasterFileActions';
import { canDoAction, haveActions } from '../../../utils/permissions';
import { jwtDecode } from 'jwt-decode';
import TableLoadingRow from '../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../ui/forms/TableNoRows';
import PrintAllClient from './modals/PrintAllClient';
import ExportAllClient from './modals/ExportAllClient';
import ManageAccountNav from '../../../ui/navs/ManageAccountNav';
import { create, eye, trash } from 'ionicons/icons';
import ClientStatistics from './components/ClientStatistics';
import { db } from '../../../../database/db';
import { useOnlineStore } from '../../../../store/onlineStore';
import { get } from 'http';
import { filterAndSortClients } from '../../../ui/utils/sort';
import { Upload } from 'lucide-react';
import ReportProgress from '../../../ui/common/report-progress';
import TestPrintAllClient from './modals/Test';
import Paginations from '../../../ui/common/PaginationsV2';
import { set } from 'zod';
import { SortableTableHeader } from '../../../ui/table/SortableTableHeader';

export type TClientMasterFile = {
  clients: ClientMasterFileType[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

// StatusBadge.tsx
type Status =
  | 'Active On-Leave'
  | 'Active-Existing'
  | 'Active-New'
  | 'Active-PastDue'
  | 'Active-Returnee'
  | 'Resigned';

type Variant = 'filled' | 'outlined' | 'solid';

const statusConfig: Record<Status, { bg: string; border: string; text: string; dot: string }> = {
  'Active On-Leave': {
    bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-900', dot: 'bg-amber-500',
  },
  'Active-Existing': {
    bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-900', dot: 'bg-teal-500',
  },
  'Active-New': {
    bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', dot: 'bg-blue-400',
  },
  'Active-PastDue': {
    bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-900', dot: 'bg-red-400',
  },
  'Active-Returnee': {
    bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-900', dot: 'bg-purple-400',
  },
  Resigned: {
    bg: 'bg-stone-100', border: 'border-stone-300', text: 'text-stone-600', dot: 'bg-stone-400',
  },
};

export const StatusBadge = ({ status, variant = 'filled' }: { status: Status; variant?: Variant }) => {
  const c = statusConfig[status];
  const base = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border select-none';
  const cls =
    variant === 'filled'
      ? `${base} ${c?.bg} ${c?.border} ${c?.text}`
      : variant === 'outlined'
      ? `${base} bg-transparent ${c?.border} ${c?.text}`
      : `${base} bg-current border-transparent text-white`; // solid handled inline

  return (
    <span className={cls}>
      <span className={`w-1.5 h-1.5 rounded-full ${c?.dot}`} />
      {status}
    </span>
  );
};

const SORTS = {
  ACCTNO_ASC: 'acctno-asc',
  ACCTNO_DESC: 'acctno-desc',
  NAME_ASC: 'name-asc',
  NAME_DESC: 'name-desc',
}

const ClientMasterFile = () => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')
  const [present] = useIonToast();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKey, setSearchKey] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('name-asc');
  const [status, setStatus] = useState<string>('');
  const [dateReleased, setDateReleased] = useState<string>('');
  const [dateResigned, setDateResigned] = useState<string>('');

  //online status
  const online = useOnlineStore((state) => state.online);

  const [data, setData] = useState<TClientMasterFile>({
    clients: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  const getClientsOffline = async (
    page: number,
    keyword: string = '',
    sort: string = ''
  ) => {
    setData(prev => ({ ...prev, loading: true }));

    try {
      const limit = TABLE_LIMIT;

      let data = await db.clientMasterFile.toArray();
      let allData = filterAndSortClients(data, keyword, sort);

      const totalItems = allData.length;
      const totalPages = Math.ceil(totalItems / limit);

      const start = (page - 1) * limit;
      const end = start + limit;

      const customers = allData.slice(start, end);

      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;

      setData(prev => ({
        ...prev,
        clients: customers,
        totalPages,
        prevPage: hasPrevPage,
        nextPage: hasNextPage,
      }));

      setCurrentPage(page);
      setSearchKey(keyword);
      setSortKey(sort);
    } catch (error) {
      console.error("Offline clients fetch error:", error);
      present({
        message: 'Failed to load offline client records.',
        duration: 1000,
      });
    } finally {
      setData(prev => ({ ...prev, loading: false }));
    }
  };


  const [statistics, setStatistics] = useState({
    loading: false,
    totalClient: 0,
    resigned: 0,
    activeOnLeave: 0,
    activeExisting: 0,
    activeNew: 0,
    activePastDue: 0,
    activeReturnee: 0,
  });

  const getOfflineStatistics = async() =>{
    const clients = await db.clientMasterFile.toArray();

    let totalClient = clients.length;
    let resigned = 0;
    let activeOnLeave = 0;
    let activeExisting = 0;
    let activeNew = 0;
    let activePastDue = 0;
    let activeReturnee = 0;

    for (const c of clients) {
      const status = c.memberStatus?.toLowerCase() ?? "";


      if (status === "resigned") resigned++;
      if (status === "active on-leave") activeOnLeave++;
      if (status === "active-existing") activeExisting++;
      if (status === "active-new") activeNew++;
      if (status === "active past-due") activePastDue++;
      if (status === "active-returnee") activeReturnee++;
    }

    setStatistics(prev => ({ ...prev, totalClient, resigned, activeOnLeave, activeExisting, activeNew, activePastDue, activeReturnee }));


  return {
    totalClient,
    resigned,
    activeOnLeave,
    activeExisting,
    activeNew,
    activePastDue,
    activeReturnee,
  };
  }

  const getStatistics = async () => {
    try {
      setStatistics(prev => ({ ...prev, loading: true }));
      const result = await kfiAxios.get('/customer/statistics');
      const { totalClient, resigned, activeOnLeave, activeExisting, activeNew, activePastDue, activeReturnee } = result.data;
      setStatistics(prev => ({ ...prev, totalClient, resigned, activeOnLeave, activeExisting, activeNew, activePastDue, activeReturnee }));
    } catch (error) {
      present({
        message: 'Failed to get client statistics. Please try again',
        duration: 1000,
      });
    } finally {
      setStatistics(prev => ({ ...prev, loading: false }));
    }
  };

  const getStatisticsData = async () => {
    if (online) {
      getStatistics();  
    } else {
      getOfflineStatistics();
    }
  };



  const getClients = async (page: number, keyword: string = '', sort: string = 'name-asc', status: string = '', dateReleased: string = '', dateResigned: string = '') => {
    setData(prev => ({ ...prev, loading: true }));

    try {
      const filter: TTableFilter = { limit: TABLE_LIMIT, page };
      if (keyword) filter.search = keyword;
      if (sort) filter.sort = sort || 'name-asc';
      if (status) filter.status = status;
      if (dateReleased) filter.dateReleased = dateReleased;
      if (dateResigned) filter.dateResigned = dateResigned;
      const result = await kfiAxios.get('/customer', { params: filter });
      const { success, customers, hasPrevPage, hasNextPage, totalPages } = result.data;
      if (success) {
        setData(prev => ({
          ...prev,
          clients: customers,
          totalPages: totalPages,
          nextPage: hasNextPage,
          prevPage: hasPrevPage,
        }));
        getStatistics();
        setCurrentPage(page);
        setSearchKey(keyword);
        setSortKey(sort);
        return;
      }
    } catch (error) {
      present({
        message: 'Failed to get records. Please try again',
        duration: 1000,
      });
    } finally {
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  const getCLientsData = async (page: number, keyword = '', sort = '') => {
    if (online){
      getClients(page, keyword, sort);  
    } else {
      getClientsOffline(page, keyword, sort);
    }
  };

  const handlePagination = (page: number) => setCurrentPage(page);
  const [uploading, setUploading] = useState<boolean>(false)
  

  useIonViewWillEnter(() => {
    getClients(currentPage)
    getStatisticsData()
  });

  // useEffect(() => {
  //   getClients(currentPage, searchKey, sortKey)
  // },[sortKey])

      useEffect(() => {
        setCurrentPage(1)
      const timer = setTimeout(() => {
      getClients(currentPage, searchKey, sortKey, status, dateReleased, dateResigned);

      }, 500);

      return () => clearTimeout(timer);

    }, [sortKey, searchKey, dateReleased, dateResigned, status]);

     useEffect(() => {
        setCurrentPage(1)
    }, [sortKey, searchKey, dateReleased, dateResigned, status]);
  

    useEffect(() => {
       const timer = setTimeout(() => {
           getClients(currentPage, searchKey, sortKey, status, dateReleased, dateResigned);

      }, 500);

      return () => clearTimeout(timer);
    }, [currentPage]);
  



  return (
    <IonPage className=" w-full flex items-center justify-center !h-full pb-12 bg-zinc-100">
      <IonContent className="[--background:#F4F4F5] max-w-[1920px]  ">
        <div className="h-full flex flex-col gap-4 py-6 items-stretch justify-start p-4 ">
         <div className=' space-y-1'>
              {/* <PageTitle pages={['Dashboard']} /> */}
              <p className=' text-xl text-gray-700 !font-medium'>Manage Account</p>
              <p className=' text-sm text-gray-500 '>Manage user and members accounts.</p>

            </div>
          <div className=" flex-1 flex flex-col gap-4">
            <ManageAccountNav />
           
            <div className="pb-1">
                <ClientStatistics data={statistics} />
              </div>
            <div className=" p-4 pb-5 bg-white rounded-xl flex-1 shadow-lg">
               <div className="flex items-start lg:items-center lg:flex-row flex-col flex-wrap gap-2 my-2">
                <div className="flex flex-wrap">
                  {canDoAction(token.role, permissions, 'clients', 'create') && <CreateClientMasterFile getClientsOffline={getClientsOffline} getClients={getClients} />}
                  {/* <TestPrintAllClient search={searchKey} sort={sortKey}/> */}
                  {canDoAction(token.role, permissions, 'clients', 'print') && <PrintAllClient search={searchKey} sort={sortKey} />}
                  {canDoAction(token.role, permissions, 'clients', 'export') && <ExportAllClient search={searchKey} sort={sortKey} />} 
                </div>
                <ClientMasterFileFilter setDateResigned={setDateResigned} setDateReleased={setDateReleased} setStatus={setStatus} setSearchKey={setSearchKey} setSorthKey={setSortKey} getClientsOffline={getClientsOffline} getClients={getClients} clients={data.clients.map(item => item.name)} />
              </div>
              <div className="relative flex overflow-auto rounded-xl">
                <Table className=' sticky z-50 top-0 left-0 md:table hidden'>
                  <TableHeader className=''>
                    <TableHeadRow className=''>
                      <TableHead className=" hidden lg:table-cell min-w-[12rem] max-w-[12rem] py-4">
                        <SortableTableHeader 
                          label="Acct. No"
                          sortKey="acctno"
                          currentSort={sortKey}
                          ascValue={SORTS.ACCTNO_ASC}
                          descValue={SORTS.ACCTNO_DESC}
                          onSort={setSortKey}
                        />
                      </TableHead>
                      <TableHead className=" hidden lg:table-cell min-w-[10rem] max-w-[10rem] py-4">
                        <SortableTableHeader 
                          label="Name"
                          sortKey="name"
                          currentSort={sortKey}
                          ascValue={SORTS.NAME_ASC}
                          descValue={SORTS.NAME_DESC}
                          onSort={setSortKey}
                        />
                      </TableHead>
                      <TableHead className="hidden lg:table-cell min-w-[10rem] max-w-[10rem]">Center No.</TableHead>
                      <TableHead className="hidden lg:table-cell min-w-[12rem] max-w-[12rem]">Account Officer</TableHead>
                    </TableHeadRow>
                  </TableHeader>
                  <TableBody>
                    {/* {data.loading && <TableLoadingRow colspan={25} />} */}
                    {/* {!data.loading && data.clients.length < 1 && <TableNoRows label="No Client Record Found" colspan={25} />} */}
                    {!data.loading &&
                      data.clients.length > 0 &&
                      data.clients.map((client: ClientMasterFileType) => (
                        <TableRow key={client._id} className="[&>td]:bg-white">
                          <TableCell className="hidden lg:table-cell min-w-[10rem] max-w-[10rem]">{client.acctNumber}</TableCell>
                          <TableCell className=" hidden lg:table-cell min-w-[10rem] max-w-[10rem]">{client.name}</TableCell>
                          <TableCell className="hidden lg:table-cell min-w-[5rem] max-w-[5rem]">{client.center?.centerNo}</TableCell>
                          <TableCell className="hidden lg:table-cell min-w-[12rem] max-w-[12rem]">{client.acctOfficer}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>

               
               
                <Table className=' '>
                  <TableHeader>
                    <TableHeadRow>
                      <TableHead className=" lg:hidden min-w-[12rem] max-w-[12rem]">
                        <SortableTableHeader 
                          label="Account No."
                          sortKey="acctno"
                          currentSort={sortKey}
                          ascValue={SORTS.ACCTNO_ASC}
                          descValue={SORTS.ACCTNO_DESC}
                          onSort={setSortKey}
                        />
                      </TableHead>
                      <TableHead className=" lg:hidden min-w-[10rem] max-w-[10rem]">
                        <SortableTableHeader 
                          label="Name"
                          sortKey="name"
                          currentSort={sortKey}
                          ascValue={SORTS.NAME_ASC}
                          descValue={SORTS.NAME_DESC}
                          onSort={setSortKey}
                        />
                      </TableHead>
                      <TableHead className=" lg:hidden min-w-[10rem] max-w-[10rem]">Center No.</TableHead>
                      <TableHead className=" lg:hidden min-w-[12rem] max-w-[12rem]">Account Officer</TableHead>
                      <TableHead className=" min-w-[10rem] max-w-[10rem]">Member Status</TableHead>
                      <TableHead className=' whitespace-nowrap'>Address</TableHead>
                      <TableHead className=' whitespace-nowrap'>City</TableHead>
                      <TableHead className=' whitespace-nowrap'>Zip Code</TableHead>
                      <TableHead className=' whitespace-nowrap'>Mobile No.</TableHead>
                      <TableHead className=' whitespace-nowrap'>Sex</TableHead>
                      <TableHead className=' whitespace-nowrap'>Date Release</TableHead>
                      <TableHead className=' whitespace-nowrap'>Date Resigned</TableHead>
                      {/* {haveActions(token.role, 'clients', permissions, ['update', 'delete', 'visible']) && <TableHead>Actions</TableHead>} */}
                    </TableHeadRow>
                  </TableHeader>
                  <TableBody>
                    {/* {data.loading && <TableLoadingRow colspan={25} />} */}
                    {/* {!data.loading && data.clients.length < 1 && <TableNoRows label="No Client Record Found" colspan={25} />} */}
                    {!data.loading &&
                      data.clients.length > 0 &&
                      data.clients.map((client: ClientMasterFileType) => (
                        <TableRow key={client._id} className="[&>td]:bg-white">
                          <TableCell className=" lg:hidden min-w-[10rem] max-w-[10rem]">{client.acctNumber}</TableCell>
                          <TableCell className=" md:hidden min-w-[10rem] max-w-[10rem]">{client.name}</TableCell>
                          <TableCell className=" lg:hidden min-w-[5rem] max-w-[5rem]">{client.center?.centerNo}</TableCell>
                          <TableCell className=" lg:hidden min-w-[12rem] max-w-[12rem]">{client.acctOfficer}</TableCell>
                         <TableCell className="min-w-[10rem] max-w-[10rem]">
                            <StatusBadge status={(client?.memberStatus as Status)} />
                          </TableCell>
                          <TableCell>{client.address}</TableCell>
                          <TableCell>{client.city}</TableCell>
                          <TableCell>{client.zipCode}</TableCell>
                          <TableCell>{client.mobileNo}</TableCell>
                          <TableCell className=' capitalize'>{client.sex}</TableCell>
                          <TableCell>{client.dateRelease?.split('T')[0] || ''}</TableCell>
                          <TableCell>{client.dateResigned?.split('T')[0] || ''}</TableCell>
                          {/* {haveActions(token.role, 'clients', permissions, ['update', 'delete', 'visible']) && (
                            <TableCell>
                              <ClientMasterFileActions
                              getClientsOffline={getClientsOffline}
                                client={client}
                                getClients={getClients}
                                setData={setData}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                searchKey={searchKey}
                                sortKey={sortKey}
                                rowLength={data.clients.length}
                              />
                            </TableCell>
                          )} */}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>

                 <Table className=' sticky z-50 top-0 right-0 '>
                  <TableHeader className=''>
                    <TableHeadRow className=''>
                      <TableHead className="">Action</TableHead>
                    
                    </TableHeadRow>
                  </TableHeader>
                  <TableBody>
                    {/* {data.loading && <TableLoadingRow colspan={25} />} */}
                    {/* {!data.loading && data.clients.length < 1 && <TableNoRows label="No Client Record Found" colspan={25} />} */}
                    {!data.loading &&
                      data.clients.length > 0 &&
                      data.clients.map((client: ClientMasterFileType) => (
                        <TableRow key={client._id} className="[&>td]:bg-white">
                            {haveActions(token.role, 'clients', permissions, ['update', 'delete', 'visible']) && (
                            <TableCell className='  '>
                              <ClientMasterFileActions
                              getClientsOffline={getClientsOffline}
                                client={client}
                                getClients={getClients}
                                setData={setData}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                searchKey={searchKey}
                                sortKey={sortKey}
                                rowLength={data.clients.length}
                              />
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>

                
              </div>
              {data.clients.length !== 0 && (
          <Paginations currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePagination} disabled={data.loading} />

              )}

               {!data.loading && data.clients.length < 1 &&(
                  <p className=' text-xs text-zinc-800 w-full text-center mt-4'>No Client Record Found</p>   
                )}

                {data.loading && (
                  <div className=' w-full mt-4 flex items-center justify-center'>
                <IonSpinner name="lines-small" />

                  </div>
                )}



            </div>

            <div className=' w-full !h-[300px]'>

          </div>
          </div>

          
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ClientMasterFile;

import { IonContent, IonPage, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
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

export type TClientMasterFile = {
  clients: ClientMasterFileType[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const ClientMasterFile = () => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const [present] = useIonToast();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKey, setSearchKey] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('');

  const [data, setData] = useState<TClientMasterFile>({
    clients: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  const getClients = async (page: number, keyword: string = '', sort: string = '') => {
    setData(prev => ({ ...prev, loading: true }));
    try {
      const filter: TTableFilter = { limit: TABLE_LIMIT, page };
      if (keyword) filter.search = keyword;
      if (sort) filter.sort = sort;
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
        setCurrentPage(page);
        setSearchKey(keyword);
        setSortKey(sort);
        return;
      }
    } catch (error) {
      present({
        message: 'Failed to get client records. Please try again',
        duration: 1000,
      });
    } finally {
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  const handlePagination = (page: number) => getClients(page, searchKey, sortKey);

  useIonViewWillEnter(() => {
    getClients(currentPage);
  });

  return (
    <IonPage className="">
      <IonContent className="[--background:#F1F1F1]" fullscreen>
        <div className="h-full flex flex-col items-stretch justify-start">
          <div>
            <PageTitle pages={['Manage Account', 'Clients']} />
          </div>
          <div className="px-3 pb-3 pt-2 flex-1">
            <ManageAccountNav />
            <div className="flex items-center justify-center gap-3 bg-white px-3 py-2 rounded-2xl shadow-lg mt-3 mb-4">
              <div className="flex">
                {canDoAction(token.role, token.permissions, 'clients', 'create') && <CreateClientMasterFile getClients={getClients} />}
                {canDoAction(token.role, token.permissions, 'clients', 'print') && <PrintAllClient />}
                {canDoAction(token.role, token.permissions, 'clients', 'export') && <ExportAllClient />}
              </div>
              <ClientMasterFileFilter getClients={getClients} />
            </div>
            <div className="relative overflow-auto">
              <Table>
                <TableHeader>
                  <TableHeadRow>
                    <TableHead>Account No.</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Group No.</TableHead>
                    <TableHead>Center No.</TableHead>
                    <TableHead>Account Officer</TableHead>
                    <TableHead>New Status</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Zip Code</TableHead>
                    <TableHead>Telephone No.</TableHead>
                    <TableHead>Mobile No.</TableHead>
                    {haveActions(token.role, 'clients', token.permissions, ['update', 'delete', 'visible']) && <TableHead>Actions</TableHead>}
                  </TableHeadRow>
                </TableHeader>
                <TableBody>
                  {data.loading && <TableLoadingRow colspan={25} />}
                  {!data.loading && data.clients.length < 1 && <TableNoRows label="No Client Record Found" colspan={25} />}
                  {!data.loading &&
                    data.clients.length > 0 &&
                    data.clients.map((client: ClientMasterFileType) => (
                      <TableRow key={client._id}>
                        <TableCell>{client.acctNumber}</TableCell>
                        <TableCell>{client.name}</TableCell>
                        <TableCell>{client.groupNumber.code}</TableCell>
                        <TableCell>{client.center.centerNo}</TableCell>
                        <TableCell>{client.acctOfficer}</TableCell>
                        <TableCell>{client.newStatus}</TableCell>
                        <TableCell>{client.address}</TableCell>
                        <TableCell>{client.city}</TableCell>
                        <TableCell>{client.zipCode}</TableCell>
                        <TableCell>{client.telNo}</TableCell>
                        <TableCell>{client.mobileNo}</TableCell>
                        {haveActions(token.role, 'clients', token.permissions, ['update', 'delete', 'visible']) && (
                          <TableCell>
                            <ClientMasterFileActions
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
          </div>
          <TablePagination currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePagination} disabled={data.loading} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ClientMasterFile;

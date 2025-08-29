import { IonContent, IonPage, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import PageTitle from '../../../ui/page/PageTitle';
import CreateCenter from './modals/CreateCenter';
import CenterFilter from './components/CenterFilter';
import CenterActions from './components/CenterActions';
import { AccessToken, Center as CenterType, TTableFilter } from '../../../../types/types';
import { TABLE_LIMIT } from '../../../utils/constants';
import kfiAxios from '../../../utils/axios';
import TablePagination from '../../../ui/forms/TablePagination';
import TableLoadingRow from '../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../ui/forms/TableNoRows';
import { canDoAction, haveActions } from '../../../utils/permissions';
import { jwtDecode } from 'jwt-decode';
import PrintAllCenter from './modals/PrintAllCenter';
import ExportAllCenter from './modals/ExportAllCenter';

export type TCenter = {
  centers: CenterType[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const Center = () => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const [present] = useIonToast();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKey, setSearchKey] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('');

  const [data, setData] = useState<TCenter>({
    centers: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  const getCenters = async (page: number, keyword: string = '', sort: string = '') => {
    setData(prev => ({ ...prev, loading: true }));
    try {
      const filter: TTableFilter = { limit: TABLE_LIMIT, page };
      if (keyword) filter.search = keyword;
      if (sort) filter.sort = sort;
      const result = await kfiAxios.get('/center', { params: filter });
      const { success, centers, hasPrevPage, hasNextPage, totalPages } = result.data;
      if (success) {
        setData(prev => ({
          ...prev,
          centers: centers,
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
        message: 'Failed to get center records. Please try again',
        duration: 1000,
      });
    } finally {
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  const handlePagination = (page: number) => getCenters(page, searchKey, sortKey);

  useIonViewWillEnter(() => {
    getCenters(currentPage);
  });

  return (
    <IonPage className=" w-full flex items-center justify-center h-full bg-zinc-100">
      <IonContent className="[--background:#F4F4F5] max-w-[1920px] h-full" fullscreen>
        <div className="h-full flex flex-col gap-4 py-6 items-stretch justify-start">
          <PageTitle pages={['System', 'Center']} />
          <div className="px-3 pb-3 flex-1 flex flex-col">
            

            <div className=" p-4 pb-5 bg-white rounded-xl flex-1 shadow-lg">
              <div className="flex lg:flex-row flex-col gap-3">
                <div className="flex items-center flex-wrap">
                  {canDoAction(token.role, token.permissions, 'center', 'create') && <CreateCenter getCenters={getCenters} />}
                  {canDoAction(token.role, token.permissions, 'center', 'print') && <PrintAllCenter />}
                  {canDoAction(token.role, token.permissions, 'center', 'export') && <ExportAllCenter />}
                </div>
                <CenterFilter getCenters={getCenters} />
              </div>
              <div className="relative overflow-auto rounded-xl mt-4">
                <Table>
                  <TableHeader>
                    <TableHeadRow>
                      <TableHead>Center No.</TableHead>
                      <TableHead>Center Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Center Chief</TableHead>
                      <TableHead>Treasurer</TableHead>
                      <TableHead>Account Officer</TableHead>
                      {haveActions(token.role, 'center', token.permissions, ['update', 'delete', 'visible']) && <TableHead>Actions</TableHead>}
                    </TableHeadRow>
                  </TableHeader>
                  <TableBody>
                    {data.loading && <TableLoadingRow colspan={7} />}
                    {!data.loading && data.centers.length < 1 && <TableNoRows label="No Center Record Found" colspan={7} />}
                    {!data.loading &&
                      data.centers.length > 0 &&
                      data.centers.map((center: CenterType) => (
                        <TableRow key={center._id}>
                          <TableCell>{center.centerNo}</TableCell>
                          <TableCell>{center.description}</TableCell>
                          <TableCell>{center.location}</TableCell>
                          <TableCell>{center.centerChief}</TableCell>
                          <TableCell>{center.treasurer}</TableCell>
                          <TableCell>{center.acctOfficer}</TableCell>
                          {haveActions(token.role, 'center', token.permissions, ['update', 'delete', 'visible']) && (
                            <TableCell>
                              <CenterActions
                                center={center}
                                setData={setData}
                                getCenters={getCenters}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                searchKey={searchKey}
                                sortKey={sortKey}
                                rowLength={data.centers.length}
                              />
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
          <TablePagination currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePagination} disabled={data.loading} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Center;

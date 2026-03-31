import { IonButton, IonContent, IonPage, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useEffect, useState } from 'react';
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
import { useOnlineStore } from '../../../../store/onlineStore';
import { db } from '../../../../database/db';
import { filterAndSortCenter } from '../../../ui/utils/sort';
import { ArrowDown, ArrowUp, Upload } from 'lucide-react';

export type TCenter = {
  centers: CenterType[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const SORTS = {
  CODE_ASC: 'centerno-asc',
  CODE_DESC: 'centerno-desc',
  DESCRIPTION_ASC: 'description-asc',
  DESCRIPTION_DESC: 'description-desc',
}


const Center = () => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')

  const [present] = useIonToast();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKey, setSearchKey] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false)
  const online = useOnlineStore((state) => state.online);
  

  const [data, setData] = useState<TCenter>({
    centers: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });


  const getCenters = async (page: number, keyword: string = '', sort: string = '') => {
    if(online){
       setData(prev => ({ ...prev, loading: true }));
      try {
        const filter: TTableFilter = { limit: TABLE_LIMIT, page };
        if (keyword) filter.search = keyword;
        if (keyword) filter.keyword = keyword;
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
    }else{
      setData(prev => ({ ...prev, loading: true }));
      
          try {
            const limit = TABLE_LIMIT;
      
            let data = await db.centers.toArray();
            console.log(data)
            const filteredCenters = data.filter(e => !e.deletedAt);
            let allData = filterAndSortCenter(filteredCenters, keyword, sort);
      
            const totalItems = allData.length;
            const totalPages = Math.ceil(totalItems / limit);
      
            const start = (page - 1) * limit;
            const end = start + limit;
      
            const centers = allData.slice(start, end);
      
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;
      
            setData(prev => ({
              ...prev,
              centers: centers,
              totalPages,
              prevPage: hasPrevPage,
              nextPage: hasNextPage,
            }));

      
            setCurrentPage(page);
            setSearchKey(keyword);
            setSortKey(sort);
          } catch (error) {
            present({
              message: 'Failed to load offline records.',
              duration: 1000,
            });
          } finally {
            setData(prev => ({ ...prev, loading: false }));
          }
    }
   
  };

  const handlePagination = (page: number) => setCurrentPage(page);

  useIonViewWillEnter(() => {
    getCenters(currentPage);
  });

    useEffect(() => {
       setCurrentPage(1);
       getCenters(1, searchKey, sortKey);
     }, [searchKey, sortKey]);
     
     useEffect(() => {
       getCenters(currentPage, searchKey, sortKey);
     }, [currentPage]);
   


  return (
    <IonPage className=" w-full flex items-center justify-center h-full bg-zinc-100">
      <IonContent className="[--background:#F4F4F5] max-w-[1920px] h-full" fullscreen>
        <div className="h-full flex flex-col gap-4 py-6 items-stretch justify-start">
          <div className="px-3 pb-3 flex-1 flex flex-col">

             <div className=' space-y-1 mb-6'>
              <p className=' text-xl text-gray-700 !font-medium'>Center</p>
              <p className=' text-sm text-gray-500 '>Manage center records.</p>
            </div>
            

            <div className=" p-4 pb-16 bg-white rounded-xl flex-1 shadow-lg">
              <div className="flex lg:flex-row flex-col gap-3">
                <div className="flex items-center flex-wrap gap-2">
                  {canDoAction(token.role, permissions, 'center', 'create') && <CreateCenter getCenters={getCenters} />}
                  {canDoAction(token.role, permissions, 'center', 'print') && <PrintAllCenter />}
                  {canDoAction(token.role, permissions, 'center', 'export') && <ExportAllCenter />}
                 
                </div>
                <CenterFilter getCenters={getCenters} setSearchKey={setSearchKey} suggestion={data.centers.map((item) => item.centerNo)} />
              </div>
              <div className="relative overflow-auto rounded-xl mt-4">
                <Table>
                  <TableHeader>
                    <TableHeadRow>
                      <TableHead>
                         <div className="flex items-center gap-6">
                         Center no.
                          {sortKey === SORTS.CODE_ASC ? (
                            <ArrowUp
                              size={15}
                              onClick={() => setSortKey(SORTS.CODE_DESC)}
                              className="cursor-pointer"
                            />
                          ) : sortKey === SORTS.CODE_DESC ? (
                            <ArrowDown
                              size={15}
                              onClick={() => setSortKey(SORTS.CODE_ASC)}
                              className="cursor-pointer"
                            />
                          ) : (
                            <ArrowUp
                              size={15}
                              onClick={() => setSortKey(SORTS.CODE_ASC)}
                              className="cursor-pointer opacity-30"
                            />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>
                         <div className="flex items-center gap-6">
                         Name
                          {sortKey === SORTS.DESCRIPTION_ASC ? (
                            <ArrowUp
                              size={15}
                              onClick={() => setSortKey(SORTS.DESCRIPTION_DESC)}
                              className="cursor-pointer"
                            />
                          ) : sortKey === SORTS.DESCRIPTION_DESC ? (
                            <ArrowDown
                              size={15}
                              onClick={() => setSortKey(SORTS.DESCRIPTION_ASC)}
                              className="cursor-pointer"
                            />
                          ) : (
                            <ArrowUp
                              size={15}
                              onClick={() => setSortKey(SORTS.DESCRIPTION_ASC)}
                              className="cursor-pointer opacity-30"
                            />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Center Chief</TableHead>
                      <TableHead>Treasurer</TableHead>
                      <TableHead>Account Officer</TableHead>
                      {haveActions(token.role, 'center', permissions, ['update', 'delete', 'visible']) && <TableHead>Actions</TableHead>}
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
                          {haveActions(token.role, 'center', permissions, ['update', 'delete', 'visible']) && (
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

          <TablePagination currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePagination} disabled={data.loading} />

            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Center;

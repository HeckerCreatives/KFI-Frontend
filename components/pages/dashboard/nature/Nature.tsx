import { IonButton, IonContent, IonPage, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import PageTitle from '../../../ui/page/PageTitle';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import CreateNature from './modals/CreateNature';
import NatureFilter from './components/NatureFilter';
import NatureActions from './components/NatureActions';
import { AccessToken, Nature as NatureType, TTableFilter } from '../../../../types/types';
import { TABLE_LIMIT } from '../../../utils/constants';
import kfiAxios from '../../../utils/axios';
import TableLoadingRow from '../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../ui/forms/TableNoRows';
import TablePagination from '../../../ui/forms/TablePagination';
import { useOnlineStore } from '../../../../store/onlineStore';
import { db } from '../../../../database/db';
import { filterAndSortNatures } from '../../../ui/utils/sort';
import { RefreshCcw, Upload } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { canDoAction } from '../../../utils/permissions';
import Paginations from '../../../ui/common/PaginationsV2';

export type TNature = {
  natures: NatureType[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const Nature = () => {

  const [present] = useIonToast();
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
   const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')


  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKey, setSearchKey] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('');
  const online = useOnlineStore((state) => state.online);
  const [uploading, setUploading] = useState<boolean>(false)

  const [data, setData] = useState<TNature>({
    natures: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  const getNatures = async (page: number, keyword: string = '', sort: string = '') => {
   if(online){
     setData(prev => ({ ...prev, loading: true }));
    try {
      const filter: TTableFilter = { limit: TABLE_LIMIT, page };
      if (keyword) filter.search = keyword;
      if (sort) filter.sort = sort;
      const result = await kfiAxios.get('/nature', { params: filter });
      const { success, natures, hasPrevPage, hasNextPage, totalPages } = result.data;
      if (success) {
        setData(prev => ({
          ...prev,
          natures: natures,
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
        message: 'Failed to get nature records. Please try again',
        duration: 1000,
      });
    } finally {
      setData(prev => ({ ...prev, loading: false }));
    }
   } else {
     setData(prev => ({ ...prev, loading: true }));
      try {
        const limit = TABLE_LIMIT;
        let data = await db.natures.toArray();
        const filteredData = data.filter(e => !e.deletedAt);
        let allData = filterAndSortNatures(filteredData, keyword, sort);
        const totalItems = allData.length;
        const totalPages = Math.ceil(totalItems / limit);
        const start = (page - 1) * limit;
        const end = start + limit;
        const finalData = allData.slice(start, end);
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;
        console.log(finalData)
        setData(prev => ({
          ...prev,
          natures: finalData,
          totalPages,
          prevPage: hasPrevPage,
          nextPage: hasNextPage,
        }));
        setCurrentPage(page);
        setSearchKey(keyword);
        setSortKey(sort);
      } catch (error) {
        console.log(error)
        present({
          message: 'Failed to load records.',
          duration: 1000,
        });
      } finally {
        setData(prev => ({ ...prev, loading: false }));
      }
   }
  };


  const handlePagination = (page: number) => getNatures(page, searchKey, sortKey);

  useIonViewWillEnter(() => {
    getNatures(currentPage);
  });

   useEffect(() => {
             setCurrentPage(1);
             getNatures(1, searchKey, sortKey);
           }, [searchKey, sortKey]);
           
           useEffect(() => {
             getNatures(currentPage, searchKey, sortKey);
           }, [currentPage]);
  

  return (
    <IonPage className=" w-full flex items-center justify-center h-full bg-zinc-100 ">
      <IonContent className="[--background:#f4f4f5] max-w-[1920px] h-full" fullscreen>
        <div className="h-full flex flex-col gap-4 items-stretch justify-start p-4">
          <div className="px-3 pb-3 flex-1">

            <div className=' space-y-1 mb-6'>
              <p className=' text-xl text-gray-700 !font-medium'>Nature</p>
              <p className=' text-sm text-gray-500 '>Manage nature records.</p>
            </div>
           
            <div className="relative overflow-auto px-3 pt-3 pb-16 bg-white rounded-xl flex-1 shadow-lg">
               <div className="flex items-center justify-center gap-2 flex-wrap">
                {canDoAction(token.role, permissions, 'nature', 'create') && (
                  <CreateNature getNatures={getNatures} />
                )}
              
              <NatureFilter getNatures={getNatures} setSearchKey={setSearchKey} suggestions={data.natures.map((item) => item.nature)} />

                 <IonButton fill="clear" onClick={() => getNatures(currentPage, searchKey)} className="!h-10 !text-white w-fit bg-[#FA6C2F] !rounded-lg">
                                   <RefreshCcw size={15}/>
                                 </IonButton>
            </div>
              <Table>
                <TableHeader>
                  <TableHeadRow>
                    <TableHead>Nature</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableHeadRow>
                </TableHeader>
                <TableBody>
                  {data.loading && <TableLoadingRow colspan={3} />}
                  {!data.loading && data.natures.length < 1 && <TableNoRows label="No Nature Record Found" colspan={3} />}
                  {!data.loading &&
                    data.natures.length > 0 &&
                    data.natures.map((nature: NatureType) => (
                      <TableRow key={nature._id}>
                        <TableCell>{nature.nature}</TableCell>
                        <TableCell>{nature.description}</TableCell>
                        <TableCell>
                          <NatureActions
                            nature={nature}
                            setData={setData}
                            getNatures={getNatures}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            searchKey={searchKey}
                            sortKey={sortKey}
                            rowLength={data.natures.length}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>

         
              {data.natures.length !== 0 && (
                <Paginations currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePagination} disabled={data.loading} />

              )}


            </div>
            <div className=' w-full h-[300px]'></div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Nature;

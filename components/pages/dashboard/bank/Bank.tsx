import { IonButton, IonContent, IonPage, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import PageTitle from '../../../ui/page/PageTitle';
import CreateBank from './modals/CreateBank';
import BankFilter from './components/BankFilter';
import BankActions from './components/BankActions';
import { AccessToken, Bank as BankType, Permission, TTableFilter } from '../../../../types/types';
import { TABLE_LIMIT } from '../../../utils/constants';
import kfiAxios from '../../../utils/axios';
import TablePagination from '../../../ui/forms/TablePagination';
import TableLoadingRow from '../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../ui/forms/TableNoRows';
import { jwtDecode } from 'jwt-decode';
import { canDoAction, haveActions } from '../../../utils/permissions';
import { useOnlineStore } from '../../../../store/onlineStore';
import { db } from '../../../../database/db';
import { filterAndSortBanks } from '../../../ui/utils/sort';
import { ArrowDown, ArrowUp, Upload } from 'lucide-react';

export type TBank = {
  banks: BankType[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const SORTS = {
  CODE_ASC: 'code-asc',
  CODE_DESC: 'code-desc',
  DESCRIPTION_ASC: 'description-asc',
  DESCRIPTION_DESC: 'description-desc',
}

const Bank = () => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')

  const [present] = useIonToast();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKey, setSearchKey] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('');
  const online = useOnlineStore((state) => state.online);
  const [uploading, setUploading] = useState<boolean>(false)

  const [data, setData] = useState<TBank>({
    banks: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  const getBanks = async (page: number, keyword: string = '', sort: string = '') => {
   if(online){
     setData(prev => ({ ...prev, loading: true }));
    try {
      const filter: TTableFilter = { limit: TABLE_LIMIT, page };
      if (keyword) filter.search = keyword;
      if (sort) filter.sort = sort;
      const result = await kfiAxios.get('/bank', { params: filter });
      const { success, banks, hasPrevPage, hasNextPage, totalPages } = result.data;
      if (success) {
        setData(prev => ({
          ...prev,
          banks: banks,
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
        message: 'Failed to get bank records. Please try again',
        duration: 1000,
      });
    } finally {
      setData(prev => ({ ...prev, loading: false }));
    }
   } else {
    setData(prev => ({ ...prev, loading: true }));
        
                    
                        try {
                          const limit = TABLE_LIMIT;
                    
                          let data = await db.banks.toArray();

                          console.log(data)
        
                          const filteredData = data.filter(e => e.action !== 'delete');
                          let allData = filterAndSortBanks(filteredData, keyword, sort);
                    
                          const totalItems = allData.length;
                          const totalPages = Math.ceil(totalItems / limit);
                    
                          const start = (page - 1) * limit;
                          const end = start + limit;
                    
                          const coa = allData.slice(start, end);
                    
                          const hasPrevPage = page > 1;
                          const hasNextPage = page < totalPages;
                    
                          setData(prev => ({
                            ...prev,
                            banks: coa,
                            totalPages,
                            prevPage: hasPrevPage,
                            nextPage: hasNextPage,
                          }));
              
                    
                          setCurrentPage(page);
                          setSearchKey(keyword);
                          setSortKey(sort);
                        } catch (error) {
                          present({
                            message: 'Failed to load records.',
                            duration: 1000,
                          });
                        } finally {
                          setData(prev => ({ ...prev, loading: false }));
                        }
   }
  };



  const handlePagination = (page: number) => setCurrentPage(page);

  useIonViewWillEnter(() => {
    getBanks(currentPage);
  });

      useEffect(() => {
         setCurrentPage(1);
         getBanks(1, searchKey, sortKey);
       }, [searchKey, sortKey]);
       
       useEffect(() => {
         getBanks(currentPage, searchKey, sortKey);
       }, [currentPage]);


  return (
    <IonPage className=" w-full flex items-center justify-center h-full bg-zinc-100">
      <IonContent className="[--background:#F1F1F1] max-w-[1920px] h-full" fullscreen>
        <div className="h-full flex flex-col gap-4 py-6 items-stretch justify-start">
          <div className="px-3 pb-3 flex-1 flex flex-col">
            <div className=' space-y-1 mb-6'>
              <p className=' text-xl text-gray-700 !font-medium'>Bank</p>
              <p className=' text-sm text-gray-500 '>Manage bank records.</p>
            </div>
            
            <div className="px-3 pt-3 pb-16 bg-white rounded-xl flex-1 shadow-lg">
              <div className="flex flex-col lg:flex-row items-start justify-start gap-3">
                <div className=' flex flex-wrap gap-2'>{canDoAction(token.role, permissions, 'bank', 'create') && <CreateBank getBanks={getBanks} />}
               
                </div>
                <BankFilter getBanks={getBanks} setSearchKey={setSearchKey} suggestion={data.banks.map((item) => item.code)} />
              </div>
              <div className="relative overflow-auto rounded-xl mt-4">
                <Table>
                  <TableHeader>
                    <TableHeadRow>
                      <TableHead>
                        <div className="flex items-center gap-6">
                        Code
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
                          Description
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
                      {haveActions(token.role, 'bank', permissions, ['update', 'delete', 'visible']) && <TableHead>Actions</TableHead>}
                    </TableHeadRow>
                  </TableHeader>
                  <TableBody>
                    {data.loading && <TableLoadingRow colspan={3} />}
                    {!data.loading && data.banks.length < 1 && <TableNoRows label="No Bank Record Found" colspan={3} />}
                    {!data.loading &&
                      data.banks.length > 0 &&
                      data.banks.map((bank: BankType) => (
                        <TableRow key={bank._id}>
                          <TableCell>{bank.code}</TableCell>
                          <TableCell>{bank.description}</TableCell>
                          {haveActions(token.role, 'bank', permissions, ['update', 'delete', 'visible']) && (
                            <TableCell>
                              <BankActions
                                bank={bank}
                                setData={setData}
                                getBanks={getBanks}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                searchKey={searchKey}
                                sortKey={sortKey}
                                rowLength={data.banks.length}
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

export default Bank;

import { IonButton, IonContent, IonPage, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import PageTitle from '../../../ui/page/PageTitle';
import CreateGroupAccount from './modals/CreateGroupAccount';
import GroupAccountFilter from './components/GroupAccountFilter';
import GroupAccountActions from './components/GroupAccountActions';
import { AccessToken, GroupAccount as GroupAccountType, TTableFilter } from '../../../../types/types';
import { TABLE_LIMIT } from '../../../utils/constants';
import kfiAxios from '../../../utils/axios';
import TablePagination from '../../../ui/forms/TablePagination';
import TableLoadingRow from '../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../ui/forms/TableNoRows';
import { jwtDecode } from 'jwt-decode';
import { canDoAction, haveActions } from '../../../utils/permissions';
import { useOnlineStore } from '../../../../store/onlineStore';
import { db } from '../../../../database/db';
import { filterAndSortGOA } from '../../../ui/utils/sort';
import { ArrowDown, ArrowUp, RefreshCcw, Upload } from 'lucide-react';
import Paginations from '../../../ui/common/PaginationsV2';

export type TGroupAccount = {
  groupAccounts: GroupAccountType[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const SORTS = {
  CODE_ASC: 'code-asc',
  CODE_DESC: 'code-desc',
}

const GroupAccount = () => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')

  const [present] = useIonToast();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKey, setSearchKey] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('');
  const online = useOnlineStore((state) => state.online);
  const [uploading, setUploading] = useState<boolean>(false)
  
  

  const [data, setData] = useState<TGroupAccount>({
    groupAccounts: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  const getGroupAccounts = async (page: number, keyword: string = '', sort: string = '') => {
    if(online){
      setData(prev => ({ ...prev, loading: true }));
    try {
      const filter: TTableFilter = { limit: TABLE_LIMIT, page };
      if (keyword) filter.search = keyword;
      if (sort) filter.sort = sort;
      const result = await kfiAxios.get('/group-account', { params: filter });
      const { success, groupAccounts, hasPrevPage, hasNextPage, totalPages } = result.data;
      if (success) {
        setData(prev => ({
          ...prev,
          groupAccounts: groupAccounts,
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
        message: 'Failed to get group account records. Please try again',
        duration: 1000,
      });
    } finally {
      setData(prev => ({ ...prev, loading: false }));
    }
    } else {
       setData(prev => ({ ...prev, loading: true }));
                try {
                  const limit = TABLE_LIMIT;
            
                  let data = await db.groupOfAccounts.toArray();

                  console.log('GOA', data)

                  const filteredData = data.filter(e => e.action !== 'delete');
                  let allData = filterAndSortGOA(filteredData, keyword, sort);
            
                  const totalItems = allData.length;
                  const totalPages = Math.ceil(totalItems / limit);
            
                  const start = (page - 1) * limit;
                  const end = start + limit;
            
                  const goa = allData.slice(start, end);
            
                  const hasPrevPage = page > 1;
                  const hasNextPage = page < totalPages;
            
                  setData(prev => ({
                    ...prev,
                    groupAccounts: goa,
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
    getGroupAccounts(currentPage);
  });

  useEffect(() => {
    setCurrentPage(1);
    getGroupAccounts(1, searchKey, sortKey);
  }, [searchKey, sortKey]);
  
  useEffect(() => {
    getGroupAccounts(currentPage, searchKey, sortKey);
  }, [currentPage]);


  return (
    <IonPage className=" w-full flex items-center justify-center h-full bg-zinc-100">
      <IonContent className="[--background:#F4F4F5] max-w-[1920px] h-full" fullscreen>
        <div className="h-full flex flex-col gap-4 py-6 items-stretch justify-start">
          <div className="px-3 pb-3 flex-1 flex flex-col">

            <div className=' space-y-1 mb-6'>
              {/* <PageTitle pages={['Dashboard']} /> */}
              <p className=' text-xl text-gray-700 !font-medium'>Group of Account</p>
              <p className=' text-sm text-gray-500 '>Manage group of account records.</p>

            </div>
            

            <div className=" p-4 pb-16 bg-white rounded-xl flex-1 shadow-lg">

              <div className=" flex lg:flex-row flex-col items-start justify-start">
                <div className=' flex flex-wrap items-center gap-2'>
                  {canDoAction(token.role, permissions, 'group of account', 'create') && <CreateGroupAccount getGroupAccounts={getGroupAccounts} />}
                 
                </div>
                <GroupAccountFilter getGroupAccounts={getGroupAccounts} setSearchKey={setSearchKey} setSortKey={setSortKey} suggestions={data.groupAccounts.map((item) => item.code)} />
                  <IonButton fill="clear" onClick={() => getGroupAccounts(currentPage, searchKey)} className="!h-10 !text-white w-fit bg-[#FA6C2F] !rounded-lg">
                                   <RefreshCcw size={15}/>
                                 </IonButton>
              </div>
              <div className="relative overflow-auto rounded-xl mt-4">
                <Table>
                  <TableHeader>
                    <TableHeadRow>
                       <TableHead className="min-w-44 max-w-44 sticky left-0">
                          <div className="flex items-center gap-6">
                          Name
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
                      {haveActions(token.role, 'group of account', permissions, ['update', 'delete']) && <TableHead>Actions</TableHead>}
                    </TableHeadRow>
                  </TableHeader>
                  <TableBody>
                    {data.loading && <TableLoadingRow colspan={2} />}
                    {!data.loading && data.groupAccounts.length < 1 && <TableNoRows label="No Group Account Record Found" colspan={2} />}
                    {!data.loading &&
                      data.groupAccounts.length > 0 &&
                      data.groupAccounts.map((groupAccount: GroupAccountType) => (
                        <TableRow key={groupAccount._id}>
                          <TableCell>{groupAccount.code}</TableCell>
                          {haveActions(token.role, 'group of account', permissions, ['update', 'delete']) && (
                            <TableCell>
                              <GroupAccountActions
                                groupAccount={groupAccount}
                                setData={setData}
                                getGroupAccounts={getGroupAccounts}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                searchKey={searchKey}
                                sortKey={sortKey}
                                rowLength={data.groupAccounts.length}
                              />
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
          
              {data.groupAccounts.length !== 0 && (
                <Paginations currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePagination} disabled={data.loading} />

              )}


            </div>
            <div className=' w-full h-[300px]'></div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default GroupAccount;

import { IonContent, IonPage, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
import PageTitle from '../../../ui/page/PageTitle';
import TableNoRows from '../../../ui/forms/TableNoRows';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import kfiAxios from '../../../utils/axios';
import TablePagination from '../../../ui/forms/TablePagination';
import { AccessToken, BegBalance, FinancialStatements } from '../../../../types/types';
import Create from './modals/create';
import Delete from './modals/delete';
import Update from './modals/update';
import PrintExport from './modals/print&export';
import { jwtDecode } from 'jwt-decode';
import { canDoAction } from '../../../utils/permissions';
import { useOnlineStore } from '../../../../store/onlineStore';
import { TABLE_LIMIT } from '../../../utils/constants';
import { db } from '../../../../database/db';
import { filterAndSortGOA } from '../../../ui/utils/sort';
import BBActions from './components/actions';
import Paginations from '../../../ui/common/PaginationsV2';

export type TBS = {
  beginningBalances: BegBalance[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const BeginningBalance = () => {
  const [list, setList] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1);
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')
  const online = useOnlineStore((state) => state.online);
  const [present] = useIonToast();
  
    const [data, setData] = useState<TBS>({
      beginningBalances: [],
      loading: false,
      totalPages: 0,
      nextPage: false,
      prevPage: false,
    });

   const getList = async (page: number) => {
         if(online){
           try {
            const result = await kfiAxios.get(`/beginning-balance?limit=10&page=${currentPage}`);

            const { beginningBalances, success,hasPrevPage, hasNextPage, totalPages } = result.data

            if(success){
               setData(prev => ({
              ...prev,
              beginningBalances: beginningBalances,
              totalPages: totalPages,
              nextPage: hasNextPage,
              prevPage: hasPrevPage,
            }));
            }

          } catch (error) {
          } finally {
          }
         } else {
             setData(prev => ({ ...prev, loading: true }));
                     try {
                       const limit = TABLE_LIMIT;
                       let data = await db.beginningBalance.toArray();
                       console.log(data)
                       const filteredData = data.filter(e => e.action !== 'delete');
                       let allData = filterAndSortGOA(filteredData, '', '');
                       const totalItems = allData.length;
                       const totalPages = Math.ceil(totalItems / limit);
                       const start = (page - 1) * limit;
                       const end = start + limit;
                       const fs = allData.slice(start, end);
                       const hasPrevPage = page > 1;
                       const hasNextPage = page < totalPages;
                       setData(prev => ({
                         ...prev,
                         beginningBalances: fs,
                         totalPages,
                         prevPage: hasPrevPage,
                         nextPage: hasNextPage,
                       }));
                       setCurrentPage(page);
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

  const handlePagination = (page: number) => getList(page);

  useIonViewWillEnter(() => {
    getList(currentPage);
  });
  return (
    <IonPage className=" w-full flex items-center justify-center h-full bg-zinc-100">
      <IonContent className="[--background:#F4F4F5] max-w-[1920px] h-full" fullscreen>
        <div className="h-full flex flex-col gap-4 py-6 items-stretch justify-start">
           <div className="px-3 pb-3 flex-1">

            <div className=' space-y-1 mb-6'>
              {/* <PageTitle pages={['Dashboard']} /> */}
              <p className=' text-xl text-gray-700 !font-medium'>Beginning Balance</p>
              <p className=' text-sm text-gray-500 '>Manage beginning balance records.</p>

            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {canDoAction(token.role, permissions, 'beginning balance', 'create') && (
              <Create getList={getList} currentPage={currentPage} />
              )}
              <PrintExport/>
              
            </div>
           
           
              <Table>
                <TableHeader>
                  <TableHeadRow>
                    <TableHead>Entry</TableHead>
                    <TableHead>Memo</TableHead>
                    <TableHead>Year</TableHead>
                    {/* <TableHead>Prepared By</TableHead> */}
                    <TableHead>Debit</TableHead>
                    <TableHead>Credit</TableHead>
               
                    <TableHead>Action</TableHead>
                  </TableHeadRow>
                </TableHeader>
                <TableBody>
                  {data.beginningBalances.length < 1 && <TableNoRows label="No Record Found" colspan={6} />}
                  {
                    data.beginningBalances.length > 0 &&
                    data.beginningBalances.map((item, index) => (
                      <TableRow key={item._id}>
                        <TableCell className=' capitalize'>{item.entryCount}</TableCell>
                        <TableCell className=' capitalize'>{item.memo}</TableCell>
                        <TableCell className=' capitalize'>{item.year}</TableCell>
                        <TableCell>{item.debit.toLocaleString()}</TableCell>
                        <TableCell>{item.credit.toLocaleString()}</TableCell>
                      
                        <TableCell className=' flex '>
                          <BBActions data={item} getList={getList} currentPage={currentPage}/>
                          
                        </TableCell>
                      
                      </TableRow>
                    ))}
                </TableBody>
              </Table>


            
              {data.beginningBalances.length !== 0 && (
                <Paginations currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePagination} disabled={data.loading} />

              )}


            </div>
            <div className=' w-full h-[300px]'></div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default BeginningBalance;

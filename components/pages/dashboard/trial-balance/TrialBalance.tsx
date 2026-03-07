import { IonContent, IonPage, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
import PageTitle from '../../../ui/page/PageTitle';
import TableNoRows from '../../../ui/forms/TableNoRows';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import UpdateSystemParameters from '../systemparameters/modals/UpdateParams';
import kfiAxios from '../../../utils/axios';
import CreateFS from './modals/create';
import TablePagination from '../../../ui/forms/TablePagination';
import { AccessToken, FinancialStatements } from '../../../../types/types';
import UpdateFS from './modals/update';
import DeleteFS from './modals/delete';
import UpdateFSEntries from './modals/entries';
import CreateTB from './modals/create';
import UpdateTB from './modals/update';
import DeleteTB from './modals/delete';
import TBReport from './modals/report';
import { jwtDecode } from 'jwt-decode';
import { canDoAction } from '../../../utils/permissions';
import { useOnlineStore } from '../../../../store/onlineStore';
import { TABLE_LIMIT } from '../../../utils/constants';
import { db } from '../../../../database/db';
import { filterAndSortGOA } from '../../../ui/utils/sort';

export type TBS = {
  trialBalances: any[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const TrialBalance = () => {
  const [list, setList] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1);
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')
  const online = useOnlineStore((state) => state.online);

  const [present] = useIonToast();
  
  
  
    const [data, setData] = useState<TBS>({
      trialBalances: [],
      loading: false,
      totalPages: 0,
      nextPage: false,
      prevPage: false,
    });

   const getList = async (page: number) => {
         if(online){
           try {
            const result = await kfiAxios.get('/trial-balance');
            const { data, success,hasPrevPage, hasNextPage, totalPages } = result.data

            if(success){
               setData(prev => ({
              ...prev,
              trialBalances: data.items,
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
                      let data = await db.trialBalance.toArray();
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
                        trialBalances: fs,
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
          <PageTitle pages={['General Ledger', 'Trial Balance']} />
           <div className="px-3 pb-3 flex-1">

            <div className="flex items-center gap-2 flex-wrap">
              {canDoAction(token.role, permissions, 'trial balance', 'create') && (
              <CreateTB getList={getList} currentPage={currentPage} />
              )}
            <TBReport/>

              
            </div>

           
           
              <Table>
                <TableHeader>
                  <TableHeadRow>
                    <TableHead>Report Code</TableHead>
                    {/* <TableHead>Prepared By</TableHead> */}
                    <TableHead>Report Name</TableHead>
               
                    <TableHead>Action</TableHead>
                  </TableHeadRow>
                </TableHeader>
                <TableBody>
                  {data.trialBalances.length < 1 && <TableNoRows label="No Record Found" colspan={4} />}
                  {
                    data.trialBalances.length > 0 &&
                    data.trialBalances.map((item, index) => (
                      <TableRow key={item._id}>
                        <TableCell className=' capitalize'>{item.reportCode}</TableCell>
                        <TableCell>{item.reportName}</TableCell>
                      
                        <TableCell className=' flex '>
                           {canDoAction(token.role, permissions, 'trial balance', 'update') && (
                              <UpdateTB item={item} getList={getList} currentPage={currentPage}/>
                            )}
                            {canDoAction(token.role, permissions, 'trial balance', 'delete') && (
                               <DeleteTB item={item} getList={getList} currentPage={currentPage}/>
                            )}
                            {canDoAction(token.role, permissions, 'trial balance', 'update') && (
                               <UpdateFSEntries item={item} getList={getList} currentPage={currentPage}/>
                            )}
                          
                        </TableCell>
                      
                      </TableRow>
                    ))}
                </TableBody>
              </Table>


              <TablePagination currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePagination} disabled={data.loading} />
              


          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default TrialBalance;

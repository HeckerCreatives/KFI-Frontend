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
import GenerateReport from './modals/generate-report';
import { jwtDecode } from 'jwt-decode';
import { canDoAction } from '../../../utils/permissions';
import { useOnlineStore } from '../../../../store/onlineStore';
import { TABLE_LIMIT } from '../../../utils/constants';
import { db } from '../../../../database/db';
import { filterAndSortGOA } from '../../../ui/utils/sort';

export type TFS = {
  financialStatements: FinancialStatements[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const FinancialStatement = () => {
  const [list, setList] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1);
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')
  const online = useOnlineStore((state) => state.online);
  const [present] = useIonToast();
  
     
  
    const [data, setData] = useState<TFS>({
      financialStatements: [],
      loading: false,
      totalPages: 0,
      nextPage: false,
      prevPage: false,
    });

   const getList = async (page: number) => {
        if(online){
            try {
            const result = await kfiAxios.get('/financial-statement');

            const { data, success,hasPrevPage, hasNextPage, totalPages } = result.data

            if(success){
               setData(prev => ({
              ...prev,
              financialStatements: data.items,
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
            let data = await db.financialStatements.toArray();
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
              financialStatements: fs,
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
          <PageTitle pages={['General Ledger', 'Financial Statement']} />
           <div className="px-3 pb-3 flex-1">

            <div className="flex items-center gap-2 flex-wrap">
              {canDoAction(token.role, permissions, 'financial statement', 'create') && (
              <CreateFS getList={getList} currentPage={currentPage} />
              )}

              <GenerateReport/>
              
            </div>
           
           
              <Table>
                <TableHeader>
                  <TableHeadRow>
                    <TableHead>Report Code</TableHead>
                    {/* <TableHead>Prepared By</TableHead> */}
                    <TableHead>Report Name</TableHead>
                    <TableHead>Type</TableHead>
                    {/* <TableHead>Title</TableHead>
                    <TableHead>Subtitle</TableHead> */}
                    <TableHead>Action</TableHead>
                  </TableHeadRow>
                </TableHeader>
                <TableBody>
                  {data.financialStatements.length < 1 && <TableNoRows label="No Record Found" colspan={6} />}
                  {
                    data.financialStatements.length > 0 &&
                    data.financialStatements.map((item, index) => (
                      <TableRow key={item._id}>
                        <TableCell className=' capitalize'>{item.reportCode}</TableCell>
                        <TableCell>{item.reportName}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        {/* <TableCell>{item.title}</TableCell>
                        <TableCell>{item.subTitle}</TableCell> */}
                        <TableCell className=' flex '>
                           {canDoAction(token.role, permissions, 'financial statement', 'update') && (
                            <UpdateFS key={item._id} item={item} getList={getList} currentPage={currentPage}/>
                            
                            )}
                            {canDoAction(token.role, permissions, 'financial statement', 'delete') && (
                            <DeleteFS item={item} getList={getList} currentPage={currentPage}/>
                            )}
                            {canDoAction(token.role, permissions, 'financial statement', 'update') && (
                            <UpdateFSEntries key={index} item={item} getList={getList} currentPage={currentPage}/>
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

export default FinancialStatement;

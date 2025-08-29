import { IonContent, IonPage, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import PageTitle from '../../../ui/page/PageTitle';
import CreateBusinessType from './modals/CreateBusinessType';
import BusinessTypeFilter from './components/BusinessTypeFilter';
import BusinessTypeActions from './components/BusinessTypeActions';
import { AccessToken, BusinessType as BusinessTypeInt, TTableFilter } from '../../../../types/types';
import { TABLE_LIMIT } from '../../../utils/constants';
import kfiAxios from '../../../utils/axios';
import TableLoadingRow from '../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../ui/forms/TableNoRows';
import TablePagination from '../../../ui/forms/TablePagination';
import { jwtDecode } from 'jwt-decode';
import { canDoAction, haveActions } from '../../../utils/permissions';

export type TBusinessType = {
  businessTypes: BusinessTypeInt[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const BusinessType = () => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const [present] = useIonToast();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKey, setSearchKey] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('');

  const [data, setData] = useState<TBusinessType>({
    businessTypes: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  const getBusinessTypes = async (page: number, keyword: string = '', sort: string = '') => {
    setData(prev => ({ ...prev, loading: true }));
    try {
      const filter: TTableFilter = { limit: TABLE_LIMIT, page };
      if (keyword) filter.search = keyword;
      if (sort) filter.sort = sort;
      const result = await kfiAxios.get('/business-type', { params: filter });
      const { success, businessTypes, hasPrevPage, hasNextPage, totalPages } = result.data;
      if (success) {
        setData(prev => ({
          ...prev,
          businessTypes: businessTypes,
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
        message: 'Failed to get loan records. Please try again',
        duration: 1000,
      });
    } finally {
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  const handlePagination = (page: number) => getBusinessTypes(page, searchKey, sortKey);

  useIonViewWillEnter(() => {
    getBusinessTypes(currentPage);
  });

  return (
    <IonPage className="w-full flex items-center justify-center h-full bg-zinc-100">
      <IonContent className="[--background:#F4F4F5] max-w-[1920px] h-full" fullscreen>
        <div className="h-full flex flex-col gap-4 py-6 items-stretch justify-start">
          <PageTitle pages={['System', 'Business', 'Type']} />
          <div className="px-3 pb-3 flex-1 flex flex-col">
           
            <div className="px-3 pt-3 pb-5 bg-white rounded-xl flex-1 shadow-lg">
               <div className="flex flex-col lg:flex-row items-start justify-start ">
                <div>{canDoAction(token.role, token.permissions, 'business type', 'create') && <CreateBusinessType getBusinessTypes={getBusinessTypes} />}</div>
                <BusinessTypeFilter getBusinessTypes={getBusinessTypes} />
              </div>
              <div className="relative overflow-auto rounded-xl mt-4">
                <Table>
                  <TableHeader>
                    <TableHeadRow>
                      <TableHead>Business Type</TableHead>
                      {haveActions(token.role, 'business type', token.permissions, ['update', 'delete', 'visible']) && <TableHead>Actions</TableHead>}
                    </TableHeadRow>
                  </TableHeader>
                  <TableBody>
                    {data.loading && <TableLoadingRow colspan={3} />}
                    {!data.loading && data.businessTypes.length < 1 && <TableNoRows label="No Business Type Record Found" colspan={3} />}
                    {!data.loading &&
                      data.businessTypes.length > 0 &&
                      data.businessTypes.map((businessType: BusinessTypeInt) => (
                        <TableRow key={businessType._id}>
                          <TableCell>{businessType.type}</TableCell>
                          {haveActions(token.role, 'business type', token.permissions, ['update', 'delete', 'visible']) && (
                            <TableCell>
                              <BusinessTypeActions
                                businessType={businessType}
                                setData={setData}
                                getBusinessTypes={getBusinessTypes}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                searchKey={searchKey}
                                sortKey={sortKey}
                                rowLength={data.businessTypes.length}
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

export default BusinessType;

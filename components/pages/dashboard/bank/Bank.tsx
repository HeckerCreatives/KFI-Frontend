import { IonContent, IonPage, IonTitle, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import PageTitle from '../../../ui/page/PageTitle';
import CreateBank from './modals/CreateBank';
import BankFilter from './components/BankFilter';
import BankActions from './components/BankActions';
import { Bank as BankType, TTableFilter } from '../../../../types/types';
import { TABLE_LIMIT } from '../../../utils/constants';
import kfiAxios from '../../../utils/axios';
import TablePagination from '../../../ui/forms/TablePagination';
import TableLoadingRow from '../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../ui/forms/TableNoRows';

export type TBank = {
  banks: BankType[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const Bank = () => {
  const [present] = useIonToast();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKey, setSearchKey] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('');

  const [data, setData] = useState<TBank>({
    banks: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  const getBanks = async (page: number, keyword: string = '', sort: string = '') => {
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
  };

  const handlePagination = (page: number) => getBanks(page, searchKey, sortKey);

  useIonViewWillEnter(() => {
    getBanks(currentPage);
  });

  return (
    <IonPage className="">
      <IonContent className="[--background:#F1F1F1]" fullscreen>
        <div className="h-full flex flex-col items-stretch justify-start">
          <PageTitle pages={['All Files', 'Bank']} />
          <div className="px-3 pb-3 flex-1">
            <div className="flex items-center justify-center gap-3 bg-white px-3 py-2 rounded-2xl shadow-lg mt-3 mb-4">
              <CreateBank getBanks={getBanks} />
              <BankFilter getBanks={getBanks} />
            </div>
            <div className="relative overflow-auto">
              <Table>
                <TableHeader>
                  <TableHeadRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
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

export default Bank;

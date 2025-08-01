import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../../ui/table/Table';
import { useIonToast, useIonViewWillEnter } from '@ionic/react';
import { TTableFilter } from '../../../../../types/types';
import { TABLE_LIMIT } from '../../../../utils/constants';
import kfiAxios from '../../../../utils/axios';
import TablePagination from '../../../../ui/forms/TablePagination';
import TableLoadingRow from '../../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../../ui/forms/TableNoRows';
import { formatNumber } from '../../../../ui/utils/formatNumber';

export type Member = {
  _id: string;
  debit: number;
  client: { name: string };
};
export type TRecentMember = {
  entries: Member[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const RecentLoans = () => {
  const [present] = useIonToast();

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [data, setData] = useState<TRecentMember>({
    entries: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  const getRecentLoans = async (page: number) => {
    setData(prev => ({ ...prev, loading: true }));
    try {
      const filter: TTableFilter = { limit: TABLE_LIMIT, page };
      const result = await kfiAxios.get('/statistics/recent-loans', { params: filter });
      const { success, entries, hasPrevPage, hasNextPage, totalPages } = result.data;
      if (success) {
        setData(prev => ({
          ...prev,
          entries: entries,
          totalPages: totalPages,
          nextPage: hasNextPage,
          prevPage: hasPrevPage,
        }));
        setCurrentPage(page);
        return;
      }
    } catch (error) {
      present({
        message: 'Failed to get recentt members records. Please try again',
        duration: 1000,
      });
    } finally {
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  const handlePagination = (page: number) => getRecentLoans(page);

  useEffect(() => {
    getRecentLoans(currentPage);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="relative overflow-auto flex-1">
        <Table>
          <TableHeader>
            <TableHeadRow className="bg-white !border-0 [&>th]:uppercase">
              <TableHead className=" text-orange-700 !font-[600]">Name</TableHead>
              <TableHead className="text-center text-orange-700 !font-[600]">Amount</TableHead>
            </TableHeadRow>
          </TableHeader>
          <TableBody>
            {data.loading && <TableLoadingRow colspan={3} />}
            {!data.loading && data.entries.length < 1 && <TableNoRows label="No Recent Loan Found" colspan={3} />}
            {!data.loading &&
              data.entries.length > 0 &&
              data.entries.map((entry: Member, i: number) => (
                <TableRow key={`${entry._id}-${i}`} className="!border-0 odd:bg-orange-50 [&>td]:text-[0.8rem]">
                  <TableCell className="">{entry.client.name}</TableCell>
                  <TableCell className="text-center">{formatNumber(entry.debit)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <TablePagination currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePagination} disabled={data.loading} />
    </div>
  );
};

export default RecentLoans;

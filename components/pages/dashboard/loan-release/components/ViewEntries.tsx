import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../../ui/table/Table';
import { Entry, Transaction, TTableFilter } from '../../../../../types/types';
import { TABLE_LIMIT } from '../../../../utils/constants';
import kfiAxios from '../../../../utils/axios';
import { useIonToast } from '@ionic/react';
import TablePagination from '../../../../ui/forms/TablePagination';
import { formatNumber } from '../../../../ui/utils/formatNumber';
import UpdateEntry from '../modals/entries/UpdateEntry';
import DeleteEntry from '../modals/entries/DeleteEntry';
import AddEntry from '../modals/entries/AddEntry';
import TableLoadingRow from '../../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../../ui/forms/TableNoRows';

export type TData = {
  entries: Entry[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

type ViewEntriesProps = {
  isOpen: boolean;
  transaction: Transaction;
};

const ViewEntries = ({ isOpen, transaction }: ViewEntriesProps) => {
  const [present] = useIonToast();
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [data, setData] = useState<TData>({
    entries: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  const getEntries = async (page: number) => {
    setData(prev => ({ ...prev, loading: true }));
    try {
      const filter: TTableFilter = { limit: TABLE_LIMIT, page };

      const result = await kfiAxios.get(`/transaction/loan-release/entries/${transaction._id}`, { params: filter });
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
        message: 'Failed to get entry records. Please try again',
        duration: 1000,
      });
    } finally {
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  const handlePagination = (page: number) => getEntries(page);

  useEffect(() => {
    if (isOpen) {
      getEntries(1);
    }
  }, [isOpen]);

  return (
    <div className="pb-2 h-full flex flex-col mt-2">
      <div className="relative overflow-auto flex-1">
        <Table>
          <TableHeader>
            <TableHeadRow className="border-4 bg-slate-100 [&>th]:border-4 [&>th]:!py-1.5 [&>th]:!font-normal  [&>th]:!text-xs">
              <TableHead>Line</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Particular</TableHead>
              <TableHead>Acct. Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">Debit</TableHead>
              <TableHead className="text-center">Credit</TableHead>
              <TableHead>Interest</TableHead>
              <TableHead>Cycle</TableHead>
              <TableHead>Check No.</TableHead>
            </TableHeadRow>
          </TableHeader>
          <TableBody>
            {data.loading && <TableLoadingRow colspan={11} />}
            {!data.loading && data.entries.length < 1 && <TableNoRows label="No Entry Record Found" colspan={11} />}
            {!data.loading &&
              data.entries.map((entry: Entry, index: number) => (
                <TableRow key={entry._id} className="border-b-0 [&>td]:border-4 [&>td]:!py-1 [&>td]:!px-2 [&>td]:!text-[.8rem]">
                  <TableCell className="text-center">{(currentPage - 1) * TABLE_LIMIT + (index + 1)}</TableCell>
                  <TableCell>{entry?.client?.name}</TableCell>
                  <TableCell>{entry?.particular}</TableCell>
                  <TableCell>{entry?.acctCode?.code}</TableCell>
                  <TableCell>{entry?.acctCode?.description}</TableCell>
                  <TableCell className="text-end">{formatNumber(entry?.debit as number)}</TableCell>
                  <TableCell className="text-end">{formatNumber(entry?.credit as number)}</TableCell>
                  <TableCell className="text-center">{entry?.interest ? `${entry?.interest}%` : ''}</TableCell>
                  <TableCell className="text-center">{entry?.cycle}</TableCell>
                  <TableCell className="text-center">{entry?.checkNo}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <div className="px-3">
        <div className="grid grid-cols-3">
          <div className="flex items-center justify-start gap-2 text-sm border-4 px-2 py-1 [&>div]:!font-semibold">
            <div>Diff: </div>
            <div>{`${formatNumber(Math.abs(data.entries.reduce((acc, entry) => acc + Number(entry.debit), 0) - data.entries.reduce((acc, entry) => acc + Number(entry.credit), 0)))}`}</div>
          </div>
          <div className="flex items-center justify-start gap-2 text-sm border-4 px-2 py-1 [&>div]:!font-semibold">
            <div>Total Debit: </div>
            <div>{`${formatNumber(data.entries.reduce((acc, entry) => acc + Number(entry.debit), 0))}`}</div>
          </div>
          <div className="flex items-center justify-start gap-2 text-sm border-4 px-2 py-1 [&>div]:!font-semibold">
            <div>Total Credit: </div>
            <div>{`${formatNumber(data.entries.reduce((acc, entry) => acc + Number(entry.credit), 0))}`}</div>
          </div>
        </div>
      </div>
      <div className="pt-2">
        <TablePagination currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePagination} disabled={data.loading} />
      </div>
    </div>
  );
};

export default ViewEntries;

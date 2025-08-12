import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../../ui/table/Table';
import { JournalVoucher, JournalVoucherEntry, TTableFilter } from '../../../../../types/types';
import { TABLE_LIMIT } from '../../../../utils/constants';
import kfiAxios from '../../../../utils/axios';
import { useIonToast } from '@ionic/react';
import TablePagination from '../../../../ui/forms/TablePagination';
import { formatNumber } from '../../../../ui/utils/formatNumber';

import TableLoadingRow from '../../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../../ui/forms/TableNoRows';
import AddEntry from '../modals/entries/AddEntry';
import UpdateEntry from '../modals/entries/UpdateEntry';
import DeleteEntry from '../modals/entries/DeleteEntry';

export type TData = {
  entries: JournalVoucherEntry[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

type UpdateJVEntriesProps = {
  isOpen: boolean;
  journalVoucher: JournalVoucher;
};

const UpdateJVEntries = ({ isOpen, journalVoucher }: UpdateJVEntriesProps) => {
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
      const result = await kfiAxios.get(`/journal-voucher/entries/${journalVoucher._id}`, { params: filter });
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
    <div className="pb-2 h-full flex flex-col">
      <div>
        <AddEntry journalVoucherId={journalVoucher._id} getEntries={getEntries} />
      </div>
      <div className="relative overflow-auto flex-1">
        <Table>
          <TableHeader>
            <TableHeadRow className="border-4 bg-slate-100 [&>th]:border-4 [&>th]:!font-normal [&>th]:!py-1.5 [&>th]:!text-xs">
              <TableHead>Name</TableHead>
              <TableHead>Particular</TableHead>
              <TableHead>Acct. Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">Debit</TableHead>
              <TableHead className="text-center">Credit</TableHead>
              <TableHead>CV# for Recompute</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableHeadRow>
          </TableHeader>
          <TableBody>
            {data.loading && <TableLoadingRow colspan={11} />}
            {!data.loading && data.entries.length < 1 && <TableNoRows label="No Entry Record Found" colspan={11} />}
            {!data.loading &&
              data.entries.map((entry: JournalVoucherEntry) => (
                <TableRow key={entry._id} className="border-b-0 [&>td]:border-4 [&>td]:!py-1 [&>td]:!px-2 [&>td]:!text-[1.1rem]">
                  <TableCell>{entry?.client?.name}</TableCell>
                  <TableCell>{entry?.particular}</TableCell>
                  <TableCell>{entry?.acctCode?.code}</TableCell>
                  <TableCell>{entry?.acctCode?.description}</TableCell>
                  <TableCell className="text-end">{formatNumber(entry?.debit as number)}</TableCell>
                  <TableCell className="text-end">{formatNumber(entry?.credit as number)}</TableCell>
                  <TableCell>{entry?.cvForRecompute}</TableCell>
                  <TableCell className="text-center space-x-1">
                    <UpdateEntry entry={entry} setData={setData} />
                    <DeleteEntry entry={entry} getEntries={getEntries} rowLength={data.entries.length} currentPage={currentPage} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <div className="pt-2">
        <TablePagination currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePagination} disabled={data.loading} />
      </div>
    </div>
  );
};

export default UpdateJVEntries;

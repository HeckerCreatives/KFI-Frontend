import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../../ui/table/Table';
import { Release, ReleaseEntry, TTableFilter } from '../../../../../types/types';
import { TABLE_LIMIT } from '../../../../utils/constants';
import kfiAxios from '../../../../utils/axios';
import { useIonToast } from '@ionic/react';
import TablePagination from '../../../../ui/forms/TablePagination';
import { formatNumber } from '../../../../ui/utils/formatNumber';
import TableLoadingRow from '../../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../../ui/forms/TableNoRows';
import { formatDateTable } from '../../../../utils/date-utils';

export type TData = {
  entries: ReleaseEntry[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

type ViewEntriesProps = {
  isOpen: boolean;
  release: Release;
};

const ViewReleaseEntries = ({ isOpen, release }: ViewEntriesProps) => {
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

      const result = await kfiAxios.get(`/release/entries/${release._id}`, { params: filter });
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
    <div className="pb-2 flex flex-col h-full">
      <div className="relative overflow-auto flex-1">
        <Table>
          <TableHeader>
            <TableHeadRow className="border-4 bg-slate-100 [&>th]:border-4 [&>th]:!px-2 [&>th]:!font-normal [&>th]:!py-1.5  [&>th]:!text-xs">
              <TableHead>CV#</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Week</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Acct. Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">Debit</TableHead>
              <TableHead className="text-center">Credit</TableHead>
            </TableHeadRow>
          </TableHeader>
          <TableBody>
            {data.loading && <TableLoadingRow colspan={11} />}
            {!data.loading && data.entries.length < 1 && <TableNoRows label="No Entry Record Found" colspan={11} />}
            {!data.loading &&
              data.entries.map((entry: ReleaseEntry, index: number) => (
                <TableRow key={entry._id} className="border-b-0 [&>td]:border-4 [&>td]:!py-1 [&>td]:!px-2 [&>td]:!text-[.8rem]">
                  <TableCell>{entry?.loanReleaseEntryId?.transaction?.code ? `CV#${entry?.loanReleaseEntryId?.transaction?.code}` : ''}</TableCell>
                  <TableCell>{entry?.loanReleaseEntryId?.transaction?.dueDate ? formatDateTable(entry?.loanReleaseEntryId?.transaction?.dueDate) : ''}</TableCell>
                  <TableCell>{entry?.loanReleaseEntryId?.transaction?.noOfWeeks}</TableCell>
                  <TableCell>{entry?.loanReleaseEntryId?.client?.name}</TableCell>
                  <TableCell>{entry?.acctCode?.code}</TableCell>
                  <TableCell>{entry?.acctCode?.description}</TableCell>
                  <TableCell className="text-end">{formatNumber(entry?.debit as number)}</TableCell>
                  <TableCell className="text-end">{formatNumber(entry?.credit as number)}</TableCell>
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

export default ViewReleaseEntries;

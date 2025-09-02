import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../../ui/table/Table';
import { JournalVoucher, JournalVoucherEntry, TTableFilter } from '../../../../../types/types';
import { TABLE_LIMIT } from '../../../../utils/constants';
import kfiAxios from '../../../../utils/axios';
import { IonButton, IonIcon, useIonToast } from '@ionic/react';
import TablePagination from '../../../../ui/forms/TablePagination';
import { formatNumber } from '../../../../ui/utils/formatNumber';

import TableLoadingRow from '../../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../../ui/forms/TableNoRows';
import AddEntry from '../modals/entries/AddEntry';
import UpdateEntry from '../modals/entries/UpdateEntry';
import DeleteEntry from '../modals/entries/DeleteEntry';
import { UseFormReturn } from 'react-hook-form';
import { JournalVoucherFormData } from '../../../../../validations/journal-voucher.schema';
import { arrowBack, arrowForward } from 'ionicons/icons';

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
  entries: JournalVoucherEntry[];
  setEntries: React.Dispatch<React.SetStateAction<JournalVoucherEntry[]>>;
  setPrevEntries: React.Dispatch<React.SetStateAction<JournalVoucherEntry[]>>;
   deletedIds: string[]
    setDeletedIds: React.Dispatch<React.SetStateAction<string[]>>
  
};

const UpdateJVEntries = ({ isOpen, journalVoucher, entries, setEntries, setPrevEntries, deletedIds, setDeletedIds }: UpdateJVEntriesProps) => {
  const [present] = useIonToast();
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [data, setData] = useState<TData>({
    entries: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  const [page, setPage] = useState(1);
      const limit = 5
      const totalPages = Math.ceil(data.entries.length / limit)
    
    const handleNextPage = () => {
      if (page !== Math.ceil(data.entries.length / limit)) {
        setPage(prev => prev + 1);
      }
    };
  
    const handlePrevPage = () => {
      if (page > 0) {
        setPage(prev => prev - 1);
      }
    };
  
    const currentPageItems = React.useMemo(() => {
        return data.entries.slice((page - 1) * limit, page * limit);
      }, [data.entries, page, limit]);

  const getEntries = async (page: number) => {
    setData(prev => ({ ...prev, loading: true }));
    try {
      const filter: TTableFilter = { limit: TABLE_LIMIT, page };
      const result = await kfiAxios.get(`/journal-voucher/entries/${journalVoucher._id}`, { params: filter });
      const { success, entries, hasPrevPage, hasNextPage, totalPages } = result.data;
      if (success) {
        setData(prev => ({
          ...prev,
          entries,
          totalPages,
          nextPage: hasNextPage,
          prevPage: hasPrevPage,
        }));
        setEntries(entries);
        setPrevEntries(entries)
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
        <AddEntry journalVoucherId={journalVoucher._id} getEntries={getEntries} entries={entries} setEntries={setEntries} setData={setData} />
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
            
            {
              currentPageItems.map((entry: JournalVoucherEntry) => (
                <TableRow
                  key={entry._id}
                  className="border-b-0 [&>td]:border-4 [&>td]:!py-1 [&>td]:!px-2 [&>td]:!text-[.8rem]"
                >
                  <TableCell>{entry?.client?.name}</TableCell>
                  <TableCell>{entry?.particular}</TableCell>
                  <TableCell>{entry?.acctCode?.code}</TableCell>
                  <TableCell>{entry?.acctCode?.description}</TableCell>
                  <TableCell className="text-end">{formatNumber(entry?.debit as number)}</TableCell>
                  <TableCell className="text-end">{formatNumber(entry?.credit as number)}</TableCell>
                  <TableCell>{entry?.cvForRecompute}</TableCell>
                  <TableCell className="text-center space-x-1">
                    <UpdateEntry entry={entry} setData={setData} transaction={journalVoucher} entries={entries} setEntries={setEntries} />
                    <DeleteEntry
                      entry={entry}
                      getEntries={getEntries}
                      rowLength={data.entries.length}
                      currentPage={currentPage}
                      deletedIds={deletedIds}
                      setDeletedIds={setDeletedIds}
                      setData={setData}
                      entries={entries}
                      setEntries={setEntries}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {data.entries.length > 0 && (
                            <div className="w-full pb-3">
                              <div className="flex items-center justify-center gap-2 py-1 px-5 rounded-md w-fit mx-auto">
                                <div>
                                  <IonButton onClick={handlePrevPage} disabled={page === 1} fill="clear" className="max-h-10 min-h-6 h-8 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md">
                                    <IonIcon icon={arrowBack} />
                                  </IonButton>
                                </div>
                                <div>
                                  <div className="text-sm !font-semibold  px-3 py-1.5 rounded-lg text-slate-700">
                                    {page} / {Math.ceil(data.entries.length / limit)}
                                  </div>
                                </div>
                                <div>
                                  <IonButton
                                    onClick={handleNextPage}
                                    disabled={page === Math.ceil(data.entries.length / limit)}
                                    fill="clear"
                                    className="max-h-10 min-h-6 h-8 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md"
                                  >
                                    <IonIcon icon={arrowForward} />
                                  </IonButton>
                                </div>
                              </div>
                            </div>
                          )}
      {/* <div className="pt-2">
        <TablePagination
          currentPage={currentPage}
          totalPages={data.totalPages}
          onPageChange={handlePagination}
          disabled={data.loading}
        />
      </div> */}
    </div>
  );
};


export default UpdateJVEntries;

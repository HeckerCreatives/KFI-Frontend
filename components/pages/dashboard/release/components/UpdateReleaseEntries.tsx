import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../../ui/table/Table';
import { Acknowledgement, AcknowledgementEntry, ExpenseVoucher, ExpenseVoucherEntry, Release, ReleaseEntry, TTableFilter } from '../../../../../types/types';
import { TABLE_LIMIT } from '../../../../utils/constants';
import kfiAxios from '../../../../utils/axios';
import { IonButton, IonIcon, useIonToast } from '@ionic/react';
import TablePagination from '../../../../ui/forms/TablePagination';
import { formatNumber } from '../../../../ui/utils/formatNumber';

import TableLoadingRow from '../../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../../ui/forms/TableNoRows';
import { formatDateTable } from '../../../../utils/date-utils';
import AddEntry from '../modals/entries/AddEntry';
import UpdateEntry from '../modals/entries/UpdateEntry';
import DeleteEntry from '../modals/entries/DeleteEntry';
import { arrowBack, arrowForward } from 'ionicons/icons';
// import AddEntry from '../modals/entries/AddEntry';
// import UpdateEntry from '../modals/entries/UpdateEntry';
// import DeleteEntry from '../modals/entries/DeleteEntry';

export type TData = {
  entries: ReleaseEntry[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

type UpdateReleaseEntriesProps = {
  isOpen: boolean;
  release: Release;
   entries: ReleaseEntry[]
  setEntries: React.Dispatch<React.SetStateAction<ReleaseEntry[]>>
  deletedIds: string[]
  setDeletedIds: React.Dispatch<React.SetStateAction<string[]>>
  setPrevEntries: React.Dispatch<React.SetStateAction<ReleaseEntry[]>>;

};

const UpdateReleaseEntries = ({ isOpen, release, entries, setEntries, deletedIds, setDeletedIds , setPrevEntries}: UpdateReleaseEntriesProps) => {
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
         setEntries(entries)
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

   function normalizeCVNumber(cv: string): string {
      if (!cv) return "";
  
      return cv.replace(/^(CV#)+/, "CV#");
    }

  return (
    <div className="pb-2 h-full flex flex-col">
      <div>
        <AddEntry releaseId={release._id} getEntries={getEntries} entries={entries} setEntries={setEntries} setData={setData} transaction={release} />
      </div>
      <div className="relative overflow-auto flex-1">
        <Table>
          <TableHeader>
            <TableHeadRow className="border-4 bg-slate-100 [&>th]:border-4 [&>th]:!font-normal [&>th]:!py-1.5 [&>th]:!text-xs">
              <TableHead>CV#</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Week</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Acct. Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">Debit</TableHead>
              <TableHead className="text-center">Credit</TableHead>
              <TableHead>Actions</TableHead>
            </TableHeadRow>
          </TableHeader>
          <TableBody>
            
            {
              currentPageItems.map((entry: ReleaseEntry, index: number) => (
                <TableRow key={entry._id} className="border-b-0 [&>td]:border-4 [&>td]:!py-1 [&>td]:!px-2 [&>td]:!text-[.8rem]">
                  <TableCell>{entry?.loanReleaseEntryId ? `${entry?.loanReleaseEntryId?.transaction?.code}` : ''}</TableCell>
                  <TableCell>{entry?.loanReleaseEntryId ? formatDateTable(entry?.loanReleaseEntryId?.transaction?.dueDate) : ''}</TableCell>
                  <TableCell>{entry?.loanReleaseEntryId ? entry?.loanReleaseEntryId?.transaction?.noOfWeeks : ''}</TableCell>
                  <TableCell>{entry?.loanReleaseEntryId ? entry.loanReleaseEntryId.client.name : ''}</TableCell>
                  <TableCell>{entry?.acctCode?.code}</TableCell>
                  <TableCell>{entry?.acctCode?.description}</TableCell>
                  <TableCell className="text-end">{formatNumber(entry?.debit as number)}</TableCell>
                  <TableCell className="text-end">{formatNumber(entry?.credit as number)}</TableCell>
                  <TableCell className="text-center space-x-1">
                    <UpdateEntry entry={entry} setData={setData} transaction={release} entries={entries} setEntries={setEntries} />
                    <DeleteEntry entry={entry} getEntries={getEntries} rowLength={data.entries.length} currentPage={currentPage} entries={entries} setEntries={setEntries} deletedIds={deletedIds} setDeletedIds={setDeletedIds} setData={setData} />
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
    </div>
  );
};

export default UpdateReleaseEntries;

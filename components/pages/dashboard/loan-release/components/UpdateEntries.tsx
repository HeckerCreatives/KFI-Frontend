import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../../ui/table/Table';
import { Entry, Transaction, TTableFilter } from '../../../../../types/types';
import { TABLE_LIMIT } from '../../../../utils/constants';
import kfiAxios from '../../../../utils/axios';
import { IonButton, IonIcon, useIonToast } from '@ionic/react';
import TablePagination from '../../../../ui/forms/TablePagination';
import { formatNumber } from '../../../../ui/utils/formatNumber';
import UpdateEntry from '../modals/entries/UpdateEntry';
import DeleteEntry from '../modals/entries/DeleteEntry';
import AddEntry from '../modals/entries/AddEntry';
import TableLoadingRow from '../../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../../ui/forms/TableNoRows';
import { arrowBack, arrowForward } from 'ionicons/icons';

export type TData = {
  entries: Entry[];
  // totalPages: number;
  // nextPage: boolean;
  // prevPage: boolean;
  // loading: boolean;
};

type UpdateEntriesProps = {
  isOpen: boolean;
  transaction: Transaction;
  currentAmount: string;
  entries: Entry[];
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
  deletedIds: string[]
  setDeletedIds: React.Dispatch<React.SetStateAction<string[]>>
  setPrevEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
  
};

const UpdateEntries = ({ isOpen, transaction, currentAmount, entries, setEntries, deletedIds, setDeletedIds, setPrevEntries }: UpdateEntriesProps) => {
  const [present] = useIonToast();
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [data, setData] = useState<TData>({
    entries: [],
    // loading: false,
    // totalPages: 0,
    // nextPage: false,
    // prevPage: false,
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
        setPrevEntries(entries)
        setEntries(entries)
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

  console.log(data.entries)




  return (
    <div className="pb-2 flex flex-col h-full">
      <div>
        <AddEntry
          transactionId={transaction._id}
          centerId={transaction.center._id}
          centerNo={transaction.center.centerNo}
          getEntries={getEntries}
          currentAmount={currentAmount}
          entries={data.entries}
          setData={setData}
          transaction={transaction}
          setEntries={setEntries}
        />
      </div>
      <div className="relative overflow-auto flex-1">
        <Table>
          <TableHeader>
            <TableHeadRow className="border-4 bg-slate-100 [&>th]:border-4 [&>th]:!py-1.5 [&>th]:!font-normal [&>th]:!text-xs">
              <TableHead>Line</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Particular</TableHead>
              <TableHead>Acct. Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Debit</TableHead>
              <TableHead>Credit</TableHead>
              <TableHead>Interest</TableHead>
              <TableHead>Cycle</TableHead>
              <TableHead>Check No.</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableHeadRow>
          </TableHeader>
          <TableBody>
            
            {currentPageItems.map((entry: Entry, index: number) => (
                <TableRow key={entry._id} className="border-b-0 [&>td]:border-4 [&>td]:!py-1 [&>td]:!px-2 [&>td]:!text-[.8rem]">
                  <TableCell className="text-center">{(currentPage - 1) * TABLE_LIMIT + (index + 1)}</TableCell>
                  <TableCell>{entry?.client?.name}</TableCell>
                  <TableCell>{entry?.particular}</TableCell>
                  <TableCell>{entry?.acctCode?.code}</TableCell>
                  <TableCell>{entry?.acctCode?.description}</TableCell>
                  <TableCell>{formatNumber(entry?.debit as number)}</TableCell>
                  <TableCell>{formatNumber(entry?.credit as number)}</TableCell>
                  <TableCell className="text-center">{entry?.interest ? `${entry?.interest}%` : ''}</TableCell>
                  <TableCell className="text-center">{entry?.cycle}</TableCell>
                  <TableCell className="text-center">{entry?.checkNo}</TableCell>
                  <TableCell className="text-center space-x-1">
                    <UpdateEntry entry={entry} setData={setData} transaction={transaction} entries={data.entries} setEntries={setEntries} />
                    <DeleteEntry entry={entry} getEntries={getEntries} rowLength={data.entries.length} currentPage={currentPage} setData={setData} entries={entries} setEntries={setEntries} deletedIds={deletedIds} setDeletedIds={setDeletedIds} />
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
      <div className="px-3">
        <div className="grid grid-cols-3">
          <div className="flex items-center justify-start gap-2 text-sm border-4 px-2 py-1 [&>div]:!font-semibold">
            <div>Diff: </div>
            <div>{`${formatNumber(Math.abs(data.entries.reduce((acc, entry) => acc + Number(entry.debit), 0) - data.entries.reduce((acc, entry) => acc + Number(entry.credit), 0)))}`}</div>
          </div>
           <div className="flex items-center justify-start gap-2 text-sm border-4 px-2 py-1 [&>div]:!font-semibold col-span-2">
              <div>Total: </div>
              <div>{`${transaction.amount.toLocaleString('en-US', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                  useGrouping: false,
                })}`}</div>
            </div>
          {/* <div className="flex items-center justify-start gap-2 text-sm border-4 px-2 py-1 [&>div]:!font-semibold">
            <div>Total Debit: </div>
            <div>{`${formatNumber(data.entries.reduce((acc, entry) => acc + Number(entry.debit), 0))}`}</div>
          </div>
          <div className="flex items-center justify-start gap-2 text-sm border-4 px-2 py-1 [&>div]:!font-semibold">
            <div>Total Credit: </div>
            <div>{`${formatNumber(data.entries.reduce((acc, entry) => acc + Number(entry.credit), 0))}`}</div>
          </div> */}
        </div>
      </div>
      <div className="pt-2">
        {/* <TablePagination currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePagination} disabled={data.loading} /> */}
      </div>
    </div>
  );
};

export default UpdateEntries;

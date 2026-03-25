import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../../ui/table/Table';
import { JournalVoucher, JournalVoucherEntry, TTableFilter } from '../../../../../types/types';
import { TABLE_LIMIT } from '../../../../utils/constants';
import kfiAxios from '../../../../utils/axios';
import { IonButton, IonIcon, useIonToast } from '@ionic/react';
import TablePagination from '../../../../ui/forms/TablePagination';
import { formatNumber, removeAmountComma } from '../../../../ui/utils/formatNumber';
import TableLoadingRow from '../../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../../ui/forms/TableNoRows';
import { arrowBack, arrowForward } from 'ionicons/icons';

export type TData = {
  entries: JournalVoucherEntry[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

type ViewEntriesProps = {
  isOpen: boolean;
  journalVoucher: JournalVoucher;
};

const ViewJVEntries = ({ isOpen, journalVoucher }: ViewEntriesProps) => {
  const [present] = useIonToast();
  const [currentPage, setCurrentPage] = useState<number>(1);

   const entries = journalVoucher.entries;
      const totalPages = Math.ceil(journalVoucher.entries.length / TABLE_LIMIT);
    
      const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1)); 
      };
    
      const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages)); 
      };
    
      const paginatedEntries = entries.slice(
        (currentPage - 1) * TABLE_LIMIT,
        currentPage * TABLE_LIMIT
      );
    
  
    const [data, setData] = useState<TData>({
      entries: journalVoucher.entries,
      loading: false,
      totalPages: 0,
      nextPage: false,
      prevPage: false,
    });
  
  
    
      useEffect(() => {
        setCurrentPage(1);
      }, [journalVoucher]);



  return (
    <div className="pb-2 h-full flex flex-col">
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
            </TableHeadRow>
          </TableHeader>
          <TableBody>
            {data.loading && <TableLoadingRow colspan={11} />}
            {!data.loading && data.entries.length < 1 && <TableNoRows label="No Entry Record Found" colspan={11} />}
            {!data.loading &&
              paginatedEntries.map((entry: JournalVoucherEntry, index: number) => (
                <TableRow key={entry._id} className="border-b-0 [&>td]:border-4 [&>td]:!py-1 [&>td]:!px-2 [&>td]:!text-[.8rem]">
                  <TableCell>{entry?.client?.name || ''}</TableCell>
                  <TableCell>{entry?.particular || ''}</TableCell>
                  <TableCell>{entry?.acctCode?.code}</TableCell>
                  <TableCell>{entry?.acctCode?.description}</TableCell>
                  <TableCell className="text-end">{formatNumber(entry?.debit as number)}</TableCell>
                  <TableCell className="text-end">{formatNumber(entry?.credit as number)}</TableCell>
                  <TableCell className="text-center">{entry?.cvForRecompute}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <div className="pt-2">
          {paginatedEntries.length > 0 && (
                          <div className="w-full pb-3">
                            <div className="flex items-center justify-center gap-2 py-1 px-5 rounded-md w-fit mx-auto">
                              <div>
                                <IonButton onClick={handlePrevPage} disabled={currentPage === 1} fill="clear" className="max-h-10 min-h-6 h-8 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md"> {/* ✅ was page */}
                                  <IonIcon icon={arrowBack} />
                                </IonButton>
                              </div>
                              <div>
                                <div className="text-sm !font-semibold px-3 py-1.5 rounded-lg text-slate-700">
                                  {currentPage} / {totalPages}
                                </div>
                              </div>
                              <div>
                                <IonButton
                                  onClick={handleNextPage}
                                  disabled={currentPage === totalPages}
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

      <div className="px-3">
           <div className="grid grid-cols-3">
             <div className="flex items-center justify-start gap-2 text-sm border-4 px-2 py-1 [&>div]:!font-semibold">
               <div>Diff: </div>
               <div>{`${formatNumber((data.entries).reduce((acc, current) => acc + Number(removeAmountComma(current.debit ?? '')), 0) - data.entries.reduce((acc, current) => acc + Number(removeAmountComma(current.credit ?? '')), 0))}`}</div>
             </div>
             <div className="flex items-center justify-start gap-2 text-sm border-4 px-2 py-1 [&>div]:!font-semibold col-span-2">
               <div>Total: </div>
               <div>{`${journalVoucher.amount.toLocaleString()}`}</div>
             </div>
           </div>
      </div>
    </div>
  );
};

export default ViewJVEntries;

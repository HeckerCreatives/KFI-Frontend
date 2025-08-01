import React, { useRef, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../../ui/table/Table';
import { IonButton, IonIcon, IonInput, useIonToast, useIonViewWillEnter } from '@ionic/react';
import { search } from 'ionicons/icons';
import { TTableFilter } from '../../../../../types/types';
import { TABLE_LIMIT } from '../../../../utils/constants';
import kfiAxios from '../../../../utils/axios';
import TablePagination from '../../../../ui/forms/TablePagination';
import TableLoadingRow from '../../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../../ui/forms/TableNoRows';
import { formatNumber } from '../../../../ui/utils/formatNumber';

export type Loan = {
  _id: string;
  description: string;
  location: string;
  acctOfficer: string;
  members: number;
  loans: number;
};
export type TRecentMember = {
  loans: Loan[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const LoansPerCenter = () => {
  const arrDummy: string[] = Array.from(Array(10)).fill('');
  const ionInputRef = useRef<HTMLIonInputElement>(null);

  const [present] = useIonToast();

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [data, setData] = useState<TRecentMember>({
    loans: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  const getRecentLoans = async (page: number) => {
    setData(prev => ({ ...prev, loading: true }));
    try {
      const value = ionInputRef.current?.value;
      const filter: TTableFilter = { limit: TABLE_LIMIT, page };
      const result = await kfiAxios.get('/statistics/loans-per-center', { params: { ...filter, keyword: value } });
      const { success, loans, hasPrevPage, hasNextPage, totalPages } = result.data;
      if (success) {
        setData(prev => ({
          ...prev,
          loans: loans,
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

  useIonViewWillEnter(() => {
    getRecentLoans(currentPage);
  });

  return (
    <div className="bg-white shadow-lg rounded-sm px-3 pt-1 pb-2 flex-1 flex flex-col">
      <div className="flex items-center justify-between border-b w-full">
        <h3 className="text-[0.9rem] !font-semibold pb-2 text-orange-700">Loans per Account Officer</h3>
        <div className="flex items-center">
          <IonInput
            ref={ionInputRef}
            aria-label={'no label'}
            placeholder="Search"
            labelPlacement="stacked"
            className={'!border text-[0.9rem] bg-orange-50 border-orange-400 [--highlight-color-focused:none] rounded-md !px-2 !py-1 text-sm !min-h-[1.2rem]'}
          ></IonInput>
          <div>
            <IonButton
              type="submit"
              fill="clear"
              className="max-h-10 min-h-[1.8rem] ![--padding-top:0] ![--padding-bottom:0] ![--padding-end:0.4rem] ![--padding-start:0.45rem] bg-[#FA6C2F] text-white capitalize font-semibold rounded-md"
              strong
            >
              <IonIcon icon={search} />
            </IonButton>
          </div>
        </div>
      </div>
      <div className="relative overflow-auto flex-1">
        <Table>
          <TableHeader>
            <TableHeadRow className="bg-white !border-0 [&>th]:uppercase">
              <TableHead className="text-orange-700 !font-[600]">Account Officer</TableHead>
              <TableHead className="text-center text-orange-700 !font-[600]">Center</TableHead>
              <TableHead className="text-center text-orange-700 !font-[600]">Total Members</TableHead>
              <TableHead className="text-center text-orange-700 !font-[600]">Total Loan Amount</TableHead>
            </TableHeadRow>
          </TableHeader>
          <TableBody>
            {data.loading && <TableLoadingRow colspan={4} />}
            {!data.loading && data.loans.length < 1 && <TableNoRows label="No Loans Found" colspan={4} />}
            {!data.loading &&
              data.loans.length > 0 &&
              data.loans.map((loan: Loan, i: number) => (
                <TableRow key={`${loan._id}-${i}`} className="!border-0 odd:bg-orange-50 [&>td]:text-[0.8rem]">
                  <TableCell className="">{loan.acctOfficer}</TableCell>
                  <TableCell className="text-center">{loan.description}</TableCell>
                  <TableCell className="text-center">{loan.members}</TableCell>
                  <TableCell className="text-center">{formatNumber(loan.loans)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <TablePagination currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePagination} disabled={data.loading} />
    </div>
  );
};

export default LoansPerCenter;

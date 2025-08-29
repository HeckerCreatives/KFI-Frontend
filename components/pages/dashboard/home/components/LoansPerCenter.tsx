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
    <div className=" relative h-fit flex-1 flex flex-col bg-white shadow-lg rounded-xl">
      <div className=" pb-2 flex-1 flex flex-col">
        <div className="flex items-center justify-between w-full py-2 bg-orange-50 p-4 px-8 rounded-t-xl">
          <h3 className="text-[0.9rem] pb-2 text-black !font-medium">Loans per Account Officer</h3>
          <div className="flex items-center gap-2">
            <IonInput
              ref={ionInputRef}
              aria-label={'no label'}
              placeholder="Search"
              labelPlacement="stacked"
              className={'!border text-[0.9rem] border-orange-400 !bg-orange-50 ![--background:transparent] [--highlight-color-focused:none] rounded-md !px-2 !py-1 text-sm !min-h-[1.2rem]'}
            ></IonInput>
            <div>
              <IonButton
                onClick={() => getRecentLoans(1)}
                fill="clear"
                className="max-h-10 min-h-[1.8rem] ![--padding-top:0] ![--padding-bottom:0] ![--padding-end:0.4rem] ![--padding-start:0.45rem] bg-[#FA6C2F] text-white capitalize font-semibold rounded-md"
                strong
              >
                <IonIcon icon={search} />
              </IonButton>
            </div>
          </div>
        </div>

       
          
          <div className=" flex-1 p-4 ">
            <div className='relative overflow-auto max-h-[500px] '>
               <div className=' w-full sticky top-0 z-[999] bg-white'>
              <Table>
              <TableHeader>
                <TableHeadRow className="!bg-white !border-0">
                  <TableHead className=" !font-[600]">Account Officer</TableHead>
                  <TableHead className=" !font-[400] text-start">Center</TableHead>
                  <TableHead className=" !font-[400]">Total Members</TableHead>
                  <TableHead className=" !font-[400]">Total Loan Amount</TableHead>
                </TableHeadRow>
              </TableHeader>
              <TableBody
                style={{ visibility: 'collapse' }}
              
              >
                {data.loading && <TableLoadingRow colspan={4} />}
                {!data.loading && data.loans.length < 1 && <TableNoRows label="No Loans Found" colspan={4} />}
                {!data.loading &&
                  data.loans.length > 0 &&
                  data.loans.map((loan: Loan, i: number) => (
                    <TableRow key={`${loan._id}-${i}`} className="!border-1 [&>td]:text-[0.7rem] py-2">
                      <TableCell className="">{loan.acctOfficer}</TableCell>
                      <TableCell className="">{loan.description}</TableCell>
                      <TableCell className="">{loan.members}</TableCell>
                      <TableCell className="">{formatNumber(loan.loans)}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              
            </Table>
            </div>
            <Table>
              <TableHeader
              >
                <TableHeadRow className="!bg-white !border-0"
                style={{ visibility: 'collapse' }}
                
                >
                  <TableHead className=" !font-[600]">Account Officer</TableHead>
                  <TableHead className=" !font-[400] text-start">Center</TableHead>
                  <TableHead className=" !font-[400]">Total Members</TableHead>
                  <TableHead className=" !font-[400]">Total Loan Amount</TableHead>
                </TableHeadRow>
              </TableHeader>
              <TableBody>
                {data.loading && <TableLoadingRow colspan={4} />}
                {!data.loading && data.loans.length < 1 && <TableNoRows label="No Loans Found" colspan={4} />}
                {!data.loading &&
                  data.loans.length > 0 &&
                  data.loans.map((loan: Loan, i: number) => (
                    <TableRow key={`${loan._id}-${i}`} className="!border-1 [&>td]:text-[0.7rem] py-2">
                      <TableCell className="">{loan.acctOfficer}</TableCell>
                      <TableCell className="">{loan.description}</TableCell>
                      <TableCell className="">{loan.members}</TableCell>
                      <TableCell className="">{formatNumber(loan.loans)}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            </div>
           
          </div>
        
      </div>
      <div>
        <TablePagination currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePagination} disabled={data.loading} />
      </div>
    </div>
  );
};

export default LoansPerCenter;

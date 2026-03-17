import React, { useEffect, useRef, useState } from 'react';
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
import { useForm } from 'react-hook-form';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import SearchInput from '../../../../ui/forms/InputSearch';

type TSearch = {
  keyword: string;
};

export type Loan = {
  createdAt: string
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
  

  const form = useForm<TSearch>({
      defaultValues: {
        keyword: '',
      },
    });

  const code = form.watch('keyword')


  const [currentPage, setCurrentPage] = useState<number>(1);

  const [data, setData] = useState<TRecentMember>({
    loans: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });
  const [items, setItems] = useState<string[]>([])

  const getRecentLoans = async (page: number) => {
    setData(prev => ({ ...prev, loading: true }));
    try {
      const filter: TTableFilter = { limit: TABLE_LIMIT, page };
      const result = await kfiAxios.get('/statistics/loans-per-center', { params: { ...filter, keyword: code } });
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

  const onSubmit = (data: TSearch) => {
    getRecentLoans(currentPage)
  };

  useIonViewWillEnter(() => {
    getRecentLoans(currentPage);
  });


    useEffect(() => {
       const getData = async () => {

      try {
        const result = await kfiAxios.get('/statistics/loans-per-center', { params: { limit: 5, keyword: code, page: 1 } });
        const { success, loans, hasPrevPage, hasNextPage, totalPages } = result.data;
        if (success) {
          setItems(loans.map((item: any) => item.acctOfficer));
        }
      } catch (error) {
        // handle error
      } finally {
      }
    };

    const timer = setTimeout(() => {
      getData();
    }, 800);

    return () => clearTimeout(timer);
   
  }, [code]);



  return (
    <div className=" relative h-fit flex-1 flex flex-col bg-white shadow-lg rounded-xl">
      <div className=" pb-2 flex-1 flex flex-col">
        <div className="flex items-center justify-between w-full py-2 bg-orange-50 p-4 px-8 rounded-t-xl">
          <h3 className="text-[0.9rem] pb-2 text-black !font-medium">Loans per Account Officer</h3>
           <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center flex-wrap lg:justify-end gap-2">
          
            <div className="flex items-center min-w-20 overflow-visible!">
              <FormIonItem className="flex-1 overflow-visible!">
               

                <SearchInput
                  name="keyword"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  // label="Code"
                  placeholder="Search acct. officer..."
                  className="!px-3 !min-h-[1rem] rounded-md !border-orange-500"
                  suggestions={items}
                />
              </FormIonItem>
              <IonButton type="submit" fill="clear" className="max-h-8 min-h-[2rem] bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
                <IonIcon icon={search} />
              </IonButton>
            </div>
          </form>
         
        </div>

       
          
          <div className=" flex-1 p-4 ">
            <div className='relative overflow-auto max-h-[500px] '>
               <div className=' w-full sticky top-0 z-[9] bg-white'>
              <Table>
              <TableHeader>
                <TableHeadRow className="!bg-white !border-0">
                  <TableHead className=" !font-[600]">Account Officer</TableHead>
                  <TableHead className=" !font-[400] text-start">Center</TableHead>
                  <TableHead className=" !font-[400]">Total Members</TableHead>
                  <TableHead className=" !font-[400]">Total Loan Amount</TableHead>
                  {/* <TableHead className=" !font-[400]">Date</TableHead> */}
                  
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
                     {/* <TableCell>{loan.createdAt?.split('T')[0] || ''}</TableCell> */}

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
                  {/* <TableHead className=" !font-[400]">Date</TableHead> */}

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
                     {/* <TableCell>{loan.createdAt?.split('T')[0] || ''}</TableCell> */}

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

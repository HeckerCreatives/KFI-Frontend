"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from "../../../../ui/table/Table"
import { IonButton, IonIcon, IonSelect, IonSelectOption, useIonToast } from "@ionic/react"
import kfiAxios from "../../../../utils/axios"
import TableLoadingRow from "../../../../ui/forms/TableLoadingRow"
import TableNoRows from "../../../../ui/forms/TableNoRows"
import { formatNumber } from "../../../../ui/utils/formatNumber"
import ViewLoanDetails from "../modals/ViewLoanDetails"
import FormIonItem from "../../../../ui/utils/FormIonItem"
import SearchInput from "../../../../ui/forms/InputSearch"
import { useForm } from "react-hook-form"
import { search } from "ionicons/icons"
import ViewLoanRelease from "../modals/ViewLoanRelease"
import { Transaction } from "../../../../../types/types"

type TSearch = {
  code: string;
};


export type TData = {
  transactions: Transaction[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

export type Member = {
  createdAt: string
  _id: string
  debit: number
  client: { name: string }
  checkNo: string
  credit: string
  cycle: string
  interest: string
  particular: string
  center: { centerNo: string; description: string }
  acctCode: { code: string; description: string }
}
export type TRecentMember = {
  entries: Member[]
  totalPages: number
  nextPage: boolean
  prevPage: boolean
  loading: boolean
}

type Props = {
  setSelected: React.Dispatch<React.SetStateAction<string>>
  selected: string
}

const RecentLoans = ({setSelected, selected} : Props) => {
  const [present] = useIonToast()

  const [currentPage, setCurrentPage] = useState<number>(1)

   const [data, setData] = useState<TData>({
      transactions: [],
      loading: false,
      totalPages: 0,
      nextPage: false,
      prevPage: false,
    });
  const [items, setItems] = useState<string[]>([])
  

  const form = useForm<TSearch>({
        defaultValues: {
          code: '',
        },
      });
  
   const code = form.watch('code')

  const getRecentLoans = async (page: number) => {
    setData((prev) => ({ ...prev, loading: true }))
    try {
      const result = await kfiAxios.get("/transaction/loan-release",{params: {search: code, page: 1, limit: 10}})
        const { success, transactions, hasPrevPage, hasNextPage, totalPages } = result.data;
        if (success) {
          setData(prev => ({
            ...prev,
            transactions: transactions,
            totalPages: totalPages,
            nextPage: hasNextPage,
            prevPage: hasPrevPage,
            loading: false
          }));
          setCurrentPage(page);
         
          return;
        }
    } catch (error) {
      present({
        message: "Failed to get records. Please try again",
        duration: 1000,
      })
      setData((prev) => ({ ...prev, loading: false }))

    } finally {
      setData((prev) => ({ ...prev, loading: false }))
    }
  }

   const getTest = async () => {
    setData((prev) => ({ ...prev, loading: true }))
    try {
      const result = await kfiAxios.get("/auth/test-401")
     console.log(result)
    
    } catch (error) {
    
    } 
  }



  useEffect(() => {
    getRecentLoans(currentPage)

  }, [])

  

  const onSubmit = (data: TSearch) => {
      getRecentLoans(currentPage)
  };
     useEffect(() => {
        const getData = async () => {
       try {
         const result = await kfiAxios.get('/transaction/loan-release', {params: {search: code, page: 1}});
           const { success, transactions, hasPrevPage, hasNextPage, totalPages } = result.data;
         if (success) {
           setItems(transactions.map((item: any) => item.code));
         }
       } catch (error) {
       } finally {
       }
     };
     const timer = setTimeout(() => {
       getData();
       getRecentLoans(currentPage)
     }, 500);
     return () => clearTimeout(timer);
   }, [code]);
  

  return (
     <div className=" flex flex-col space-y-2 bg-white rounded-xl shadow-lg">
                        <div className="flex flex-wrap items-center justify-between bg-orange-50 p-5 rounded-t-xl">
                          <div className="min-w-44">
                            <IonSelect
                              aria-label={'no label'}
                              interface="popover"
                              placeholder="Recent Loan"
                              labelPlacement="stacked"
                              className={'!px-3 !py-2.5 border border-zinc-300 rounded-xl [--highlight-color-focused:none] bg-white !text-[0.8rem] !min-h-[1.2rem] min-w-full '}
                              onIonChange={e => setSelected(e.detail.value)}
                              value={selected}
                            >
                              <IonSelectOption value="recent loan" className="h-10 text-xs ![--min-height:1rem] [&>ion-radio]:checked:bg-red-600">
                                Recent Loan
                              </IonSelectOption>
                              <IonSelectOption value="recent member" className="h-18 text-xs ![--min-height:1rem]">
                                Recent Member
                              </IonSelectOption>
                            </IonSelect>
                          </div>

                           {/* <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center flex-wrap lg:justify-end gap-2 ">
                            <div className="flex items-center min-w-20 overflow-visible!">
                              <FormIonItem className="flex-1 overflow-visible!">

                                <SearchInput
                                  name="code"
                                  control={form.control}
                                  clearErrors={form.clearErrors}
                                  // label="Code"
                                  placeholder="Search ..."
                                  className="!px-3 !py-1 rounded-xl"
                                  suggestions={items}
                                />
                              </FormIonItem>
                             
                            </div>
                          </form> */}
    
                          
                        </div>
                        <div className="bg-white w-full flex-1 p-2 rpunded rounded-xl">
                          <div className="relative max-h-[800px] h-full flex flex-col rounded-xl">

      
      
     <div className="relative overflow-auto flex-1 ">
       
     
      <Table className=" w-full border-collapse">
        {/* Make the entire TableHeader sticky */}
       <TableHeader className="sticky top-0 z-10  backdrop-blur-sm shadow-sm">
            <TableHeadRow className=" "
            
            >
              <TableHead className="!font-[400] border-b border-gray-200 bg-zinc-100">Code</TableHead>
              <TableHead className="!font-[400] border-b border-gray-200 bg-zinc-100">Amount</TableHead>
              <TableHead className="  !font-[600] bg-zinc-100">Date</TableHead>
              <TableHead className="!font-[400] border-b border-gray-200 bg-zinc-100">Actions</TableHead>
            </TableHeadRow>
           
          </TableHeader>

        <TableBody>
           {data.loading && <TableLoadingRow colspan={8} />}
            {!data.loading && data.transactions.length < 1 && <TableNoRows label="No Record Found" colspan={8} />}
        
          {!data.loading &&
            data.transactions.length > 0 &&
            data.transactions.map((item) => (
              <TableRow
                key={`${item._id}`}
                className="!border-1 [&>td]:text-[0.7rem]"
              >
                <TableCell>{item.code}</TableCell>
                <TableCell className="">{formatNumber(item.amount)}</TableCell>
                <TableCell>{item.createdAt?.split('T')[0] || ''}</TableCell>

                <TableCell>
                  {/* <ViewLoanDetails loan={entry} /> */}
                  <ViewLoanRelease transaction={item}/>
                </TableCell>
              </TableRow>
            ))}

         

        </TableBody>
      </Table>
    </div>

    </div>
                        </div>
                      </div>
    
  )
}

export default RecentLoans

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

type TSearch = {
  code: string;
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

  const [data, setData] = useState<TRecentMember>({
    entries: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  })
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
      const result = await kfiAxios.get("/statistics/recent-loans",{params: {code: code}})
      const { success, entries } = result.data
      if (success) {
        setData((prev) => ({ ...prev, entries: entries }))
        setCurrentPage(page)
        return
      }
    } catch (error) {
      present({
        message: "Failed to get records. Please try again",
        duration: 1000,
      })
    } finally {
      setData((prev) => ({ ...prev, loading: false }))
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
          const result = await kfiAxios.get('/statistics/recent-loans', {params: {search: code}});
           const { success, entries } = result.data
          if (success) {
            setItems(entries.map((item: any) => item.client.name));
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
     <div className=" flex flex-col space-y-2 bg-white rounded-xl shadow-lg">
                        <div className="flex items-center justify-between bg-orange-50 p-4 rounded-t-xl">
                          <div className="min-w-44">
                            <IonSelect
                              aria-label={'no label'}
                              interface="popover"
                              placeholder="Recent Loan"
                              labelPlacement="stacked"
                              className={'!border border-orange-400 [--highlight-color-focused:none] rounded-md bg-orange-50 !px-2 !py-2 !text-[0.8rem] !min-h-[1.2rem] min-w-full '}
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

                           <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center flex-wrap lg:justify-end gap-2 ">
                            <div className="flex items-center min-w-20 overflow-visible!">
                              <FormIonItem className="flex-1 overflow-visible!">

                                <SearchInput
                                  name="code"
                                  control={form.control}
                                  clearErrors={form.clearErrors}
                                  // label="Code"
                                  placeholder="Search ..."
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
                        <div className="bg-white w-full flex-1 p-2 rpunded rounded-xl">
                          <div className="relative max-h-[500px] h-full flex flex-col rounded-xl">

      
       <div className=' w-full absolute top-0 z-[9]'>
        <Table className=" w-full border-collapse ">
          {/* Make the entire TableHeader sticky */}
          <TableHeader className="sticky top-0 z-10  backdrop-blur-sm shadow-sm">
            <TableHeadRow className=" "
            
            >
              <TableHead className="!font-[400] border-b border-gray-200 bg-zinc-100">Name</TableHead>
              <TableHead className="!font-[400] border-b border-gray-200 bg-zinc-100">Amount</TableHead>
              <TableHead className="  !font-[600] bg-zinc-100">Date</TableHead>
              <TableHead className="!font-[400] border-b border-gray-200 bg-zinc-100">Actions</TableHead>
            </TableHeadRow>
           
          </TableHeader>
            <TableBody
                style={{ visibility: 'collapse' }}
             
             >
          {data.loading && <TableLoadingRow colspan={3} />}
          {!data.loading && data.entries.length < 1 && (
            <TableNoRows label="No Recent Loan Found" colspan={3} />
          )}
          {!data.loading &&
            data.entries.length > 0 &&
            data.entries.map((entry: Member, i: number) => (
              <TableRow
                key={`${entry._id}-${i}`}
                className="!border-1 [&>td]:text-[0.7rem]"
              >
                <TableCell>{entry.client.name}</TableCell>
                <TableCell>{formatNumber(entry.debit)}</TableCell>
                <TableCell>{entry.createdAt?.split('T')[0] || ''}</TableCell>
                
                <TableCell>
                  <ViewLoanDetails loan={entry} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
        </Table>
      </div>
     <div className="relative max-h-[500px] overflow-auto flex-1 ">
     
      <Table className=" w-full border-collapse">
        {/* Make the entire TableHeader sticky */}
        {/* <TableHeader className="sticky top-0 z-10 bg-white backdrop-blur-sm shadow-sm">
          <TableHeadRow>
            <TableHead className="!font-[400] border-b border-gray-200">Name</TableHead>
            <TableHead className="!font-[400] border-b border-gray-200">Amount</TableHead>
            <TableHead className="  !font-[600] bg-zinc-100">Date</TableHead>
            <TableHead className="!font-[400] border-b border-gray-200">Actions</TableHead>
          </TableHeadRow>
        </TableHeader> */}

        <TableBody>
          {data.loading && <TableLoadingRow colspan={3} />}
          {!data.loading && data.entries.length < 1 && (
            <TableNoRows label="No Recent Loan Found" colspan={3} />
          )}
          {!data.loading &&
            data.entries.length > 0 &&
            data.entries.map((entry: Member, i: number) => (
              <TableRow
                key={`${entry._id}-${i}`}
                className="!border-1 [&>td]:text-[0.7rem]"
              >
                <TableCell>{entry.client.name}</TableCell>
                <TableCell>{formatNumber(entry.debit)}</TableCell>
                <TableCell>{entry.createdAt?.split('T')[0] || ''}</TableCell>

                <TableCell>
                  {/* <ViewLoanDetails loan={entry} /> */}
                  <ViewLoanRelease loan={entry}/>
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

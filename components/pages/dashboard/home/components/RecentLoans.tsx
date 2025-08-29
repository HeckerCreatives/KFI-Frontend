"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from "../../../../ui/table/Table"
import { useIonToast } from "@ionic/react"
import kfiAxios from "../../../../utils/axios"
import TableLoadingRow from "../../../../ui/forms/TableLoadingRow"
import TableNoRows from "../../../../ui/forms/TableNoRows"
import { formatNumber } from "../../../../ui/utils/formatNumber"
import ViewLoanDetails from "../modals/ViewLoanDetails"

export type Member = {
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

const RecentLoans = () => {
  const [present] = useIonToast()

  const [currentPage, setCurrentPage] = useState<number>(1)

  const [data, setData] = useState<TRecentMember>({
    entries: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  })

  const getRecentLoans = async (page: number) => {
    setData((prev) => ({ ...prev, loading: true }))
    try {
      const result = await kfiAxios.get("/statistics/recent-loans")
      const { success, entries } = result.data
      if (success) {
        setData((prev) => ({ ...prev, entries: entries }))
        setCurrentPage(page)
        return
      }
    } catch (error) {
      present({
        message: "Failed to get recentt members records. Please try again",
        duration: 1000,
      })
    } finally {
      setData((prev) => ({ ...prev, loading: false }))
    }
  }

  useEffect(() => {
    getRecentLoans(currentPage)
  }, [])

  return (
    <div className="relative max-h-[500px] h-full flex flex-col rounded-xl">
       <div className=' w-full absolute top-0 z-[9999]'>
        <Table className=" w-full border-collapse ">
          {/* Make the entire TableHeader sticky */}
          <TableHeader className="sticky top-0 z-10  backdrop-blur-sm shadow-sm">
            <TableHeadRow className=" "
            
            >
              <TableHead className="!font-[400] border-b border-gray-200 bg-zinc-100">Name</TableHead>
              <TableHead className="!font-[400] border-b border-gray-200 bg-zinc-100">Amount</TableHead>
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
        <TableHeader className="sticky top-0 z-10 bg-white backdrop-blur-sm shadow-sm">
          <TableHeadRow>
            <TableHead className="!font-[400] border-b border-gray-200">Name</TableHead>
            <TableHead className="!font-[400] border-b border-gray-200">Amount</TableHead>
            <TableHead className="!font-[400] border-b border-gray-200">Actions</TableHead>
          </TableHeadRow>
        </TableHeader>

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
                <TableCell>
                  <ViewLoanDetails loan={entry} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>

    </div>
  )
}

export default RecentLoans

"use client"

import { useState } from "react"
import { CheckCircle2, Circle, Loader2, XCircle, CloudUpload } from "lucide-react"
import { IonButton, IonProgressBar, useIonToast } from "@ionic/react"
import kfiAxios from "../../../utils/axios"
import { syncAR, syncDmayanFund, syncEmergencyLoan, syncExpenseVoucher, syncJournalVoucher, syncLoanRelease, syncLoanReleaseDueDates, syncOR } from "../../../../database/sync"

interface SyncStep {
  id: string
  label: string
  status: "pending" | "loading" | "complete" | "error"
}

const SYNC_STEPS: SyncStep[] = [
  { id: "loanReleases", label: "Syncing Loan Releases", status: "pending" },
  { id: "expenseVouchers", label: "Syncing Expense Vouchers", status: "pending" },
  { id: "officialReceipts", label: "Syncing Official Receipts", status: "pending" },
  { id: "ackReceipts", label: "Syncing Acknowledgement Receipts", status: "pending" },
  { id: "emergencyLoans", label: "Syncing Emergency Loans", status: "pending" },
  { id: "damayanFunds", label: "Syncing Damayan Funds", status: "pending" },
  { id: "journalVouchers", label: "Syncing Journal Vouchers", status: "pending" },
]

interface BackupModalContentProps {
  onClose: () => void

  dateFrom: string
  dateTo: string
}

export function BackupEntriesModalContent({
  onClose,
  dateFrom,
  dateTo,
}: BackupModalContentProps) {
  const [steps, setSteps] = useState<SyncStep[]>(SYNC_STEPS)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
    const [present] = useIonToast();
  

  const completedSteps = steps.filter((s) => s.status === "complete").length
  const progress = (completedSteps / steps.length) * 100

  const updateStepStatus = (id: string, status: SyncStep["status"]) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)))
  }

  const syncDataEntries = async () => {
    setIsSyncing(true)
    setIsComplete(false)
    setError(null)
    setSteps(SYNC_STEPS)

    try {
      updateStepStatus("loanReleases", "loading")
      const loanRelease = await kfiAxios.get(`/sync/loan-releases?dateFrom=${dateFrom}&dateTo=${dateTo}`)
      await syncLoanRelease(loanRelease.data?.loanReleases || [])
      await syncLoanReleaseDueDates(loanRelease.data?.dueDates || [])
      updateStepStatus("loanReleases", "complete")

      updateStepStatus("expenseVouchers", "loading")
      const expenseVoucher = await kfiAxios.get(`/sync/expense-vouchers?dateFrom=${dateFrom}&dateTo=${dateTo}`)
      await syncExpenseVoucher(expenseVoucher.data?.expenseVouchers || [])
      updateStepStatus("expenseVouchers", "complete")

      updateStepStatus("officialReceipts", "loading")
      const or = await kfiAxios.get(`/sync/official-receipts?dateFrom=${dateFrom}&dateTo=${dateTo}`)
      await syncOR(or.data?.officialReceipts || [])
      updateStepStatus("officialReceipts", "complete")

      updateStepStatus("ackReceipts", "loading")
      const ar = await kfiAxios.get(`/sync/acknowledgement-receipts?dateFrom=${dateFrom}&dateTo=${dateTo}`)
      await syncAR(ar.data?.acknowledgementReceipts || [])
      updateStepStatus("ackReceipts", "complete")

      updateStepStatus("emergencyLoans", "loading")
      const emergencyLoan = await kfiAxios.get(`/sync/emergency-loans?dateFrom=${dateFrom}&dateTo=${dateTo}`)
      await syncEmergencyLoan(emergencyLoan.data?.emergencyLoans || [])
      updateStepStatus("emergencyLoans", "complete")

      updateStepStatus("damayanFunds", "loading")
      const damayanFund = await kfiAxios.get(`/sync/damayan-funds?dateFrom=${dateFrom}&dateTo=${dateTo}`)
      await syncDmayanFund(damayanFund.data?.damayanFunds || [])
      updateStepStatus("damayanFunds", "complete")

      updateStepStatus("journalVouchers", "loading")
      const journalVoucher = await kfiAxios.get(`/sync/journal-vouchers?dateFrom=${dateFrom}&dateTo=${dateTo}`);
      await syncJournalVoucher(journalVoucher.data?.journalVouchers || [])

      updateStepStatus("journalVouchers", "complete")



      setIsComplete(true)
    //   present({ message: "Backup completed successfully!", duration: 1200 })
    } catch (err: any) {
      console.error(err)
      setError("An error occurred while syncing. Please try again.")

      present({
        message: err.response?.data?.error?.message || "Sync failed",
        duration: 1500,
      })

      setSteps((prev) =>
        prev.map((step) =>
          step.status === "loading" ? { ...step, status: "error" } : step
        )
      )
    } finally {
      setIsSyncing(false)
    }
  }

  const getStatusIcon = (status: SyncStep["status"]) => {
    switch (status) {
      case "complete":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "loading":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div className="p-6">

      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <CloudUpload className="h-8 w-8 text-primary" />
        </div>
        <div>
          <p className="text-lg font-bold">Backup Entries</p>
          <p className="text-sm text-muted-foreground">Sync entries based on your date range.</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>

        <IonProgressBar
          value={progress / 100}
          className="h-2 rounded-lg overflow-hidden"
        ></IonProgressBar>
      </div>

      <div className="max-h-64 overflow-y-auto space-y-2 mb-6 pr-2">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex items-center gap-3 p-2 rounded-lg ${
              step.status === "loading"
                ? "bg-blue-50"
                : step.status === "complete"
                ? "bg-green-50"
                : step.status === "error"
                ? "bg-red-50"
                : "bg-muted/10"
            }`}
          >
            {getStatusIcon(step.status)}
            <span className="text-sm">{step.label}</span>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {isComplete && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 rounded-lg text-sm flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          Backup completed successfully!
        </div>
      )}

      <div className="flex gap-3">
        <IonButton
          className="flex-1"
          color="light"
          onClick={onClose}
          disabled={isSyncing}
        >
          {isComplete ? "Close" : "Cancel"}
        </IonButton>

        <IonButton className="flex-1" onClick={syncDataEntries} disabled={isSyncing}>
          {isSyncing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Syncing...
            </>
          ) : isComplete ? (
            "Sync Again"
          ) : (
            "Start Backup"
          )}
        </IonButton>
      </div>
    </div>
  )
}

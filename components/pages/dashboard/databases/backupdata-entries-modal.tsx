"use client"

import { useState } from "react"
import { CheckCircle2, Circle, Loader2, XCircle, CloudUpload } from "lucide-react"
import { IonButton, IonProgressBar, useIonToast } from "@ionic/react"
import kfiAxios from "../../../utils/axios"
import { syncAR, syncBusinessTypes, syncCenters, syncClientMasterFile, syncDmayanFund, syncEmergencyLoan, syncExpenseVoucher, syncJournalVoucher, syncLoanRelease, syncLoanReleaseDueDates, syncOR } from "../../../../database/sync"

interface SyncStep {
  id: string
  label: string
  status: "pending" | "loading" | "complete" | "error"
}

const SYNC_STEPS: SyncStep[] = [
   { id: "clientMasterFile", label: "Syncing clients", status: "pending" },
   { id: "center", label: "Syncing center", status: "pending" },
   { id: "business-types", label: "Syncing business types", status: "pending" },
  // { id: "loanReleases", label: "Syncing Loan Releases", status: "pending" },
  // { id: "expenseVouchers", label: "Syncing Expense Vouchers", status: "pending" },
  // { id: "officialReceipts", label: "Syncing Official Receipts", status: "pending" },
  // { id: "ackReceipts", label: "Syncing Acknowledgement Receipts", status: "pending" },
  // { id: "emergencyLoans", label: "Syncing Emergency Loans", status: "pending" },
  // { id: "damayanFunds", label: "Syncing Damayan Funds", status: "pending" },
  // { id: "journalVouchers", label: "Syncing Journal Vouchers", status: "pending" },
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
      updateStepStatus("clientMasterFile", "loading")
      const client = await kfiAxios.get(`/sync/customers`)
      await syncClientMasterFile(client.data?.customers || [])
      updateStepStatus("clientMasterFile", "complete")

      updateStepStatus("center", "loading")
      const center = await kfiAxios.get(`/sync/selection/center`)
      console.log('center',center)
      await syncCenters(center.data?.centers || [])
      updateStepStatus("center", "complete")

      updateStepStatus("business-types", "loading")
      const businessTypes = await kfiAxios.get(`/sync/selection/business-types`)
      console.log('businessTypes',businessTypes)
      await syncBusinessTypes(businessTypes.data?.businessTypes || [])
      updateStepStatus("business-types", "complete")


      setIsComplete(true)
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

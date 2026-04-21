"use client"

import { useState } from "react"
import { CheckCircle2, Circle, Loader2, XCircle, CloudUpload, TriangleAlert } from "lucide-react"
import { IonButton, IonProgressBar, useIonToast } from "@ionic/react"
import kfiAxios from "../../../utils/axios"
import { syncAR, syncBanks, syncBeginningBalance, syncBusinessSuppliers, syncBusinessTypes, syncCenters, syncChartAccount, syncClientMasterFile, syncDamayanFund, syncDmayanFund, syncEmergencyLoan, syncExpenseVoucher, syncFinancialStatements, syncGroupAccount, syncJournalVoucher, syncLoanProducts, syncLoanRelease, syncLoanReleaseDueDates, syncNatures, syncOR, syncProductLoans, syncSuppliers, syncSystemParameters, syncTrialBalance, syncUsers, syncWeeklySavings } from "../../../../database/sync"

interface SyncStep {
  id: string
  label: string
  status: "pending" | "loading" | "complete" | "error"
}

const SYNC_STEPS: SyncStep[] = [
   { id: "clientMasterFile", label: "Syncing clients", status: "pending" },
   { id: "center", label: "Syncing center", status: "pending" },
   { id: "business-types", label: "Syncing business types", status: "pending" },
   { id: "group-acc", label: "Syncing group of accounts", status: "pending" },
   { id: "chart-acc", label: "Syncing chart of accounts", status: "pending" },
   { id: "loans", label: "Syncing product loans", status: "pending" },
   { id: "center", label: "Syncing centers", status: "pending" },
   { id: "banks", label: "Syncing banks", status: "pending" },
   { id: "wsavings", label: "Syncing weekly savings", status: "pending" },
   { id: "bsupliers", label: "Syncing suppliers", status: "pending" },
   { id: "natures", label: "Syncing natures", status: "pending" },
   { id: "sparameters", label: "Syncing system parameters", status: "pending" },
   { id: "fs", label: "Syncing financial statements", status: "pending" },
   { id: "begbalance", label: "Syncing beginning balance", status: "pending" },
   { id: "trialbal", label: "Syncing trial balance", status: "pending" },
   { id: "users", label: "Syncing users", status: "pending" },

   //transactions
   { id: "loanrelease", label: "Syncing loan release", status: "pending" },
   { id: "expenseVouchers", label: "Syncing Expense Vouchers", status: "pending" },
   { id: "journalVouchers", label: "Syncing Journal Vouchers", status: "pending" },
   { id: "emergencyLoans", label: "Syncing Emergency Loans", status: "pending" },
   { id: "damayanFunds", label: "Syncing Damayan Funds", status: "pending" },
   { id: "ar", label: "Syncing acknowledgements", status: "pending" },
  { id: "or", label: "Syncing official receipts", status: "pending" },



  // { id: "officialReceipts", label: "Syncing Official Receipts", status: "pending" },
  // { id: "ackReceipts", label: "Syncing Acknowledgement Receipts", status: "pending" },
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

  const syncStep = async (id: string, fn: () => Promise<void>) => {
  updateStepStatus(id, "loading")
  try {
    await fn()
    updateStepStatus(id, "complete")
  } catch (err: any) {
    console.error(`Error syncing ${id}:`, err)
    updateStepStatus(id, "error")
    present({
      message: err.response?.data?.error?.message || `Failed to sync ${id}`,
      duration: 1500,
    })
  }
}

  const syncDataEntries = async () => {
    setIsSyncing(true)
    setIsComplete(false)
    setError(null)
    setSteps(SYNC_STEPS)

    await syncStep("clientMasterFile", async () => {
      const res = await kfiAxios.get(`/sync/customers?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=10`)
      await syncClientMasterFile(res.data?.customers || [])
    })

    await syncStep("center", async () => {
      const res = await kfiAxios.get(`/sync/selection/center?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=999999`)
      await syncCenters(res.data?.centers || [])
    })

    await syncStep("business-types", async () => {
      const res = await kfiAxios.get(`/sync/selection/business-types?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=999999`)
      await syncBusinessTypes(res.data?.businessTypes || [])
    })

    await syncStep("group-acc", async () => {
      const res = await kfiAxios.get(`/sync/group-accounts?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=999999`)
      await syncGroupAccount(res.data?.groupAccounts || [])
    })

    await syncStep("chart-acc", async () => {
      const res = await kfiAxios.get(`/sync/chart-of-accounts?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=999999`)
      await syncChartAccount(res.data?.chartOfAccounts || [])
    })

    await syncStep("loans", async () => {
      const res = await kfiAxios.get(`/sync/loans?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=999999`)
      await syncProductLoans(res.data?.loans || [])
    })

    await syncStep("banks", async () => {
      const res = await kfiAxios.get(`/sync/banks?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=999999`)
      await syncBanks(res.data?.banks || [])
    })

    await syncStep("wsavings", async () => {
      const res = await kfiAxios.get(`/sync/weekly-savings?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=999999`)
      await syncWeeklySavings(res.data?.weelySavings || [])
    })

    await syncStep("bsupliers", async () => {
      const res = await kfiAxios.get(`/sync/suppliers?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=999999`)
      await syncBusinessSuppliers(res.data?.suppliers || [])
    })

    await syncStep("natures", async () => {
      const res = await kfiAxios.get(`/sync/natures?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=999999`)
      await syncNatures(res.data?.natures || [])
    })

    await syncStep("sparameters", async () => {
      const res = await kfiAxios.get(`/sync/signature-params?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=999999`)
      await syncSystemParameters(res.data?.signatureParams || [])
    })

    await syncStep("fs", async () => {
      const res = await kfiAxios.get(`/sync/financial-statements?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=999999`)
      await syncFinancialStatements(res.data?.data.items || [])
    })

    await syncStep("begbalance", async () => {
      const res = await kfiAxios.get(`/sync/beginning-balances?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=999999`)
      await syncBeginningBalance(res.data?.data.items || [])
    })

    await syncStep("trialbal", async () => {
      const res = await kfiAxios.get(`/sync/trial-balances?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=999999`)
      await syncTrialBalance(res.data?.data.items || [])
    })



     await syncStep("users", async () => {
       const res = await kfiAxios.get(`/sync/user?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=999999`)
       await syncUsers(res.data?.users|| [])
     })


    await syncStep("expenseVouchers", async () => {
      const res = await kfiAxios.get(`/sync/expense-vouchers?dateFrom=${dateFrom}&dateTo=${dateTo}&startDate=${dateFrom}&endDate=${dateTo}&limit=10`)
      await syncExpenseVoucher(res.data?.expenseVouchers || [])
    })

     await syncStep("loanrelease", async () => {
      const res = await kfiAxios.get(`/sync/loan-releases?dateFrom=${dateFrom}&dateTo=${dateTo}&startDate=${dateFrom}&endDate=${dateTo}&limit=10`)
      await syncLoanRelease(res.data?.loanReleases || [])
    })

    await syncStep("journalVouchers", async () => {
      const res = await kfiAxios.get(`/sync/journal-vouchers?dateFrom=${dateFrom}&dateTo=${dateTo}&startDate=${dateFrom}&endDate=${dateTo}&limit=10`)
      await syncJournalVoucher(res.data?.journalVouchers || [])
    })

    await syncStep("emergencyLoans", async () => {
      const res = await kfiAxios.get(`/sync/emergency-loans?dateFrom=${dateFrom}&dateTo=${dateTo}&startDate=${dateFrom}&endDate=${dateTo}&limit=10`)
      await syncEmergencyLoan(res.data?.emergencyLoans || [])
    })

    await syncStep("damayanFunds", async () => {
      const res = await kfiAxios.get(`/sync/damayan-funds?dateFrom=${dateFrom}&dateTo=${dateTo}&startDate=${dateFrom}&endDate=${dateTo}&limit=10`)
      await syncDamayanFund(res.data?.damayanFunds || [])
    })

    await syncStep("ar", async () => {
      const res = await kfiAxios.get(`/sync/acknowledgement-receipts?dateFrom=${dateFrom}&dateTo=${dateTo}&startDate=${dateFrom}&endDate=${dateTo}&limit=10`)
      await syncAR(res.data?.releases || [])
    })

     await syncStep("or", async () => {
      const res = await kfiAxios.get(`/sync/release?dateFrom=${dateFrom}&dateTo=${dateTo}&startDate=${dateFrom}&endDate=${dateTo}&limit=10`)
      await syncOR(res.data?.acknowledgements || [])
    })

    setIsSyncing(false)
    setIsComplete(true)
  }

  const syncTest = async () => {
      const res = await kfiAxios.get(`/sync/damayan-funds?dateFrom=${dateFrom}&dateTo=${dateTo}&startDate=${dateFrom}&endDate=${dateTo}&limit=10`)
      await syncDamayanFund(res.data?.damayanFunds || [])
      console.log("Test sync completed", res.data)
 
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

        {isComplete ? (
          <IonButton className="flex-1" onClick={onClose} disabled={isSyncing}>
            Done
          </IonButton>
        ): (
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
        )}

        {/* <IonButton className="flex-1" onClick={syncTest}>
            Sync test
          </IonButton> */}

        
      </div>
    </div>
  )
}

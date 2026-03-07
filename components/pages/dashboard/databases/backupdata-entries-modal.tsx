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
   { id: "or", label: "Syncing acknowledgements", status: "pending" },



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

  const syncDataEntries = async () => {
    setIsSyncing(true)
    setIsComplete(false)
    setError(null)
    setSteps(SYNC_STEPS)

    try {
      updateStepStatus("clientMasterFile", "loading")
      const client = await kfiAxios.get(`/sync/customers?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=999999`)
      await syncClientMasterFile(client.data?.customers || [])
      updateStepStatus("clientMasterFile", "complete")

      updateStepStatus("center", "loading")
      const center = await kfiAxios.get(`/sync/selection/center?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=999999`)
      await syncCenters(center.data?.centers || [])
      updateStepStatus("center", "complete")

      updateStepStatus("business-types", "loading")
      const businessTypes = await kfiAxios.get(`/sync/selection/business-types?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=999999`)
      await syncBusinessTypes(businessTypes.data?.businessTypes || [])
      updateStepStatus("business-types", "complete")

      updateStepStatus("group-acc", "loading")
      const groupAcc = await kfiAxios.get(`/sync/group-accounts?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=999999`)
      await syncGroupAccount(groupAcc.data?.groupAccounts || [])
      updateStepStatus("group-acc", "complete")

      updateStepStatus("chart-acc", "loading")
      const chartAcc = await kfiAxios.get(`/sync/chart-of-accounts?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=999999`)
      await syncChartAccount(chartAcc.data?.chartOfAccounts || [])
      updateStepStatus("chart-acc", "complete")

      updateStepStatus("loans", "loading")
      const loans = await kfiAxios.get(`/sync/loans?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=999999`)
      await syncProductLoans(loans.data?.loans || [])
      updateStepStatus("loans", "complete")

      updateStepStatus("banks", "loading")
      const banks = await kfiAxios.get(`/sync/banks?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=999999`)
      console.log('banks', banks)
      await syncBanks(banks.data?.banks || [])
      updateStepStatus("banks", "complete")

      updateStepStatus("wsavings", "loading")
      const wsavings = await kfiAxios.get(`/sync/weekly-savings?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=999999`)
      console.log('wsavings', wsavings)
      await syncWeeklySavings(wsavings.data?.weelySavings || [])
      updateStepStatus("wsavings", "complete")

      updateStepStatus("bsupliers", "loading")
      const bsupliers = await kfiAxios.get(`/sync/suppliers?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=999999`)
      console.log('bsupliers', bsupliers)
      await syncBusinessSuppliers(bsupliers.data?.suppliers || [])
      updateStepStatus("bsupliers", "complete")

       updateStepStatus("natures", "loading")
      const natures = await kfiAxios.get(`/sync/natures?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=999999`)
      console.log('natures', natures)
      await syncNatures(natures.data?.natures || [])
      updateStepStatus("natures", "complete")

      updateStepStatus("sparameters", "loading")
      const sparameters = await kfiAxios.get(`/sync/signature-params?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=999999`)
      console.log('sparameters', sparameters)
      await syncSystemParameters(sparameters.data?.signatureParams || [])
      updateStepStatus("sparameters", "complete")

      updateStepStatus("fs", "loading")
      const fs = await kfiAxios.get(`/sync/financial-statements?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=999999`)
      console.log('fs', fs)
      await syncFinancialStatements(fs.data?.data.items || [])
      updateStepStatus("fs", "complete")

      updateStepStatus("begbalance", "loading")
      const begbalance = await kfiAxios.get(`/sync/beginning-balances?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=999999`)
      console.log('begbalance', fs)
      await syncBeginningBalance(begbalance.data?.data.items || [])
      updateStepStatus("begbalance", "complete")

      updateStepStatus("trialbal", "loading")
      const trialbal = await kfiAxios.get(`/sync/trial-balances?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=999999`)
      console.log('trialbal', trialbal)
      await syncTrialBalance(trialbal.data?.data.items || [])
      updateStepStatus("trialbal", "complete")

      updateStepStatus("users", "loading")
      const users = await kfiAxios.get(`/sync/users?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=999999`)
      console.log('users', users)
      await syncUsers(users.data?.users|| [])
      updateStepStatus("users", "complete")


      //transactions
      updateStepStatus("loanrelease", "loading")
      const loanrelease = await kfiAxios.get(`/sync/loan-releases?dateFrom=${dateFrom}&dateTo=${dateTo}&startDate=${dateFrom}&endDate=${dateTo}&limit=999999`)
      console.log('loanrelease', loanrelease)
      await syncLoanRelease(loanrelease.data?.transactions || [])
      updateStepStatus("loanrelease", "complete")

      updateStepStatus("expenseVouchers", "loading")
      const expenseVouchers = await kfiAxios.get(`/sync/expense-vouchers?dateFrom=${dateFrom}&dateTo=${dateTo}&startDate=${dateFrom}&endDate=${dateTo}&limit=999999`)
      console.log('expenseVouchers', expenseVouchers)
      await syncExpenseVoucher(expenseVouchers.data?.expenseVouchers || [])
      updateStepStatus("expenseVouchers", "complete")

      updateStepStatus("journalVouchers", "loading")
      const journalVouchers = await kfiAxios.get(`/sync/journal-vouchers?dateFrom=${dateFrom}&dateTo=${dateTo}&startDate=${dateFrom}&endDate=${dateTo}&limit=999999`)
      console.log('journalVouchers', journalVouchers)
      await syncJournalVoucher(journalVouchers.data?.journalVouchers || [])
      updateStepStatus("journalVouchers", "complete")

      updateStepStatus("emergencyLoans", "loading")
      const emergencyLoans = await kfiAxios.get(`/sync/emergency-loans?dateFrom=${dateFrom}&dateTo=${dateTo}&startDate=${dateFrom}&endDate=${dateTo}&limit=999999`)
      console.log('emergencyLoans', emergencyLoans)
      await syncEmergencyLoan(emergencyLoans.data?.emergencyLoans || [])
      updateStepStatus("emergencyLoans", "complete")

      updateStepStatus("damayanFunds", "loading")
      const damayanFunds = await kfiAxios.get(`/sync/damayan-funds?dateFrom=${dateFrom}&dateTo=${dateTo}&startDate=${dateFrom}&endDate=${dateTo}&limit=999999`)
      console.log('damayanFunds', damayanFunds)
      await syncDamayanFund(damayanFunds.data?.damayanFunds || [])
      updateStepStatus("damayanFunds", "complete")

      updateStepStatus("or", "loading")
      const or = await kfiAxios.get(`/sync/acknowledgement-receipts?dateFrom=${dateFrom}&dateTo=${dateTo}&startDate=${dateFrom}&endDate=${dateTo}&limit=999999`)
      console.log('or', or)
      await syncOR(or.data?.acknowledgements || [])
      updateStepStatus("or", "complete")



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

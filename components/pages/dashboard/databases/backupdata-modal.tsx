"use client"

import { useState } from "react"
import { CheckCircle2, Circle, Loader2, XCircle, CloudUpload } from "lucide-react"
import { IonButton, IonProgressBar } from "@ionic/react"
import kfiAxios from "../../../utils/axios"
import { syncBanks, syncBusinessTypes, syncCenters, syncClientMasterFile, syncCoa, syncLoanCodes, syncLoanProducts, syncNatures, syncPaymentSchedules, syncSuppliers, syncSystemParams } from "../../../../database/sync"
import { db } from "../../../../database/db"

interface SyncStep {
  id: string
  label: string
  status: "pending" | "loading" | "complete" | "error"
}

const SYNC_STEPS: SyncStep[] = [
  { id: "clients", label: "Syncing Clients", status: "pending" },
  { id: "banks", label: "Syncing Banks", status: "pending" },
  { id: "systemParams", label: "Syncing System Parameters", status: "pending" },
  { id: "suppliers", label: "Syncing Suppliers", status: "pending" },
  // { id: "paymentSched", label: "Syncing Payment Schedules", status: "pending" },
  { id: "natures", label: "Syncing Natures", status: "pending" },
  // { id: "loanCodes", label: "Syncing Loan Codes", status: "pending" },
  { id: "loanProducts", label: "Syncing Loan Products", status: "pending" },
  { id: "centers", label: "Syncing Centers", status: "pending" },
  { id: "coa", label: "Syncing Chart of Accounts", status: "pending" },
  { id: "businessTypes", label: "Syncing Business Types", status: "pending" },
]

interface BackupModalContentProps {
  onClose: () => void
}

export function BackupModalContent({
  onClose,
}: BackupModalContentProps) {
  const [steps, setSteps] = useState<SyncStep[]>(SYNC_STEPS)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const completedSteps = steps.filter((s) => s.status === "complete").length
  const progress = (completedSteps / steps.length) * 100

  const updateStepStatus = (id: string, status: SyncStep["status"]) => {
    setSteps((prev) => prev.map((step) => (step.id === id ? { ...step, status } : step)))
  }

  const syncDatabases = async () => {
    setIsSyncing(true)
    setError(null)
    setIsComplete(false)
    setSteps(SYNC_STEPS) 

    try {
      updateStepStatus("clients", "loading")
      const clients = await kfiAxios.get("/sync/clients")
      updateStepStatus("clients", "complete")

      updateStepStatus("banks", "loading")
      const banks = await kfiAxios.get("/sync/banks")
      updateStepStatus("banks", "complete")

      updateStepStatus("systemParams", "loading")
      const systemParams = await kfiAxios.get("/sync/system-parameters")
      updateStepStatus("systemParams", "complete")

      updateStepStatus("suppliers", "loading")
      const suppliers = await kfiAxios.get("/sync/suppliers")
      updateStepStatus("suppliers", "complete")

      // updateStepStatus("paymentSched", "loading")
      // const paymentSched = await kfiAxios.get("/sync/payment-schedules")
      // updateStepStatus("paymentSched", "complete")

      updateStepStatus("natures", "loading")
      const natures = await kfiAxios.get("/sync/natures")
      updateStepStatus("natures", "complete")

      // updateStepStatus("loanCodes", "loading")
      // const loanCodes = await kfiAxios.get("/sync/loan-codes")
      // updateStepStatus("loanCodes", "complete")

      updateStepStatus("loanProducts", "loading")
      const loanProducts = await kfiAxios.get("/sync/loan-products")
      updateStepStatus("loanProducts", "complete")

      updateStepStatus("centers", "loading")
      const centers = await kfiAxios.get("/sync/centers")
      updateStepStatus("centers", "complete")

      updateStepStatus("coa", "loading")
      const coa = await kfiAxios.get("/sync/chart-of-accounts")
      updateStepStatus("coa", "complete")

      updateStepStatus("businessTypes", "loading")
      const businessTypes = await kfiAxios.get("/sync/business-types")
      updateStepStatus("businessTypes", "complete")

      // Sync to local database
      await syncBanks(banks.data?.banks || [])
      await syncSystemParams(systemParams.data?.signatureParams || [])
      await syncSuppliers(suppliers.data?.suppliers || [])
      // await syncPaymentSchedules(paymentSched.data?.paymentSchedules || [])
      await syncNatures(natures.data?.natures || [])
      // await syncLoanCodes(loanCodes.data?.loanCodes || [])
      await syncLoanProducts(loanProducts.data?.loanProducts || [])
      await syncClientMasterFile(clients.data?.clients || [])
      await syncCenters(centers.data?.centers || [])
      await syncCoa(coa.data?.chartOfAccounts || [])
     await syncBusinessTypes(businessTypes.data.businessTypes || [])

      setIsComplete(true)
    } catch (err) {
      console.error("Sync error:", err)
      setError("An error occurred during sync. Please try again.")
      // Mark current loading step as error
      setSteps((prev) => prev.map((step) => (step.status === "loading" ? { ...step, status: "error" } : step)))
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
          <p className="text-lg font-bold">Backup Data</p>
          <p className="text-sm text-muted-foreground">Sync your data to the server</p>
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
            className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
              step.status === "loading" ? "bg-blue-50 dark:bg-blue-950/20" : ""
            } ${step.status === "complete" ? "bg-green-50 dark:bg-green-950/20" : ""} ${
              step.status === "error" ? "bg-red-50 dark:bg-red-950/20" : ""
            }`}
          >
            {getStatusIcon(step.status)}
            <span className={`text-sm ${step.status === "pending" ? "text-muted-foreground" : "text-foreground"}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      {isComplete && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 rounded-lg text-sm flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          Backup completed successfully!
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <IonButton className="flex-1" color={'light'} onClick={onClose} disabled={isSyncing}>
          {isComplete ? "Close" : "Cancel"}
        </IonButton>
        <IonButton className="flex-1" onClick={syncDatabases} disabled={isSyncing}>
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

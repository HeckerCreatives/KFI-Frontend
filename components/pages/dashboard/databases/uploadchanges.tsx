import { IonButton, useIonToast, useIonViewWillEnter } from "@ionic/react";
import React, { useCallback, useState } from "react";
import kfiAxios from "../../../utils/axios";
import { db } from "../../../../database/db";
import { business, key } from "ionicons/icons";
import { removeAmountComma } from "../../../ui/utils/formatNumber";

type SyncKey = "clientMasterFile" | "loanReleases" | "expenseVouchers" | "journalVouchers" | "groupOfAccounts" | "chartOfAccounts" | "centers" | "banks" | "weeklySavings" | "businessTypes" | "suppliers" | "natures" | "systemParameters";

export default function UploadChanges() {
  const [changes, setChanges] = useState<Record<SyncKey, number>>({
    clientMasterFile: 0,
    loanReleases: 0,
    expenseVouchers: 0,
    journalVouchers: 0,
    groupOfAccounts: 0,
    chartOfAccounts: 0,
    centers: 0,
    banks: 0,
    weeklySavings: 0,
    businessTypes: 0,
    suppliers: 0,
    natures: 0,
    systemParameters: 0
  });
    const [present] = useIonToast();
  

  const [loading, setLoading] = useState<SyncKey | null>(null);

  const tables: {
    key: SyncKey;
    label: string;
    endpoint: string;
    field?: string
  }[] = [
    {
      key: "clientMasterFile",
      label: "Client Master File",
      endpoint: "/sync/customer",
      field:'clients'

    },
    {
      key: "loanReleases",
      label: "Loan Releases",
      endpoint: "/sync/upload/loan-release",
    },
    {
      key: "expenseVouchers",
      label: "Expense Voucher",
      endpoint: "/sync/upload/expense-voucher",
    },
    {
      key: "journalVouchers",
      label: "Journal Voucher",
      endpoint: "/sync/upload/journal-voucher",
    },
    {
      key: "groupOfAccounts",
      label: "Group of Accounts",
      endpoint: "/sync/group-accounts",
      field:'groupAccounts'
    },
    {
      key: "chartOfAccounts",
      label: "Chart of Accounts",
      endpoint: "/sync/chart-of-accounts",
      field:'chartOfAccounts'
    },
    {
      key: "centers",
      label: "Centers",
      endpoint: "/sync/centers",
      field:'centers'
    },
    {
      key: "banks",
      label: "Banks",
      endpoint: "/sync/banks",
      field:'banks'
    },
     {
      key: "weeklySavings",
      label: "Weekly Savings",
      endpoint: "/sync/weekly-savings",
      field:'weeklySavings'
    },
    {
      key: "businessTypes",
      label: "Business Types",
      endpoint: "/sync/business-types",
      field:'businessTypes'
    },
    {
      key: "suppliers",
      label: "Suppliers",
      endpoint: "/sync/suppliers",
      field:'suppliers'
    },
    {
      key: "natures",
      label: "Natures",
      endpoint: "/sync/natures",
      field:'natures'
    },
    {
      key: "systemParameters",
      label: "System Parameters",
      endpoint: "/sync/signature-params",
      field:'signatureParams'
    },
  ];

  const loadChanges = useCallback(async () => {
    const cmf = await db.clientMasterFile.toArray();
    const lr = await db.loanReleases.toArray();
    const ev = await db.expenseVouchers.toArray();
    const jv = await db.journalVouchers.toArray();
    const goa = await db.groupOfAccounts.toArray();
    const coa = await db.chartOfAccounts.toArray();
    const centers = await db.centers.toArray();
    const banks = await db.banks.toArray();
    const ws = await db.weeklySavings.toArray();
    const bt = await db.businessTypes.toArray();
    const suppliers = await db.suppliers.toArray();
    const natures = await db.natures.toArray();
    const params = await db.systemParameters.toArray();

    setChanges({
      clientMasterFile: cmf.filter((e) => e._synced === false).length,
      loanReleases: lr.filter((e) => e._synced === false).length,
      expenseVouchers: ev.filter((e) => e._synced === false).length,
      journalVouchers: jv.filter((e) => e._synced === false).length,
      groupOfAccounts: goa.filter((e) => e._synced === false).length,
      chartOfAccounts: coa.filter((e) => e._synced === false).length,
      centers: centers.filter((e) => e._synced === false).length,
      banks: banks.filter((e) => e._synced === false).length,
      weeklySavings: ws.filter((e) => e._synced === false).length,
      businessTypes: bt.filter((e) => e._synced === false).length,
      suppliers: suppliers.filter((e) => e._synced === false).length,
      natures: natures.filter((e) => e._synced === false).length,
      systemParameters: params.filter((e) => e._synced === false).length,
    });
  }, []);

 const uploadChanges = async (
  key: SyncKey,
  endpoint: string,
  field?: string
) => {
  try {
    setLoading(key);

    const list = await (db as any)[key].toArray();
    const offlineChanges = list.filter((e: any) => e._synced === false);

    if (!offlineChanges.length) return;

    const payload = offlineChanges.map((item: any) => {
      const {
        isOldData,
        id,
        deletedAt,
        createdAt,
        groupAccount,
        groupAccountLabel,
        deptStatus,
        center,
        business,
        rangeAmountFrom,
        rangeAmountTo,
        weeklySavingsFund,
        ...rest
      } = item;

      return {
        ...rest,
        rangeAmountFrom: Number(removeAmountComma(rangeAmountFrom)),
        rangeAmountTo: Number(removeAmountComma(rangeAmountTo)),
        weeklySavingsFund: Number(removeAmountComma(weeklySavingsFund)),
        center:
          typeof center === "object" && center?._id
            ? center._id
            : center,
        business: typeof business === "object" && business?._id
            ? business._id
            : business,
      };
    });

    const result = await kfiAxios.post(endpoint, {
      [field || "data"]: payload,
    });

    if (result.data.success) {
      for (const item of offlineChanges) {
        await (db as any)[key].update(item.id, { _synced: true });
      }
    }

    await loadChanges();

    present({
      message: "All changes has been saved.",
      duration: 1000,
    });

  } catch (error) {
    present({
      message: "Error occured, please try again.",
      duration: 1000,
    });
    console.log(error);
  } finally {
    setLoading(null);
  }
};

  useIonViewWillEnter(() => {
    loadChanges();
  });

  return (
    <div className="bg-white rounded-md shadow-sm p-4 w-full max-w-[40rem]">
      <p className="text-sm !font-bold">Upload Offline Changes</p>

      <div className=" w-full grid grid-cols-2 gap-1 mt-4">
        {tables.map((table) => {
          const count = changes[table.key];

          return (
            <div
              key={table.key}
              className="flex items-center justify-between bg-zinc-50 hover:bg-zinc-100 transition rounded-md p-4 border border-zinc-200"
            >
              <div className="flex flex-col">
                <span className="font-medium text-sm">
                  {table.label}
                </span>

                {count > 0 ? (
                  <span className="text-xs text-red-500 font-medium">
                    {count} pending change{count > 1 ? "s" : ""}
                  </span>
                ) : (
                  <span className="text-xs text-emerald-500">
                    All synced
                  </span>
                )}
              </div>

              <IonButton
                size="small"
                disabled={!count || loading === table.key}
                onClick={() =>
                  uploadChanges(table.key, table.endpoint, table.field)
                }
                className=" "
              >
                {loading === table.key ? "Uploading..." : "Upload"}
              </IonButton>
            </div>
          );
        })}
      </div>
    </div>
  );
}
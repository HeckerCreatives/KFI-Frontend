import { IonButton, useIonToast, useIonViewWillEnter } from "@ionic/react";
import React, { useCallback, useState } from "react";
import kfiAxios from "../../../utils/axios";
import { db } from "../../../../database/db";

type SyncKey = "clientMasterFile" | "loanReleases" | "expenseVouchers";

export default function UploadChanges() {
  const [changes, setChanges] = useState<Record<SyncKey, number>>({
    clientMasterFile: 0,
    loanReleases: 0,
    expenseVouchers: 0,
  });
    const [present] = useIonToast();
  

  const [loading, setLoading] = useState<SyncKey | null>(null);

  const tables: {
    key: SyncKey;
    label: string;
    endpoint: string;
  }[] = [
    {
      key: "clientMasterFile",
      label: "Client Master File",
      endpoint: "/sync/upload/customers",
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
  ];

  const loadChanges = useCallback(async () => {
    const cmf = await db.clientMasterFile.toArray();
    const lr = await db.loanReleases.toArray();
    const ev = await db.expenseVouchers.toArray();

    setChanges({
      clientMasterFile: cmf.filter((e) => e._synced === false).length,
      loanReleases: lr.filter((e) => e._synced === false).length,
      expenseVouchers: ev.filter((e) => e._synced === false).length,
    });
  }, []);

  const uploadChanges = async (key: SyncKey, endpoint: string) => {
    try {
      setLoading(key);

      const list = await (db as any)[key].toArray();
      const offlineChanges = list.filter((e: any) => e._synced === false);

      if (!offlineChanges.length) return;

      const result = await kfiAxios.post(endpoint, {
        data: offlineChanges,
      });

      if (result.data.success) {
        // Mark as synced
        for (const item of offlineChanges) {
          await (db as any)[key].update(item.id, { _synced: true });
        }
      }

      await loadChanges();
       present({
        message: 'All changes has been saved.',
        duration: 1000,
      });
    } catch (error) {
         present({
        message: 'Error occured, please try again.',
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
    <div className="bg-white rounded-md shadow-sm p-4 w-full max-w-[25rem]">
      <p className="text-sm !font-bold">Upload Offline Changes</p>

      <div className="flex flex-col gap-1 mt-4">
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
                  uploadChanges(table.key, table.endpoint)
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
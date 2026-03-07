import { IonButton, useIonToast, useIonViewWillEnter } from "@ionic/react";
import React, { useCallback, useState } from "react";
import kfiAxios from "../../../utils/axios";
import { db } from "../../../../database/db";
import { business, key } from "ionicons/icons";
import { removeAmountComma } from "../../../ui/utils/formatNumber";

type SyncKey = "clientMasterFile" | "loanReleases" | "expenseVouchers" | "journalVouchers" | "groupOfAccounts" | "chartOfAccounts" | "centers" | "banks" | "weeklySavings" | "businessTypes" | "suppliers" | "natures" | "systemParameters" | "productLoans" | "damayanFunds" | "emergencyLoans" | "financialStatements" | "trialBalance" | "beginningBalance";

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
    systemParameters: 0,
    productLoans: 0,
    damayanFunds: 0,
    emergencyLoans: 0,
    financialStatements: 0,
    trialBalance: 0,
    beginningBalance: 0,
  });
    const [present] = useIonToast();
  const user = localStorage.getItem('user')

  

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
      endpoint: "/sync/loan-releases",
       field:'loanReleases'
    },
    {
      key: "expenseVouchers",
      label: "Expense Voucher",
      endpoint: "/sync/expense-vouchers",
    field:'expenseVouchers'

    },
    {
      key: "journalVouchers",
      label: "Journal Voucher",
      endpoint: "/sync/journal-vouchers",
        field:'journalVouchers'

    },
    {
      key: "damayanFunds",
      label: "Damayan Funds",
      endpoint: "/sync/damayan-funds",
        field:'damayanFunds'

    },
    {
      key: "emergencyLoans",
      label: "Emergency Loans",
      endpoint: "/sync/emergency-loans",
        field:'emergencyLoans'

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
    {
      key: "productLoans",
      label: "Loan products",
      endpoint: "/sync/loans",
      field:'loans'
    },
    {
      key: "financialStatements",
      label: "Financial Statements",
      endpoint: "/sync//financial-statements",
      field:'financialStatements'
    },
    {
      key: "trialBalance",
      label: "Trial Balance",
      endpoint: "/sync/trial-balances",
      field:'trialBalances'
    },
    {
      key: "beginningBalance",
      label: "Beginning Balance",
      endpoint: "/sync/beginning-balances",
      field:'beginningBalances'
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
    const loans = await db.productLoans.toArray();
    const damayan = await db.damayanFunds.toArray();
    const emergencyl = await db.emergencyLoans.toArray();
    const fs = await db.financialStatements.toArray();
    const trialb = await db.trialBalance.toArray();
    const beginningb = await db.beginningBalance.toArray();

    setChanges({
      clientMasterFile: cmf.filter((e) => e._synced === false).length,
      loanReleases: lr.filter((e) => e._synced === false).length,
      expenseVouchers: ev.filter((e) => e._synced === false).length,
      journalVouchers: jv.filter((e) => e._synced === false).length,
      damayanFunds: damayan.filter((e) => e._synced === false).length,
      groupOfAccounts: goa.filter((e) => e._synced === false).length,
      chartOfAccounts: coa.filter((e) => e._synced === false).length,
      centers: centers.filter((e) => e._synced === false).length,
      banks: banks.filter((e) => e._synced === false).length,
      weeklySavings: ws.filter((e) => e._synced === false).length,
      businessTypes: bt.filter((e) => e._synced === false).length,
      suppliers: suppliers.filter((e) => e._synced === false).length,
      natures: natures.filter((e) => e._synced === false).length,
      systemParameters: params.filter((e) => e._synced === false).length,
      productLoans: loans.filter((e) => e._synced === false).length,
      emergencyLoans: emergencyl.filter((e) => e._synced === false).length,
      financialStatements: fs.filter((e) => e._synced === false).length,
      trialBalance: trialb.filter((e) => e._synced === false).length,
      beginningBalance: beginningb.filter((e) => e._synced === false).length,
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
        entries,
        acctMonth,
        acctYear,
        bank,
        amount,
        noOfWeeks,
        code,
        cvNo,
        loan,
        client,
        date,
        checkDate,
        supplier,
        centerLabel,
        primary,
        secondary,
        loanCodes,
        year,
        ...rest
      } = item;

      return {
        ...rest,
        rangeAmountFrom: Number(removeAmountComma(rangeAmountFrom)),
        rangeAmountTo: Number(removeAmountComma(rangeAmountTo)),
        weeklySavingsFund: Number(removeAmountComma(weeklySavingsFund)),
        acctMonth: Number(acctMonth),
        acctYear: Number(acctYear),
        bank: bank?._id,
        amount: Number(removeAmountComma(amount)),
        noOfWeeks: Number(removeAmountComma(noOfWeeks)),
        code: code ?? cvNo,
        loan: loan?._id,
        centerLabel: center?.description,
        date: date?.split('T')[0],
        checkDate: date?.split('T')[0],
        supplier: supplier?._id,
        name: user,
        primaryYear: Number(primary?.year),
        primaryMonth: Number(primary?.month),
        secondaryYear: Number(secondary?.year),
        secondaryMonth: Number(secondary?.month),
        year: Number(year),
        entries: entries?.map((item: any, index: number) => ({
            ...item,
            debit: Number(removeAmountComma(item.debit)),
            credit: Number(removeAmountComma(item.credit)),
            acctCode: item.acctCodeId || item.acctCode._id,
            acctCodeId: item.acctCodeId || item.acctCode._id,
            client: item.clientId || item.client?._id,
            line: Number(item.line)

        })) ,
        loanCodes: loanCodes?.map((item: any, index: number) => ({
            ...item,
            code: item.acctCode._id,
            acctCode: item.acctCode._id,
        })) ,
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

      <div className=" w-full grid grid-cols-2 gap-1 mt-4 max-h-[30rem] overflow-y-auto">
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
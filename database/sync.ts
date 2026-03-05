import { ApiError } from "next/dist/server/api-utils";
import { formatLoanReleaseSync } from "../components/ui/utils/fomatData";
import { ClientMasterFile } from "../types/types";
import { db } from "./db";

export async function syncClientMasterFile(apiData: any) {
   console.log('Data CMF', apiData);
  if (!apiData) return;

  await db.clientMasterFile.clear();

  const clients: ClientMasterFile[] = apiData.map((c: any) => ({...c, 
    _synced: true, 
    isOldData: true,
    id: c._id
  }));

  await db.clientMasterFile.bulkPut(clients);

  console.log('CMF Sync success', clients);
  return true;
}

export async function syncCenters(apiData: any) {
  console.log('Data Centers', apiData)
  if (!apiData) return;

    await db.centers.clear();

  const data: any[] = apiData.map((c: any) => ({
    ...c,
    _synced: true,
    isOldData: true
  }));

  await db.table("centers").bulkPut(data);

  console.log('Center Sync sucess', data)

  return true;
}



export async function syncSystemParams(apiData: any) {
    console.log('Data', apiData)
  if (!apiData) return;

    await db.systemParameters.clear();

  const data: any[] = apiData.map((c: any) => ({
    ...c,
    _id: c._id,
  }));

  await db.table("systemParameters").bulkPut(data);

  console.log('Sync sucess', data)

  return true;
}



export async function syncPaymentSchedules(apiData: any) {
  console.log('Data', apiData)
  if (!apiData) return;

    await db.paymentSchedules.clear();

  const data: any[] = apiData.map((c: any) => ({
    ...c,
    _id: c._id,
  }));

  await db.table("paymentSchedules").bulkPut(data);

  console.log('Sync sucess', data)

  return true;
}


export async function syncLoanCodes(apiData: any) {
  console.log('Data', apiData)
  if (!apiData) return;

    await db.loanCodes.clear();

  const data: any[] = apiData.map((c: any) => ({
    ...c,
    _id: c._id,
  }));

  await db.table("loanCodes").bulkPut(data);

  console.log('Sync sucess', data)

  return true;
}

export async function syncLoanProducts(apiData: any) {
  console.log('Data products', apiData)
  if (!apiData) return;

  await db.loanProducts.clear();

  await db.table("loanProducts").bulkAdd(apiData);

  console.log('Sync sucess', apiData)

  return true;
}



//genral ledgers updated
export async function syncGroupAccount(apiData: any) {
  console.log('syncGroupAccount', apiData)
  if (!apiData) return;

    await db.groupOfAccounts.clear();

  const data: any[] = apiData.map((c: any) => ({
    ...c,
    _synced: true,
    isOldData: true
  }));

  await db.table("groupOfAccounts").bulkPut(data);

  console.log('Sync syncGroupAccount sucess', data)

  return true;
}

export async function syncChartAccount(apiData: any) {
  console.log('syncChartAccount', apiData)
  if (!apiData) return;

    await db.chartOfAccounts.clear();

  const data: any[] = apiData.map((c: any) => ({
    ...c,
    id: c._id,
    groupAccount: c.groupOfAccount?._id || '',
    groupAccountLabel: c.groupOfAccount?.code || '',
    _synced: true,
    isOldData: true,

  }));

  await db.table("chartOfAccounts").bulkPut(data);

  console.log('Sync chartOfAccounts sucess', data)

  return true;
}

export async function syncBusinessTypes(apiData: any) {
  console.log('Data Business', apiData)
  if (!apiData) return;

    await db.businessTypes.clear();

  const data: any[] = apiData.map((c: any) => ({
    ...c,
     id: c._id,
    _synced: true,
    isOldData: true,
  }));

  await db.table("businessTypes").bulkPut(data);

  console.log('Sync businessTypes sucess', data)

  return true;
}

export async function syncBusinessSuppliers(apiData: any) {
  console.log('Data syncBusinessSuppliers', apiData)
  if (!apiData) return;

    await db.suppliers.clear();

  const data: any[] = apiData.map((c: any) => ({
    ...c,
     id: c._id,
    _synced: true,
    isOldData: true,
  }));

  await db.table("suppliers").bulkPut(data);

  console.log('Sync suppliers sucess', data)

  return true;
}

export async function syncProductLoans(apiData: any) {
  console.log('Data syncProductLoans', apiData)
  if (!apiData) return;

    await db.productLoans.clear();

  const data: any[] = apiData.map((c: any) => ({
    ...c,
    id: c._id,
    _synced: true,
    isOldData: true,
  }));

  await db.table("productLoans").bulkPut(data);

  console.log('Sync syncProductLoans sucess', data)

  return true;
}

export async function syncBanks(apiData: any) {
    console.log('Data Banks', apiData)
  if (!apiData) return;

    await db.banks.clear();

  const data: any[] = apiData?.map((c: any) => ({
    ...c,
     id: c._id,
    _synced: true,
    isOldData: true,
  }));

  await db.table("banks").bulkPut(data);

  console.log('Sync sucess', data)

  return true;
}

export async function syncWeeklySavings(apiData: any) {
    console.log('Data syncWeeklySavings', apiData)
  if (!apiData) return;

    await db.weeklySavings.clear();

  const data: any[] = apiData?.map((c: any) => ({
    ...c,
     id: c._id,
    _synced: true,
    isOldData: true,
  }));

  await db.table("weeklySavings").bulkPut(data);

  console.log('Sync sucess weeklySavings', data)

  return true;
}

export async function syncSuppliers(apiData: any) {
    console.log('Data suppliers', apiData)
  if (!apiData) return;

  await db.suppliers.clear();

  await db.table("suppliers").bulkAdd(apiData);

  console.log('Sync sucess suppliers', apiData)

  return true;
}

export async function syncNatures(apiData: any) {
  console.log('Data natures', apiData)
  if (!apiData) return;

 await db.natures.clear();

  const data: any[] = apiData?.map((c: any) => ({
    ...c,
     id: c._id,
    _synced: true,
    isOldData: true,
  }));

   await db.table("natures").bulkPut(data);

  console.log('Sync sucess natures', data)

  return true;
}

export async function syncSystemParameters(apiData: any) {
  console.log('Data systemParameters', apiData)
  if (!apiData) return;

 await db.systemParameters.clear();

  const data: any[] = apiData?.map((c: any) => ({
    ...c,
     id: c._id,
    _synced: true,
    isOldData: true,
  }));

   await db.table("systemParameters").bulkPut(data);

  console.log('Sync sucess systemParameters', data)

  return true;
}

export async function syncFinancialStatements(apiData: any) {
  console.log('Data syncFinancialStatements', apiData)
  if (!apiData) return;

 await db.financialStatements.clear();

  const data: any[] = apiData?.map((c: any) => ({
    ...c,
     id: c._id,
    _synced: true,
    isOldData: true,
  }));

   await db.table("financialStatements").bulkPut(data);

  console.log('Sync syncFinancialStatements', data)

  return true;
}

export async function syncBeginningBalance(apiData: any) {
  console.log('Data syncBeginningBalance', apiData)
  if (!apiData) return;

 await db.beginningBalance.clear();

  const data: any[] = apiData?.map((c: any) => ({
    ...c,
     id: c._id,
    _synced: true,
    isOldData: true,
  }));

   await db.table("beginningBalance").bulkPut(data);

  console.log('Sync syncBeginningBalance', data)

  return true;
}


//transactions
export async function syncLoanRelease(apiData: any) {
  console.log('Data syncLoanRelease', apiData)
  if (!apiData) return;

 await db.loanReleases.clear();

  const data: any[] = apiData?.map((c: any) => ({
    ...c,
     id: c._id,
    _synced: true,
    isOldData: true,
  }));

   await db.table("loanReleases").bulkPut(data);

  console.log('Sync syncLoanRelease', data)

  return true;
}

export async function syncExpenseVoucher(apiData: any) {
  console.log('Data syncExpenseVoucher', apiData)
  if (!apiData) return;

 await db.expenseVouchers.clear();

  const data: any[] = apiData?.map((c: any) => ({
    ...c,
     id: c._id,
    _synced: true,
    isOldData: true,
  }));

   await db.table("expenseVouchers").bulkPut(data);

  console.log('Sync syncExpenseVoucher', data)

  return true;
}

export async function syncJournalVoucher(apiData: any) {
  console.log('Data syncJournalVoucher', apiData)
  if (!apiData) return;

 await db.journalVouchers.clear();

  const data: any[] = apiData?.map((c: any) => ({
    ...c,
     id: c._id,
    _synced: true,
    isOldData: true,
  }));

   await db.table("journalVouchers").bulkPut(data);

  console.log('Sync syncJournalVoucher', data)

  return true;
}








export async function syncCoa(apiData: any) {
  console.log('Data', apiData)
  if (!apiData) return;

    await db.chartOfAccounts.clear();

  const data: any[] = apiData.map((c: any) => ({
    ...c,
    _id: c._id,
  }));

  await db.table("chartOfAccounts").bulkPut(data);

  console.log('Sync sucess', data)

  return true;
}

export async function syncGoa(apiData: any) {
  console.log('Data Goa', apiData)
  if (!apiData) return;
  await db.groupOfAccounts.clear();

  await db.table("groupOfAccounts").bulkAdd(apiData);

  console.log('Sync sucess Goa', apiData)

  return true;
}





export async function syncLoanReleaseDueDates(apiData: any) {
  console.log('Data LR dates', apiData)
  if (!apiData) return;

  await db.dueDates.clear();
  await db.table("dueDates").bulkAdd(apiData);

  console.log('Sync sucess LR dates', apiData)

  return true;
}


export async function syncOR(apiData: any) {
  console.log('Data', apiData)
  if (!apiData) return;

  await db.officialReceipts.clear();
  await db.table("officialReceipts").bulkAdd(apiData);
  console.log('Sync sucess', apiData)

  return true;
}

export async function syncAR(apiData: any) {
  console.log('Data ar', apiData)
  if (!apiData) return;

  await db.acknowledgementReceipts.clear();
  await db.table("acknowledgementReceipts").bulkAdd(apiData);
  console.log('Sync sucess ar', apiData)

  return true;
}

export async function syncEmergencyLoan(apiData: any) {
  console.log('Data el', apiData)
  if (!apiData) return;

  await db.emergencyLoans.clear();
  await db.table("emergencyLoans").bulkAdd(apiData);

  console.log('Sync sucess el', apiData)

  return true;
}

export async function syncDmayanFund(apiData: any) {
  console.log('Data df', apiData)
  if (!apiData) return;

  await db.damayanFunds.clear();
  await db.damayanFunds.bulkAdd(apiData);

  console.log('Sync sucess df', apiData)

  return true;
}



export async function dropClientMasterFile() {
  try {
    await db.clientMasterFile.clear();
    console.log("clientMasterFile cleared successfully.");
   
  } catch (err) {
    console.error("Failed to reset clientMasterFile:", err);
  }
}


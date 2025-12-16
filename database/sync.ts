import { ApiError } from "next/dist/server/api-utils";
import { formatLoanReleaseSync } from "../components/ui/utils/fomatData";
import { ClientMasterFile } from "../types/types";
import { db } from "./db";

export async function syncClientMasterFile(apiData: any) {
   console.log('Data CMF', apiData);
  if (!apiData) return;

  await db.clientMasterFile.clear();

  const clients: ClientMasterFile[] = apiData.map((c: any) => ({
    ...c,
    business: c.business
      ? { _id: c.business, type: c.businessLabel }
      : { _id: '', type: '' },
    center: c.center
      ? {
          _id: c.center,
          centerNo: c.centerLabel || '',
          description: c.centerLabel || '',
        }
      : { _id: '', centerNo: '', description: '' },
  }));

  await db.clientMasterFile.bulkPut(clients);

  console.log('Sync success', clients);
  return true;
}

export async function syncBanks(apiData: any) {
    console.log('Data Banks', apiData)
  if (!apiData) return;

    await db.banks.clear();

  const data: any[] = apiData?.map((c: any) => ({
    ...c,
    _id: c._id,
    code: c.code,
  }));

  await db.table("banks").bulkPut(data);

  console.log('Sync sucess', data)

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

export async function syncSuppliers(apiData: any) {
    console.log('Data suppliers', apiData)
  if (!apiData) return;

  await db.suppliers.clear();

  await db.table("suppliers").bulkAdd(apiData);

  console.log('Sync sucess suppliers', apiData)

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

export async function syncNatures(apiData: any) {
  console.log('Data', apiData)
  if (!apiData) return;

    await db.natures.clear();

  const data: any[] = apiData.map((c: any) => ({
    ...c,
    _id: c._id,
  }));

  await db.table("natures").bulkPut(data);

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

export async function syncCenters(apiData: any) {
  console.log('Data Centers', apiData)
  if (!apiData) return;

    await db.centers.clear();

  const data: any[] = apiData.map((c: any) => ({
    ...c,
    _id: c._id,
  }));

  await db.table("centers").bulkPut(data);

  console.log('Sync sucess', data)

  return true;
}

export async function syncBusinessTypes(apiData: any) {
  console.log('Data Business', apiData)
  if (!apiData) return;

    await db.businessTypes.clear();

  const data: any[] = apiData.map((c: any) => ({
    ...c,
    _id: c._id,
  }));

  await db.table("businessTypes").bulkPut(data);

  console.log('Sync sucess', data)

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

export async function syncWeeklySavings(apiData: any) {
  console.log('Data Weekly Savings', apiData)
  if (!apiData) return;
  await db.weeklySavings.clear();

  await db.table("weeklySavings").bulkAdd(apiData);

  console.log('Sync sucess Weekly savings', apiData)

  return true;
}



//transactions
export async function syncLoanRelease(apiData: any) {
  console.log('Data LR', apiData)

  if (!apiData) return;

  const data = formatLoanReleaseSync(apiData)
  await db.loanReleases.clear();
  await db.table("loanReleases").bulkPut(data);

  console.log('Sync sucess LR', data)

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

export async function syncExpenseVoucher(apiData: any) {
  console.log('Data EV', apiData)
  if (!apiData) return;

  await db.expenseVouchers.clear();
  await db.table("expenseVouchers").bulkAdd(apiData);

  console.log('Sync sucess EV', apiData)

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

export async function syncJournalVoucher(apiData: any) {
  console.log('Data', apiData)
  if (!apiData) return;

    await db.journalVoucherEntries.clear();

  const data: any[] = apiData.map((c: any) => ({
    ...c,
    _id: c._id,
  }));

  await db.table("journalVoucherEntries").bulkPut(data);

  console.log('Sync sucess', data)

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


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
    console.log('Data', apiData)
  if (!apiData) return;

    await db.suppliers.clear();

  const data: any[] = apiData.map((c: any) => ({
    ...c,
    _id: c._id,
  }));

  await db.table("suppliers").bulkPut(data);

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
  console.log('Data', apiData)
  if (!apiData) return;

    await db.loanProducts.clear();

  const data: any[] = apiData.map((c: any) => ({
    ...c,
    _id: c._id,
  }));

  await db.table("loanProducts").bulkPut(data);

  console.log('Sync sucess', data)

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

export async function syncLoanRelease(apiData: any) {
  console.log('Data', apiData)
  if (!apiData) return;

    await db.loanReleases.clear();

  const data: any[] = apiData.map((c: any) => ({
    ...c,
    _id: c._id,
  }));

  await db.table("loanReleases").bulkPut(data);

  console.log('Sync sucess', data)

  return true;
}

export async function syncExpenseVoucher(apiData: any) {
  console.log('Data', apiData)
  if (!apiData) return;

    await db.expenseVoucherEntries.clear();

  const data: any[] = apiData.map((c: any) => ({
    ...c,
    _id: c._id,
  }));

  await db.table("expenseVoucherEntries").bulkPut(data);

  console.log('Sync sucess', data)

  return true;
}

export async function syncOR(apiData: any) {
  console.log('Data', apiData)
  if (!apiData) return;

    await db.officialReceiptEntries.clear();

  const data: any[] = apiData.map((c: any) => ({
    ...c,
    _id: c._id,
  }));

  await db.table("officialReceiptEntries").bulkPut(data);

  console.log('Sync sucess', data)

  return true;
}

export async function syncAR(apiData: any) {
  console.log('Data', apiData)
  if (!apiData) return;

    await db.acknowledgementReceiptEntries.clear();

  const data: any[] = apiData.map((c: any) => ({
    ...c,
    _id: c._id,
  }));

  await db.table("acknowledgementReceiptEntries").bulkPut(data);

  console.log('Sync sucess', data)

  return true;
}

export async function syncEmergencyLoan(apiData: any) {
  console.log('Data', apiData)
  if (!apiData) return;

    await db.emergencyLoanEntries.clear();

  const data: any[] = apiData.map((c: any) => ({
    ...c,
    _id: c._id,
  }));

  await db.table("emergencyLoanEntries").bulkPut(data);

  console.log('Sync sucess', data)

  return true;
}

export async function syncDmayanFund(apiData: any) {
  console.log('Data', apiData)
  if (!apiData) return;

    await db.damayanFundEntries.clear();

  const data: any[] = apiData.map((c: any) => ({
    ...c,
    _id: c._id,
  }));

  await db.table("damayanFundEntries").bulkPut(data);

  console.log('Sync sucess', data)

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


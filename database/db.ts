import Dexie, { Table } from "dexie";


export class KfiDatabase extends Dexie {
  loanReleases!: Table<any>;
  banks!: Table<any>;
  businessTypes!: Table<any>;
  chartOfAccounts!: Table<any>;
  productLoans!: Table<any>;
  clients!: Table<any>;
  loanCodes!: Table<any>;
  loanProducts!: Table<any>;
  natures!: Table<any>;
  paymentSchedules!: Table<any>;
  suppliers!: Table<any>;
  systemParameters!: Table<any>;
  weeklySavings!: Table<any>;
  groupOfAccounts!: Table<any>;
  dueDates!: Table<any>;
  journalVouchers!: Table<any>;
  journalVoucherEntries!: Table<any>;
  expenseVouchers!: Table<any>;
  expenseVoucherEntries!: Table<any>;
  officialReceipts!: Table<any>;
  officialReceiptEntries!: Table<any>;
  acknowledgementReceipts!: Table<any>;
  acknowledgementReceiptEntries!: Table<any>;
  emergencyLoans!: Table<any>;
  emergencyLoanEntries!: Table<any>;
  damayanFunds!: Table<any>;
  damayanFundEntries!: Table<any>;

  //customer
  clientMasterFile!: Table<any>;
  newclientMasterFile!: Table<any>;
  centers!: Table<any>;
  financialStatements!: Table<any>


  constructor() {
    super("kfi");

    this.version(1).stores({
        //transactions
      clientMasterFile: "++id, _id, acctNumber, centerNo, name",
      centers: "++id, centerNo, description",
      chartOfAccounts: "++id, _id, code, description",
      productLoans: "++id, _id",
      banks: "++id,_id",
      weeklySavings: "++id, _id",
      financialStatements: "++id, _id",

      
      newClientMasterFile: "++id",
      loanReleases: "++id",
      businessTypes: "++id, action",
      clients: "++id, name, center",
      loanCodes: "++id, loan",
      loanProducts: "++id, code",
      natures: "++id, nature",
      paymentSchedules: "++id",
      suppliers: "++id, code, description",
      systemParameters: "++id",
      groupOfAccounts: "++id, code",
      dueDates: "++id, loanRelease",
      journalVouchers: "++id, code, center",
      journalVoucherEntries: "++id, journalVoucher",
      expenseVouchers: "++id, code, center",
      expenseVoucherEntries: "++id, expenseVoucher",
      officialReceipts: "++id, code, center",
      officialReceiptEntries: "++id, acknowledgement",
      acknowledgementReceipts: "++id, code, center",
      acknowledgementReceiptEntries: "++id, release",
      emergencyLoans: "++id, code, center",
      emergencyLoanEntries: "++id, emergencyLoan",
      damayanFunds: "++id, code, center",
      damayanFundEntries: "++id, damayanFund",
    });
  }
}

export const db = new KfiDatabase();

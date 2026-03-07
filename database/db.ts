import Dexie, { Table } from "dexie";


export class KfiDatabase extends Dexie {
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
  journalVoucherEntries!: Table<any>;
  expenseVouchers!: Table<any>;
  expenseVoucherEntries!: Table<any>;
  officialReceipts!: Table<any>;
  officialReceiptEntries!: Table<any>;
  acknowledgementReceipts!: Table<any>;
  acknowledgementReceiptEntries!: Table<any>;
  emergencyLoans!: Table<any>;
  emergencyLoanEntries!: Table<any>;
  damayanFundEntries!: Table<any>;

  //customer
  clientMasterFile!: Table<any>;

  //others
  centers!: Table<any>;
  financialStatements!: Table<any>
  beginningBalance!: Table<any>
  trialBalance!: Table<any>
  journalVouchers!: Table<any>;
  damayanFunds!: Table<any>;
  loanReleases!: Table<any>;
  releaseReceipts!: Table<any>;

  //users
  users!: Table<any>;




  constructor() {
    super("kfi");

    this.version(1).stores({

      users: "++id, _id, username",
      
      clientMasterFile: "++id, _id, acctNumber, centerNo, name",
      centers: "++id, centerNo, description",
      chartOfAccounts: "++id, _id, code, description",
      productLoans: "++id, _id",
      banks: "++id,_id",
      weeklySavings: "++id, _id",
      financialStatements: "++id, _id",
      beginningBalance: "++id, _id",
      trialBalance: "++id, _id",

      //trnsactions
      loanReleases: "++id",
      expenseVouchers: "++id, _id",
      journalVouchers: "++id, _id",
      damayanFunds: "++id, _id",
      acknowledgementReceipts: "++id, _id",
      releaseReceipts: "++id, _id",






      
      newClientMasterFile: "++id",
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
      journalVoucherEntries: "++id, journalVoucher",
      expenseVoucherEntries: "++id, expenseVoucher",
      officialReceipts: "++id, code, center",
      officialReceiptEntries: "++id, acknowledgement",
      acknowledgementReceiptEntries: "++id, release",
      emergencyLoans: "++id, code, center",
      emergencyLoanEntries: "++id, emergencyLoan",
      damayanFundEntries: "++id, damayanFund",
    });
  }
}

export const db = new KfiDatabase();

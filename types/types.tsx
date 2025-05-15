export type NavLink = {
  label: string;
  path: string;
};

export type ChartOfAccount = {
  _id: string;
  code: string;
  description: string;
  classification: string;
  nature: string;
  groupAccount: string;
  closingAccount: string;
  fsCode: string;
  mainAcctNo: string;
  subAcctNo: string;
  branchCode: string;
  sequence: string;
  parent: string;
  indention: string;
  detailed: boolean;
};

export type Loan = {
  _id: string;
  code: string;
  description: string;
  createdAt: string;
};

export type Supplier = {
  _id: string;
  code: string;
  description: string;
  createdAt: string;
};

export type Bank = {
  _id: string;
  code: string;
  description: string;
  createdAt: string;
};

export type GroupAccount = {
  _id: string;
  code: string;
  createdAt: string;
};

export type BusinessType = {
  _id: string;
  type: string;
  createdAt: string;
};

export type WeeklySavings = {
  _id: string;
  rangeAmountFrom: string;
  rangeAmountTo: string;
  weeklySavingsFund: string;
  createdAt: string;
};

export type Nature = {
  _id: string;
  type: string;
  createdAt: string;
};

export type Center = {
  _id: string;
  centerNo: string;
  description: string;
  location: string;
  centerChief: string;
  treasurer: string;
  acctOfficer: string;
  createdAt: string;
};

export type TFormError = {
  msgs: string[];
  path: string;
};

export type TErrorData = {
  formErrors?: TFormError[];
  message: string;
};

export type TError = {
  error: TErrorData;
  message: string;
};

export type TTableFilter = {
  limit: number;
  page: number;
  search?: string;
  sort?: string;
};

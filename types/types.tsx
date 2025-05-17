export type NavLink = {
  label: string;
  path: string;
  resource: string;
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

export type Beneficiary = {
  createdAt: string;
  name: string;
  relationship: string;
  owner: string;
  _id: string;
};

export type Child = {
  createdAt: string;
  name: string;
  owner: string;
  _id: string;
};

export interface ClientMasterFile {
  acctNumber: string;
  acctOfficer: string;
  address: string;
  age: string;
  birthdate: string;
  birthplace: string;
  business: { _id: string; type: String };
  center: { _id: string; centerNo: string };
  city: string;
  civilStatus: string;
  createdAt: string;
  dateRelease: string;
  dateResigned: string;
  groupNumber: string;
  memberStatus: string;
  mobileNo: string;
  name: string;
  newStatus: string;
  parent: string;
  position: string;
  reason: string;
  sex: string;
  spouse: string;
  telNo: string;
  zipCode: string;
  _id: string;
  beneficiaries: Beneficiary[];
  children: Child[];
}

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

export type Action = {
  create: boolean;
  update: boolean;
  delete: boolean;
  read: boolean;
  print: boolean;
  visible: boolean;
};

export type ActionType = 'create' | 'visible' | 'read' | 'update' | 'delete' | 'print';

export type Permission = {
  resource: string;
  actions: Action;
  _id: string;
};

export type AccessToken = {
  _id: string;
  username: string;
  role: string;
  permissions: Permission[];
  exp: number;
  iat: number;
};

export type User = {
  _id: string;
  name: string;
  username: string;
  status: string;
  createdAt: string;
  permissions: Permission[];
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

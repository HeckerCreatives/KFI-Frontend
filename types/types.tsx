export type NavLink = {
  label: string;
  path: string;
};

export type TAccountFile = {
  code: string;
  description: string;
  classification: 'A' | 'L' | 'E' | 'R' | 'C' | 'X' | '';
  natureOfAccount: 'D' | 'C' | '';
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

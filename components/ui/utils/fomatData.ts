import { Entry } from "../../../types/types";
import { LoanReleaseFormData } from "../../../validations/loan-release.schema";
import { removeAmountComma } from "./formatNumber";

//transactions
export function formatLoanReleaseSync(list: any[]) {
  return list.map(item => ({
    acctMonth: item.acctMonth,
    acctYear: item.acctYear,
    amount: item.amount || 0,
    bankCode: item.bank._id,
    bankCodeLabel: item.bank.code,
    center: item.center._id,
    centerLabel: item.center.description,
    checkNo: item.checkNo || "",
    checkDate: item.checkDate || "",
    cvNo: item.code,
    cycle: item.cycle || 0,
    date: item.date,
    encodedBy: {
      username: item.encodedBy,
    },
    entries: Array.isArray(item.entries) ? item.entries : [],
    _id: item._id,
    interestRate: item.interestRate || 0,
     isEduc: item.isEduc,
    name: item.center.description,
    noOfWeeks: item.noOfWeeks,
    refNumber: item.refNo || '',
    remarks: item.remarks,
    root: "",
    typeOfLoan: item.loan._id,
    typeOfLoanLabel: item.loan.typeOfLoanLabel,
    _synced: true,

    }))

}

export function formatLoanReleaseList(list: any[]) {
  return list.map(item => ({
    id: item.id || undefined,
    _id: item._id || '' ,
    acctMonth: Number(item.acctMonth) || 0,
    acctYear: Number(item.acctYear) || 0,
    amount: Number(item.amount) || 0,

    bank: {
      _id: item.bankCode,
      code: item.bankCode,
      description: item.bankCodeLabel,
    },

    center: {
      _id: item.center,
      centerNo: item.centerLabel,
      description: item.centerLabel,
    },

    checkDate: item.checkDate || "",
    checkNo: item.checkNo || "",
    code: item.cvNo,
    cycle: Number(item.cycle) || 0,
    date: item.date,
    encodedBy: {
      username: item?.encodedBy.username || '',
    },

    entries: Array.isArray(item.entries) ? item.entries : [],

    interest: Number(item.interestRate) || 0,

    loan: {
      _id: item.typeOfLoan,
      code: item.typeOfLoanLabel,
    },

    noOfWeeks: Number(item.noOfWeeks) || 0,
    refNo: item.refNumber,
    remarks: item.remarks || "",
    createdAt: item.date,
    type: 'loan release',
    isEduc: Boolean(item.isEduc),
  }));
}

export function formatJV(list: any[]) {
  return list.map(item => ({
    id: item.id || undefined,
    _id: item._id || '' ,
    code: item.code,
    nature: item.nature,
    remarks: item.remarks || "",
    date: item.date,
    acctMonth: Number(item.acctMonth) || 0,
    acctYear: Number(item.acctYear) || 0,
    checkDate: item.checkDate || "",
    checkNo: item.checkNo || "",
    bankCode: {
      _id: item.bank,
      code: item.bankLabel,
      description: item.bankLabel,
    },
    amount: Number(removeAmountComma(item.amount)) || 0,
    encodedBy: {
      username: item?.encodedBy.username || '',
    },
    entries: Array.isArray(item.entries) ? item.entries : [],
    createdAt: item.date,
    type: 'journal voucher',
   
  }));
}

export function formatEVList(list: any[]) {
  return list.map(item => ({
    acctMonth: item.acctMonth,
    acctYear: item.acctYear,
    amount: Number(removeAmountComma(item.amount)) || 0,
    bankCode: {
      _id: item.bank,
      code: item.bankLabel,
      description: item.bankLabel,
    },
    checkDate: item.checkDate || "",
    checkNo: item.checkNo || "",
    code: item.code,
    createdAt: item.createdAt,
    date: item.date,
    encodedBy: {
      username: item?.encodedBy?.username || '',
    },
    refNo: item.refNo,
    remarks: item.remarks || "",
    supplier: item.supplier,
    id: item.id || undefined,
    _id: item._id || '' ,
    type: 'expense voucher',
    entries: Array.isArray(item.entries) ? item.entries : [],
    _synced: item._synced,
    action: item.action,
    deletedAt: item.deletedAt

  }));
}

export function formatELList(list: any[]) {
  return list.map(item => ({
    _id: item._id,
    id: item.id,
    code: item.code,
    user: item.user,
    refNo: item.refNo,
    remarks: item.remarks,
    date: item.date,
    acctMonth: item.acctMonth,
    acctYear: item.acctYear,
    checkNo: item.checkNo,
    checkDate: item.checkDate,
    center: { _id: item.centerValue, centerNo: item.centerLabel, description: item.centerLabel },
    bankCode: { _id: item.bankCode, code: item.bankCodeLabel, description: item.bankCodeLabel },
    amount: item.amount,
    encodedBy: { username: item.encodedBy,name },
     entries: Array.isArray(item.entries) ? item.entries : [],
    _synced: item._synced,
    action: item.action,
    deletedAt: item.deletedAt,
    type: item.type,
    cashCollectionAmount: item.cashCollectionAmount,
    acctOfficer: item.acctOfficer

  }));
}

//emtries
export  function formatLREntries(data: any[]){
    return Array.isArray(data)
    ? data.map((entry: any, index: number): Entry => ({
       _id: entry._id ?? '',
        acctCode: { _id: entry.acctCodeId, code: entry.acctCode, description: entry.description },
        center: { _id: "", centerNo: "", description: "" },
        client: { _id: entry.clientId, name: entry.client },
        particular: entry.particular,
        checkNo: entry.checkNo,
        credit: entry.credit,
        debit: entry.debit,
        cycle: entry.cycle,
        interest: entry.interest,
        product: { _id: '', code:'' },
        transaction: '',
        createdAt: '',
        line: entry.line
      }))
    : [];
}

export  function formatJVEntries(data: any[]){
    return Array.isArray(data)
    ? data.map((entry: any, index: number): any => ({
        _id: entry._id ?? '',
        client: { _id: entry.client, name: entry.clientLabel},
        particular: entry.particular,
        acctCode: { _id: entry.acctCodeId, code: entry.acctCode, description: entry.description },
        credit: entry.credit,
        debit: entry.credit,
        cvForRecompute: entry.cvForRecompute,
        line: entry.line,
        _synced: entry._synced,
        action: entry.action
      }))
    : [];
}

export  function formatEVEntries(data: any[]){
    return Array.isArray(data)
    ? data.map((entry: any, index: number): any => ({
        _id: entry._id ?? '',
        client: { _id: entry.client, name: entry.clientLabel},
        particular: entry.particular,
        acctCode: { _id: entry.acctCodeId, code: entry.acctCode, description: entry.description },
        credit: entry.credit,
        debit: entry.credit,
        cvForRecompute: entry.cvForRecompute,
        line: entry.line,
        _synced: entry._synced,
        action: entry.action
      }))
    : [];
}


//uploading
export function formatLoanReleaseForUpload(item: any) {
  return {
    code: item.code,
    center: item.center._id,
    date: item.date,
    acctMonth: item.acctMonth,
    acctYear: item.acctYear,
    noOfWeeks: item.noOfWeeks,
    loan: item.typeOfLoan,
    checkDate: item.checkDate,
    bank: item.bankCode,
    amount: item.amount,
    interest: item.interestRate,
    checkNo: item.checkNo,
    cycle: item.cycle,
    entries: Array.isArray(item.entries)
      ? item.entries.map((e: any) => ({
          line: e.line,
          clientId: e.client._id,
          client: e.client.name,
          particular: e.particular,
          acctCodeId: e.acctCode._id,
          acctCode: e.acctCode.code,
          description: e.acctCode.description,
          debit: e.debit,
          credit: e.credit,
          interest: e.interest,
          cycle: e.cycle,
          checkNo: e.checkNo,
          _synced: e._synced,
          action: e.action,
          deletedAt: e.deletedAt ?? '',


          // _id: e._id || undefined,
          // line: Number(e.line),
          // client: {
          //   _id: e.clientId,
          //   name: e.client,
          // },
          // particular: e.particular || " - ",
          // acctCode: {
          //   _id: e.acctCodeId,
          //   code: e.acctCode,
          //   description: e.description,
          // },
          // debit: e.debit ? Number(e.debit) : null,
          // credit: e.credit ? Number(e.credit) : null,
          // interest: e.interest ? Number(e.interest) : null,
          // cycle: e.cycle ? Number(e.cycle) : null,
          // checkNo: e.checkNo || "",

          
        }))
      : [],
    _synced: false,
    action: item._id ? "update" : "create",
  };
}
export function formatJVForUpload(item: any) {
  console.log(item)
  return {
    // code: "JV#34534258",
    // nature: "345",
    // date: "2025-12-03",
    // acctMonth: "9",
    // acctYear: "2025",
    // checkNo: "3564456456456",
    // checkDate: "2025-12-03",
    // bank: "6823ec4dccc74a4d9ec494b7",
    // bankLabel: "PNB",
    // amount: "8000",
    // remarks: "",
    

    code: item.code,
    date: item.date,
    acctMonth: item.acctMonth,
    acctYear: item.acctYear,
    checkDate: item.checkDate,
    bank: item.bank,
    bankLabel: item.bankLabel,
    amount: Number(removeAmountComma(item.amount)),
    checkNo: item.checkNo,
    entries: Array.isArray(item.entries)
      ? item.entries.map((e: any) => ({
          line: e.line,
          clientId: e.client._id,
          client: e.client.name,
          particular: e.particular,
          acctCodeId: e.acctCode._id,
          acctCode: e.acctCode.code,
          description: e.acctCode.description,
          debit: e.debit,
          credit: e.credit,
          interest: e.interest,
          cycle: e.cycle,
          checkNo: e.checkNo,
          _synced: e._synced,
          action: e.action,
          deletedAt: e.deletedAt ?? '',
        }))
      : [],
    _synced: item._synced,
    action: item._id ? "update" : "create",
    _id: item._id,
    deletedAt: item.deletedAt
  };
}

export function formatEVForUpload(item: any) {
  console.log(item)
  return {
    // code: "JV#34534258",
    // nature: "345",
    // date: "2025-12-03",
    // acctMonth: "9",
    // acctYear: "2025",
    // checkNo: "3564456456456",
    // checkDate: "2025-12-03",
    // bank: "6823ec4dccc74a4d9ec494b7",
    // bankLabel: "PNB",
    // amount: "8000",
    // remarks: "",
    

    code: item.code,
    date: item.date,
    acctMonth: item.acctMonth,
    acctYear: item.acctYear,
    checkDate: item.checkDate,
    bank: item.bank,
    bankLabel: item.bankLabel,
    amount: Number(removeAmountComma(item.amount)),
    checkNo: item.checkNo,
    entries: Array.isArray(item.entries)
      ? item.entries.map((e: any) => ({
          line: e.line,
          clientId: e.client._id,
          client: e.client.name,
          particular: e.particular,
          acctCodeId: e.acctCode._id,
          acctCode: e.acctCode.code,
          description: e.acctCode.description,
          debit: e.debit,
          credit: e.credit,
          interest: e.interest,
          cycle: e.cycle,
          checkNo: e.checkNo,
          _synced: e._synced,
          action: e.action,
          deletedAt: e.deletedAt ?? '',
        }))
      : [],
    _synced: item._synced,
    action: item._id ? "update" : "create",
    _id: item._id,
    deletedAt: item.deletedAt
  };
}

// export function formatDFForUpload(item: any) {
//   console.log(item)
//   return {
//     code: item.code,
//     nature: item.nature,
//     name: item.name,
//     centerLabel: item.centerLabel,
//     center: item.centerValue || item.center,
//     refNo: item.refNo,
//     remarks: item.remarks,
//     date: item.date,
//     acctMonth: item.acctMonth,
//     acctYear: item.acctYear,
//     checkDate: item.checkDate,
//     checkNo: item.checkNo,
//     bankCode: item.bankCode,
//     bankCodeLabel: item.bankCodeLable,
//     amount: Number(removeAmountComma(item.amount)),
//     entries: Array.isArray(item.entries)
//       ? item.entries.map((e: any) => ({
//           line: e.line,
//           client: e.client._id || e.client,
//           clientName: e.client.name || e.clientName,
//           particular: e.particular,
//           acctCodeId: e.acctCode._id || e.acctCodeId,
//           acctCodeLabel: e.acctCode.description || e.acctCodeLabel,
//           debit: e.debit,
//           credit: e.credit,
//           _synced: e._synced,
//           action: e.action,
//           deletedAt: e.deletedAt ?? '',
//         }))
//       : [],
//     _synced: item._synced,
//     action: item._id ? "update" : "create",
//     _id: item._id,
//     deletedAt: item.deletedAt
//   };
// }

export  function formatDFForUpload(item: any[]){
    return Array.isArray(item)
    ? item.map((item: any, index: number): any => ({
       code: item.code,
      nature: item.nature,
      name: item.name,
      centerLabel: item.centerLabel,
      center: item?.centerValue || item.center,
      refNo: item.refNo,
      remarks: item.remarks,
      date: item.date,
      acctMonth: item.acctMonth,
      acctYear: item.acctYear,
      checkDate: item.checkDate,
      checkNo: item.checkNo,
      bankCode: item.bankCode,
      deletedIds: item.deletedIds,
      bankCodeLabel: item.bankCodeLabel,
      amount: Number(removeAmountComma(item.amount)),
      entries: Array.isArray(item.entries)
        ? item.entries.map((e: any) => ({
            line: e.line,
            client: e.client?._id || e.client,
            clientName: e.client?.name || e.clientName,
            particular: e.particular,
            acctCodeId: e.acctCode?._id || e.acctCodeId,
            acctCodeLabel: e.acctCode?.description || e.acctCodeLabel,
            debit: e.debit,
            credit: e.credit,
            _synced: e._synced,
            action: e.action,
            deletedAt: e.deletedAt ?? '',
          }))
        : [],
      _synced: item._synced,
      action: item._id ? "update" : "create",
      _id: item._id,
      deletedAt: item.deletedAt
      }))
    : [];
}



//submit
export function formatJVEntriesSubmit(list: any[]) {
  console.log('Formateer',list)
  return list.map(item => ({
    id: item.id || undefined,
    _id: item._id || '' ,
    line: item.line,
    client: item.client._id,
    clientLabel: item.client.name,
    particular: item.particular,
    acctCodeId: item.acctCode._id,
    acctCode: item.acctCode.code,
    description: item.acctCode.description,
    debit:String(item.debit),
    credit:String(item.credit),
    cvForRecompute: item.cvForRecompute,
    action: item.action,
    _synced: item._synced,
    deletedAt: item.deletedAt,
  }));
}



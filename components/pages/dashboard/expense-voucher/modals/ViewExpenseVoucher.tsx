import React, { useRef, useState } from 'react';
import { IonModal, IonHeader, IonToolbar, IonIcon, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonText, IonButton } from '@ionic/react';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { eye } from 'ionicons/icons';
import ExpenseVoucherViewCard from '../components/ExpenseVoucherViewCard';
import { ExpenseVoucher } from '../../../../../types/types';
import { formatDateTable } from '../../../../utils/date-utils';
import { formatNumber } from '../../../../ui/utils/formatNumber';
import ViewExpenseVoucherEntries from '../components/ViewExpenseVoucherEntries';

type ViewExpenseVoucherType = {
  expenseVoucher: ExpenseVoucher;
};

const ViewExpenseVoucher = ({ expenseVoucher }: ViewExpenseVoucherType) => {
  const [isOpen, setIsOpen] = useState(false);

  function dismiss() {
    setIsOpen(false);
  }

  return (
    <>
      {/* <div className="text-end">
        <div
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={eye} className="text-[1rem]" /> View
        </div>
      </div> */}
      <IonButton
        type="button"
        onClick={() => setIsOpen(true)}
        fill="clear"
        className="space-x-1 rounded-lg w-24 h-6 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-[#ffe808] text-slate-700 capitalize min-h-4 text-xs"
      >
        <IonIcon icon={eye} className="text-xs" />
        <span>View</span>
      </IonButton>
      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:95%] md:[--width:100%] lg:[--max-width:95%] lg:[--width:95%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader title="Expense Voucher - View Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content h-screen flex flex-col gap-2">
          <div className="space-y-1">
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <ExpenseVoucherViewCard label="CV#" value={`CV#${expenseVoucher.code}`} labelClassName="min-w-20 text-end !text-slate-600" />
                <ExpenseVoucherViewCard label="Supplier" value={expenseVoucher.supplier.description} labelClassName="min-w-20 text-end !text-slate-600" />
              </div>
              <div className="space-y-1">
                <ExpenseVoucherViewCard label="Date" value={formatDateTable(expenseVoucher.date)} labelClassName="min-w-20 text-end !text-slate-600" />
                <ExpenseVoucherViewCard label="Account Month" value={`${expenseVoucher.acctMonth}`} labelClassName="min-w-28 text-end !text-slate-600" />
                <ExpenseVoucherViewCard label="Account Year" value={`${expenseVoucher.acctYear}`} labelClassName="min-w-28 text-end !text-slate-600" />
              </div>
              <div className="space-y-1">
                <ExpenseVoucherViewCard label="Check Number" value={expenseVoucher.checkNo} labelClassName="min-w-28 text-end !text-slate-600" />
                <ExpenseVoucherViewCard label="Check Date" value={formatDateTable(expenseVoucher.checkDate)} labelClassName="min-w-28 text-end !text-slate-600" />
                <ExpenseVoucherViewCard label="Bank Code" value={expenseVoucher.bankCode.description} labelClassName="min-w-28 text-end !text-slate-600" />
                <ExpenseVoucherViewCard label="Amount" value={`${formatNumber(expenseVoucher.amount)}`} labelClassName="min-w-28 text-end !text-slate-600" />
              </div>
            </div>
            <div className="space-y-1">
              <ExpenseVoucherViewCard label="Remark" value={expenseVoucher.remarks} labelClassName="min-w-20 text-end !text-slate-600" />
              <ExpenseVoucherViewCard label="User" value={expenseVoucher.encodedBy.username} labelClassName="min-w-20 text-end !text-slate-600" containerClassName="max-w-40" />
            </div>
          </div>
          <div className="flex-1">
            <ViewExpenseVoucherEntries expenseVoucher={expenseVoucher} isOpen={isOpen} />
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default ViewExpenseVoucher;

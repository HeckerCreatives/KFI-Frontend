import React, { useRef, useState } from 'react';
import { IonModal, IonHeader, IonToolbar, IonIcon, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonText } from '@ionic/react';
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
      <div className="text-end">
        <div
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={eye} className="text-[1rem]" /> View
        </div>
      </div>
      <IonModal isOpen={isOpen} backdropDismiss={false} className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:70%] lg:[--width:70%]">
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader title="Expense Voucher - View Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content !px-6 !py-5">
          <IonGrid>
            <IonRow>
              <IonCol size="6" className="space-y-2">
                <ExpenseVoucherViewCard label="EV#" value={`EV#${expenseVoucher.code}`} />
                <ExpenseVoucherViewCard label="Supplier" value={expenseVoucher.supplier.description} />
                <ExpenseVoucherViewCard label="Reference Number" value={expenseVoucher.refNo} />
                <ExpenseVoucherViewCard label="Remark" value={expenseVoucher.remarks} />
                <ExpenseVoucherViewCard label="Date" value={formatDateTable(expenseVoucher.date)} />
                <ExpenseVoucherViewCard label="User" value={expenseVoucher.encodedBy.username} />
              </IonCol>
              <IonCol size="6" className="space-y-2">
                <IonGrid className="ion-no-padding">
                  <IonRow className="gap-2">
                    <IonCol>
                      <ExpenseVoucherViewCard label="Account Month" value={`${expenseVoucher.acctMonth}`} />
                    </IonCol>
                    <IonCol>
                      <ExpenseVoucherViewCard label="Account Year" value={`${expenseVoucher.acctYear}`} />
                    </IonCol>
                  </IonRow>
                </IonGrid>
                <ExpenseVoucherViewCard label="Check Number" value={expenseVoucher.checkNo} />
                <ExpenseVoucherViewCard label="Check Date" value={formatDateTable(expenseVoucher.checkDate)} />
                <ExpenseVoucherViewCard label="Bank Code" value={expenseVoucher.bankCode.description} />
                <ExpenseVoucherViewCard label="Amount" value={`${formatNumber(expenseVoucher.amount)}`} />
              </IonCol>
            </IonRow>
          </IonGrid>
          <ViewExpenseVoucherEntries expenseVoucher={expenseVoucher} isOpen={isOpen} />
        </div>
      </IonModal>
    </>
  );
};

export default ViewExpenseVoucher;

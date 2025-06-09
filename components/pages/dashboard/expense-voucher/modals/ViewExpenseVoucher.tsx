import React, { useRef } from 'react';
import { IonModal, IonHeader, IonToolbar, IonIcon, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonText } from '@ionic/react';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { eye } from 'ionicons/icons';
import LoanReleaseFormTable from '../components/ExpenseVoucherFormTable';
import ExpenseVoucherViewCard from '../components/ExpenseVoucherViewCard';

const ViewExpenseVoucher = ({ index }: { index: number }) => {
  const arrDummy: string[] = Array.from(Array(10)).fill('');

  const modal = useRef<HTMLIonModalElement>(null);

  function dismiss() {
    modal.current?.dismiss();
  }

  return (
    <>
      <div className="text-end">
        <div
          id={`view-expenseVoucher-modal-${index}`}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={eye} className="text-[1rem]" /> View
        </div>
      </div>
      <IonModal
        ref={modal}
        trigger={`view-expenseVoucher-modal-${index}`}
        backdropDismiss={false}
        className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:70%] lg:[--width:70%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader title="Transaction - Expense Voucher - View Record" sub="All Actions" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content !px-6 !py-5">
          <IonGrid>
            <IonRow>
              <IonCol size="6" className="space-y-2">
                <ExpenseVoucherViewCard label="CV#" value="CV#25564" />
                <ExpenseVoucherViewCard label="Center Code" value="413" />
                <ExpenseVoucherViewCard label="Name" value="ALITE-Kristine T. Bartican" />
                <ExpenseVoucherViewCard label="Reference Number" value="" />
                <ExpenseVoucherViewCard label="Remark" value="Loan release to CV#413-ALITE-Kristine T. Bartican" />
                <ExpenseVoucherViewCard label="Date" value="04/01/2025" />
                <IonGrid className="ion-no-padding">
                  <IonRow className="gap-2">
                    <IonCol>
                      <ExpenseVoucherViewCard label="Account Month" value="4" />
                    </IonCol>
                    <IonCol>
                      <ExpenseVoucherViewCard label="Account Year" value="2025" />
                    </IonCol>
                  </IonRow>
                </IonGrid>
                <ExpenseVoucherViewCard label="User" value="EVD" />
              </IonCol>
              <IonCol size="6" className="space-y-2">
                <ExpenseVoucherViewCard label="Number of Weeks" value="25" />
                <ExpenseVoucherViewCard label="Type of Loan" value="IC" />
                <ExpenseVoucherViewCard label="Check Number" value="20005244" />
                <ExpenseVoucherViewCard label="Check Date" value="04/01/2025" />
                <ExpenseVoucherViewCard label="Bank Code" value="PNB" />
                <ExpenseVoucherViewCard label="Amount" value="13,290.00" />
                <ExpenseVoucherViewCard label="Cycle" value="2" />
                <ExpenseVoucherViewCard label="Interest Rate" value="24" />
              </IonCol>
            </IonRow>
          </IonGrid>
          <LoanReleaseFormTable />
        </div>
      </IonModal>
    </>
  );
};

export default ViewExpenseVoucher;

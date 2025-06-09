import React, { useRef } from 'react';
import { IonModal, IonHeader, IonToolbar, IonIcon, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonText } from '@ionic/react';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { eye } from 'ionicons/icons';
import LoanReleaseFormTable from '../components/JournalVoucherFormTable';
import JournalVoucherViewCard from '../components/JournalVoucherViewCard';

const ViewJournalVoucher = ({ index }: { index: number }) => {
  const arrDummy: string[] = Array.from(Array(10)).fill('');

  const modal = useRef<HTMLIonModalElement>(null);

  function dismiss() {
    modal.current?.dismiss();
  }

  return (
    <>
      <div className="text-end">
        <div
          id={`view-journalVoucher-modal-${index}`}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={eye} className="text-[1rem]" /> View
        </div>
      </div>
      <IonModal
        ref={modal}
        trigger={`view-journalVoucher-modal-${index}`}
        backdropDismiss={false}
        className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:70%] lg:[--width:70%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader title="Transaction - Journal Voucher - View Record" sub="All Actions" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content !px-6 !py-5">
          <IonGrid>
            <IonRow>
              <IonCol size="6" className="space-y-2">
                <JournalVoucherViewCard label="CV#" value="CV#25564" />
                <JournalVoucherViewCard label="Center Code" value="413" />
                <JournalVoucherViewCard label="Name" value="ALITE-Kristine T. Bartican" />
                <JournalVoucherViewCard label="Reference Number" value="" />
                <JournalVoucherViewCard label="Remark" value="Loan release to CV#413-ALITE-Kristine T. Bartican" />
                <JournalVoucherViewCard label="Date" value="04/01/2025" />
                <IonGrid className="ion-no-padding">
                  <IonRow className="gap-2">
                    <IonCol>
                      <JournalVoucherViewCard label="Account Month" value="4" />
                    </IonCol>
                    <IonCol>
                      <JournalVoucherViewCard label="Account Year" value="2025" />
                    </IonCol>
                  </IonRow>
                </IonGrid>
                <JournalVoucherViewCard label="User" value="EVD" />
              </IonCol>
              <IonCol size="6" className="space-y-2">
                <JournalVoucherViewCard label="Number of Weeks" value="25" />
                <JournalVoucherViewCard label="Type of Loan" value="IC" />
                <JournalVoucherViewCard label="Check Number" value="20005244" />
                <JournalVoucherViewCard label="Check Date" value="04/01/2025" />
                <JournalVoucherViewCard label="Bank Code" value="PNB" />
                <JournalVoucherViewCard label="Amount" value="13,290.00" />
                <JournalVoucherViewCard label="Cycle" value="2" />
                <JournalVoucherViewCard label="Interest Rate" value="24" />
              </IonCol>
            </IonRow>
          </IonGrid>
          <LoanReleaseFormTable />
        </div>
      </IonModal>
    </>
  );
};

export default ViewJournalVoucher;

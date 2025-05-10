import React, { useRef } from 'react';
import { IonModal, IonHeader, IonToolbar, IonIcon, IonGrid, IonRow, IonCol } from '@ionic/react';
import ModalHeader from '../../../../../ui/page/ModalHeader';
import { eye } from 'ionicons/icons';
import LoanReleaseFormTable from '../components/OfficialReceiptFormTable';
import OfficialReceiptViewCard from '../components/OfficialReceiptViewCard';

const ViewOfficialReceipt = ({ index }: { index: number }) => {
  const modal = useRef<HTMLIonModalElement>(null);

  function dismiss() {
    modal.current?.dismiss();
  }

  return (
    <>
      <div className="text-end">
        <div
          id={`view-officialReceipt-modal-${index}`}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={eye} className="text-[1rem]" /> View
        </div>
      </div>
      <IonModal
        ref={modal}
        trigger={`view-officialReceipt-modal-${index}`}
        backdropDismiss={false}
        className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:70%] lg:[--width:70%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader title="Transaction - Official Receipt - View Record" sub="All Actions" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content !px-6 !py-5">
          <IonGrid>
            <IonRow>
              <IonCol size="6" className="space-y-2">
                <OfficialReceiptViewCard label="CV#" value="CV#25564" />
                <OfficialReceiptViewCard label="Center Code" value="413" />
                <OfficialReceiptViewCard label="Name" value="ALITE-Kristine T. Bartican" />
                <OfficialReceiptViewCard label="Reference Number" value="" />
                <OfficialReceiptViewCard label="Remark" value="Loan release to CV#413-ALITE-Kristine T. Bartican" />
                <OfficialReceiptViewCard label="Date" value="04/01/2025" />
                <IonGrid className="ion-no-padding">
                  <IonRow className="gap-2">
                    <IonCol>
                      <OfficialReceiptViewCard label="Account Month" value="4" />
                    </IonCol>
                    <IonCol>
                      <OfficialReceiptViewCard label="Account Year" value="2025" />
                    </IonCol>
                  </IonRow>
                </IonGrid>
                <OfficialReceiptViewCard label="User" value="EVD" />
              </IonCol>
              <IonCol size="6" className="space-y-2">
                <OfficialReceiptViewCard label="Number of Weeks" value="25" />
                <OfficialReceiptViewCard label="Type of Loan" value="IC" />
                <OfficialReceiptViewCard label="Check Number" value="20005244" />
                <OfficialReceiptViewCard label="Check Date" value="04/01/2025" />
                <OfficialReceiptViewCard label="Bank Code" value="PNB" />
                <OfficialReceiptViewCard label="Amount" value="13,290.00" />
                <OfficialReceiptViewCard label="Cycle" value="2" />
                <OfficialReceiptViewCard label="Interest Rate" value="24" />
              </IonCol>
            </IonRow>
          </IonGrid>
          <LoanReleaseFormTable />
        </div>
      </IonModal>
    </>
  );
};

export default ViewOfficialReceipt;

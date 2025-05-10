import React, { useRef } from 'react';
import { IonModal, IonHeader, IonToolbar, IonIcon, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonText } from '@ionic/react';
import ModalHeader from '../../../../../ui/page/ModalHeader';
import { eye } from 'ionicons/icons';
import LoanReleaseFormTable from '../components/DamayanFundFormTable';
import DamayanFundViewCard from '../components/DamayanFundViewCard';

const ViewDamayanFund = ({ index }: { index: number }) => {
  const modal = useRef<HTMLIonModalElement>(null);

  function dismiss() {
    modal.current?.dismiss();
  }

  return (
    <>
      <div className="text-end">
        <div
          id={`view-leanRelease-modal-${index}`}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={eye} className="text-[1rem]" /> View
        </div>
      </div>
      <IonModal
        ref={modal}
        trigger={`view-leanRelease-modal-${index}`}
        backdropDismiss={false}
        className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:70%] lg:[--width:70%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader title="Transaction - Damayan Fund - View Record" sub="All Actions" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content !px-6 !py-5">
          <IonGrid>
            <IonRow>
              <IonCol size="6" className="space-y-2">
                <DamayanFundViewCard label="CV#" value="CV#25564" />
                <DamayanFundViewCard label="Center Code" value="413" />
                <DamayanFundViewCard label="Name" value="ALITE-Kristine T. Bartican" />
                <DamayanFundViewCard label="Reference Number" value="" />
                <DamayanFundViewCard label="Remark" value="Loan release to CV#413-ALITE-Kristine T. Bartican" />
                <DamayanFundViewCard label="Date" value="04/01/2025" />
                <IonGrid className="ion-no-padding">
                  <IonRow className="gap-2">
                    <IonCol>
                      <DamayanFundViewCard label="Account Month" value="4" />
                    </IonCol>
                    <IonCol>
                      <DamayanFundViewCard label="Account Year" value="2025" />
                    </IonCol>
                  </IonRow>
                </IonGrid>
                <DamayanFundViewCard label="User" value="EVD" />
              </IonCol>
              <IonCol size="6" className="space-y-2">
                <DamayanFundViewCard label="Number of Weeks" value="25" />
                <DamayanFundViewCard label="Type of Loan" value="IC" />
                <DamayanFundViewCard label="Check Number" value="20005244" />
                <DamayanFundViewCard label="Check Date" value="04/01/2025" />
                <DamayanFundViewCard label="Bank Code" value="PNB" />
                <DamayanFundViewCard label="Amount" value="13,290.00" />
                <DamayanFundViewCard label="Cycle" value="2" />
                <DamayanFundViewCard label="Interest Rate" value="24" />
              </IonCol>
            </IonRow>
          </IonGrid>
          <LoanReleaseFormTable />
        </div>
      </IonModal>
    </>
  );
};

export default ViewDamayanFund;

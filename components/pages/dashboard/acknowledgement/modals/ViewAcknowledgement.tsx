import React, { useState } from 'react';
import { IonModal, IonHeader, IonToolbar, IonIcon, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonText } from '@ionic/react';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { eye } from 'ionicons/icons';
import { Acknowledgement } from '../../../../../types/types';
import { formatDateTable } from '../../../../utils/date-utils';
import { formatNumber } from '../../../../ui/utils/formatNumber';
import AcknowledgementViewCard from '../components/AcknowledgementViewCard';
import ViewAcknowledgementEntries from '../components/ViewAcknowledgementEntries';

type ViewAcknowledgementProps = {
  acknowledgement: Acknowledgement;
};

const ViewAcknowledgement = ({ acknowledgement }: ViewAcknowledgementProps) => {
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
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader title="Acknowledgement - View Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content !p-2">
          <IonGrid>
            <IonRow>
              <IonCol size="6" className="space-y-1">
                <AcknowledgementViewCard label="CV#" value={`CV#${acknowledgement.code}`} />
                <AcknowledgementViewCard label="Center Code" value={`${acknowledgement.center.centerNo}`} />
                <AcknowledgementViewCard label="Name" value={`${acknowledgement.center.description}`} />
                <AcknowledgementViewCard label="Particular" value={acknowledgement.remarks} />
                <AcknowledgementViewCard label="Cash Type" value={acknowledgement.type} />
                <AcknowledgementViewCard label="Account Officer" value={acknowledgement.acctOfficer} />
                <AcknowledgementViewCard label="User" value={acknowledgement.encodedBy.username} />
              </IonCol>
              <IonCol size="6" className="space-y-1">
                <AcknowledgementViewCard label="Date" value={formatDateTable(acknowledgement.date)} />
                <IonGrid className="ion-no-padding">
                  <IonRow className="gap-2">
                    <IonCol>
                      <AcknowledgementViewCard label="Account Month" value={`${acknowledgement.acctMonth}`} />
                    </IonCol>
                    <IonCol>
                      <AcknowledgementViewCard label="Account Year" value={`${acknowledgement.acctYear}`} />
                    </IonCol>
                  </IonRow>
                </IonGrid>
                <AcknowledgementViewCard label="Check Number" value={acknowledgement.checkNo} />
                <AcknowledgementViewCard label="Check Date" value={formatDateTable(acknowledgement.checkDate)} />
                <AcknowledgementViewCard label="Bank Code" value={acknowledgement.bankCode.description} />
                <AcknowledgementViewCard label="Amount" value={`${formatNumber(acknowledgement.amount)}`} />
                <AcknowledgementViewCard label="Cash Collection" value={`${formatNumber(acknowledgement.cashCollectionAmount || 0)}`} />
              </IonCol>
            </IonRow>
          </IonGrid>
          <ViewAcknowledgementEntries acknowledgement={acknowledgement} isOpen={isOpen} />
        </div>
      </IonModal>
    </>
  );
};

export default ViewAcknowledgement;

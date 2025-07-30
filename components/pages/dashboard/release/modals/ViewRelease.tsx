import React, { useState } from 'react';
import { IonModal, IonHeader, IonToolbar, IonIcon, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonText, IonButton } from '@ionic/react';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { eye } from 'ionicons/icons';
import { Release } from '../../../../../types/types';
import { formatDateTable } from '../../../../utils/date-utils';
import { formatNumber } from '../../../../ui/utils/formatNumber';
import ViewAcknowledgementEntries from '../components/ViewReleaseEntries';
import ReleaseViewCard from '../components/ReleaseViewCard';
import ViewReleaseEntries from '../components/ViewReleaseEntries';

type ViewReleaseProps = {
  release: Release;
};

const ViewRelease = ({ release }: ViewReleaseProps) => {
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
        onClick={() => setIsOpen(true)}
        type="button"
        fill="clear"
        className="space-x-1 rounded-lg w-24 h-6 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-[#ffe808] text-slate-700 capitalize min-h-4 text-xs"
      >
        <IonIcon icon={eye} className="text-xs" />
        <span>View</span>
      </IonButton>
      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:70%] lg:[--width:70%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader title="Release - View Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content !p-2">
          <IonGrid>
            <IonRow>
              <IonCol size="6" className="space-y-1">
                <ReleaseViewCard label="CV#" value={`CV#${release.code}`} />
                <ReleaseViewCard label="Center Code" value={`${release.center.centerNo}`} />
                <ReleaseViewCard label="Name" value={`${release.center.description}`} />
                <ReleaseViewCard label="Particular" value={release.remarks} />
                <ReleaseViewCard label="Cash Type" value={release.type} />
                <ReleaseViewCard label="Account Officer" value={release.acctOfficer} />
                <ReleaseViewCard label="User" value={release.encodedBy.username} />
              </IonCol>
              <IonCol size="6" className="space-y-1">
                <ReleaseViewCard label="Date" value={formatDateTable(release.date)} />
                <IonGrid className="ion-no-padding">
                  <IonRow className="gap-2">
                    <IonCol>
                      <ReleaseViewCard label="Account Month" value={`${release.acctMonth}`} />
                    </IonCol>
                    <IonCol>
                      <ReleaseViewCard label="Account Year" value={`${release.acctYear}`} />
                    </IonCol>
                  </IonRow>
                </IonGrid>
                <ReleaseViewCard label="Check Number" value={release.checkNo} />
                <ReleaseViewCard label="Check Date" value={formatDateTable(release.checkDate)} />
                <ReleaseViewCard label="Bank Code" value={release.bankCode.description} />
                <ReleaseViewCard label="Amount" value={`${formatNumber(release.amount)}`} />
                <ReleaseViewCard label="Cash Collection" value={`${formatNumber(release.cashCollectionAmount || 0)}`} />
              </IonCol>
            </IonRow>
          </IonGrid>
          <ViewReleaseEntries release={release} isOpen={isOpen} />
        </div>
      </IonModal>
    </>
  );
};

export default ViewRelease;

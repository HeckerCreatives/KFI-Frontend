import React, { useState } from 'react';
import { IonModal, IonHeader, IonToolbar, IonIcon, IonGrid, IonRow, IonCol, IonButton } from '@ionic/react';
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
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:95%] md:[--width:100%] lg:[--max-width:95%] lg:[--width:95%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader title="Acknowledgement - View Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content h-screen !p-2 flex flex-col gap-2">
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <AcknowledgementViewCard label="OR#" value={`${acknowledgement.code}`} labelClassName="min-w-20 text-end !text-slate-600" />
                <AcknowledgementViewCard label="Center Code" value={`${acknowledgement.center.centerNo}`} labelClassName="min-w-20 text-end !text-slate-600" />
                <AcknowledgementViewCard label="Name" value={`${acknowledgement.center.description}`} labelClassName="min-w-20 text-end !text-slate-600" />
                <AcknowledgementViewCard label="Cash Type" value={acknowledgement.type} labelClassName="min-w-20 text-end !text-slate-600" />
              </div>
              <div className="space-y-1">
                <AcknowledgementViewCard label="Date" value={formatDateTable(acknowledgement.date)} labelClassName="min-w-28 text-end !text-slate-600" />
                <AcknowledgementViewCard label="Account Month" value={`${acknowledgement.acctMonth}`} labelClassName="min-w-28 text-end !text-slate-600" />
                <AcknowledgementViewCard label="Account Year" value={`${acknowledgement.acctYear}`} labelClassName="min-w-28 text-end !text-slate-600" />
                <AcknowledgementViewCard label="Account Officer" value={acknowledgement.acctOfficer} labelClassName="min-w-28 text-end !text-slate-600" />
              </div>
              <div className="col-span-2 ">
                <AcknowledgementViewCard label="Particular" value={acknowledgement.remarks} labelClassName="min-w-20 text-end !text-slate-600" />
              </div>
            </div>
            <div className="space-y-1">
              <AcknowledgementViewCard label="Check Number" value={acknowledgement.checkNo} labelClassName="min-w-28 text-end !text-slate-600" />
              <AcknowledgementViewCard label="Check Date" value={formatDateTable(acknowledgement.checkDate)} labelClassName="min-w-28 text-end !text-slate-600" />
              <AcknowledgementViewCard label="Bank Code" value={acknowledgement.bankCode.code} labelClassName="min-w-28 text-end !text-slate-600" />
              <AcknowledgementViewCard label="Amount" value={`${formatNumber(acknowledgement.amount)}`} labelClassName="min-w-28 text-end !text-slate-600" />
              <AcknowledgementViewCard
                label="Cash Collection"
                value={`${formatNumber(acknowledgement.cashCollectionAmount || 0)}`}
                labelClassName="min-w-28 text-end !text-slate-600"
              />
            </div>
          </div>
          <div>
            <AcknowledgementViewCard label="User" value={acknowledgement.encodedBy.username} labelClassName="min-w-20 text-end !text-slate-600" containerClassName="max-w-40" />
          </div>
          <div className="flex-1">
            <ViewAcknowledgementEntries acknowledgement={acknowledgement} isOpen={isOpen} />
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default ViewAcknowledgement;

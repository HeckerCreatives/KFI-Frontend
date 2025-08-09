import { IonButton, IonHeader, IonIcon, IonModal, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { documentAttachOutline } from 'ionicons/icons';
import { Member } from '../components/RecentLoans';
import DetailsCard from '../components/DetailsCard';
import { formatNumber } from '../../../../ui/utils/formatNumber';

const ViewLoanDetails = ({ loan }: { loan: Member }) => {
  const [isOpen, setIsOpen] = useState(false);

  const dismiss = () => {
    setIsOpen(false);
  };

  return (
    <>
      <IonButton
        onClick={() => setIsOpen(true)}
        type="button"
        fill="clear"
        className="space-x-1 rounded-lg w-28 h-6 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-[#ffe808] text-slate-700 capitalize min-h-4 text-xs"
      >
        <IonIcon icon={documentAttachOutline} className="text-xs" />
        <span>View Loan</span>
      </IonButton>
      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:50rem] md:[--width:100%] lg:[--max-width:50rem] lg:[--width:50rem]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader title="Loan Details" sub="System" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content">
          <div className="space-y-2">
            <DetailsCard label="Client" value={loan?.client?.name || ''} labelClassName="min-w-24 !text-end" />
            <DetailsCard label="Particular" value={loan?.particular || ''} labelClassName="min-w-24 !text-end" />
            <DetailsCard label="Center" value={loan?.center ? `${loan.center.centerNo} - ${loan.center?.description || ''}` : ''} labelClassName="min-w-24 !text-end" />
            <DetailsCard label="Account Code" value={loan?.acctCode ? `${loan.acctCode.code} - ${loan.acctCode?.description || ''}` : ''} labelClassName="min-w-24 !text-end" />
            <DetailsCard label="Debit" value={formatNumber(loan.debit)} labelClassName="min-w-24 !text-end" />
            <DetailsCard label="Credit" value={formatNumber(loan.credit)} labelClassName="min-w-24 !text-end" />
            <DetailsCard label="Interest" value={loan?.interest} labelClassName="min-w-24 !text-end" />
          </div>
          {/* <div className="grid grid-cols-3 border border-b-0 [&>div]:p-2 text-sm">
            <div className="border-r">Client</div>
            <div className="col-span-2">{loan?.client?.name || ''}</div>
          </div>
          <div className="grid grid-cols-3 border border-b-0 [&>div]:p-2 text-sm">
            <div className="border-r">Client</div>
            <div className="col-span-2">{loan?.client?.name || ''}</div>
          </div>
          <div className="grid grid-cols-3 border border-b-0 [&>div]:p-2 text-sm">
            <div className="border-r">Client</div>
            <div className="col-span-2">{loan?.client?.name || ''}</div>
          </div>
          <div className="grid grid-cols-3 border border-b-0 [&>div]:p-2 text-sm">
            <div className="border-r">Client</div>
            <div className="col-span-2">{loan?.client?.name || ''}</div>
          </div>
          <div className="grid grid-cols-3 border border-b-0 [&>div]:p-2 text-sm">
            <div className="border-r">Client</div>
            <div className="col-span-2">{loan?.client?.name || ''}</div>
          </div>
          <div className="grid grid-cols-3 border [&>div]:p-2 text-sm">
            <div className="border-r">Client</div>
            <div className="col-span-2">{loan?.client?.name || ''}</div>
          </div> */}
        </div>
      </IonModal>
    </>
  );
};

export default ViewLoanDetails;

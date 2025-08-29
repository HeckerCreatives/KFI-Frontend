import { IonButton, IonHeader, IonIcon, IonModal, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { businessOutline, documentAttachOutline, documentTextOutline, eye, eyeOutline, idCardOutline, personOutline } from 'ionicons/icons';
import { Member } from '../components/RecentLoans';
import DetailsCard from '../components/DetailsCard';
import { formatNumber } from '../../../../ui/utils/formatNumber';
import UserIcon from '../../../../ui/icons/UserIcon';
import HashIcon from '../../../../ui/icons/HashIcon';
import CalculatorIcon from '../../../../ui/icons/CalculatorIcon';
import { ViewIcon} from 'hugeicons-react';


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
        className="space-x-1 rounded-lg w-16 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0] bg-orange-50 text-orange-700 capitalize text-xs"
      >
        <ViewIcon size={15} stroke='.8' className="text-xs" />
        &nbsp;View
      </IonButton>
      <IonModal isOpen={isOpen} backdropDismiss={false} className=" [--border-radius:0.7rem] auto-height [--max-width:50rem] [--width:95%]">
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader title="Loan Details" sub="System" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6">
            <ModalHeader title="Loan Details" sub="" dismiss={dismiss} />

          <div>
            <div className=" p-2 rounded-md">
              <h6 className="text-[0.9rem] px-2 m-0  text-slate-600 flex items-center gap-1">
                <UserIcon className="w-3.5 h-3.5 text-blue-700" />
                <span className="!font-semibold">Client Information</span>
              </h6>
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <DetailsCard label="Name" value={loan?.client?.name || ''} labelClassName="" containerClassName="" />
                <DetailsCard label="Particular" value={loan?.particular || ''} labelClassName="" containerClassName="" />
              </div>
            </div>
            <div className="border-b mx-4 mb-4 mt-3" />
            <div className=" p-2 rounded-md">
              <h6 className="text-[0.9rem] px-2 m-0  text-slate-600 flex items-center gap-1">
                <IonIcon icon={businessOutline} className="text-[0.85rem] text-slate-700" />
                <span className="!font-semibold">Center</span>
              </h6>
              <div className="grid grid-cols-1 lg:grid-cols-1">
                <DetailsCard label="" value={loan?.center ? `${loan.center.centerNo} - ${loan.center?.description || ''}` : ''} labelClassName="" containerClassName="" />
              </div>
            </div>
            <div className="border-b mx-4 mb-4 mt-3" />
            <div className=" p-2 rounded-md">
              <h6 className="text-[0.9rem] px-2 m-0  text-slate-600 flex items-center gap-1">
                <HashIcon className="w-3.5 h-3.5 text-green-700" />
                <span className="!font-semibold">Account Information</span>
              </h6>
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <DetailsCard label="Account Code" value={loan?.acctCode ? `${loan.acctCode.code}` : ''} labelClassName="" containerClassName="" />
                <DetailsCard label="Description" value={loan?.acctCode ? `${loan.acctCode.description}` : ''} labelClassName="" containerClassName="" />
              </div>
            </div>
            <div className="border-b mx-4 mb-4 mt-3" />
            <div className=" p-2 rounded-md">
              <h6 className="text-[0.9rem] px-2 m-0  text-slate-600 flex items-center gap-1">
                <CalculatorIcon className="w-3.5 h-3.5 text-violet-700" />
                <span className="!font-semibold">Financial Information</span>
              </h6>
              <div className="grid grid-cols-1 lg:grid-cols-3">
                <DetailsCard label="Debit" value={formatNumber(loan.debit)} labelClassName="" containerClassName="" isAmount />
                <DetailsCard label="Credit" value={formatNumber(loan.credit)} labelClassName="" containerClassName="" isAmount />
                <DetailsCard label="Interest" value={loan?.interest} labelClassName="" containerClassName="" isPercent />
              </div>
            </div>
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

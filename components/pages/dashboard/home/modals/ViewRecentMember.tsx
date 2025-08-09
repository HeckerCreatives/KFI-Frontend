import { IonButton, IonHeader, IonIcon, IonModal, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { documentAttachOutline } from 'ionicons/icons';
import DetailsCard from '../components/DetailsCard';
import { formatNumber } from '../../../../ui/utils/formatNumber';
import { Member } from '../components/RecentMembers';
import { formatDateTable } from '../../../../utils/date-utils';

const ViewRecentMember = ({ member }: { member: Member }) => {
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
        <span>View Details</span>
      </IonButton>
      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:95%] md:[--width:100%] lg:[--max-width:80%] lg:[--width:80%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader title="Recent Member Details" sub="System" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <DetailsCard label="Name" value={member?.name || ''} labelClassName="min-w-24 !text-end" />
              <DetailsCard label="Address" value={member?.address || ''} labelClassName="min-w-24 !text-end" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                <DetailsCard label="City" value={member?.city || ''} labelClassName="min-w-24 !text-end" />
                <DetailsCard label="Zip Code" value={member?.zipCode || ''} labelClassName="min-w-24 !text-end" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                <DetailsCard label="Telephone No." value={member?.telNo || ''} labelClassName="min-w-24 !text-end" />
                <DetailsCard label="Mobile" value={member?.mobileNo || ''} labelClassName="min-w-24 !text-end" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                <DetailsCard label="Birthdate" value={formatDateTable(member?.birthdate) || ''} labelClassName="min-w-24 !text-end" />
                <DetailsCard label="Birthplace" value={member?.birthplace || ''} labelClassName="min-w-24 !text-end" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                <DetailsCard label="Age" value={`${member?.age}` || ''} labelClassName="min-w-24 !text-end" />
                <DetailsCard label="Sex" value={member?.sex || ''} labelClassName="min-w-24 !text-end" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                <DetailsCard label="Parent" value={member?.parent || ''} labelClassName="min-w-24 !text-end" />
                <DetailsCard label="Spouse" value={member?.spouse || ''} labelClassName="min-w-24 !text-end" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                <DetailsCard label="Civil Status" value={member?.civilStatus || ''} labelClassName="min-w-28 !text-end" />
                <DetailsCard label="Position" value={member?.position || ''} labelClassName="min-w-28 !text-end" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                <DetailsCard label="Member Status" value={member?.memberStatus || ''} labelClassName="min-w-28 !text-end" />
                <DetailsCard label="Center" value={`${member?.center.centerNo} - ${member?.center.description}` || ''} labelClassName="min-w-28 !text-end" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                <DetailsCard label="Account Officer" value={member.acctOfficer || ''} labelClassName="min-w-28 !text-end" />
                <DetailsCard label="Date Release" value={formatDateTable(member.dateRelease) || ''} labelClassName="min-w-28 !text-end" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                <DetailsCard label="Business" value={`${member?.business.type}` || ''} labelClassName="min-w-28 !text-end" />
                <DetailsCard label="Account Number" value={member?.acctNumber || ''} labelClassName="min-w-28 !text-end" />
              </div>
              <DetailsCard label="Reason" value={member?.reason || ''} labelClassName="min-w-28 !text-end" />
              <DetailsCard label="Children" value={member?.children.map(child => child.name).join(', ') || ''} labelClassName="min-w-28 !text-end" />
              <DetailsCard label="Beneficiary" value={member?.beneficiaries.map(child => child.name).join(', ') || ''} labelClassName="min-w-28 !text-end" />
            </div>
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default ViewRecentMember;

import React from 'react';
import { Member } from '../../pages/dashboard/home/components/RecentMembers';
import DetailsCard from '../../pages/dashboard/home/components/DetailsCard';
import MapPinIcon from '../icons/MapPinIcon';
import { IonIcon } from '@ionic/react';
import { calendarClearOutline, callOutline } from 'ionicons/icons';
import BusinessBagIcon from '../icons/BusinessBagIcon';

const OtherDetails = ({ member }: { member: Member }) => {
  return (
    <div className="min-h-[22rem]">
      <div className="py-3 px-2 border rounded-lg">
        <div>
          <h6 className="text-[0.9rem] px-2 m-0  text-slate-600 flex items-center gap-1">
            <BusinessBagIcon className="w-3.5 h-3.5 text-purple-500" />
            <span className="!font-semibold">Business & Family</span>
          </h6>
          <div className="grid grid-cols-1">
            <DetailsCard label="Business" value={`${member.business.type}` || ''} />
            <DetailsCard label="Children" value={member.children.map(child => child.name).join(', ') || ''} />
            <DetailsCard label="Beneficiary" value={member.beneficiaries.map(beneficiary => beneficiary.name).join(', ') || ''} />
          </div>
        </div>
        <div>
          <h6 className="text-[0.9rem] px-2 m-0  text-slate-600 flex items-center gap-1">
            <IonIcon icon={calendarClearOutline} className="w-3.5 h-3.5 text-red-700" />
            <span className="!font-semibold">Additional Information</span>
          </h6>
          <div className="grid grid-cols-1">
            <DetailsCard label="Reason" value={`${member.reason}` || ''} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherDetails;

import React from 'react';
import { Member } from '../../pages/dashboard/home/components/RecentMembers';
import DetailsCard from '../../pages/dashboard/home/components/DetailsCard';
import { formatDateTable } from '../../utils/date-utils';
import { IonIcon } from '@ionic/react';
import { documentTextOutline } from 'ionicons/icons';

const AccountDetails = ({ member }: { member: Member }) => {
  return (
    <div className="min-h-[22rem]">
      <div className="py-3 px-2 border rounded-lg">
        <h6 className="text-[0.9rem] px-2 m-0  text-slate-600 flex items-center gap-1">
          <IonIcon icon={documentTextOutline} className="w-3.5 h-3.5 text-green-700" />
          <span className="!font-semibold">Account Information</span>
        </h6>
        <div className="grid grid-cols-1">
          <DetailsCard label="Account Number" value={member.acctNumber || ''} />
          <DetailsCard label="Date Release" value={formatDateTable(member.dateRelease) || ''} />
          <DetailsCard label="Center" value={`${member.center.centerNo} - ${member.center.description}` || ''} />
          <DetailsCard label="Account Officer" value={member.acctOfficer || ''} />
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;

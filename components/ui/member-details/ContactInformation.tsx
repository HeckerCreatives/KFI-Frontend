import React from 'react';
import MapPinIcon from '../icons/MapPinIcon';
import DetailsCard from '../../pages/dashboard/home/components/DetailsCard';
import { IonIcon } from '@ionic/react';
import { callOutline } from 'ionicons/icons';
import { Member } from '../../pages/dashboard/home/components/RecentMembers';

const ContactInformation = ({ member }: { member: Member }) => {
  return (
    <div className=" min-h-[22rem]">
      <div className="py-3 px-2 border rounded-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div>
            <h6 className="text-[0.9rem] px-2 m-0  text-slate-600 flex items-center gap-1">
              <MapPinIcon className="w-3.5 h-3.5 text-violet-700" />
              <span className="!font-semibold">Contact Information</span>
            </h6>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <DetailsCard label="Address" value={member.address || ''} wrapperClassName="col-span-2" />
              <DetailsCard label="City" value={`${member.city}` || ''} />
              <DetailsCard label="Zip Code" value={member.zipCode || ''} />
            </div>
          </div>
          <div className="border-b mx-4 mb-4 mt-3 lg:hidden" />
          <div>
            <h6 className="text-[0.9rem] px-2 m-0  text-slate-600 flex items-center gap-1">
              <IonIcon icon={callOutline} className="w-3.5 h-3.5 text-red-700" />
              <span className="!font-semibold">Phone Information</span>
            </h6>
            <div className="grid grid-cols-1">
              <DetailsCard label="Mobile Number" value={`${member.mobileNo}` || ''} />
              <DetailsCard label="Telephone Number" value={member.telNo || ''} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInformation;

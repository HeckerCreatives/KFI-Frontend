import React from 'react';
import { Member } from '../../pages/dashboard/home/components/RecentMembers';
import UserIcon from '../icons/UserIcon';
import DetailsCard from '../../pages/dashboard/home/components/DetailsCard';
import { formatDateTable } from '../../utils/date-utils';

const AccountInformation = ({ member }: { member: Member }) => {
  return (
    <div className=" min-h-[22rem]">
      <div className="py-3 px-2 border rounded-lg">
        <h6 className="text-[0.9rem] px-2 m-0  text-slate-600 flex items-center gap-1">
          <UserIcon className="w-3.5 h-3.5 text-blue-700" />
          <span className="!font-semibold">Personal Information</span>
        </h6>
        <div className="grid grid-cols-1 lg:grid-cols-3">
          <DetailsCard label="Name" value={member.name || ''} wrapperClassName="col-span-2" />
          <DetailsCard label="Sex" value={member.sex || ''} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3">
          <DetailsCard label="Birthdate" value={formatDateTable(member.birthdate) || ''} />
          <DetailsCard label="Age" value={`${member.age}` || ''} />
          <DetailsCard label="Birthplace" value={member.birthplace || ''} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <DetailsCard label="Parent" value={`${member.parent}` || ''} />
          <DetailsCard label="Spouse" value={member.spouse || ''} />
        </div>
      </div>
    </div>
  );
};

export default AccountInformation;

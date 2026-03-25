import React from 'react';
import ClientStatisticsCard from './ClientStatisticsCard';
import { peopleSharp } from 'ionicons/icons';
import { UserMultiple02Icon, UserBlock01Icon, UserMinus01Icon, UserSearch01Icon, UserRemove02Icon, UserCheck02Icon } from 'hugeicons-react';
import { UserCheck, UserRoundX, UserX } from 'lucide-react';


type ClientStatisticsData = {
  loading: boolean;
  totalClient: number;
  resigned: number;
  activeOnLeave: number;
  activeExisting: number;
  activeNew: number;
  activePastDue: number;
  activeReturnee: number;
};

type ClientStatisticsProps = {
  data: ClientStatisticsData;
};

const ClientStatistics = ({ data }: ClientStatisticsProps) => {
  return (
    <div className="overflow-auto py-2">
      <div className="flex flex-nowrap items-center justify-around gap-2">
        <ClientStatisticsCard icon={<UserMultiple02Icon stroke='.8' size={25}/>} loading={false} title="Total Clients" value={`${data.totalClient.toLocaleString()}`} />
        <ClientStatisticsCard icon={<UserRemove02Icon stroke='.8' size={25}/>} loading={false} title="Resigned" value={`${data.resigned.toLocaleString()}`} />
        <ClientStatisticsCard icon={<UserMinus01Icon stroke='.8' size={25}/>} loading={false} title="Active On-Leave" value={`${data.activeOnLeave.toLocaleString()}`} />
        <ClientStatisticsCard icon={<UserMultiple02Icon stroke='.8' size={25}/>} loading={false} title="Active-Existing" value={`${data.activeExisting.toLocaleString()}`} />
        <ClientStatisticsCard icon={<UserCheck02Icon stroke='.8' size={25}/>} loading={false} title="Active-New" value={`${data.activeNew.toLocaleString()}`} />
        <ClientStatisticsCard icon={<UserBlock01Icon stroke='.8' size={25}/>} loading={false} title="Active-PastDue" value={`${data.activePastDue.toLocaleString()}`} />
        <ClientStatisticsCard icon={<UserSearch01Icon stroke='.8' size={25}/>} loading={false} title="Active-Returnee" value={`${data.activeReturnee.toLocaleString()}`} />
      </div>
    </div>
  );
};

export default ClientStatistics;

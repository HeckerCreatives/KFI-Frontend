import React from 'react';
import ClientStatisticsCard from './ClientStatisticsCard';
import { peopleSharp } from 'ionicons/icons';
import { UserMultiple02Icon, UserBlock01Icon, UserMinus01Icon } from 'hugeicons-react';


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
        <ClientStatisticsCard icon={<UserMultiple02Icon stroke='.8' size={20}/>} loading={data.loading} title="Total Clients" value={`${data.totalClient}`} />
        <ClientStatisticsCard icon={<UserMultiple02Icon stroke='.8' size={20}/>} loading={data.loading} title="Resigned" value={`${data.resigned}`} />
        <ClientStatisticsCard icon={<UserMultiple02Icon stroke='.8' size={20}/>} loading={data.loading} title="Active On-Leave" value={`${data.activeOnLeave}`} />
        <ClientStatisticsCard icon={<UserMultiple02Icon stroke='.8' size={20}/>} loading={data.loading} title="Active-Existing" value={`${data.activeExisting}`} />
        <ClientStatisticsCard icon={<UserMultiple02Icon stroke='.8' size={20}/>} loading={data.loading} title="Active-New" value={`${data.activeNew}`} />
        <ClientStatisticsCard icon={<UserMultiple02Icon stroke='.8' size={20}/>} loading={data.loading} title="Active-PastDue" value={`${data.activePastDue}`} />
        <ClientStatisticsCard icon={<UserMultiple02Icon stroke='.8' size={20}/>} loading={data.loading} title="Active-Returnee" value={`${data.activeReturnee}`} />
      </div>
    </div>
  );
};

export default ClientStatistics;

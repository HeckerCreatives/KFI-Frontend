import React, { useState } from 'react';
import DashboardCard from './DashboardCard';
import { cashSharp, peopleSharp, personAddSharp, personRemoveSharp } from 'ionicons/icons';
import kfiAxios from '../../../../utils/axios';
import { useIonViewWillEnter } from '@ionic/react';
import { formatNumber } from '../../../../ui/utils/formatNumber';

const CardStatistics = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    totalActiveMembers: 0,
    totalInactiveMembers: 0,
    totalMembers: 0,
    totalLoan: 0,
  });

  const getCardStats = async () => {
    try {
      setLoading(true);
      const result = await kfiAxios.get('/statistics/cards');
      const { totalActiveMembers, totalInactiveMembers, totalMembers, totalLoan } = result.data;
      setData(prev => ({ ...prev, totalActiveMembers, totalInactiveMembers, totalMembers, totalLoan }));
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useIonViewWillEnter(() => {
    getCardStats();
  });

  return (
    <div className="overflow-auto py-2">
      <div className="flex flex-nowrap items-center justify-around gap-2">
        <DashboardCard title="Total Members" value={`${data.totalMembers}`} icon={peopleSharp} loading={loading} />
        <DashboardCard title="Total Active Members" value={`${data.totalActiveMembers}`} icon={personAddSharp} loading={loading} />
        <DashboardCard title="Total Inactive Members" value={`${data.totalInactiveMembers}`} icon={personRemoveSharp} loading={loading} />
        <DashboardCard title="Total Loan Amount" value={`${formatNumber(data.totalLoan)}`} icon={cashSharp} loading={loading} />
      </div>
    </div>
  );
};

export default CardStatistics;

import React, { useState } from 'react';
import DashboardCard from './DashboardCard';
import { cashSharp, peopleSharp, personAddSharp, personRemoveSharp } from 'ionicons/icons';
import kfiAxios from '../../../../utils/axios';
import { useIonViewWillEnter } from '@ionic/react';
import { formatNumber } from '../../../../ui/utils/formatNumber';
import { UserMultiple02Icon, Wallet03Icon, UserMinus01Icon} from 'hugeicons-react';

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
    <div className="overflow-auto">
      <div className="flex flex-nowrap items-center justify-around gap-4">
        <DashboardCard title="Total Members" value={`${data.totalMembers}`} icon={<UserMultiple02Icon stroke='.8' size={20}/>} loading={loading} />
        <DashboardCard title="Total Active Members" value={`${data.totalActiveMembers}`} icon={<UserMultiple02Icon stroke='.8' size={20}/>} loading={loading} />
        <DashboardCard title="Total Inactive Members" value={`${data.totalInactiveMembers}`} icon={<UserMinus01Icon stroke='.8' size={20}/>} loading={loading} />
        <DashboardCard title="Total Loan Amount" value={`${formatNumber(data.totalLoan)}`} icon={<Wallet03Icon stroke='.8' size={20}/>} loading={loading} />
      </div>
    </div>
  );
};

export default CardStatistics;

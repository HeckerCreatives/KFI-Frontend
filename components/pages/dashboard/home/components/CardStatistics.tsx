import React, { useState } from 'react';
import DashboardCard from './DashboardCard';
import { cashSharp, peopleSharp, personAddSharp, personRemoveSharp } from 'ionicons/icons';
import kfiAxios from '../../../../utils/axios';
import { useIonViewWillEnter } from '@ionic/react';
import { formatNumber } from '../../../../ui/utils/formatNumber';
import { UserMultiple02Icon, Wallet03Icon, UserMinus01Icon, UserCheck01Icon, UserBlock02Icon} from 'hugeicons-react';
import { UserCheck } from 'lucide-react';
import { useOnlineStore } from '../../../../../store/onlineStore';

const CardStatistics = () => {
  const [loading, setLoading] = useState(false);
  const online = useOnlineStore((state) => state.online);
  
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
    if(online){
       getCardStats()
    }
  });

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-2">
        <DashboardCard title="Total Members" value={`${data.totalMembers.toLocaleString()}`} icon={<UserMultiple02Icon stroke='.8' size={25}/>} loading={loading} details={true}/>
        {/* <DashboardCard title="Total Active Members" value={`${data.totalActiveMembers.toLocaleString()}`} icon={<UserCheck01Icon stroke='.8' size={25}/>} loading={loading} details={true} />
        <DashboardCard title="Total Inactive Members" value={`${data.totalInactiveMembers.toLocaleString()}`} icon={<UserBlock02Icon stroke='.8' size={25}/>} loading={loading} details={true} /> */}
        <DashboardCard title="Total Loan Amount" value={`${data.totalLoan.toLocaleString()}`} icon={<Wallet03Icon stroke='.8' size={25}/>} loading={loading} details={true} />
      </div>
  );
};

export default CardStatistics;

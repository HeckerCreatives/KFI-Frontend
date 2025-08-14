import { IonIcon, IonSpinner } from '@ionic/react';
import React from 'react';

type ClientStatisticsCardProps = {
  title: string;
  icon: string;
  value: string;
  loading?: boolean;
};

const ClientStatisticsCard = ({ title, icon, value, loading = false }: ClientStatisticsCardProps) => {
  return (
    <div className="shadow-lg bg-white border border-slate-100 p-4 flex-1 min-w-56 rounded-xl flex items-center justify-between">
      <div className="">
        <div className="text-[0.8rem] truncate text-orange-700 !font-[600]">{title}</div>
        <div className="text-[0.9rem] text-orange-900 !font-semibold">{loading ? <IonSpinner name="lines-small" className="h-4 w-4" /> : value}</div>
      </div>
      <div className="bg-[#F76B2E] h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br via-[#fdae6e] from-[#F76B2E]  via-100% from-1% to-100%">
        <IonIcon icon={icon} className="text-slate-100 min-w-5 max-w-5 max-h-5 min-h-5" />
      </div>
    </div>
  );
};

export default ClientStatisticsCard;

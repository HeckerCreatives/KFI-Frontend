import { IonIcon } from '@ionic/react';
import React from 'react';

type DashboardCardProps = {
  title: string;
  icon: string;
  value: string;
};

const DashboardCard = ({ title, icon, value }: DashboardCardProps) => {
  return (
    <div className="shadow-lg bg-white p-4 flex-1 min-w-80 rounded-xl flex items-center justify-between">
      <div className="">
        <div className="text-[1rem] font-semibold truncate">{title}</div>
        <div className="text-lg font-semibold">{value}</div>
      </div>
      <div className="bg-[#F76B2E] h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br via-[#fdae6e] from-[#F76B2E]  via-100% from-1% to-100%">
        <IonIcon icon={icon} className="text-slate-100 min-w-5 max-w-5 max-h-5 min-h-5" />
      </div>
    </div>
  );
};

export default DashboardCard;

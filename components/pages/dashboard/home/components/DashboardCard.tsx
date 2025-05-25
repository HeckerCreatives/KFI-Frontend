import { IonIcon } from '@ionic/react';
import React from 'react';

type DashboardCardProps = {
  title: string;
  icon: string;
  value: string;
};

const DashboardCard = ({ title, icon, value }: DashboardCardProps) => {
  return (
    <div className="shadow-lg bg-[#F76B2E] p-4 flex-1 rounded-xl">
      <div className="flex items-center gap-1">
        <div className="min-w-6 min-h-6 grid place-items-center">
          <IonIcon icon={icon} className="text-white min-w-5 max-w-5 max-h-5 min-h-5" />
        </div>
        <div className="text-[1rem] font-semibold text-white tracking-wider truncate">{title}</div>
      </div>
      <div className="text-3xl my-3 text-white font-semibold tracking-widest text-end">{value}</div>
    </div>
  );
};

export default DashboardCard;

import { IonIcon, IonSpinner } from '@ionic/react';
import React from 'react';


type ClientStatisticsCardProps = {
  title: string;
  icon: React.ReactElement; 
  value: string;
  loading?: boolean;
};

const ClientStatisticsCard = ({ title, icon, value, loading = false }: ClientStatisticsCardProps) => {
  return (
    <div className=" bg-white p-6 flex-1 min-w-56 rounded-xl flex items-start justify-between shadow-md">
      <div className=" space-y-2">
        <div className="text-[0.8rem] truncate text-zinc-500 ">{title}</div>
        <div className="text-3xl text-orange-600 !font-bold">{loading ? <div className=' h-6 bg-orange-100 w-full rounded-sm animate-pulse'></div> : value}</div>
      </div>
      {/* <div className="bg-[#F76B2E] h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br via-[#fdae6e] from-[#F76B2E]  via-100% from-1% to-100%">
        <IonIcon icon={icon} className="text-slate-100 min-w-5 max-w-5 max-h-5 min-h-5" />
      </div> */}
      <div className=" bg-orange-50 w-10 h-10 rounded-full flex items-center justify-center text-orange-500">
       {icon}
      </div>
    </div>
  );
};

export default ClientStatisticsCard;

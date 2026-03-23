import { HugeiconsIcon, IconSvgElement } from '@hugeicons/react';
import { IonButton, IonIcon, IonSpinner } from '@ionic/react';
import Link from 'next/link';
import React from 'react';
import ViewMemberDetails from './MemdersDetails';

type DashboardCardProps = {
  title: string;
  icon: React.ReactElement; 
  value: string;
  loading?: boolean;
  details?: boolean
};


const DashboardCard = ({ title, icon, value, loading = false, details = false }: DashboardCardProps) => {
  return (
    <div className=" relative shadow-sm h-full! bg-white p-6 flex-1 min-w-56 rounded-xl flex items-start justify-between overflow-hidden">
      <div className=" relative z-10 space-y-2">
        <div className="text-[0.8rem] truncate text-zinc-700 !font-medium ">{title}</div>
        <div className="text-3xl text-orange-600 !font-bold">{loading ? <div className=' h-6 bg-orange-100 w-full rounded-sm animate-pulse'></div> : value}</div>
      </div>
      {/* <div className="bg-[#F76B2E] h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br via-[#fdae6e] from-[#F76B2E]  via-100% from-1% to-100%">
        <IonIcon icon={icon} className="text-slate-100 min-w-5 max-w-5 max-h-5 min-h-5" />
      </div> */}

      <div className=' flex flex-col items-end justify-between'>
        <div className=" relative z-10 bg-orange-50 w-10 h-10 rounded-full flex items-center justify-center text-orange-500">
        {icon}
        </div>

        {details ? (
          <ViewMemberDetails title={title} icon={icon} value={value}/>
        ): (
          <IonButton
          fill='clear'
          >

          </IonButton>
        )}
      </div>
      

     
    </div>
  );
};

export default DashboardCard;

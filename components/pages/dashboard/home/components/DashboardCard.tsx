import { HugeiconsIcon, IconSvgElement } from '@hugeicons/react';
import { IonButton, IonIcon, IonSpinner } from '@ionic/react';
import Link from 'next/link';
import React from 'react';
import ViewMemberDetails from './MemdersDetails';
import InactiveMembers from './InactiveMembers';
import ActiveMembers from './ActiveMembers';
import LoanDetails from './LoanDetails';

type DashboardCardProps = {
  title: string;
  icon: React.ReactElement; 
  value: string;
  loading?: boolean;
  details?: boolean
};


const DashboardCard = ({ title, icon, value, loading = false, details = false }: DashboardCardProps) => {
  return (
    <div className=" relative max-w-[450px] h-[140px] shadow-md bg-white p-6 flex-1 min-w-56 rounded-xl flex items-start justify-between overflow-hidden">
      <svg className=' absolute bottom-0 right-0 w-full z-20' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 280">
        <path fill="#FCA95C" fill-opacity=".05" d="M0,96L34.3,106.7C68.6,117,137,139,206,133.3C274.3,128,343,96,411,90.7C480,85,549,107,617,128C685.7,149,754,171,823,149.3C891.4,128,960,64,1029,58.7C1097.1,53,1166,107,1234,112C1302.9,117,1371,75,1406,53.3L1440,32L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"></path>
      </svg>

       <svg className=' absolute bottom-0 right-0 w-full z-10' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="#F9761A" fill-opacity=".05" d="M0,96L34.3,106.7C68.6,117,137,139,206,133.3C274.3,128,343,96,411,90.7C480,85,549,107,617,128C685.7,149,754,171,823,149.3C891.4,128,960,64,1029,58.7C1097.1,53,1166,107,1234,112C1302.9,117,1371,75,1406,53.3L1440,32L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"></path>
      </svg>
      <div className=" relative z-10 space-y-2">
        <div className="text-[0.8rem] truncate ">{title}</div>
        <div className="text-3xl text-orange-500 !font-bold">{loading ? <div className=' h-6 bg-orange-100 w-full rounded-sm animate-pulse'></div> : value}</div>
      </div>
      {/* <div className="bg-[#F76B2E] h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br via-[#fdae6e] from-[#F76B2E]  via-100% from-1% to-100%">
        <IonIcon icon={icon} className="text-slate-100 min-w-5 max-w-5 max-h-5 min-h-5" />
      </div> */}

      <div className=' flex flex-col items-end justify-between gap-6 relative z-30'>
        <div className=" relative z-10 bg-orange-500 w-12 h-12 rounded-xl backdrop-blur-lg flex items-center justify-center text-orange-50">
        {icon}
        </div>

       <div></div>

     
      </div>

      <div className=' absolute bottom-2 right-4 z-30'>
           {details ? (
          <>
          {title === 'Total Members' && <ViewMemberDetails title={title} icon={icon} value={value}/>}
          {title === 'Total Inactive Members' && <InactiveMembers title={title} icon={icon} value={value}/>}
          {title === 'Total Active Members' && <ActiveMembers title={title} icon={icon} value={value}/>}
          {title === 'Total Loan Amount' && <LoanDetails title={title} icon={icon} value={value}/>}
          </>
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

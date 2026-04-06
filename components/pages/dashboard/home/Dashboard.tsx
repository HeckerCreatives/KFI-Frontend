import { IonContent, IonPage, IonSelect, IonSelectOption } from '@ionic/react';
import React, { useState } from 'react';
import PageTitle from '../../../ui/page/PageTitle';
import CardStatistics from './components/CardStatistics';
import RecentMembers from './components/RecentMembers';
import RecentLoans from './components/RecentLoans';
import LoansPerCenter from './components/LoansPerCenter';
import { List, ShieldCheck, Users } from 'lucide-react';
import { useHistory } from 'react-router';

const quickActions = [
  {
    name: 'Add Member', 
    description: 'Register new client',
    link: '/dashboard/client', 
    icon: Users,
    styles: 'bg-orange-50 border border-orange-200 p-6 rounded-xl flex item-start gap-2 cursor-pointer',
    iconColor: 'text-orange-500'
  },
   {
    name: 'Loan Release', 
    description: 'Release new loan',
    link: '/dashboard/loan-release', 
    icon: List,
    styles: 'bg-blue-50 border border-blue-200 p-6 rounded-xl flex item-start gap-2 cursor-pointer',
    iconColor: 'text-blue-500'
  },
  {
    name: 'Create Admin', 
    description: 'Create a new administrator',
    link: '/dashboard/admin', 
    icon: ShieldCheck,
    styles: 'bg-green-50 border border-green-200 p-6 rounded-xl flex item-start gap-2 cursor-pointer',
    iconColor: 'text-green-500'
  },
]

const Dashboard = () => {
  const [selected, setSelected] = useState('recent loan');
  const history = useHistory();

  return (
    <IonPage className=" w-full flex items-center justify-center h-full bg-zinc-100">
      <IonContent className=" max-w-[1920px] overflow-y-hidden bg-zinc-100 h-full " fullscreen>
        <div className="h-full flex flex-col gap-6 items-stretch justify-start bg-zinc-100 py-6">
          {/* <PageTitle pages={['Dashboard']} /> */}

          
           
          <div className="px-3 pb-3 flex-1 space-y-4">

             <div className=' space-y-1'>
              {/* <PageTitle pages={['Dashboard']} /> */}
              <p className=' text-xl text-gray-700 !font-medium'>Dashboard</p>
              <p className=' text-sm text-gray-500 '>Monitor loan activity, collections, and members.</p>

            </div>
            
            <div className=" h-full gap-2">
              <div className="md:col-span-1 lg:col-span-2 flex flex-col space-y-4">
                <CardStatistics />
                <div className=' w-full flex flex-col gap-4'>
                  <p>Quick Actions</p>

                  <div className=' w-full grid grid-cols-5 gap-4'>
                    {quickActions.map((item) => (
                      <div 
                      onClick={() => history.push(item.link)}
                      className={item.styles} key={item.name} >
                        <div className=' p-3 h-fit flex bg-white rounded-lg shadow-md'>
                          <item.icon size={20} className={item.iconColor} />
                        </div>
                        <div className=' flex flex-col'>
                          <span className=' text-lg !font-medium'>{item.name}</span>
                          <span className=' text-sm text-gray-500'>{item.description}</span>
                        </div>
                      </div>
                    ))}

                  </div>

                </div>
                <div className=' w-full grid grid-cols-1 lg:grid-cols-[60%_1fr] gap-4'>
                  <LoansPerCenter />

                  {selected === 'recent loan' && <RecentLoans selected={selected} setSelected={setSelected} />}
                  {selected === 'recent member' && <RecentMembers selected={selected} setSelected={setSelected} />}

                

                </div>
              </div>
             
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;

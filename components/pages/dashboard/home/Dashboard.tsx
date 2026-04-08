import { IonContent, IonPage, IonSelect, IonSelectOption } from '@ionic/react';
import React, { useState } from 'react';
import PageTitle from '../../../ui/page/PageTitle';
import CardStatistics from './components/CardStatistics';
import RecentMembers from './components/RecentMembers';
import RecentLoans from './components/RecentLoans';
import LoansPerCenter from './components/LoansPerCenter';
import { List, ShieldCheck, Users } from 'lucide-react';
import { useHistory } from 'react-router';
import CreateClientMasterFileQuickActions from '../client-master-file/modals/CreateClientQuickActions';
import CreateLoanReleaseQuickAction from '../loan-release/modals/CreateLoanReleaseQuickActions';
import CreateUserQuickAction from '../admin/modal/CreateUserQuickActions';

const quickActions = [
  {
    name: 'Add Member', 
    description: 'Register new client',
    link: '/dashboard/client', 
    icon: Users,
    styles: 'bg-orange-50 border border-orange-200 p-6 rounded-xl flex item-start gap-2 cursor-pointer',
    iconColor: 'text-orange-500',
    type: 'member'
  },
   {
    name: 'Add Loan Release', 
    description: 'Release new loan',
    link: '/dashboard/loan-release', 
    icon: List,
    styles: 'bg-blue-50 border border-blue-200 p-6 rounded-xl flex item-start gap-2 cursor-pointer',
    iconColor: 'text-blue-500',
    type: 'loan'


  },
  {
    name: 'Create Admin', 
    description: 'Create a new administrator',
    link: '/dashboard/admin', 
    icon: ShieldCheck,
    styles: 'bg-green-50 border border-green-200 p-6 rounded-xl flex item-start gap-2 cursor-pointer',
    iconColor: 'text-green-500',
    type: 'admin'
  },
]

const Dashboard = () => {
  const [selected, setSelected] = useState('recent loan');
  const history = useHistory();
  const [qaClient, setQAClient] = useState(false)
  const [qaLoan, setQALoan] = useState(false)
  const [qaAdmin, setQAAdmin] = useState(false)

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

                  <div className=' w-full grid md:grid-cols-2 grid-cols-1 lg:grid-cols-4 xl:grid-cols-4 gap-4'>
                    {quickActions.map((item) => (
                      <div 
                      onClick={() => {
                        if(item.type === 'member'){
                          setQAClient(true)
                        } else if (item.type === 'loan'){
                          setQALoan(true)
                        }else if (item.type === 'admin'){
                          setQAAdmin(true)
                        }
                      }}
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

                    <CreateClientMasterFileQuickActions qaClient={qaClient}setQAClient={setQAClient}/>
                    <CreateLoanReleaseQuickAction open={qaLoan} setOpen={setQALoan}/>
                    <CreateUserQuickAction open={qaAdmin} setOpen={setQAAdmin}/>

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

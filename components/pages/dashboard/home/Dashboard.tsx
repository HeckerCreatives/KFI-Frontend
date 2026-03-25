import { IonContent, IonPage, IonSelect, IonSelectOption } from '@ionic/react';
import React, { useState } from 'react';
import PageTitle from '../../../ui/page/PageTitle';
import CardStatistics from './components/CardStatistics';
import RecentMembers from './components/RecentMembers';
import RecentLoans from './components/RecentLoans';
import LoansPerCenter from './components/LoansPerCenter';

const Dashboard = () => {
  const [selected, setSelected] = useState('recent loan');

  return (
    <IonPage className=" w-full flex items-center justify-center h-full bg-zinc-100">
      <IonContent className=" max-w-[1920px] overflow-y-hidden bg-zinc-100 h-full " fullscreen>
        <div className="h-full flex flex-col gap-6 items-stretch justify-start bg-zinc-100 py-6">
          {/* <PageTitle pages={['Dashboard']} /> */}

          
           
          <div className="px-3 pb-3 flex-1 space-y-4">

             <div>
              {/* <PageTitle pages={['Dashboard']} /> */}
              <p className=' text-xl !font-medium'>Dashboard</p>

            </div>
            
            <div className=" h-full gap-2">
              <div className="md:col-span-1 lg:col-span-2 flex flex-col space-y-4">
                <CardStatistics />
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

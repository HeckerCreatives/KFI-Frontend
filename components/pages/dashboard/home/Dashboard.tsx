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
    <IonPage className="">
      <IonContent className="[--background:#F1F1F1]" fullscreen>
        <div className="h-full flex flex-col items-stretch justify-start">
          <PageTitle pages={['Dashboard']} />
          <div className="px-3 pb-3 flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-full gap-2">
              <div className="md:col-span-1 lg:col-span-2 flex flex-col">
                <CardStatistics />
                <LoansPerCenter />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center justify-between border-b pt-2 pb-1 ">
                  <div className="min-w-64">
                    <IonSelect
                      aria-label={'no label'}
                      interface="popover"
                      placeholder="Recent Loan"
                      labelPlacement="stacked"
                      className={'!border border-orange-400 [--highlight-color-focused:none] rounded-md bg-orange-50 !px-2 !py-2 !text-[0.8rem] !min-h-[1.2rem] min-w-full '}
                      onIonChange={e => setSelected(e.detail.value)}
                      value={selected}
                    >
                      <IonSelectOption value="recent loan" className="h-10 text-sm ![--min-height:1rem] [&>ion-radio]:checked:bg-red-600">
                        Recent Loan
                      </IonSelectOption>
                      <IonSelectOption value="recent member" className="h-18 text-sm ![--min-height:1rem]">
                        Recent Member
                      </IonSelectOption>
                    </IonSelect>
                  </div>
                </div>
                <div className="bg-white shadow-lg w-full rounded-sm px-3 pt-1 pb-2 flex-1">
                  {selected === 'recent loan' && <RecentLoans />}
                  {selected === 'recent member' && <RecentMembers />}
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

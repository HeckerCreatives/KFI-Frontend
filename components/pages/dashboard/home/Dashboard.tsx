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
          <div className="px-3 pb-3 flex-1">
            <div className=" h-full gap-2">
              <div className="md:col-span-1 lg:col-span-2 flex flex-col space-y-4">
                <CardStatistics />
                <div className=' w-full grid grid-cols-1 md:grid-cols-[60%_1fr] gap-4'>
                  <LoansPerCenter />

                  <div className=" flex flex-col space-y-2 bg-white rounded-xl shadow-lg">
                    <div className="flex items-center justify-between bg-orange-50 p-4 rounded-t-xl">
                      <div className="min-w-44">
                        <IonSelect
                          aria-label={'no label'}
                          interface="popover"
                          placeholder="Recent Loan"
                          labelPlacement="stacked"
                          className={'!border border-orange-400 [--highlight-color-focused:none] rounded-md bg-orange-50 !px-2 !py-2 !text-[0.8rem] !min-h-[1.2rem] min-w-full '}
                          onIonChange={e => setSelected(e.detail.value)}
                          value={selected}
                        >
                          <IonSelectOption value="recent loan" className="h-10 text-xs ![--min-height:1rem] [&>ion-radio]:checked:bg-red-600">
                            Recent Loan
                          </IonSelectOption>
                          <IonSelectOption value="recent member" className="h-18 text-xs ![--min-height:1rem]">
                            Recent Member
                          </IonSelectOption>
                        </IonSelect>
                      </div>
                    </div>
                    <div className="bg-white w-full flex-1 p-2 rpunded rounded-xl">
                      {selected === 'recent loan' && <RecentLoans />}
                      {selected === 'recent member' && <RecentMembers />}
                    </div>
                  </div>

                </div>
              </div>
              {/* <div className="flex flex-col space-y-4 bg-white p-4 rounded-xl">
                <div className="flex items-center justify-between ">
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
                <div className="bg-white w-full flex-1">
                  {selected === 'recent loan' && <RecentLoans />}
                  {selected === 'recent member' && <RecentMembers />}
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;

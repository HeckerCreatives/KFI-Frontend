import { IonContent, IonPage } from '@ionic/react';
import React from 'react';
import PageTitle from '../../../ui/page/PageTitle';

const TrialBalance = () => {
  return (
    <IonPage className="">
      <IonContent className="[--background:#F1F1F1]" fullscreen>
        <div className="h-full flex flex-col items-stretch justify-start">
          <PageTitle pages={['General Ledger', 'Trial Balance']} />
          <div className="px-3 pb-3 flex-1">
            <div className="relative overflow-auto"></div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default TrialBalance;

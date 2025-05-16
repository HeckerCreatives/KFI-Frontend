import { IonContent, IonPage } from '@ionic/react';
import React from 'react';
import PageTitle from '../../../ui/page/PageTitle';

const Dashboard = () => {
  return (
    <IonPage className="">
      <IonContent className="[--background:#F1F1F1]" fullscreen>
        <div className="h-full flex flex-col items-stretch justify-start">
          <PageTitle pages={['Dashboard']} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;

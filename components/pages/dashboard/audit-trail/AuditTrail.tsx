import { IonContent, IonPage } from '@ionic/react';
import React from 'react';
import PageTitle from '../../../ui/page/PageTitle';

const AuditTrail = () => {
  return (
    <IonPage className=" w-full flex items-center justify-center h-full bg-zinc-100">
      <IonContent className="[--background:#F4F4F5] max-w-[1920px] h-full" fullscreen>
        <div className="h-full flex flex-col gap-4 py-6 items-stretch justify-start">
          <PageTitle pages={['General Ledger', 'Audit Trail']} />
          <div className="px-3 pb-3 flex-1">
            <div className="relative overflow-auto"></div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AuditTrail;

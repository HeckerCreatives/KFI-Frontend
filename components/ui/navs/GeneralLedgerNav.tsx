import { IonAccordion, IonIcon, IonLabel, IonList } from '@ionic/react';
import { listCircle } from 'ionicons/icons';
import React from 'react';

const GeneralLedgerNav = () => {
  return (
    <IonAccordion value="general-ledger" className="">
      <div
        slot="header"
        className="px-4 flex items-center gap-2 py-2 cursor-pointer text-sm font-semibold border-b border-gray-400/50 bg-[#b44e1d] hover:text-slate-800 text-slate-100 hover:bg-[#FFE4C9]"
      >
        <IonIcon icon={listCircle} className="!text-inherit" />
        <IonLabel color="dark" className="!text-inherit">
          General Ledger
        </IonLabel>
      </div>
      <div slot="content">
        <IonList className="p-0">
          {/* {fileLinks.map(link => (
                <IonMenuToggle key={link.path}>
                  <IonItem routerLink="/chart-of-account">
                    <IonLabel>{link.label}</IonLabel>
                  </IonItem>
                </IonMenuToggle>
              ))} */}
        </IonList>
      </div>
    </IonAccordion>
  );
};

export default GeneralLedgerNav;

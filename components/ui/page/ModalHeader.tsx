import { IonButton, IonIcon } from '@ionic/react';
import { closeSharp } from 'ionicons/icons';
import React from 'react';

type TProps = {
  dismiss: () => void;
  title: string;
  sub: string;
  disabled?: boolean;
};

const ModalHeader = ({ dismiss, title, sub, disabled = false }: TProps) => {
  return (
    <div className=" bg-desktop bg-center h-20">
      <div className="h-20 flex items-center justify-between bg-slate-900/40">
        <div slot="start" className="h-20 grid place-items-center">
          <div className="px-5">
            <span className="text-xs">{sub}</span>
            <h6 className="font-semibold m-0 text-xl leading-3">{title}</h6>
          </div>
        </div>
        <div slot="end" className="h-20 grid place-items-center">
          <IonButton disabled={disabled} onClick={dismiss} fill="clear" className="" color="light">
            <IonIcon icon={closeSharp} size="large" />
          </IonButton>
        </div>
      </div>
    </div>
  );
};

export default ModalHeader;

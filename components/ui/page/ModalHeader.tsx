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
    <div className=" bg-desktop bg-center h-12">
      <div className="h-12 flex items-center justify-between bg-slate-900/40">
        <div slot="start" className="h-12 grid place-items-center">
          <div className="px-5 leading-3">
            <span className="text-xs">{sub}</span>
            <h6 className="font-semibold leading-5 m-0 text-lg">{title}</h6>
          </div>
        </div>
        <div slot="end" className="h-12 grid place-items-center">
          <IonButton disabled={disabled} onClick={dismiss} fill="clear" className="" color="light">
            <IonIcon icon={closeSharp} size="medium" />
          </IonButton>
        </div>
      </div>
    </div>
  );
};

export default ModalHeader;

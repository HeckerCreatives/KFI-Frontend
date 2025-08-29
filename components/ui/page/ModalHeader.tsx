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
    <div className=" bg-center h-fit">
      <div className="h-fit flex items-start justify-between ">
        <div className=" flex flex-col gap-1">
            {/* <span className="text-xs">{sub}</span> */}
            <p className="!font-semibold text-lg ">{title}</p>
            <p className=" text-zinc-800 text-sm">{sub}</p>
          </div>
          <IonButton disabled={disabled} onClick={dismiss} fill="clear" className=" h-fit " color='dark'>
            <IonIcon icon={closeSharp} size="small" />
          </IonButton>
      </div>
    </div>
  );
};

export default ModalHeader;

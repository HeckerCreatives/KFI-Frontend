import { IonButton, IonIcon } from '@ionic/react';
import { closeSharp } from 'ionicons/icons';
import React from 'react';

type SelectionHeaderProps = {
  disabled?: boolean;
  dismiss: () => void;
  title: string;
};

const SelectionHeader = ({ disabled = false, dismiss, title }: SelectionHeaderProps) => {
  return (
    <div className=" bg-desktop bg-center h-10">
      <div className="h-10 flex items-center justify-between bg-slate-900/40">
        <div slot="start" className="h-10 grid place-items-center">
          <div className="px-5">
            <h6 className="font-semibold m-0 text-sm leading-3 tracking-wider">{title}</h6>
          </div>
        </div>
        <div slot="end" className="h-10 grid place-items-center">
          <IonButton disabled={disabled} onClick={dismiss} fill="clear" className="" color="light">
            <IonIcon icon={closeSharp} size="small" />
          </IonButton>
        </div>
      </div>
    </div>
  );
};

export default SelectionHeader;

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
    <div className=" bg-center">
      <div className=" flex items-center justify-between ">
        <div slot="start" className=" grid place-items-center">
          <div className="">
            <h6 className="!font-semibold m-0 text-sm">{title}</h6>
          </div>
        </div>
        <div slot="end" className="h-10 grid place-items-center">
          <IonButton disabled={disabled} onClick={dismiss} fill="clear" className="" color="dark">
            <IonIcon icon={closeSharp} size="small" />
          </IonButton>
        </div>
      </div>
    </div>
  );
};

export default SelectionHeader;

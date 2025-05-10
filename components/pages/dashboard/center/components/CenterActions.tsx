import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';

import { ellipsisVertical } from 'ionicons/icons';
import UpdateCenter from '../modals/UpdateCenter';
import DeleteCenter from '../modals/DeleteCenter';

const CenterActions = ({ index }: { index: number }) => {
  return (
    <>
      <IonButton fill="clear" id={`center-${index}`}>
        <IonIcon icon={ellipsisVertical} className="text-[#FA6C2F]" />
      </IonButton>
      <IonPopover showBackdrop={false} trigger={`center-${index}`} triggerAction="click" className="[--max-width:10rem]">
        <IonContent>
          <UpdateCenter index={index} />
          <DeleteCenter index={index} />
        </IonContent>
      </IonPopover>
    </>
  );
};

export default CenterActions;

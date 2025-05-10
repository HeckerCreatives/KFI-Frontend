import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical } from 'ionicons/icons';
import UpdateGroupAccount from '../modals/UpdateGroupAccount';
import DeleteGroupAccount from '../modals/DeleteGroupAccount';

const GroupAccountActions = ({ index }: { index: number }) => {
  return (
    <>
      <IonButton fill="clear" id={`ga-${index}`}>
        <IonIcon icon={ellipsisVertical} className="text-[#FA6C2F]" />
      </IonButton>
      <IonPopover showBackdrop={false} trigger={`ga-${index}`} triggerAction="click" className="[--max-width:10rem]">
        <IonContent>
          <UpdateGroupAccount index={index} />
          <DeleteGroupAccount index={index} />
        </IonContent>
      </IonPopover>
    </>
  );
};

export default GroupAccountActions;

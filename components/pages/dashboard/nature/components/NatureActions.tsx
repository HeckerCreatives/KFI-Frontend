import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical } from 'ionicons/icons';
import UpdateNature from '../modals/UpdateNature';
import DeleteNature from '../modals/DeleteNature';

const NatureActions = ({ index }: { index: number }) => {
  return (
    <>
      <IonButton fill="clear" id={`nature-${index}`}>
        <IonIcon icon={ellipsisVertical} className="text-[#FA6C2F]" />
      </IonButton>
      <IonPopover showBackdrop={false} trigger={`nature-${index}`} triggerAction="click" className="[--max-width:10rem]">
        <IonContent>
          <UpdateNature index={index} />
          <DeleteNature index={index} />
        </IonContent>
      </IonPopover>
    </>
  );
};

export default NatureActions;

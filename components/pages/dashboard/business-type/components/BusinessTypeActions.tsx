import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical } from 'ionicons/icons';
import UpdateBusinessType from '../modals/UpdateBusinessType';
import DeleteBusinessType from '../modals/DeleteBusinessType';

const BusinessTypeActions = ({ index }: { index: number }) => {
  return (
    <>
      <IonButton fill="clear" id={`bt-${index}`}>
        <IonIcon icon={ellipsisVertical} className="text-[#FA6C2F]" />
      </IonButton>
      <IonPopover showBackdrop={false} trigger={`bt-${index}`} triggerAction="click" className="[--max-width:10rem]">
        <IonContent>
          <UpdateBusinessType index={index} />
          <DeleteBusinessType index={index} />
        </IonContent>
      </IonPopover>
    </>
  );
};

export default BusinessTypeActions;

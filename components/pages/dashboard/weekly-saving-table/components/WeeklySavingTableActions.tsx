import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical } from 'ionicons/icons';
import UpdateWeeklySavingTable from '../modals/UpdateWeeklySavingTable';
import DeleteWeeklySavingTable from '../modals/DeleteWeeklySavingTable';

const WeeklySavingTableActions = ({ index }: { index: number }) => {
  return (
    <>
      <IonButton fill="clear" id={`wst-${index}`}>
        <IonIcon icon={ellipsisVertical} className="text-[#FA6C2F]" />
      </IonButton>
      <IonPopover showBackdrop={false} trigger={`wst-${index}`} triggerAction="click" className="[--max-width:10rem]">
        <IonContent>
          <UpdateWeeklySavingTable index={index} />
          <DeleteWeeklySavingTable index={index} />
        </IonContent>
      </IonPopover>
    </>
  );
};

export default WeeklySavingTableActions;

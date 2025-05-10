import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical } from 'ionicons/icons';
import UpdateBank from '../modals/UpdateBank';
import DeleteBank from '../modals/DeleteBank';

const BankActions = ({ index }: { index: number }) => {
  return (
    <>
      <IonButton fill="clear" id={`bank-${index}`}>
        <IonIcon icon={ellipsisVertical} className="text-[#FA6C2F]" />
      </IonButton>
      <IonPopover showBackdrop={false} trigger={`bank-${index}`} triggerAction="click" className="[--max-width:10rem]">
        <IonContent>
          <UpdateBank index={index} />
          <DeleteBank index={index} />
        </IonContent>
      </IonPopover>
    </>
  );
};

export default BankActions;

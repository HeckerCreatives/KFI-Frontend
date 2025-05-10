import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical } from 'ionicons/icons';
import UpdateSupplier from '../modals/UpdateSupplier';
import DeleteSupplier from '../modals/DeleteSupplier';

const SupplierActions = ({ index }: { index: number }) => {
  return (
    <>
      <IonButton fill="clear" id={`supplier-${index}`}>
        <IonIcon icon={ellipsisVertical} className="text-[#FA6C2F]" />
      </IonButton>
      <IonPopover showBackdrop={false} trigger={`supplier-${index}`} triggerAction="click" className="[--max-width:10rem]">
        <IonContent>
          <UpdateSupplier index={index} />
          <DeleteSupplier index={index} />
        </IonContent>
      </IonPopover>
    </>
  );
};

export default SupplierActions;

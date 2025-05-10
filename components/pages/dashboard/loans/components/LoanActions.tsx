import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';

import { ellipsisVertical } from 'ionicons/icons';
import UpdateLoan from '../modals/UpdateLoan';
import DeleteLoan from '../modals/DeleteLoan';
import SetUpCodeLoan from '../modals/SetUpCodeLoan';

const LoanActions = ({ index }: { index: number }) => {
  return (
    <>
      <IonButton fill="clear" id={`loan-${index}`}>
        <IonIcon icon={ellipsisVertical} className="text-[#FA6C2F]" />
      </IonButton>
      <IonPopover showBackdrop={false} trigger={`loan-${index}`} triggerAction="click" className="[--max-width:10rem]">
        <IonContent>
          <UpdateLoan index={index} />
          <DeleteLoan index={index} />
          <SetUpCodeLoan index={index} />
        </IonContent>
      </IonPopover>
    </>
  );
};

export default LoanActions;

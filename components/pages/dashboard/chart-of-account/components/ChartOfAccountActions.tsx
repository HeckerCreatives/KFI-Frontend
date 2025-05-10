import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import UpdateChartOfAccount from '../modals/UpdateChartOfAccount';
import DeleteChartOfAccount from '../modals/DeleteChartOfAccount';
import { ellipsisVertical } from 'ionicons/icons';

const ChartOfAccountActions = ({ index }: { index: number }) => {
  return (
    <>
      <IonButton fill="clear" id={`coa-${index}`}>
        <IonIcon icon={ellipsisVertical} className="text-[#FA6C2F]" />
      </IonButton>
      <IonPopover showBackdrop={false} trigger={`coa-${index}`} triggerAction="click" className="[--max-width:10rem]">
        <IonContent>
          <UpdateChartOfAccount index={index} />
          <DeleteChartOfAccount index={index} />
        </IonContent>
      </IonPopover>
    </>
  );
};

export default ChartOfAccountActions;

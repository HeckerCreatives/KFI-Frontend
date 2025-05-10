import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical, print } from 'ionicons/icons';
import ViewOfficialReceipt from '../modals/ViewOfficialReceipt';
import UpdateOfficialReceipt from '../modals/UpdateOfficialReceipt';
import DeleteOfficialReceipt from '../modals/DeleteOfficialReceipt';
import UpdateCVOfficialReceipt from '../modals/UpdateCVOfficialReceipt';

const OfficialReceiptActions = ({ index }: { index: number }) => {
  return (
    <>
      <IonButton fill="clear" id={`officialReceipt-${index}`} className="[--padding-start:0] [--padding-end:0] [--padding-top:0] [--padding-bottom:0] min-h-5">
        <IonIcon icon={ellipsisVertical} className="text-[#FA6C2F]" />
      </IonButton>
      <IonPopover showBackdrop={false} trigger={`officialReceipt-${index}`} triggerAction="click" className="[--max-width:11rem]">
        <IonContent class="[--padding-top:0.5rem] [--padding-bottom:0.5rem]">
          <ViewOfficialReceipt index={index} />
          <UpdateOfficialReceipt index={index} />
          <DeleteOfficialReceipt index={index} />
          <div
            id={`present-alert-${index}`}
            className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
          >
            <IonIcon icon={print} className="text-[1rem]" /> Print
          </div>
          <UpdateCVOfficialReceipt index={index} />
        </IonContent>
      </IonPopover>
    </>
  );
};

export default OfficialReceiptActions;

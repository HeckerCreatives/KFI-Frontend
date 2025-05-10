import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical, print } from 'ionicons/icons';
import ViewDamayanFund from '../modals/ViewDamayanFund';
import UpdateDamayanFund from '../modals/UpdateDamayanFund';
import DeleteDamayanFund from '../modals/DeleteDamayanFund';
import UpdateCVDamayanFund from '../modals/UpdateCVDamayanFund';

const DamayanFundActions = ({ index }: { index: number }) => {
  return (
    <>
      <IonButton fill="clear" id={`loanRelease-${index}`} className="[--padding-start:0] [--padding-end:0] [--padding-top:0] [--padding-bottom:0] min-h-5">
        <IonIcon icon={ellipsisVertical} className="text-[#FA6C2F]" />
      </IonButton>
      <IonPopover showBackdrop={false} trigger={`loanRelease-${index}`} triggerAction="click" className="[--max-width:11rem]">
        <IonContent class="[--padding-top:0.5rem] [--padding-bottom:0.5rem]">
          <ViewDamayanFund index={index} />
          <UpdateDamayanFund index={index} />
          <DeleteDamayanFund index={index} />
          <div
            id={`present-alert-${index}`}
            className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
          >
            <IonIcon icon={print} className="text-[1rem]" /> Print
          </div>
          <UpdateCVDamayanFund index={index} />
        </IonContent>
      </IonPopover>
    </>
  );
};

export default DamayanFundActions;

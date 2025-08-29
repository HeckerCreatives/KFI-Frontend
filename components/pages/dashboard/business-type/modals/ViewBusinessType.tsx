import React, { useRef } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, IonIcon } from '@ionic/react';
import { eye } from 'ionicons/icons';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { BusinessType } from '../../../../../types/types';
import classNames from 'classnames';

const ViewBusinessType = ({ businessType }: { businessType: BusinessType }) => {
  const modal = useRef<HTMLIonModalElement>(null);

  function dismiss() {
    modal.current?.dismiss();
  }

  return (
    <>
      {/* <div className="text-end">
        <div
          id={`update-bank-modal-${bank._id}`}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={createSharp} className="text-[1rem]" /> Edit
        </div>
      </div> */}
      <IonButton
        id={`view-businessType-modal-${businessType._id}`}
        type="button"
        fill="clear"
        className="space-x-1 rounded-md w-16 h-7 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-orange-100 text-orange-900 capitalize min-h-4 text-xs"
      >
        <IonIcon icon={eye} className="text-xs" />
        <span>View</span>
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`view-businessType-modal-${businessType._id}`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:30rem] md:[--width:100%] lg:[--max-width:30rem] lg:[--width:50%] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader title="Business Type - View Record" sub="System" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content space-y-2 !p-6">
            <ModalHeader title="Business Type - View Record" sub="Manage business type records." dismiss={dismiss} />

          <div className="w-full flex items-start gap-2 !mt-4">
            <div className={classNames('text-black text-xs  font-semibold truncate w-fit min-w-20 text-end')}>Business Type</div>
            <div className={classNames('border text-black border-slate-400 min-h-8 text-xs py-0 px-3 text-sm flex items-center flex-1 rounded-md capitalize')}>{businessType.type}</div>
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default ViewBusinessType;

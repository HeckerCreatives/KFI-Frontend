import React, { useRef } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, IonIcon } from '@ionic/react';
import { eye } from 'ionicons/icons';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { Bank } from '../../../../../types/types';
import classNames from 'classnames';

const ViewBank = ({ bank }: { bank: Bank }) => {
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
        id={`view-bank-modal-${bank._id}`}
        type="button"
        fill="clear"
        className="space-x-1 rounded-lg w-16 h-6 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-[#ffe808] text-slate-700 capitalize min-h-4 text-xs"
      >
        <IonIcon icon={eye} className="text-xs" />
        <span>View</span>
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`view-bank-modal-${bank._id}`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:30rem] md:[--width:100%] lg:[--max-width:30rem] lg:[--width:50%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader title="Bank - View Record" sub="System" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content space-y-2">
          <div className="w-full flex items-start gap-2 text-slate-600">
            <div className={classNames('text-slate-600 text-[0.85rem]  font-semibold truncate w-fit min-w-20 text-end')}>Code</div>
            <div className={classNames('border border-slate-400 min-h-8 text-[0.7rem] py-0 px-3 text-sm flex items-center flex-1 rounded-md capitalize')}>{bank.code}</div>
          </div>
          <div className="w-full flex items-start gap-2 text-slate-600">
            <div className={classNames('text-slate-600 text-[0.85rem]  font-semibold truncate w-fit min-w-20 text-end')}>Description</div>
            <div className={classNames('border border-slate-400 min-h-8 text-[0.7rem] py-0 px-3 text-sm flex items-center flex-1 rounded-md capitalize')}>{bank.description}</div>
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default ViewBank;

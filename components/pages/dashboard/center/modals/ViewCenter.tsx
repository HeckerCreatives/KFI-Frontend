import React, { useRef, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, IonIcon } from '@ionic/react';
import { eye } from 'ionicons/icons';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { Center, GroupAccount } from '../../../../../types/types';
import classNames from 'classnames';
import ViewCenterCard from '../components/ViewCenterCard';

type ViewCenterProps = {
  center: Center;
};

const ViewCenter = ({ center }: ViewCenterProps) => {
  const modal = useRef<HTMLIonModalElement>(null);

  function dismiss() {
    modal.current?.dismiss();
  }

  return (
    <>
      {/* <div className="text-end">
        <div
          id={`update-group-account-modal-${groupAccount._id}`}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={createSharp} className="text-[1rem]" /> Edit
        </div>
      </div> */}
      <IonButton
        id={`view-center-modal-${center._id}`}
        type="button"
        fill="clear"
        className="space-x-1 rounded-md w-16 h-7 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-orange-100 text-orange-900 capitalize min-h-4 text-xs"
      >
        <IonIcon icon={eye} className="text-xs" />
        <span>View</span>
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`view-center-modal-${center._id}`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height [--max-width:50rem] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader title="Center - View Record" sub="System" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6">
            <ModalHeader title="Center - View Record" sub="Manage center records." dismiss={dismiss} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
            <div className="space-y-2">
              <ViewCenterCard label="Center Code" value={center.centerNo} labelClassName="text-end min-w-28" />
              <ViewCenterCard label="Account Officer" value={center.acctOfficer} labelClassName="text-end min-w-28" />
              <ViewCenterCard label="Description" value={center.description} labelClassName="text-end min-w-28" />
            </div>
            <div className="space-y-2">
              <ViewCenterCard label="Center Chief" value={center.centerChief} labelClassName="text-end min-w-28" />
              <ViewCenterCard label="Treasurer" value={center.treasurer} labelClassName="text-end min-w-28" />
              <ViewCenterCard label="Location" value={center.location} labelClassName="text-end min-w-28" />
            </div>
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default ViewCenter;

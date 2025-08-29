import React, { useState } from 'react';
import { IonModal, IonHeader, IonToolbar, IonIcon, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonText, IonButton } from '@ionic/react';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { eye } from 'ionicons/icons';
import { Release } from '../../../../../types/types';
import { formatDateTable } from '../../../../utils/date-utils';
import { formatNumber } from '../../../../ui/utils/formatNumber';
import ReleaseViewCard from '../components/ReleaseViewCard';
import ViewReleaseEntries from '../components/ViewReleaseEntries';

type ViewReleaseProps = {
  release: Release;
};

const ViewRelease = ({ release }: ViewReleaseProps) => {
  const [isOpen, setIsOpen] = useState(false);

  function dismiss() {
    setIsOpen(false);
  }

  return (
    <>
      {/* <div className="text-end">
        <div
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={eye} className="text-[1rem]" /> View
        </div>
      </div> */}
      <IonButton
        onClick={() => setIsOpen(true)}
        type="button"
        fill="clear"
        className="space-x-1 rounded-md w-20 h-7 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-orange-100 text-orange-900 capitalize min-h-4 text-xs"
      >
        <IonIcon icon={eye} className="text-xs" />
        <span>View</span>
      </IonButton>
      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height [--max-width:84rem] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader title="Acknowledgement - View Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6  flex flex-col">
            <ModalHeader title="Acknowledgement - View Record" sub="Manage acknowledgement record." dismiss={dismiss} />

          <div className="inner-content max-h-[90%] h-full  flex flex-col gap-2 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                <div className="space-y-1">
                  <ReleaseViewCard label="AR#" value={`${release.code}`} labelClassName="min-w-28 text-end " />
                  <ReleaseViewCard label="Center Code" value={`${release.center.centerNo}`} labelClassName="min-w-28 text-end" />
                  <ReleaseViewCard label="Name" value={`${release.center.description}`} labelClassName="min-w-28 text-end" />
                  <ReleaseViewCard label="Cash Type" value={release.type} labelClassName="min-w-28 text-end" />
                </div>
                <div className="space-y-1">
                  <ReleaseViewCard label="Date" value={formatDateTable(release.date)} labelClassName="min-w-28 text-end" />
                  <ReleaseViewCard label="Account Month" value={`${release.acctMonth}`} labelClassName="min-w-28 text-end" />
                  <ReleaseViewCard label="Account Year" value={`${release.acctYear}`} labelClassName="min-w-28 text-end" />
                  <ReleaseViewCard label="Account Officer" value={release.acctOfficer} labelClassName="min-w-28 text-end" />
                </div>
                
              <div className="space-y-1">
                <ReleaseViewCard label="Check Number" value={release.checkNo} labelClassName="min-w-28 text-end" />
                <ReleaseViewCard label="Check Date" value={formatDateTable(release.checkDate)} labelClassName="min-w-28 text-end" />
                <ReleaseViewCard label="Bank Code" value={release.bankCode.code} labelClassName="min-w-28 text-end" />
                <ReleaseViewCard label="Amount" value={`${formatNumber(release.amount)}`} labelClassName="min-w-28 text-end" />
                <ReleaseViewCard label="Cash Collection" value={`${formatNumber(release.cashCollectionAmount || 0)}`} labelClassName="min-w-28 text-end" />
              </div>

              <div className=" lg:col-span-3 ">
                  <ReleaseViewCard label="Particular" value={release.remarks} labelClassName="min-w-28 text-end" />
                  <ReleaseViewCard label="User" value={release.encodedBy.username} labelClassName="min-w-28 text-end" containerClassName="" />

                </div>
            </div>
            {/* <div>
              <ReleaseViewCard label="User" value={release.encodedBy.username} labelClassName="min-w-20 text-end !text-slate-600" containerClassName="" />
            </div> */}
            <div className="flex-1 mt-4">
              <ViewReleaseEntries release={release} isOpen={isOpen} />
            </div>
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default ViewRelease;

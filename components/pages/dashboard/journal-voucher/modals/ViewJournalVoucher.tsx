import React, { useState } from 'react';
import { IonModal, IonHeader, IonToolbar, IonIcon, IonGrid, IonRow, IonCol, IonButton } from '@ionic/react';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { eye, journal } from 'ionicons/icons';
import LoanReleaseFormTable from '../components/JournalVoucherFormTable';
import JournalVoucherViewCard from '../components/JournalVoucherViewCard';
import { formatDateTable } from '../../../../utils/date-utils';
import { formatNumber } from '../../../../ui/utils/formatNumber';
import { JournalVoucher } from '../../../../../types/types';
import ViewJVEntries from './ViewJVEntries';

const ViewJournalVoucher = ({ journalVoucher }: { journalVoucher: JournalVoucher }) => {
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
        type="button"
        onClick={() => setIsOpen(true)}
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
            <ModalHeader title="Journal Voucher - View Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content mx-h-[90%] h-full !p-6 flex flex-col">
            <ModalHeader title="Journal Voucher - View Record" sub="Transaction" dismiss={dismiss} />

          <div className="space-y-1 !mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1">
                <JournalVoucherViewCard label="JV#" value={`${journalVoucher.code}`} labelClassName="min-w-28 text-end" />
                <JournalVoucherViewCard label="Nature" value={journalVoucher.nature} labelClassName="min-w-28 text-end " />
              </div>
              <div className="space-y-1">
                <JournalVoucherViewCard label="Date" value={formatDateTable(journalVoucher.date)} labelClassName="min-w-28 text-end " />
                <JournalVoucherViewCard label="Account Month" value={`${journalVoucher.acctMonth}`} labelClassName="min-w-28 text-end " />
                <JournalVoucherViewCard label="Account Year" value={`${journalVoucher.acctYear}`} labelClassName="min-w-28 text-end " />
              </div>
              <div className="space-y-1">
                <JournalVoucherViewCard label="Check Number" value={journalVoucher.checkNo} labelClassName="min-w-28 text-end" />
                <JournalVoucherViewCard label="Check Date" value={formatDateTable(journalVoucher.checkDate)} labelClassName="min-w-28 text-end " />
                <JournalVoucherViewCard label="Bank Code" value={journalVoucher.bankCode.code} labelClassName="min-w-28 text-end " />
                <JournalVoucherViewCard label="Amount" value={`${formatNumber(journalVoucher.amount)}`} labelClassName="min-w-28 text-end " />
              </div>
            </div>
            <div className="space-y-1">
              <JournalVoucherViewCard label="Particular" value={journalVoucher.remarks} labelClassName="min-w-28 text-end " />
              <JournalVoucherViewCard label="User" value={journalVoucher.encodedBy.username} labelClassName="min-w-28 text-end " containerClassName="" />
            </div>
          </div>
          <div className="flex-1 mt-1">
            <ViewJVEntries journalVoucher={journalVoucher} isOpen={isOpen} />
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default ViewJournalVoucher;

import React, { useState } from 'react';
import { IonModal, IonHeader, IonToolbar, IonIcon, IonGrid, IonRow, IonCol } from '@ionic/react';
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
      <div className="text-end">
        <div
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={eye} className="text-[1rem]" /> View
        </div>
      </div>
      <IonModal isOpen={isOpen} backdropDismiss={false} className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:70%] lg:[--width:70%]">
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader title="Journal Voucher - View Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content !p-2">
          <IonGrid>
            <IonRow>
              <IonCol size="6" className="space-y-1">
                <JournalVoucherViewCard label="CV#" value={`CV#${journalVoucher.code}`} />
                <JournalVoucherViewCard label="Supplier" value={journalVoucher.supplier.description} />
                <JournalVoucherViewCard label="Particular" value={journalVoucher.remarks} />
                <JournalVoucherViewCard label="Date" value={formatDateTable(journalVoucher.date)} />
                <JournalVoucherViewCard label="User" value={journalVoucher.encodedBy.username} />
              </IonCol>
              <IonCol size="6" className="space-y-1">
                <IonGrid className="ion-no-padding">
                  <IonRow className="gap-2">
                    <IonCol>
                      <JournalVoucherViewCard label="Account Month" value={`${journalVoucher.acctMonth}`} />
                    </IonCol>
                    <IonCol>
                      <JournalVoucherViewCard label="Account Year" value={`${journalVoucher.acctYear}`} />
                    </IonCol>
                  </IonRow>
                </IonGrid>
                <JournalVoucherViewCard label="Check Number" value={journalVoucher.checkNo} />
                <JournalVoucherViewCard label="Check Date" value={formatDateTable(journalVoucher.checkDate)} />
                <JournalVoucherViewCard label="Bank Code" value={journalVoucher.bankCode.description} />
                <JournalVoucherViewCard label="Amount" value={`${formatNumber(journalVoucher.amount)}`} />
              </IonCol>
            </IonRow>
          </IonGrid>
          <ViewJVEntries journalVoucher={journalVoucher} isOpen={isOpen} />
        </div>
      </IonModal>
    </>
  );
};

export default ViewJournalVoucher;

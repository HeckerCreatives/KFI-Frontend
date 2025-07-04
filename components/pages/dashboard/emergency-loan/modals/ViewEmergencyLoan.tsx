import React, { useState } from 'react';
import { IonModal, IonHeader, IonToolbar, IonIcon, IonGrid, IonRow, IonCol } from '@ionic/react';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { eye } from 'ionicons/icons';
import JournalVoucherViewCard from '../components/EmergencyLoanViewCard';
import { formatDateTable } from '../../../../utils/date-utils';
import { formatNumber } from '../../../../ui/utils/formatNumber';
import { EmergencyLoan } from '../../../../../types/types';
import ViewELEntries from '../components/ViewELEntries';

const ViewEmergencyLoan = ({ emergencyLoan }: { emergencyLoan: EmergencyLoan }) => {
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
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader title="Emergency Loan - View Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content !px-6 !py-5">
          <IonGrid>
            <IonRow>
              <IonCol size="6" className="space-y-2">
                <JournalVoucherViewCard label="EV#" value={`CV#${emergencyLoan.code}`} />
                <JournalVoucherViewCard label="Supplier" value={emergencyLoan.supplier.description} />
                <JournalVoucherViewCard label="Reference Number" value={emergencyLoan.refNo} />
                <JournalVoucherViewCard label="Remark" value={emergencyLoan.remarks} />
                <JournalVoucherViewCard label="Date" value={formatDateTable(emergencyLoan.date)} />
                <JournalVoucherViewCard label="User" value={emergencyLoan.encodedBy.username} />
              </IonCol>
              <IonCol size="6" className="space-y-2">
                <IonGrid className="ion-no-padding">
                  <IonRow className="gap-2">
                    <IonCol>
                      <JournalVoucherViewCard label="Account Month" value={`${emergencyLoan.acctMonth}`} />
                    </IonCol>
                    <IonCol>
                      <JournalVoucherViewCard label="Account Year" value={`${emergencyLoan.acctYear}`} />
                    </IonCol>
                  </IonRow>
                </IonGrid>
                <JournalVoucherViewCard label="Check Number" value={emergencyLoan.checkNo} />
                <JournalVoucherViewCard label="Check Date" value={formatDateTable(emergencyLoan.checkDate)} />
                <JournalVoucherViewCard label="Bank Code" value={emergencyLoan.bankCode.description} />
                <JournalVoucherViewCard label="Amount" value={`${formatNumber(emergencyLoan.amount)}`} />
              </IonCol>
            </IonRow>
          </IonGrid>
          <ViewELEntries emergencyLoan={emergencyLoan} isOpen={isOpen} />
        </div>
      </IonModal>
    </>
  );
};

export default ViewEmergencyLoan;

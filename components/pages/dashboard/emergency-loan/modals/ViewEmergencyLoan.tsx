import React, { useState } from 'react';
import { IonModal, IonHeader, IonToolbar, IonIcon, IonGrid, IonRow, IonCol, IonButton } from '@ionic/react';
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
        className="space-x-1 rounded-lg w-24 h-6 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-[#ffe808] text-slate-700 capitalize min-h-4 text-xs"
      >
        <IonIcon icon={eye} className="text-xs" />
        <span>View</span>
      </IonButton>
      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:95%] md:[--width:100%] lg:[--max-width:95%] lg:[--width:95%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader title="Emergency Loan - View Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content h-screen !p-2 flex flex-col">
          <div>
            <IonGrid>
              <IonRow>
                <IonCol size="6" className="space-y-1">
                  <JournalVoucherViewCard label="CV#" value={`CV#${emergencyLoan.code}`} labelClassName="min-w-14 text-end !text-slate-600" />
                  <JournalVoucherViewCard label="Supplier" value={emergencyLoan.supplier.description} labelClassName="min-w-14 text-end !text-slate-600" />
                  <JournalVoucherViewCard label="Particular" value={emergencyLoan.remarks} labelClassName="min-w-14 text-end !text-slate-600" />
                  <JournalVoucherViewCard label="Date" value={formatDateTable(emergencyLoan.date)} labelClassName="min-w-14 text-end !text-slate-600" />
                  <JournalVoucherViewCard label="User" value={emergencyLoan.encodedBy.username} labelClassName="min-w-14 text-end !text-slate-600" />
                </IonCol>
                <IonCol size="6" className="space-y-1">
                  <IonGrid className="ion-no-padding">
                    <IonRow className="gap-2">
                      <IonCol>
                        <JournalVoucherViewCard label="Account Month" value={`${emergencyLoan.acctMonth}`} labelClassName="min-w-20 text-end !text-slate-600" />
                      </IonCol>
                      <IonCol>
                        <JournalVoucherViewCard label="Account Year" value={`${emergencyLoan.acctYear}`} labelClassName="min-w-20 text-end !text-slate-600" />
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                  <JournalVoucherViewCard label="Check Number" value={emergencyLoan.checkNo} labelClassName="min-w-20 text-end !text-slate-600" />
                  <JournalVoucherViewCard label="Check Date" value={formatDateTable(emergencyLoan.checkDate)} labelClassName="min-w-20 text-end !text-slate-600" />
                  <JournalVoucherViewCard label="Bank Code" value={emergencyLoan.bankCode.description} labelClassName="min-w-20 text-end !text-slate-600" />
                  <JournalVoucherViewCard label="Amount" value={`${formatNumber(emergencyLoan.amount)}`} labelClassName="min-w-20 text-end !text-slate-600" />
                </IonCol>
              </IonRow>
            </IonGrid>
          </div>
          <div className="flex-1">
            <ViewELEntries emergencyLoan={emergencyLoan} isOpen={isOpen} />
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default ViewEmergencyLoan;

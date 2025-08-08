import React, { useRef, useState } from 'react';
import { IonModal, IonHeader, IonToolbar, IonIcon, IonGrid, IonRow, IonCol, IonButton } from '@ionic/react';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { eye } from 'ionicons/icons';
import LoanReleaseViewCard from '../components/LoanReleaseViewCard';
import { Transaction } from '../../../../../types/types';
import { formatDateTable } from '../../../../utils/date-utils';
import { formatNumber } from '../../../../ui/utils/formatNumber';
import ViewEntries from '../components/ViewEntries';

const ViewLoanRelease = ({ transaction }: { transaction: Transaction }) => {
  const [isOpen, setIsOpen] = useState(false);

  const modal = useRef<HTMLIonModalElement>(null);

  function dismiss() {
    setIsOpen(false);
  }

  return (
    <>
      {/* <div
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
      >
        <IonIcon icon={eye} className="text-[1rem]" /> View
      </div> */}
      <IonButton
        type="button"
        fill="clear"
        className="space-x-1 rounded-lg w-24 h-6 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-[#ffe808] text-slate-700 capitalize min-h-4 text-xs"
        onClick={() => setIsOpen(true)}
      >
        <IonIcon icon={eye} className="text-xs" />
        <span>View</span>
      </IonButton>
      <IonModal
        isOpen={isOpen}
        trigger={`view-leanRelease-modal-${transaction._id}`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:95%] lg:[--width:95%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader title="Loan Release - View Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content h-screen !p-2 space-y-1 flex flex-col">
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <LoanReleaseViewCard label="CV#" value={`${transaction.code}`} labelClassName="min-w-20 text-end !text-slate-600" />
              <LoanReleaseViewCard label="Center Code" value={transaction.center.centerNo} labelClassName="min-w-20 text-end !text-slate-600" />
              <LoanReleaseViewCard label="Name" value={transaction.center.description} labelClassName="min-w-20 text-end !text-slate-600" />
            </div>
            <div className="space-y-1">
              <LoanReleaseViewCard label="Date" value={formatDateTable(transaction.date)} labelClassName="min-w-28 text-end !text-slate-600" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                <LoanReleaseViewCard label="Account Month" value={`${transaction.acctMonth}`} labelClassName="min-w-28 text-end !text-slate-600" />
                <LoanReleaseViewCard label="Account Year" value={`${transaction.acctYear}`} labelClassName="min-w-28 text-end !text-slate-600" />
              </div>
              <LoanReleaseViewCard label="Number of Weeks" value={`${transaction.noOfWeeks}`} labelClassName="min-w-28 text-end !text-slate-600" />
              <LoanReleaseViewCard label="Type of Loan" value={`${transaction.loan.code}`} labelClassName="min-w-28 text-end !text-slate-600" />
            </div>
            <div className="space-y-1">
              <LoanReleaseViewCard label="Check Number" value={transaction.checkNo} labelClassName="min-w-28 text-end !text-slate-600" />
              <LoanReleaseViewCard label="Check Date" value={formatDateTable(transaction.checkDate)} labelClassName="min-w-28 text-end !text-slate-600" />
              <LoanReleaseViewCard label="Bank Code" value={transaction.bank.code} labelClassName="min-w-28 text-end !text-slate-600" />
              <LoanReleaseViewCard label="Amount" value={`${formatNumber(transaction.amount)}`} labelClassName="min-w-28 text-end !text-slate-600" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <LoanReleaseViewCard label="Particular" value={transaction.remarks} labelClassName="min-w-20 text-end !text-slate-600" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <LoanReleaseViewCard label="Cycle" value={`${transaction.cycle}`} labelClassName="min-w-28 text-end !text-slate-600" />
              <LoanReleaseViewCard label="Interest Rate" value={`${transaction.interest}`} labelClassName="min-w-28 text-end !text-slate-600" />
            </div>
          </div>
          <div>
            <LoanReleaseViewCard label="Encoded By" value={transaction.encodedBy.username} labelClassName="min-w-20 text-end !text-slate-600" containerClassName="max-w-40" />
          </div>

          <div className="flex-1">
            <ViewEntries isOpen={isOpen} transaction={transaction} />
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default ViewLoanRelease;

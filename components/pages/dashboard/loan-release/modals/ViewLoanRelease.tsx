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
        className="space-x-1 rounded-md w-20 h-7 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-orange-100 text-orange-900 capitalize min-h-4 text-xs"
        onClick={() => setIsOpen(true)}
      >
        <IonIcon icon={eye} className="text-xs" />
        <span>View</span>
      </IonButton>
      <IonModal
        isOpen={isOpen}
        trigger={`view-leanRelease-modal-${transaction._id}`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height [--max-width:84rem] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader title="Loan Release - View Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content h-[80vh] !p-6 space-y-1 flex flex-col">
            <ModalHeader title="Loan Release - View Record" sub="Manage loan release records." dismiss={dismiss} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 !mt-4">
            <div className="space-y-1">
              <LoanReleaseViewCard label="CV#" value={`${transaction.code}`} labelClassName=" w-24" />
              <LoanReleaseViewCard label="Center Code" value={transaction.center.centerNo} labelClassName="" />
              <LoanReleaseViewCard label="Name" value={transaction.center.description} labelClassName="" />
            </div>
            <div className="space-y-1">
              <LoanReleaseViewCard label="Date" value={formatDateTable(transaction.date)} labelClassName="" />
                <LoanReleaseViewCard label="Account Month" value={`${transaction.acctMonth}`} labelClassName="" />
                <LoanReleaseViewCard label="Account Year" value={`${transaction.acctYear}`} labelClassName="" />
              {/* <div className="grid grid-cols-1 lg:grid-cols-2 mr-l ">
                <LoanReleaseViewCard label="Account Month" value={`${transaction.acctMonth}`} labelClassName="" />
                <LoanReleaseViewCard label="Account Year" value={`${transaction.acctYear}`} labelClassName="" />
              </div> */}
              <LoanReleaseViewCard label="Number of Weeks" value={`${transaction.noOfWeeks}`} labelClassName="" />
              <LoanReleaseViewCard label="Type of Loan" value={`${transaction.loan.code}`} labelClassName="" />
            </div>
            <div className="space-y-1">
              <LoanReleaseViewCard label="Check Number" value={transaction.checkNo} labelClassName="" />
              <LoanReleaseViewCard label="Check Date" value={formatDateTable(transaction.checkDate)} labelClassName="" />
              <LoanReleaseViewCard label="Bank Code" value={transaction.bank.code} labelClassName="" />
              <LoanReleaseViewCard label="Amount" value={`${formatNumber(transaction.amount)}`} labelClassName="" />
            </div>

             <div className=" lg:hidden space-y-1">
              <LoanReleaseViewCard label="Particular" value={transaction.remarks} labelClassName="" />
              <LoanReleaseViewCard label="Cycle" value={`${transaction.cycle}`} labelClassName="" />
              <LoanReleaseViewCard label="Interest Rate" value={`${transaction.interest}`} labelClassName="" />
            </div>
          </div>
          <div className="hidden lg:grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <LoanReleaseViewCard label="Particular" value={transaction.remarks} labelClassName="" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <LoanReleaseViewCard label="Cycle" value={`${transaction.cycle}`} labelClassName="" />
              <LoanReleaseViewCard label="Interest Rate" value={`${transaction.interest}`} labelClassName="" />
            </div>
          </div>
          <div className=' pt-1'>
            <LoanReleaseViewCard label="Encoded By" value={transaction.encodedBy.username} labelClassName="" containerClassName="" />
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

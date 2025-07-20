import React, { useRef, useState } from 'react';
import { IonModal, IonHeader, IonToolbar, IonIcon, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonText } from '@ionic/react';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { eye } from 'ionicons/icons';
import LoanReleaseViewCard from '../components/LoanReleaseViewCard';
import { Entry, Transaction } from '../../../../../types/types';
import { formatDateTable } from '../../../../utils/date-utils';
import { formatNumber } from '../../../../ui/utils/formatNumber';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../../ui/table/Table';
import ViewEntries from '../components/ViewEntries';

const ViewLoanRelease = ({ transaction }: { transaction: Transaction }) => {
  const [isOpen, setIsOpen] = useState(false);

  const modal = useRef<HTMLIonModalElement>(null);

  function dismiss() {
    setIsOpen(false);
  }

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
      >
        <IonIcon icon={eye} className="text-[1rem]" /> View
      </div>
      <IonModal
        isOpen={isOpen}
        trigger={`view-leanRelease-modal-${transaction._id}`}
        backdropDismiss={false}
        className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:70%] lg:[--width:70%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader title="Loan Release - View Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content !p-2">
          <IonGrid>
            <IonRow>
              <IonCol size="6" className="space-y-1">
                <LoanReleaseViewCard label="CV#" value={`CV#${transaction.code}`} />
                <LoanReleaseViewCard label="Center Code" value={transaction.center.centerNo} />
                <LoanReleaseViewCard label="Name" value={transaction.center.description} />
                <LoanReleaseViewCard label="Particular" value={transaction.remarks} />
                <LoanReleaseViewCard label="Date" value={formatDateTable(transaction.date)} />
                <IonGrid className="ion-no-padding">
                  <IonRow className="gap-2">
                    <IonCol>
                      <LoanReleaseViewCard label="Account Month" value={`${transaction.acctMonth}`} />
                    </IonCol>
                    <IonCol>
                      <LoanReleaseViewCard label="Account Year" value={`${transaction.acctYear}`} />
                    </IonCol>
                  </IonRow>
                </IonGrid>
                <LoanReleaseViewCard label="Number of Weeks" value={`${transaction.noOfWeeks}`} />
                <LoanReleaseViewCard label="Encoded By" value={transaction.encodedBy.username} />
              </IonCol>
              <IonCol size="6" className="space-y-2">
                <LoanReleaseViewCard label="Type of Loan" value={`${transaction.loan.code}`} />
                <LoanReleaseViewCard label="Check Number" value={transaction.checkNo} />
                <LoanReleaseViewCard label="Check Date" value={formatDateTable(transaction.checkDate)} />
                <LoanReleaseViewCard label="Bank Code" value={transaction.bank.description} />
                <LoanReleaseViewCard label="Amount" value={`${formatNumber(transaction.amount)}`} />
                <LoanReleaseViewCard label="Cycle" value={`${transaction.cycle}`} />
                <LoanReleaseViewCard label="Interest Rate" value={`${transaction.interest}`} />
              </IonCol>
            </IonRow>
          </IonGrid>
          <div>
            <ViewEntries isOpen={isOpen} transaction={transaction} />
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default ViewLoanRelease;

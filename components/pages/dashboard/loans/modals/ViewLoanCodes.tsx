import React, { useRef } from 'react';
import { IonModal, IonHeader, IonToolbar, IonIcon } from '@ionic/react';
import { document } from 'ionicons/icons';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { Loan, LoanCode } from '../../../../../types/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../../ui/table/Table';

const ViewLoanCodes = ({ loan }: { loan: Loan }) => {
  const modal = useRef<HTMLIonModalElement>(null);

  function dismiss() {
    modal.current?.dismiss();
  }

  return (
    <>
      <div className="text-end">
        <div
          id={`view-loan-code-${loan._id}`}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={document} className="text-[1rem]" /> View Loan Codes
        </div>
      </div>
      <IonModal
        ref={modal}
        trigger={`view-loan-code-${loan._id}`}
        backdropDismiss={false}
        className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:70%] lg:[--width:70%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader title="Product - View Loan Code Record" sub="System" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content">
          <div className="mt-2">
            <div className="relative overflow-auto">
              <Table>
                <TableHeader>
                  <TableHeadRow className="border-b-0 bg-slate-100">
                    <TableHead>Module</TableHead>
                    <TableHead>Loan Type</TableHead>
                    <TableHead>Account Code</TableHead>
                    <TableHead className="max-w-10">Sort Order</TableHead>
                  </TableHeadRow>
                </TableHeader>
                <TableBody>
                  {loan.loanCodes.map((loanCode: LoanCode) => (
                    <TableRow key={loanCode._id} className="border-b-0">
                      <TableCell className="border-4 border-slate-100 align-top max-w-40 min-w-40">{loanCode.module}</TableCell>
                      <TableCell className="border-4 border-slate-100 align-top max-w-40 min-w-40">{loanCode.loanType}</TableCell>
                      <TableCell className="border-4 border-slate-100 align-top">
                        {loanCode.acctCode.code} - {loanCode.acctCode.description}
                      </TableCell>
                      <TableCell className="border-4 border-slate-100 align-top max-w-24 min-w-24">{loanCode.sortOrder}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default ViewLoanCodes;

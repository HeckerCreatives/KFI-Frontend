import React, { useRef } from 'react';
import { IonModal, IonHeader, IonToolbar, IonIcon, IonButton } from '@ionic/react';
import ModalHeader from '../../../../../ui/page/ModalHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../../../ui/table/Table';
import { caretUpCircle } from 'ionicons/icons';

const UpdateCVExpenseVoucher = ({ index }: { index: number }) => {
  const arrDummy: string[] = Array.from(Array(10)).fill('');

  const modal = useRef<HTMLIonModalElement>(null);

  function dismiss() {
    modal.current?.dismiss();
  }

  return (
    <>
      <div className="text-end">
        <div
          id={`update-cvNoExpenseVoucher-modal-${index}`}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={caretUpCircle} className="text-[1rem]" /> Edit CV #
        </div>
      </div>
      <IonModal
        ref={modal}
        trigger={`update-cvNoExpenseVoucher-modal-${index}`}
        backdropDismiss={false}
        className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:70%] lg:[--width:70%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader title="Transaction - Expense Voucher - Edit CV#" sub="All Actions" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content !p-3">
          <div className="relative overflow-auto">
            <Table>
              <TableHeader>
                <TableHeadRow className="border-b-0 bg-slate-100">
                  <TableHead>Customer</TableHead>
                  <TableHead>CV#</TableHead>
                  <TableHead>Center No.</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Account Code</TableHead>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Debit</TableHead>
                  <TableHead>Credit</TableHead>
                  <TableHead>CV# for Advance Loan</TableHead>
                </TableHeadRow>
              </TableHeader>
              <TableBody>
                {arrDummy.map((arr: string, i: number) => (
                  <TableRow key={i} className="border-b-0">
                    <TableCell className="border-4 border-slate-100">Aaron Joseph G. Yulong</TableCell>
                    <TableCell className="border-4 border-slate-100">CV#11257</TableCell>
                    <TableCell className="border-4 border-slate-100">0306</TableCell>
                    <TableCell className="border-4 border-slate-100">06/29/2011</TableCell>
                    <TableCell className="border-4 border-slate-100">20001A</TableCell>
                    <TableCell className="border-4 border-slate-100">Loans Receivable - Socialized</TableCell>
                    <TableCell className="border-4 border-slate-100">5,000.00</TableCell>
                    <TableCell className="border-4 border-slate-100">5,000.00</TableCell>
                    <TableCell className="border-4 border-slate-100"></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="text-end pt-3 pb-2">
            <IonButton fill="clear" id="create-loan-modal" className="max-h-10 min-h-10 w-32 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
              Print
            </IonButton>
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default UpdateCVExpenseVoucher;

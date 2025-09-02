import { IonButton, IonHeader, IonIcon, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useRef, useState } from 'react';
import kfiAxios from '../../../../utils/axios';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import PrintExportFilterForm from '../components/PrintExportFilterForm';
import { Transaction } from '../../../../../types/types';
import { print } from 'ionicons/icons';
import PrintExportOptionForm from '../components/PrintExportOptionForm';
import { PrinterIcon } from 'hugeicons-react';

export const loanReleaseOptionSchema = z.object({
  option: z.string().optional().or(z.literal('')),
});

export type LoanReleaseOptionFormData = z.infer<typeof loanReleaseOptionSchema>;

const PrintLoanRelease = ({ transaction }: { transaction: Transaction }) => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);

  const modal = useRef<HTMLIonModalElement>(null);

  const form = useForm<LoanReleaseOptionFormData>({
    resolver: zodResolver(loanReleaseOptionSchema),
    defaultValues: {
      option: 'summary',
    },
  });

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }

  async function handlePrint(data: LoanReleaseOptionFormData) {
    try {
      setLoading(true);
      const result = await kfiAxios.get(`/transaction/print/file/${transaction._id}`, { responseType: 'blob' });
      const pdfBlob = new Blob([result.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
    } catch (error: any) {
      present({
        message: 'Failed to print the loan release records. Please try again',
        duration: 1000,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* <div
        id={`print_loan_release_${transaction._id}`}
        className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
      >
        <IonIcon icon={print} className="text-[1rem]" /> Print
      </div> */}
      <IonButton
        id={`print_loan_release_${transaction._id}`}
        type="button"
        fill="clear"
        className="space-x-1 rounded-md w-16 h-7 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-purple-50 text-purple-900 capitalize min-h-4 text-xs"
      >
        <IonIcon icon={print} className="text-xs" />
        <span>Print</span>
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`print_loan_release_${transaction._id}`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height [--max-width:24rem] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Loan Release - Print" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6">
            <ModalHeader disabled={loading} title="Loan Release - Print" sub="Manage loan release documents." dismiss={dismiss} />

          <form onSubmit={form.handleSubmit(handlePrint)}>
            {/* <PrintExportOptionForm form={form} loading={loading} /> */}
            <div className="mt-3">
              <IonButton disabled={loading} type="submit" fill="clear" className="w-full bg-[#FA6C2F] text-white rounded-md font-semibold capitalize">
                <PrinterIcon size={20} stroke='.8' className=' mr-1'/>
                {loading ? 'Printing Loan Release...' : 'Print Loan Release'}
              </IonButton>
            </div>
          </form>
        </div>
      </IonModal>
    </>
  );
};

export default PrintLoanRelease;

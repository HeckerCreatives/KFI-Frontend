import { IonButton, IonHeader, IonIcon, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useRef, useState } from 'react';
import kfiAxios from '../../../../utils/axios';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Transaction } from '../../../../../types/types';
import { fileTrayFullSharp, print } from 'ionicons/icons';
import PrintExportOptionForm from '../components/PrintExportOptionForm';
import { FileExportIcon, PrinterIcon } from 'hugeicons-react';

export const loanReleaseOptionSchema = z.object({
  option: z.string().optional().or(z.literal('')),
});

export type LoanReleaseOptionFormData = z.infer<typeof loanReleaseOptionSchema>;

const ExportLoanRelease = ({ transaction }: { transaction: Transaction }) => {
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
    setLoading(true);
    try {
      if(data.option === 'summary'){
         const result = await kfiAxios.get(`/transaction/export/file/${transaction._id}`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([result.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'loan-release.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
         const result = await kfiAxios.get(`/transaction/export/file-format/${transaction._id}`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([result.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'loan-release.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      }
     
    } catch (error: any) {
      present({
        message: 'Failed to export the loan release records. Please try again',
        duration: 1000,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* <div
        id={`export_loan_release_${transaction._id}`}
        className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
      >
        <IonIcon icon={fileTrayFullSharp} className="text-[1rem]" /> Export
      </div> */}
      <IonButton
        id={`export_loan_release_${transaction._id}`}
        type="button"
        fill="clear"
        className="space-x-1 w-20 h-7 rounded-md ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-pink-50 text-pink-900 capitalize min-h-4 text-xs"
      >
        <IonIcon icon={fileTrayFullSharp} className="text-xs" />
        <span>Export</span>
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`export_loan_release_${transaction._id}`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height [--max-width:24rem] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Loan Release - Export" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6">
            <ModalHeader disabled={loading} title="Loan Release - Export" sub="Manage loan release documents." dismiss={dismiss} />

          <form onSubmit={form.handleSubmit(handlePrint)}>
            <PrintExportOptionForm form={form} loading={loading} />
            <div className="mt-3">
              <IonButton disabled={loading} type="submit" fill="clear" className="w-full bg-[#FA6C2F] text-white rounded-md font-semibold capitalize">
                <FileExportIcon size={20} stroke='.8' className=' mr-1'/>
                {loading ? 'Exporting Loan Release...' : 'Export Loan Release'}
              </IonButton>
            </div>
          </form>
        </div>
      </IonModal>
    </>
  );
};

export default ExportLoanRelease;

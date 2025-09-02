import { IonButton, IonHeader, IonIcon, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useRef, useState } from 'react';
import kfiAxios from '../../../../../utils/axios';
import ModalHeader from '../../../../../ui/page/ModalHeader';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { JournalVoucher } from '../../../../../../types/types';
import { print } from 'ionicons/icons';
import PrintExportOptionForm from '../../components/PrintExportOptionForm';
import { PrinterIcon } from 'hugeicons-react';

export const journalVoucherOptionSchema = z.object({
  option: z.string().optional().or(z.literal('')),
});

export type JournalVoucherOptionFormData = z.infer<typeof journalVoucherOptionSchema>;

const PrintJournalVoucher = ({ journalVoucher }: { journalVoucher: JournalVoucher }) => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);

  const modal = useRef<HTMLIonModalElement>(null);

  const form = useForm<JournalVoucherOptionFormData>({
    resolver: zodResolver(journalVoucherOptionSchema),
    defaultValues: {
      option: 'summary',
    },
  });

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }

  async function handlePrint(data: JournalVoucherOptionFormData) {
    try {
      setLoading(true);
      const result = await kfiAxios.get(`/journal-voucher/print/file/${journalVoucher._id}`, { responseType: 'blob' });
      const pdfBlob = new Blob([result.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
    } catch (error: any) {
      present({
        message: 'Failed to print the expense voucher records. Please try again',
        duration: 1000,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* <div
        id={`print_journal_voucher_${journalVoucher._id}`}
        className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
      >
        <IonIcon icon={print} className="text-[1rem]" /> Print
      </div> */}
      <IonButton
        id={`print_journal_voucher_${journalVoucher._id}`}
        type="button"
        fill="clear"
        className="space-x-1 rounded-md w-16 h-7 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-purple-50 text-purple-900 capitalize min-h-4 text-xs"
      >
        <IonIcon icon={print} className="text-xs" />
        <span>Print</span>
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`print_journal_voucher_${journalVoucher._id}`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:30rem] md:[--width:100%] lg:[--max-width:30rem] lg:[--width:50%] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Journal Voucher - Print" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6">
            <ModalHeader disabled={loading} title="Journal Voucher - Print" sub="Manage journal voucher documents." dismiss={dismiss} />

          <form onSubmit={form.handleSubmit(handlePrint)} className=' mt-4'>
            {/* <PrintExportOptionForm form={form} loading={loading} /> */}
            <div className="mt-3">
              <IonButton disabled={loading} type="submit" fill="clear" className="w-full bg-[#FA6C2F] text-white rounded-md font-semibold capitalize">
                <PrinterIcon size={20} stroke='.8' className=' mr-1'/>
                {loading ? 'Printing Journal Voucher...' : 'Print Journal Voucher'}
              </IonButton>
            </div>
          </form>
        </div>
      </IonModal>
    </>
  );
};

export default PrintJournalVoucher;

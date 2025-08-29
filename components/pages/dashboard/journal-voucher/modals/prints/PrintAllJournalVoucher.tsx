import { IonButton, IonHeader, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useRef, useState } from 'react';
import kfiAxios from '../../../../../utils/axios';
import ModalHeader from '../../../../../ui/page/ModalHeader';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import PrintExportFilterForm from '../../components/PrintExportFilterForm';
import { PrinterIcon } from 'hugeicons-react';

export const journalVoucherFilterSchema = z.object({
  docNoFrom: z.string().optional().or(z.literal('')),
  docNoFromLabel: z.string().optional().or(z.literal('')),
  docNoTo: z.string().optional().or(z.literal('')),
  docNoToLabel: z.string().optional().or(z.literal('')),
  option: z.string().optional().or(z.literal('')),
});

export type JournalVoucherFilterFormData = z.infer<typeof journalVoucherFilterSchema>;

const PrintAllJournalVoucher = () => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);

  const modal = useRef<HTMLIonModalElement>(null);

  const form = useForm<JournalVoucherFilterFormData>({
    resolver: zodResolver(journalVoucherFilterSchema),
    defaultValues: {
      docNoFrom: '',
      docNoFromLabel: '',
      docNoTo: '',
      docNoToLabel: '',
      option: 'summary',
    },
  });

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }

  async function handlePrint(data: JournalVoucherFilterFormData) {
    try {
      const params = { docNoFrom: data.docNoFromLabel, docNoTo: data.docNoToLabel };
      setLoading(true);
      const result = await kfiAxios.get(`/journal-voucher/print-all/${data.option}`, { params: params, responseType: 'blob' });
      const pdfBlob = new Blob([result.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
    } catch (error: any) {
      present({
        message: 'Failed to print the journal voucher records. Please try again',
        duration: 1000,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <IonButton fill="clear" id="print_all_journal_voucher" className="max-h-10 w-32 min-w-32 max-w-32 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
        <PrinterIcon size={15} stroke='.8' className=' mr-2'/>
        Print All
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`print_all_journal_voucher`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height [--max-width:30rem] [--width:95%] "
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Journal Voucher - Print All" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6">
            <ModalHeader disabled={loading} title="Journal Voucher - Print All" sub="Manage journal voucher documents." dismiss={dismiss} />

          <form onSubmit={form.handleSubmit(handlePrint)} className=' mt-4'>
            <PrintExportFilterForm form={form} loading={loading} />
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

export default PrintAllJournalVoucher;

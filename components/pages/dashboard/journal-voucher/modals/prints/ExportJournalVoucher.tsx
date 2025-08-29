import { IonButton, IonHeader, IonIcon, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useRef, useState } from 'react';
import kfiAxios from '../../../../../utils/axios';
import ModalHeader from '../../../../../ui/page/ModalHeader';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { JournalVoucher } from '../../../../../../types/types';
import { fileTrayFullSharp } from 'ionicons/icons';
import PrintExportOptionForm from '../../components/PrintExportOptionForm';
import { FileExportIcon } from 'hugeicons-react';

export const exportVoucherOptionSchema = z.object({
  option: z.string().optional().or(z.literal('')),
});

export type ExportVoucherOptionFormData = z.infer<typeof exportVoucherOptionSchema>;

const ExportJournalVoucher = ({ journalVoucher }: { journalVoucher: JournalVoucher }) => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);

  const modal = useRef<HTMLIonModalElement>(null);

  const form = useForm<ExportVoucherOptionFormData>({
    resolver: zodResolver(exportVoucherOptionSchema),
    defaultValues: {
      option: 'summary',
    },
  });

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }

  async function handlePrint(data: ExportVoucherOptionFormData) {
    setLoading(true);
    try {
      const result = await kfiAxios.get(`/journal-voucher/export/${data.option}/${journalVoucher._id}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([result.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'journal-voucher.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      present({
        message: 'Failed to export the journal voucher records. Please try again',
        duration: 1000,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* <div
        id={`export_journal_voucher_${journalVoucher._id}`}
        className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
      >
        <IonIcon icon={fileTrayFullSharp} className="text-[1rem]" /> Export
      </div> */}
      <IonButton
        id={`export_journal_voucher_${journalVoucher._id}`}
        type="button"
        fill="clear"
        className="space-x-1 w-20 h-7 rounded-md ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-pink-50 text-pink-900 capitalize min-h-4 text-xs"
      >
        <IonIcon icon={fileTrayFullSharp} className="text-xs" />
        <span>Export</span>
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`export_journal_voucher_${journalVoucher._id}`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:30rem] md:[--width:100%] lg:[--max-width:30rem] lg:[--width:50%] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Journal Voucher - Export" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6">
            <ModalHeader disabled={loading} title="Journal Voucher - Export" sub="Manage journal voucher documents." dismiss={dismiss} />

          <form onSubmit={form.handleSubmit(handlePrint)} className='mt-4'>
            <PrintExportOptionForm form={form} loading={loading} />
            <div className="mt-3">
              <IonButton disabled={loading} type="submit" fill="clear" className="w-full bg-[#FA6C2F] text-white rounded-md font-semibold capitalize">
                <FileExportIcon size={20} stroke='.8' className=' mr-1'/>
                {loading ? 'Exporting Journal Voucher...' : 'Export Journal Voucher'}
              </IonButton>
            </div>
          </form>
        </div>
      </IonModal>
    </>
  );
};

export default ExportJournalVoucher;

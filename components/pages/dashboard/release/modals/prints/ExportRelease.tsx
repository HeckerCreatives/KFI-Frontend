import { IonButton, IonHeader, IonIcon, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useRef, useState } from 'react';
import kfiAxios from '../../../../../utils/axios';
import ModalHeader from '../../../../../ui/page/ModalHeader';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { fileTrayFullSharp } from 'ionicons/icons';
import PrintExportOptionForm from '../../components/PrintExportOptionForm';
import { Release } from '../../../../../../types/types';
import { FileExportIcon } from 'hugeicons-react';

export const releaseOptionSchema = z.object({
  option: z.string().optional().or(z.literal('')),
});

export type ReleaseOptionFormData = z.infer<typeof releaseOptionSchema>;

const ExportRelease = ({ release }: { release: Release }) => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);

  const modal = useRef<HTMLIonModalElement>(null);

  const form = useForm<ReleaseOptionFormData>({
    resolver: zodResolver(releaseOptionSchema),
    defaultValues: {
      option: 'summary',
    },
  });

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }


    async function handlePrint() {
        setLoading(true);
        try {
            const result = await kfiAxios.get(`/release/export/file/${release._id}`, { responseType: 'blob' });
          const url = window.URL.createObjectURL(new Blob([result.data]));
          const a = document.createElement('a');
          a.href = url;
          a.download = 'clients.xlsx';
          a.click();
          window.URL.revokeObjectURL(url);
        } catch (error: any) {
          present({
            message: 'Failed to export the clients records. Please try again',
            duration: 1000,
          });
        } finally {
          setLoading(false);
        }
      }

  return (
    <>
      {/* <div
        id={`export_release_${release._id}`}
        className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
      >
        <IonIcon icon={fileTrayFullSharp} className="text-[1rem]" /> Export
      </div> */}
      <IonButton
        id={`export_release_${release._id}`}
        type="button"
        fill="clear"
        className="space-x-1 w-20 h-7 rounded-md ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-pink-50 text-pink-900 capitalize min-h-4 text-xs"
      >
        <IonIcon icon={fileTrayFullSharp} className="text-xs" />
        <span>Export</span>
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`export_release_${release._id}`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:30rem] md:[--width:100%] lg:[--max-width:30rem] lg:[--width:40%] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Acknowledgement - Export" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6">
          <ModalHeader disabled={loading} title="Acknowledgement - Export" sub="Manage acknowledgement documents" dismiss={dismiss} />
          <form onSubmit={form.handleSubmit(handlePrint)} className=' mt-4'>
            {/* <PrintExportOptionForm form={form} loading={loading} /> */}
            <div className="mt-3">
              <IonButton disabled={loading} type="submit" fill="clear" className="w-full bg-[#FA6C2F] text-white rounded-md font-semibold capitalize">
                <FileExportIcon size={15} stroke='.8' className=' mr-1'/>
                {loading ? 'Exporting Acknowledgement...' : 'Export Acknowledgement'}
              </IonButton>
            </div>
          </form>
        </div>
      </IonModal>
    </>
  );
};

export default ExportRelease;

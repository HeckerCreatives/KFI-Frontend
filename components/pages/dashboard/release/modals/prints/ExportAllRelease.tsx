import { IonButton, IonHeader, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useRef, useState } from 'react';
import kfiAxios from '../../../../../utils/axios';
import ModalHeader from '../../../../../ui/page/ModalHeader';
import { useForm } from 'react-hook-form';
import PrintExportFilterForm from '../../components/PrintExportFilterForm';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export const releaseFilterSchema = z.object({
  docNoFrom: z.string().optional().or(z.literal('')),
  docNoFromLabel: z.string().optional().or(z.literal('')),
  docNoTo: z.string().optional().or(z.literal('')),
  docNoToLabel: z.string().optional().or(z.literal('')),
  option: z.string().optional().or(z.literal('')),
});

export type ReleaseFilterFormData = z.infer<typeof releaseFilterSchema>;

const ExportAllRelease = () => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);

  const modal = useRef<HTMLIonModalElement>(null);

  function dismiss() {
    modal.current?.dismiss();
  }

  const form = useForm<ReleaseFilterFormData>({
    resolver: zodResolver(releaseFilterSchema),
    defaultValues: {
      docNoFrom: '',
      docNoFromLabel: '',
      docNoTo: '',
      docNoToLabel: '',
      option: 'summary',
    },
  });

  async function handlePrint(data: ReleaseFilterFormData) {
    setLoading(true);
    try {
      const params = { docNoFrom: data.docNoFromLabel, docNoTo: data.docNoToLabel };
      const result = await kfiAxios.get(`/release/export-all/${data.option}`, { params, responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([result.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'releases.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      present({
        message: 'Failed to export the release records. Please try again',
        duration: 1000,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <IonButton fill="clear" id="export_all_releases" className="max-h-10 w-32 min-w-32 max-w-32 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
        Export All
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`export_all_releases`}
        backdropDismiss={false}
        className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:50%] lg:[--width:50%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader disabled={loading} title="Release - Export All" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content">
          <form onSubmit={form.handleSubmit(handlePrint)}>
            <PrintExportFilterForm form={form} loading={loading} />
            <div className="mt-3">
              <IonButton disabled={loading} type="submit" fill="clear" className="w-full bg-[#FA6C2F] text-white rounded-md font-semibold">
                {loading ? 'Exporting Release...' : 'Export Release'}
              </IonButton>
            </div>
          </form>
        </div>
      </IonModal>
    </>
  );
};

export default ExportAllRelease;

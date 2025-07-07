import { IonButton, IonHeader, IonIcon, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useRef, useState } from 'react';
import kfiAxios from '../../../../../utils/axios';
import ModalHeader from '../../../../../ui/page/ModalHeader';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Acknowledgement, ExpenseVoucher } from '../../../../../../types/types';
import { print } from 'ionicons/icons';
import PrintExportOptionForm from '../../components/PrintExportOptionForm';

export const acknowledgementOptionSchema = z.object({
  option: z.string().optional().or(z.literal('')),
});

export type AcknowledgementOptionFormData = z.infer<typeof acknowledgementOptionSchema>;

const PrintAcknowledgement = ({ acknowledgement }: { acknowledgement: Acknowledgement }) => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);

  const modal = useRef<HTMLIonModalElement>(null);

  const form = useForm<AcknowledgementOptionFormData>({
    resolver: zodResolver(acknowledgementOptionSchema),
    defaultValues: {
      option: 'summary',
    },
  });

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }

  async function handlePrint(data: AcknowledgementOptionFormData) {
    try {
      setLoading(true);
      const result = await kfiAxios.get(`/acknowledgement/print/${data.option}/${acknowledgement._id}`, { responseType: 'blob' });
      const pdfBlob = new Blob([result.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
    } catch (error: any) {
      present({
        message: 'Failed to print the acknowledgement records. Please try again',
        duration: 1000,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div
        id={`print_acknowledgement_${acknowledgement._id}`}
        className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
      >
        <IonIcon icon={print} className="text-[1rem]" /> Print
      </div>
      <IonModal
        ref={modal}
        trigger={`print_acknowledgement_${acknowledgement._id}`}
        backdropDismiss={false}
        className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:50%] lg:[--width:50%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader disabled={loading} title="Acknowledgement - Print" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content">
          <form onSubmit={form.handleSubmit(handlePrint)}>
            <PrintExportOptionForm form={form} loading={loading} />
            <div className="mt-3">
              <IonButton disabled={loading} type="submit" fill="clear" className="w-full bg-[#FA6C2F] text-white rounded-md font-semibold">
                {loading ? 'Printing Acknowledgement...' : 'Print Acknowledgement'}
              </IonButton>
            </div>
          </form>
        </div>
      </IonModal>
    </>
  );
};

export default PrintAcknowledgement;

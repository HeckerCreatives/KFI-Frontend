import { IonButton, IonHeader, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useRef, useState } from 'react';
import kfiAxios from '../../../../utils/axios';
import ModalHeader from '../../../../ui/page/ModalHeader';

const ExportAllCenter = () => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);

  const modal = useRef<HTMLIonModalElement>(null);

  function dismiss() {
    modal.current?.dismiss();
  }

  async function handlePrint() {
    setLoading(true);
    try {
      const result = await kfiAxios.get(`/center/export-all`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([result.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'centers.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      present({
        message: 'Failed to export the center records. Please try again',
        duration: 1000,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <IonButton fill="clear" id="export_all_center" className="max-h-10 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
        Export
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`export_all_center`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:30rem] md:[--width:100%] lg:[--max-width:30rem] lg:[--width:40%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Center - Export All" sub="System" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content">
          <div></div>
          <div className="text-end border-t mt-2 pt-1 space-x-2">
            <div className="text-center">
              <IonButton disabled={loading} onClick={handlePrint} fill="clear" className="w-full bg-[#FA6C2F] text-white rounded-md max-w-[70%] font-semibold">
                {loading ? 'Exporting Center List...' : 'Center List'}
              </IonButton>
            </div>
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default ExportAllCenter;

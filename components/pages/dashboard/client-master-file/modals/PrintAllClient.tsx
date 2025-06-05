import { IonButton, IonHeader, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useRef, useState } from 'react';
import kfiAxios from '../../../../utils/axios';
import ModalHeader from '../../../../ui/page/ModalHeader';

const PrintAllClient = () => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);

  const modal = useRef<HTMLIonModalElement>(null);

  function dismiss() {
    modal.current?.dismiss();
  }

  async function handlePrintClientProfile() {
    setLoading(true);
    try {
      const result = await kfiAxios.get(`/customer/print-all`, { responseType: 'blob' });
      const pdfBlob = new Blob([result.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
    } catch (error: any) {
      present({
        message: 'Failed to print the client profile records. Please try again',
        duration: 1000,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <IonButton fill="clear" id="print_all_client" className="max-h-10 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
        Print
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`print_all_client`}
        backdropDismiss={false}
        className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:50%] lg:[--width:50%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader disabled={loading} title="Client - Print All" sub="System" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content">
          <div></div>
          <div className="text-end border-t mt-2 pt-1 space-x-2">
            <div className="text-center">
              <IonButton disabled={loading} onClick={handlePrintClientProfile} fill="clear" className="w-full bg-[#FA6C2F] text-white rounded-md max-w-[70%] font-semibold">
                {loading ? 'Printing Client Profile...' : 'Client Profile'}
              </IonButton>
            </div>
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default PrintAllClient;

import { IonButton, IonHeader, IonIcon, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useRef, useState } from 'react';
import kfiAxios from '../../../../utils/axios';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { ClientMasterFile } from '../../../../../types/types';
import { print } from 'ionicons/icons';

const PrintClient = ({ client }: { client: ClientMasterFile }) => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);

  const modal = useRef<HTMLIonModalElement>(null);

  function dismiss() {
    modal.current?.dismiss();
  }

  async function handlePrintClientProfile() {
    setLoading(true);
    try {
      const result = await kfiAxios.get(`/customer/print/${client._id}`, { responseType: 'blob' });
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
      <div className="text-end">
        <div
          id={`print_client_${client._id}`}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={print} className="text-[1rem]" /> Print
        </div>
      </div>
      <IonModal
        ref={modal}
        trigger={`print_client_${client._id}`}
        backdropDismiss={false}
        className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:50%] lg:[--width:50%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Client - Print" sub="System" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content">
          <div></div>
          <div className="text-end border-t mt-2 pt-1 space-x-2">
            <div className="text-center">
              <IonButton disabled={loading} onClick={handlePrintClientProfile} fill="clear" className="w-full bg-[#FA6C2F] text-white rounded-md max-w-[70%] font-semibold">
                {loading ? 'Printing Client Profile...' : 'Client Profile'}
              </IonButton>
              <IonButton fill="clear" className="w-full bg-[#FA6C2F] text-white rounded-md max-w-[70%] font-semibold">
                {/* {loading ? 'Printing Statement of Account...' : 'Statement of Account'} */}
                Statement Of Account
              </IonButton>
            </div>
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default PrintClient;

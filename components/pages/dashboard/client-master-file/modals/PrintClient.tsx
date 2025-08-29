import { IonButton, IonHeader, IonIcon, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useRef, useState } from 'react';
import kfiAxios from '../../../../utils/axios';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { ClientMasterFile } from '../../../../../types/types';
import { print } from 'ionicons/icons';
import { PrinterIcon } from 'hugeicons-react';

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
      {/* <div className="text-end">
        <div
          id={`print_client_${client._id}`}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={print} className="text-[1rem]" /> Print
        </div>
      </div> */}
      <IonButton
        type="button"
        fill="clear"
        id={`print_client_${client._id}`}
        className="space-x-1 rounded-md w-16 h-7 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-purple-100 text-purple-900 capitalize min-h-4 text-xs"
      >
        <IonIcon icon={print} className="text-xs" />
        <span>Print</span>
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`print_client_${client._id}`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height [--max-width:24rem] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Client - Print" sub="System" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6">
            <ModalHeader disabled={loading} title="Client - Print" sub="Manage client documents." dismiss={dismiss} />

          <div></div>
          <div className="text-end mt-4 flex flex-col gap-2">
            <div className="text-center">
              <IonButton disabled={loading} onClick={handlePrintClientProfile} fill="clear" className="w-full bg-zinc-50 rounded-lg ">
                {/* {loading ? 'Printing Client Profile...' : 'Client Profile'} */}
                <div className=' flex items-center justify-center gap-2 bg-zinc-50 !border-zinc-300 !border-1 p-3 w-full rounded-md'>
                  <div className=' p-2 bg-green-100 rounded-md flex items-center text-green-800'>
                    <PrinterIcon size={20} stroke='.8' className=' '/>
                  </div>
                  <div className=' flex flex-col !text-sm !text-black !font-medium capitalize text-start'>
                    {loading ? 'Printing Client Profiles...' : 'Client Profiles'}
                    <p className=' text-xs text-zinc-500 capitalize'>Portable Document Format</p>

                  </div>
                </div>
              </IonButton>
              <IonButton fill="clear" className="w-full bg-zinc-50 rounded-lg ">
                {/* {loading ? 'Printing Statement of Account...' : 'Statement of Account'} */}
                {/* Statement Of Account */}
                 <div className=' flex items-center justify-center gap-2 bg-zinc-50 !border-zinc-300 !border-1 p-3 w-full rounded-md'>
                  <div className=' p-2 bg-red-100 rounded-md flex items-center text-red-500'>
                    <PrinterIcon size={20} stroke='.8' className=' '/>
                  </div>
                  <div className=' flex flex-col !text-sm !text-black !font-medium capitalize text-start'>
                    {loading ? 'Printing...' : 'Statement of Account'}
                    <p className=' text-xs text-zinc-500 capitalize'>Portable Document Format</p>

                  </div>
                </div>
              </IonButton>
            </div>
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default PrintClient;

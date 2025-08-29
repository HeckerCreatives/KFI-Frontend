import { IonButton, IonHeader, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useRef, useState } from 'react';
import kfiAxios from '../../../../utils/axios';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { FileExportIcon } from 'hugeicons-react';

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
        <FileExportIcon size={15} stroke='.8' className=' mr-1'/>

        Export
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`export_all_center`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:30rem] md:[--width:100%] lg:[--max-width:30rem] lg:[--width:40%] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Center - Export All" sub="System" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6">
            <ModalHeader disabled={loading} title="Center - Export All" sub="System" dismiss={dismiss} />

          <div></div>
          <div className="text-end mt-4 space-x-2">
            <div className="text-center">
              <IonButton disabled={loading} onClick={handlePrint} fill="clear" className="w-full bg-zinc-50 rounded-lg ">
                <div className=' flex items-center justify-center gap-2 bg-zinc-50 !border-zinc-300 !border-1 p-3 w-full rounded-md'>
                  <div className=' p-2 bg-green-100 rounded-md flex items-center text-green-800'>
                    <FileExportIcon size={20} stroke='.8' className=' '/>
                  </div>
                  <div className=' flex flex-col !text-sm !text-black !font-medium capitalize text-start'>
                    {loading ? 'Exporting Center List...' : 'Center List'}
                    <p className=' text-xs text-zinc-500 capitalize'>Spreadsheet Format</p>

                  </div>
                </div>
                {/* {loading ? 'Printing Client Profile...' : 'Client Profile'} */}
              </IonButton>
            </div>
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default ExportAllCenter;

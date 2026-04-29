import { IonButton, IonHeader, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import kfiAxios from '../../../../utils/axios';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { FileExportIcon } from 'hugeicons-react';
import { useJobStore } from '../../../../../store/fileQueStore';
import { Socket, io } from 'socket.io-client';

const ExportAllCenter = () => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);

  const modal = useRef<HTMLIonModalElement>(null);
  const [jobId, setJobId] = useState('')
  const {addJob, updateJob} = useJobStore()
  const socketRef = useRef<Socket | null>(null)

  function dismiss() {
    modal.current?.dismiss();
  }

  async function handlePrint() {
  setLoading(true);
  try {
    const result = await kfiAxios.get(`/center/export-all`, {
      responseType: 'arraybuffer',
      validateStatus: (status: number) => [200, 202].includes(status),
    });

    if (result.status === 200) {
      const blob = new Blob([result.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'centers.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

    } else if (result.status === 202) {
      const text = new TextDecoder().decode(result.data);
      const { jobId } = JSON.parse(text);
      setJobId(jobId);
      dismiss()
    }

  } catch (error: any) {
    present({
      message: 'Failed to export the center records. Please try again',
      duration: 1000,
    });
  } finally {
    setLoading(false);
  }
}

     useEffect(() => {
        socketRef.current = io(`${process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5005'}`,
          {
      reconnection: true,
      transports: ['websocket', 'polling'],
      withCredentials: true
    }
        )
        const socket = socketRef.current
        socket.on('connect', () => {
          console.log('Socket connected:', socket.id)
        })
        return () => {
          socket.disconnect()
        }
      }, [])
    
      useEffect(() => {
        const socket = socketRef.current
        if (!socket || !jobId) return
        console.log('Joining job:', jobId)
        socket.emit('join:report', jobId)
        socket.off('report:progress')
        socket.off('report:complete')
    
        const existing = useJobStore
            .getState()
            .jobs.find((j) => j.jobId === jobId)
          if (!existing) {
            addJob({
              jobId,
              label: `Centers `,
              type: 'export',
              progress: 0,
              status: 'processing',
              fileType: 'excel',
              file: '',
              filename: '',
            })
          }
    
    
          const handleProgress = (data: any) => {
            if (data.jobId !== jobId) return
            console.log('Progress event:', data)
    
            const percent = data.percent ?? data.progress ?? 0
    
    
            updateJob(jobId, {
              progress: percent,
              status: 'processing',
            })
    
          }
    
          const handleReady = (data: any) => {
            if (data.jobId !== jobId) return;
    
            console.log('Ready:', data);
    
    
            let url: string;
            if (typeof data.file === 'string') {
              const binary = atob(data.file);
              const bytes = new Uint8Array(binary.length);
              for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
              }
              const blob = new Blob([bytes], { type: 'application/pdf' });
              url = URL.createObjectURL(blob);
            } else {
              console.error('Expected base64 string, got:', typeof data.file);
              return;
            }
    
            updateJob(jobId, {
              progress: 100,
              status: 'done',
              file: url,
              filename: data.filename,
              fileUrl: url,
            });
          };
    
          const handleError = (data: any) => {
            if (data.jobId !== jobId) return
            console.log('Error:', data)
    
            updateJob(jobId, {
              status: 'error',
            });
    
          }
    
    
        socket.on('report:progress', handleProgress)
        socket.on('report:ready', handleReady)
        socket.on('report:error', handleError)
    
        return () => {
          socket.off('report:progress', handleProgress)
          socket.off('report:ready', handleReady)
          socket.off('report:error', handleError)
        }
      }, [jobId])

  return (
    <>
      <IonButton fill="clear" id="export_all_center" className="h-10 bg-orange-50 text-orange-500 border border-orange-200 capitalize font-semibold rounded-xl" strong>
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

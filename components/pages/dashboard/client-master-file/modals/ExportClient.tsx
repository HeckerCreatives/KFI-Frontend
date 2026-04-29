import { IonButton, IonHeader, IonIcon, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import kfiAxios from '../../../../utils/axios';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { ClientMasterFile } from '../../../../../types/types';
import { download, print } from 'ionicons/icons';
import { FileExportIcon } from 'hugeicons-react';
import LoanReleaseSelection from '../../../../ui/selections/LoanReleaseSelection';
import { useForm } from 'react-hook-form';
import { SoaFormData, soaSchema } from '../../../../../validations/soa-shema';
import { zodResolver } from '@hookform/resolvers/zod';
import InputText from '../../../../ui/forms/InputText';
import InputRadio from '../../../../ui/forms/InputRadio';
import LoanReleaseSelectionClient from '../../../../ui/selections/LoanReleaseSelectionClient';
import { Download } from 'lucide-react';
import { useJobStore } from '../../../../../store/fileQueStore';
import { Socket, io } from 'socket.io-client';

const ExportClient = ({ client }: { client: ClientMasterFile }) => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);

  const modal = useRef<HTMLIonModalElement>(null);
  
    const socketRef = useRef<Socket | null>(null)
  const [jobId, setJobId] = useState('')
  
  const {addJob, updateJob} = useJobStore()
  
    
    const form = useForm<SoaFormData>({
      resolver: zodResolver(soaSchema),
      defaultValues: {
       clientId: client.id,
       type: 'print'
      },
    });

  function dismiss() {
    modal.current?.dismiss();
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
           label: 'Client Soa',
           type: form.watch('type') === 'print' ? 'print' : 'export',
           progress: 0,
           status: 'processing',
           fileType: form.watch('type') === 'print' ? 'pdf' : 'excel',
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

  async function onSubmit(data: SoaFormData) {
  setLoading(true);

  try {
    if (data.type === 'print') {
      const result = await kfiAxios.get(`/customer/print/soa/${client._id}`, {
        params: { loanReleaseId: data.loanReleaseId },
        responseType: 'arraybuffer',
        validateStatus: (status: number) => [200, 202].includes(status),
      });

      if (result.status === 200) {
        const blob = new Blob([result.data], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(blob);
        const printWindow = window.open(pdfUrl, '_blank');
        printWindow?.addEventListener('load', () => {
          printWindow?.print();
          URL.revokeObjectURL(pdfUrl);
        });
        dismiss()

      } else if (result.status === 202) {
        const text = new TextDecoder().decode(result.data);
        const { jobId } = JSON.parse(text);
        setJobId(jobId);
        dismiss()
      }

    } else if (data.type === 'export') {
      const result = await kfiAxios.get(`/customer/export/soa/${client._id}`, {
        params: { loanReleaseId: data.loanReleaseId },
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
        a.download = 'clients-soa.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        dismiss();

      } else if (result.status === 202) {
        const text = new TextDecoder().decode(result.data);
        const { jobId } = JSON.parse(text);
        setJobId(jobId);
        dismiss();
      }
    }

  } catch (error: any) {
    present({
      message: 'Failed to process the client SOA. Please try again',
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
          id={`export_client_${client._id}`}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={download} className="text-[1rem]" /> Export
        </div>
      </div> */}
      <IonButton
        type="button"
        fill="clear"
        id={`export_client_${client._id}`}
         className=" capitalize text-sm !text-zinc-700 w-fit"
      >
        <Download size={20} className=' mr-1'/>
        <span>Soa</span>
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`export_client_${client._id}`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height [--max-width:24rem] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Client - Export" sub="System" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6">
            <ModalHeader disabled={loading} title="Statement of Account" sub="Manage client documents." dismiss={dismiss} />

          <div></div>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <p className=' text-sm mt-4 mb-1'>Loan Release</p>
            <div className=' flex items-center gap-1'>
               <InputText
                name="loanReleaseLabel"
                readOnly
                control={form.control}
                errorClassName=''
                clearErrors={form.clearErrors}
                placeholder="Type here"
                className="!px-2 !py-2 rounded-md w-full"
              />
              <LoanReleaseSelectionClient setValue={form.setValue} clearErrors={form.clearErrors} loanReleaseLabel={'loanReleaseLabel'} loanReleaseValue={'loanReleaseId'} id={client._id}/>

            </div>

            <div className=' w-full flex flex-col gap-2 p-4 border border-zinc-200 rounded-md mt-2'>
                  <p className=' text-sm !font-semibold'>Select</p>

                  <InputRadio
                    control={form.control}
                    name="type"
                    disabled={loading}
                    clearErrors={form.clearErrors}
                    options={[
                      { label: 'Print', value: 'print' },
                      { label: 'Export', value: 'export' },
                    ]}
                  />
                 
                </div>

                <div className="text-end mt-6 space-x-2">
                  <IonButton disabled={loading} type="submit" fill="clear" className="!text-sm capitalize !bg-[#FA6C2F] text-white rounded-[4px]" strong={true}>
                    <FileExportIcon size={15} stroke='.8' className=' mr-1'/>
                    {loading ? 'Loading...' : `${form.watch('type') === 'print' ? 'Print' : 'Export'}`}
                  </IonButton>
                </div>
                
             
          </form>
         
          {/* <div className="text-end mt-4 space-x-2">
            <div className="text-center">
              <IonButton disabled={loading} fill="clear" className="w-full bg-zinc-50 rounded-lg">
                <div className=' flex items-center justify-center gap-2 bg-zinc-50 !border-zinc-300 !border-1 p-3 w-full rounded-md'>
                  <div className=' p-2 bg-green-100 rounded-md flex items-center text-green-800'>
                    <FileExportIcon size={20} stroke='.8' className=' '/>
                  </div>
                  <div className=' flex flex-col !text-sm !text-black !font-medium capitalize text-start'>
                    {loading ? 'Printing...' : 'Statement of Account'}
                    <p className=' text-xs text-zinc-500 capitalize'>Portable Document Format</p>

                  </div>
                </div>
              </IonButton>
              <IonButton fill="clear" className="w-full bg-zinc-50 rounded-lg">
               

                 <div className=' flex items-center justify-center gap-2 bg-zinc-50 !border-zinc-300 !border-1 p-3 w-full rounded-md'>
                  <div className=' p-2 bg-red-100 rounded-md flex items-center text-red-500'>
                    <FileExportIcon size={20} stroke='.8' className=' '/>
                  </div>
                  <div className=' flex flex-col !text-sm !text-black !font-medium capitalize text-start'>
                    {loading ? 'Exporting...' : ' Statement of Account'}
                    <p className=' text-xs text-zinc-500 capitalize'>Spreadsheet Format</p>

                  </div>
                </div>
              </IonButton>
            </div>
          </div> */}
        </div>
      </IonModal>
    </>
  );
};

export default ExportClient;

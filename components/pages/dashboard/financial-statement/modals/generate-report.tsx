import { zodResolver } from '@hookform/resolvers/zod';
import { IonButton, IonHeader, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import kfiAxios from '../../../../utils/axios';
import { PrinterIcon } from 'hugeicons-react';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { BegBalanceDocumemtFormData, begbalancedocument } from '../../../../../validations/beginningbalance.schema';
import GenerateForm from '../components/generate-form';
import { financialstatementdocument, GenerateFSFormData } from '../../../../../validations/financialstatement.schema';
import { useJobStore } from '../../../../../store/fileQueStore';
import { Socket, io } from 'socket.io-client';


const GenerateReport = () => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);
  const [tabActive, setTabActive] = useState('print')
  

  const modal = useRef<HTMLIonModalElement>(null);
  const [jobId, setJobId] = useState('')
  const {addJob, updateJob} = useJobStore()
  const socketRef = useRef<Socket | null>(null)

  const form = useForm<GenerateFSFormData>({
      resolver: zodResolver(financialstatementdocument),
      defaultValues: {
       type:'print',
       
      },
    });

  function dismiss() {
    // form.reset();
    modal.current?.dismiss();
  }

 async function handleGenerate(data: GenerateFSFormData) {
  setLoading(true);

  try {
    if (data.type === 'print') {
      const result = await kfiAxios.get(`/report/print/gl/financial-statement`, {
        params: data,
        responseType: 'arraybuffer',
        validateStatus: (status: number) => [200, 202].includes(status),
      });

      if (result.status === 200) {
       const contentType = result.headers?.['content-type'];
        const blob = new Blob([result.data]) 

        if(contentType.includes('pdf')){
         const fileURL = URL.createObjectURL(blob);
          addJob({
            jobId: crypto.randomUUID(),
            label: `Financial Statement`,
            type: 'print',
            progress: 100,
            status: 'processing',
            fileType: 'pdf',
            file: 'pdf',
            filename: `financial-statement.pdf`,
            fileUrl: fileURL
          })
       } else {
        const fileURL = URL.createObjectURL(blob);
           addJob({
            jobId: crypto.randomUUID(),
            label: `Financial Statement`,
            type: 'print',
            progress: 100,
            status: 'processing',
            fileType: 'zip',
            file: 'zip',
            filename: `financial-statement.zip`,
            fileUrl: fileURL
          })
       }

      } else if (result.status === 202) {
        const text = new TextDecoder().decode(result.data);
        const { jobId } = JSON.parse(text);
        setJobId(jobId);
        dismiss()
      }

    } else if (data.type === 'export') {
      const result = await kfiAxios.get(`/report/export/gl/financial-statement`, {
        params: data,
        responseType: 'arraybuffer',
        validateStatus: (status: number) => [200, 202].includes(status),
      });

      if (result.status === 200) {
        const contentType = result.headers?.['content-type'];
        const blob = new Blob([result.data])  

        if(contentType.includes('vnd.openxmlformats-officedocument.spreadsheetml.sheet')){
              const fileURL = URL.createObjectURL(blob);
               addJob({
                 jobId: crypto.randomUUID(),
                 label: `Financial Statement`,
                 type: 'export',
                 progress: 100,
                 status: 'processing',
                 fileType: 'excel',
                 file: '',
                 filename: `financial-statement.xlsx`,
                 fileUrl: fileURL
               })
            } else {
             const fileURL = URL.createObjectURL(blob);
                addJob({
                 jobId: crypto.randomUUID(),
                 label: `Financial Statement`,
                 type: 'export',
                 progress: 100,
                 status: 'processing',
                 fileType: 'zip',
                 file: '',
                 filename: `financial-statement.zip`,
                 fileUrl: fileURL
               })
            }

      } else if (result.status === 202) {
        const text = new TextDecoder().decode(result.data);
        const { jobId } = JSON.parse(text);
        setJobId(jobId);
        dismiss()
      }
    }

  } catch (error) {
    console.error(error);
    present({
      message: "Failed to export the loan release records. Please try again.",
      duration: 1000,
    });
  } finally {
    setLoading(false);
  }
}

const type = form.watch('type')

console.log('Type:', type);

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
            label: `Financial Statement`,
            type: type === 'print' ? 'print' : 'export',
            progress: 0,
            status: 'processing',
            fileType: `${type === 'print' ? 'pdf' : 'excel'}`,
            file: '',
            filename: '',
          })
        }
  
  
        const handleProgress = (data: any) => {
          if (data.jobId !== jobId) return
          console.log('Progress event:', data)
  
          const percent = data.percent ?? data.progress ?? 0
            const message = data.message.toLowerCase();

          if (percent >= 50) return;

            const fileType: 'pdf' | 'excel' | 'zip' =
              message.includes('batch') ? 'zip' : type === 'print' ? 'pdf' : 'excel';


            updateJob(jobId, {
              progress: percent,
              status: 'processing',
              fileType: fileType,
              label: `Financial Statement`
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
      <IonButton fill="clear" id="fs-report" className="h-10 bg-orange-50 text-orange-500 border border-orange-200 capitalize font-semibold rounded-xl" strong>
        <PrinterIcon size={15} stroke='.8' className=' mr-1'/>
         Report
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`fs-report`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:30rem] md:[--width:100%] lg:[--max-width:30rem] lg:[--width:40%] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Damayan Fund - Print All" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6">
            <ModalHeader disabled={loading} title="Finacial Statement - Print & Export" sub="Manage financial statement records." dismiss={dismiss} />

        

          <form onSubmit={form.handleSubmit(handleGenerate)} className=' mt-4'>
            <GenerateForm form={form} loading={loading} type={tabActive} />
            <div className="mt-3">
              <IonButton disabled={loading} type="submit" fill="clear" className="w-full capitalize bg-[#FA6C2F] text-white rounded-md font-semibold capitalize">
                
                  <PrinterIcon size={15} stroke='.8' className=' mr-1'/>
                {loading ? `Loading...` : `${type}`}
              </IonButton>
            </div>
          </form>
        </div>
      </IonModal>
    </>
  );
};

export default GenerateReport;

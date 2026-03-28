"use client"

import {
  IonButton,
  IonModal,
  useIonToast,
} from '@ionic/react'
import React, { useEffect, useRef, useState } from 'react'
import ModalHeader from '../../../../ui/page/ModalHeader'
import { PrinterIcon } from 'hugeicons-react'
import kfiAxios from '../../../../utils/axios'
import { io, Socket } from 'socket.io-client'
import { X } from 'lucide-react'
import { useJobStore } from '../../../../../store/fileQueStore'

type Props = {
  sort: string
  search: string
}

const TestPrintAllClient = ({ sort, search }: Props) => {
  const [present] = useIonToast()

  const modal = useRef<HTMLIonModalElement>(null)

  const [loading, setLoading] = useState(false)
  const socketRef = useRef<Socket | null>(null)

  const [isPrinting, setIsPrinting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [jobId, setJobId] = useState('')
  const {addJob, updateJob} = useJobStore()

  function dismiss() {
    modal.current?.dismiss()
  }

  useEffect(() => {
     socketRef.current = io(`${process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5005'}`)
 
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
         label: 'Client List (Excel)',
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
 
       setProgress(percent)
 
       updateJob(jobId, {
         progress: percent,
         status: 'processing',
       })
 
     }
 
     const handleReady = (data: any) => {
       if (data.jobId !== jobId) return;
 
       console.log('Ready:', data);
 
       setProgress(100);
 
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


  async function handleDownload() {
  setLoading(true)

  try {
    const result = await kfiAxios.get(`/customer/export-all`, {
      params: { search, sort },
    })

    const { jobId } = result.data

    setJobId(jobId)
    dismiss()

  } catch (error: any) {
    present({
      message: 'Failed to start process.',
      duration: 1000,
    })
  } finally {
    setLoading(false)
  }
  }



  return (
    <>
      {/* ✅ TRIGGER */}
      <IonButton
        fill="clear"
        id="export_all_client"
        className="h-10 bg-orange-50 text-orange-500 border border-orange-200 capitalize font-semibold rounded-xl"
        strong
      >
        <PrinterIcon stroke=".8" size={15} className="mr-2" /> Excel
      </IonButton>

      {/* ✅ MODAL */}
      <IonModal
        ref={modal}
        trigger="export_all_client"
        backdropDismiss={false}
        className="[--border-radius:0.35rem] auto-height [--max-width:24rem] [--width:95%]"
      >
        <div className="inner-content !p-6">
          <ModalHeader
            disabled={loading}
            title="Client - Excel"
            sub="Generate excel file"
            dismiss={dismiss}
          />

          <div className="text-end mt-4 space-x-2">
            <div className="text-center">
              <IonButton
                disabled={loading}
                onClick={handleDownload}
                fill="clear"
                className="w-full bg-zinc-50 rounded-lg"
              >
                <div className=' flex items-center justify-center gap-2 bg-zinc-50 !border-zinc-300 !border-1 p-3 w-full rounded-md'>
                   <div className=' p-2 bg-green-100 rounded-md flex items-center text-green-800'>
                     <PrinterIcon size={20} stroke='.8' className=' '/>
                   </div>
                   <div className=' flex flex-col !text-sm !text-black !font-medium capitalize text-start'>
                     {loading ? 'Exporting Client Profiles...' : 'Client Profiles'}
                     <p className=' text-xs text-zinc-500 capitalize'>Spreadsheet Format</p>
  
                   </div>
                 </div>
              </IonButton>
            </div>
          </div>
        </div>
      </IonModal>

   
    </>
  )
}

export default TestPrintAllClient
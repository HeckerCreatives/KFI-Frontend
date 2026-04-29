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
   const [sessionRoom, setSessionRoom] = useState('')
    const [name, setName] = useState<string>('')

  function dismiss() {
    modal.current?.dismiss()
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

  // Join first batch room and session room
  socket.emit('join:report', jobId)
  socket.emit('join:report', sessionRoom)

  // Add only the first job here
  addJob({
    jobId,
    label: name || 'Client List',
    type: 'export',
    progress: 0,
    status: 'processing',
    fileType: 'excel',
    file: '',
    filename: '',
  })

  const handleProgress = (data: any) => {
    const percent = data.percent ?? data.progress ?? 0
      const message = data.message.toLowerCase();

       if (percent >= 80) return;

        const fileType: 'pdf' | 'excel' | 'zip' =
          message.includes('batch') ? 'zip' : 'excel';


        updateJob(jobId, {
          progress: percent,
          status: 'processing',
          fileType: fileType,
          label: `Clients`
        })
  }

  const handleReady = (data: any) => {
    const binary = atob(data.file)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    const blob = new Blob([bytes], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)

    updateJob(data.jobId, {
      progress: 100,
      status: 'done',
      file: url,
      filename: data.filename,
      fileUrl: url,
    })

    setJobId('') 
  }

  const handleError = (data: any) => {
    updateJob(data.jobId, { status: 'error' })
    setJobId('')
  }

  const handleNext = ({ jobId: nextJobId, batchIndex, totalBatches, filename }: any) => {
    console.log('Next batch:', { nextJobId, batchIndex, totalBatches })
    socket.emit('join:report', nextJobId)

    // Do NOT call setJobId — that would re-trigger this effect
    addJob({
      jobId: nextJobId,
      label: filename,
      type: 'export',
      progress: 0,
      status: 'processing',
      fileType: 'excel',
      file: '',
      filename: '',
    })
  }

  socket.on('report:progress', handleProgress)
  socket.on('report:ready', handleReady)
  socket.on('report:error', handleError)
  socket.on('report:next', handleNext)

  return () => {
    socket.off('report:progress', handleProgress)
    socket.off('report:ready', handleReady)
    socket.off('report:error', handleError)
    socket.off('report:next', handleNext)
  }
}, [jobId])


async function handleDownload() {
  setLoading(true);

  try {
    const result = await kfiAxios.get(`/customer/export-all`, {
      params: { search, sort },
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
                 label: `Clients`,
                 type: 'export',
                 progress: 100,
                 status: 'processing',
                 fileType: 'excel',
                 file: '',
                 filename: `clients.xlsx`,
                 fileUrl: fileURL
               })
            } else {
             const fileURL = URL.createObjectURL(blob);
                addJob({
                 jobId: crypto.randomUUID(),
                 label: `Clients`,
                 type: 'export',
                 progress: 100,
                 status: 'processing',
                 fileType: 'zip',
                 file: '',
                 filename: `clients.zip`,
                 fileUrl: fileURL
               })
            }
      dismiss();

    } else if (result.status === 202) {
      const text = new TextDecoder().decode(result.data);
     const { jobId, sessionRoom, filename } = JSON.parse(text);
      setJobId(jobId);
      setSessionRoom(sessionRoom);
      setName(filename);
      setIsPrinting(true);
      dismiss();
    }

  } catch (error: any) {
    present({
      message: 'Failed to start process.',
      duration: 1000,
    });
  } finally {
    setLoading(false);
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
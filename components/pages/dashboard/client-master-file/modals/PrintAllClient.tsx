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
import { set } from 'zod'

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

  // Join first batch room and session room
  socket.emit('join:report', jobId)
  socket.emit('join:report', sessionRoom)

  // Add only the first job here
  addJob({
    jobId,
    label: name || 'Client List (PDF)',
    type: 'print',
    progress: 0,
    status: 'processing',
    fileType: 'pdf',
    file: '',
    filename: '',
  })

  const handleProgress = (data: any) => {
    const percent = data.percent ?? data.progress ?? 0
    updateJob(data.jobId, { progress: percent, status: 'processing' })
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
      type: 'print',
      progress: 0,
      status: 'processing',
      fileType: 'pdf',
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


 async function handlePrintClientProfile() {
  setLoading(true);

  try {
    const result = await kfiAxios.get(`/customer/print-all`, {
      params: { search, sort },
      responseType: 'arraybuffer',
      validateStatus: (status: number) => [200, 202].includes(status),
    });

    if (result.status === 200) {
      const blob = new Blob([result.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(blob);
      const printWindow = window.open(fileURL);
      printWindow?.addEventListener('load', () => {
        printWindow?.print();
        URL.revokeObjectURL(fileURL);
      });
      dismiss();

    } else if (result.status === 202) {
      const text = new TextDecoder().decode(result.data);
      const { jobId, sessionRoom, filename } = JSON.parse(text);
      setJobId(jobId);
      setSessionRoom(sessionRoom);
      setName(filename);
      setIsPrinting(true);
      setProgress(0);
      setFileUrl(null);
      dismiss();
    }

  } catch (error: any) {
    present({
      message: 'Failed to start printing process.',
      duration: 1000,
    });
  } finally {
    setLoading(false);
  }
}


  return (
    <>
      <IonButton
        fill="clear"
        id="print_all_client"
        className="h-10 bg-orange-50 text-orange-500 border border-orange-200 capitalize font-semibold rounded-xl"
        strong
      >
        <PrinterIcon stroke=".8" size={15} className="mr-2" /> Pdf
      </IonButton>

      {/* ✅ MODAL */}
      <IonModal
        ref={modal}
        trigger="print_all_client"
        backdropDismiss={false}
        className="[--border-radius:0.35rem] auto-height [--max-width:24rem] [--width:95%]"
      >
        <div className="inner-content !p-6">
          <ModalHeader
            disabled={loading}
            title="Client - Print All"
            sub="Print client details."
            dismiss={dismiss}
          />

          <div className="text-end mt-4 space-x-2">
            <div className="text-center">
              <IonButton
                disabled={loading}
                onClick={handlePrintClientProfile}
                fill="clear"
                className="w-full bg-zinc-50 rounded-lg"
              >
                <div className="flex items-center justify-center gap-2 p-3 w-full rounded-md border border-zinc-300">
                  <div className="p-2 bg-green-100 rounded-md flex items-center text-green-800">
                    <PrinterIcon size={20} stroke=".8" />
                  </div>

                  <div className="flex flex-col text-sm text-black font-medium text-start">
                    {loading
                      ? 'Starting Print...'
                      : 'Client Profiles'}
                    <p className="text-xs text-zinc-500">
                      Portable Document Format
                    </p>
                  </div>
                </div>
              </IonButton>
            </div>
          </div>
        </div>
      </IonModal>

      {/* {isPrinting && (
        <div className="fixed bottom-24 right-6 w-[300px] bg-white shadow-lg border rounded-xl p-4 z-[999]">
          <div className="text-sm font-semibold w-full flex items-center justify-between mb-2">
            <p className=' '>
              Generating File...
            </p>

            {progress === 100 && (
            <button><X size={15}/></button>

            )}
          </div>

          <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="text-xs mt-1 text-zinc-500">
            {progress}% completed
          </div>

         {fileUrl && (
          <button
            onClick={handleDownload}
            className="mt-2 text-sm text-blue-600 underline"
          >
            Download File
          </button>
        )}
        </div>
      )} */}
    </>
  )
}

export default TestPrintAllClient
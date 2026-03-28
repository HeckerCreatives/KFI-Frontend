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
        label: 'Client List (PDF)',
        type: 'print',
        progress: 0,
        status: 'processing',
        fileType: 'pdf',
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

      console.log('✅ Ready:', data);

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


  async function handlePrintClientProfile() {
  setLoading(true)

  try {
    const result = await kfiAxios.get(`/customer/print-all`, {
      params: { search, sort },
    })

   if (result.status === 200) {
      // Immediate blob response — open and print
      const file = new Blob([result.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      const printWindow = window.open(fileURL);
      printWindow?.addEventListener('load', () => {
        printWindow.print();
      });
      dismiss();

    } else if (result.status === 202) {
      // Async job — wait for socket event
      const { jobId } = result.data;
      setJobId(jobId);
      dismiss();
    }

    setIsPrinting(true)
    setProgress(0)
    setFileUrl(null)



  } catch (error: any) {
    present({
      message: 'Failed to start printing process.',
      duration: 1000,
    })
  } finally {
    setLoading(false)
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
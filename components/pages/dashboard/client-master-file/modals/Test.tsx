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

type Props = {
  sort: string
  search: string
}

const TestPrintAllClient = ({ sort, search }: Props) => {
  const [present] = useIonToast()

  const modal = useRef<HTMLIonModalElement>(null)

  const [loading, setLoading] = useState(false)
  const socketRef = useRef<Socket | null>(null)

  // ✅ NEW STATES
  const [isPrinting, setIsPrinting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [jobId, setJobId] = useState('')

  function dismiss() {
    modal.current?.dismiss()
  }

  useEffect(() => {
    // ✅ connect once
    socketRef.current = io('http://localhost:5005')

    const socket = socketRef.current

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    const socket = socketRef.current
    if (!socket || !jobId) return

    console.log('📡 Joining job:', jobId)

    // ✅ join correct room
    socket.emit('join:report', jobId)

    // ✅ CLEAN OLD LISTENERS (VERY IMPORTANT)
    socket.off('report:progress')
    socket.off('report:complete')

    // ✅ LISTEN PROGRESS
    socket.on('report:progress', (data) => {
      console.log('📊 Progress event:', data)

      if (data.jobId !== jobId) return

      setProgress(data.progress)
    })

    // ✅ LISTEN COMPLETE
    socket.on('report:complete', (data) => {
      console.log('✅ Completed:', data)
      setProgress(data.percent)

      if (data.jobId !== jobId) return

      setProgress(100)
      setFileUrl(data.fileUrl)
    })

    return () => {
      console.log('❌ Leaving job:', jobId)

      socket.emit('leave:report', jobId)
    }
  }, [jobId])


 

  // ✅ DUMMY SOCKET SIMULATION
  function simulateProgress() {
    let value = 0

    const interval = setInterval(() => {
      value += Math.random() * 10

      if (value >= 100) {
        value = 100
        clearInterval(interval)

        // simulate file ready
        setTimeout(() => {
          setFileUrl('https://example.com/dummy-file.pdf')
        }, 500)
      }

      setProgress(Math.floor(value))
    }, 400)
  }

  async function handlePrintClientProfile() {
  setLoading(true)

  try {
    const result = await kfiAxios.get(`/customer/print-all`, {
      params: { search, sort },
    })

    const { jobId } = result.data

    setJobId(jobId)


    dismiss()

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
      {/* ✅ TRIGGER */}
      <IonButton
        fill="clear"
        id="print_all_client"
        className="h-10 bg-orange-50 text-orange-500 border border-orange-200 capitalize font-semibold rounded-xl"
        strong
      >
        <PrinterIcon stroke=".8" size={15} className="mr-2" /> Print Test
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

      {/* ✅ GLOBAL PROGRESS UI */}
      {isPrinting && (
        <div className="fixed bottom-20 right-5 w-[300px] bg-white shadow-lg border rounded-xl p-4 z-[999]">
          <div className="text-sm font-semibold mb-1">
            Generating File...
          </div>

          {/* progress bar */}
          <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="text-xs mt-1 text-zinc-500">
            {progress}% completed
          </div>

          {/* ✅ when done */}
          {progress === 100 && fileUrl && (
            <div className="mt-2">
              <a
                href={fileUrl}
                target="_blank"
                className="text-sm text-blue-600 underline"
              >
                Download File
              </a>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default TestPrintAllClient
import { IonButton, IonHeader, IonIcon, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import kfiAxios from '../../../../../utils/axios';
import ModalHeader from '../../../../../ui/page/ModalHeader';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { JournalVoucher } from '../../../../../../types/types';
import { fileTrayFullSharp } from 'ionicons/icons';
import PrintExportOptionForm from '../../components/PrintExportOptionForm';
import { FileExportIcon } from 'hugeicons-react';
import { File } from 'lucide-react';
import { useJobStore } from '../../../../../../store/fileQueStore';
import { Socket, io } from 'socket.io-client';

export const exportVoucherOptionSchema = z.object({
  option: z.string().optional().or(z.literal('')),
});

export type ExportVoucherOptionFormData = z.infer<typeof exportVoucherOptionSchema>;

const ExportJournalVoucher = ({ journalVoucher }: { journalVoucher: JournalVoucher }) => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);

  const modal = useRef<HTMLIonModalElement>(null);
  const [jobId, setJobId] = useState('')
  const {addJob, updateJob} = useJobStore()
  const socketRef = useRef<Socket | null>(null)

  const form = useForm<ExportVoucherOptionFormData>({
    resolver: zodResolver(exportVoucherOptionSchema),
    defaultValues: {
      option: 'summary',
    },
  });

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }


    async function handlePrint() {
            setLoading(true);
               const config = {
          responseType: 'arraybuffer' as const,
          validateStatus: (status: number) => [200, 202].includes(status),
        };
            try {
              const result = await kfiAxios.get(`/journal-voucher/export/file/${journalVoucher._id}`, { ...config });
             if (result.status === 200) {
                  const blob = new Blob([result.data], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                  });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'journal-voucher.xlsx';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  window.URL.revokeObjectURL(url);
                  dismiss?.();
            
                } else if (result.status === 202) {
                  const text = new TextDecoder().decode(result.data);
                  const { jobId } = JSON.parse(text);
                  setJobId(jobId);
                  dismiss();
                }
            } catch (error: any) {
              present({
                message: 'Failed to export records. Please try again',
                duration: 1000,
              });
            } finally {
              setLoading(false);
            }
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
                        label: `Expense Voucher (Excel)`,
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
      {/* <div
        id={`export_journal_voucher_${journalVoucher._id}`}
        className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
      >
        <IonIcon icon={fileTrayFullSharp} className="text-[1rem]" /> Export
      </div> */}
      <IonButton
        id={`export_journal_voucher_${journalVoucher._id}`}
        type="button"
        fill="clear"
        className=" capitalize text-sm !text-zinc-700 w-fit"
      >
        <File size={15} className=' mr-1'/>
        <span>Export</span>
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`export_journal_voucher_${journalVoucher._id}`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:30rem] md:[--width:100%] lg:[--max-width:30rem] lg:[--width:50%] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Journal Voucher - Export" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6">
            <ModalHeader disabled={loading} title="Journal Voucher - Export" sub="Manage journal voucher documents." dismiss={dismiss} />

          <form onSubmit={form.handleSubmit(handlePrint)} className='mt-4'>
            {/* <PrintExportOptionForm form={form} loading={loading} /> */}
            <div className="mt-3">
              <IonButton disabled={loading} type="submit" fill="clear" className="w-full bg-[#FA6C2F] text-white rounded-md font-semibold capitalize">
                <FileExportIcon size={20} stroke='.8' className=' mr-1'/>
                {loading ? 'Exporting Journal Voucher...' : 'Export Journal Voucher'}
              </IonButton>
            </div>
          </form>
        </div>
      </IonModal>
    </>
  );
};

export default ExportJournalVoucher;

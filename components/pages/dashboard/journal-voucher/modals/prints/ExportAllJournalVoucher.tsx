import { IonButton, IonHeader, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import kfiAxios from '../../../../../utils/axios';
import ModalHeader from '../../../../../ui/page/ModalHeader';
import { useForm } from 'react-hook-form';
import PrintExportFilterForm from '../../components/PrintExportFilterForm';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileExportIcon } from 'hugeicons-react';
import { PrintExportFilterFormData, printExportFilterSchema } from '../../../../../../validations/print-export-schema';
import { printExportTab } from '../../../../../../store/data';
import { File, PrinterIcon } from 'lucide-react';
import { useJobStore } from '../../../../../../store/fileQueStore';
import { Socket, io } from 'socket.io-client';

export const journalVoucherFilterSchema = z.object({
  docNoFrom: z.string().optional().or(z.literal('')),
  docNoFromLabel: z.string().optional().or(z.literal('')),
  docNoTo: z.string().optional().or(z.literal('')),
  docNoToLabel: z.string().optional().or(z.literal('')),
  option: z.string().optional().or(z.literal('')),
});

export type JournalVoucherFilterFormData = z.infer<typeof journalVoucherFilterSchema>;

const ExportAllJournalVoucher = () => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);
  const [tabActive, setTabActive] = useState('by-document')
  
  const modal = useRef<HTMLIonModalElement>(null);
  const [jobId, setJobId] = useState('')
  const {addJob, updateJob} = useJobStore()
  const socketRef = useRef<Socket | null>(null)
  
  
    const form = useForm<PrintExportFilterFormData>({
        resolver: zodResolver(printExportFilterSchema),
        defaultValues: {
          docNoFrom: "",
          docNoTo: "",
          dateFrom: "",
          dateTo: "",
          option: "summary",
          bankIds: [], 
          banksSelected: [],
          chartOfAccountsIds: [],
          coaSelected: []
        },
      });

  function dismiss() {
    modal.current?.dismiss();
  }


    async function handlePrint(data: PrintExportFilterFormData) {
      setLoading(true);

      try {
        const params = {
          docNoFrom: data.docNoFromLabel,
          docNoTo: data.docNoToLabel,
          dateFrom: data.dateFrom,
          dateTo: data.dateTo,
          bankIds: data.bankIds,
        };

        const downloadFile = (blobData: BlobPart, fileName: string) => {
          const blob = new Blob([blobData], {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = fileName;
          a.click();
          window.URL.revokeObjectURL(url);
        };

        let response;
        let fileName = "";

        switch (tabActive) {
          case "by-document":
            response = await kfiAxios.get(
              `/journal-voucher/export/by-document/${data.option}`,
              { responseType: "blob", params }
            );
            fileName = "journal-voucher-by-document.xlsx";
            break;

          case "by-date":
            response = await kfiAxios.get(
              `/journal-voucher/export/by-date/${data.option}`,
              { responseType: "blob", params }
            );
            fileName = "journal-voucher-by-date.xlsx";
            break;

          case "by-bank":
            response = await kfiAxios.post(
              `/journal-voucher/export/by-bank`,
              { bankIds: data.bankIds },
              { responseType: "blob" }
            );
            fileName = "journal-voucher-by-banks.xlsx";
            break;

          case "by-accounts":
            response = await kfiAxios.post(
              `/journal-voucher/export/by-accounts/${data.option}`,
              {
                chartOfAccountsIds: data.chartOfAccountsIds,
                dateFrom: data.dateFrom,
                dateTo: data.dateTo,
              },
              { responseType: "blob" }
            );
            fileName = "journal-voucher-by-accounts.xlsx";
            break;

          default:
            throw new Error("Invalid tab selected");
        }

        downloadFile(response.data, fileName);

        form.reset();
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

     async function handleDownload(data: PrintExportFilterFormData) {
      setLoading(true);
    
      try {
        const params = {
          docNoFrom: data.docNoFromLabel,
          docNoTo: data.docNoToLabel,
          dateFrom: data.dateFrom,
          dateTo: data.dateTo,
          bankIds: data.bankIds,
        };
    
        const config = {
          responseType: 'arraybuffer' as const,
          validateStatus: (status: number) => [200, 202].includes(status),
        };
    
        let result;
    
        switch (tabActive) {
          case "by-document":
            result = await kfiAxios.get(
              `/journal-voucher/export/by-document/${data.option}`,
              { ...config, params }
            );
            break;
    
          case "by-date":
            result = await kfiAxios.get(
              `/journal-voucher/export/by-date/${data.option}`,
              { ...config, params }
            );
            break;
    
          case "by-bank":
            result = await kfiAxios.post(
              `/journal-voucher/export/by-bank`,
              { bankIds: data.bankIds },
              config
            );
            break;
    
          case "by-accounts":
            result = await kfiAxios.post(
              `/journal-voucher/export/by-accounts/${data.option}`,
              {
                accounts: data.chartOfAccountsIds,
                dateFrom: data.dateFrom,
                dateTo: data.dateTo,
              },
              config
            );
            break;
    
          default:
            throw new Error("Invalid tab selected");
        }
    
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
              label: `Journal Voucher (Excel)`,
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
      <IonButton fill="clear" id="export_all_journal_voucher" className="h-10 bg-orange-50 text-orange-500 border border-orange-200 capitalize font-semibold rounded-xl" strong>
         <FileExportIcon size={15} stroke='.8' className=' mr-2'/>
         Export
       </IonButton>
      <IonModal
        ref={modal}
        trigger={`export_all_journal_voucher`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height [--max-width:30rem] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Journal Voucher - Export All" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6">
            <ModalHeader disabled={loading} title="Journal Voucher - Export" sub="Manage journal voucher documents." dismiss={dismiss} />

             <div className=' flex items-center w-fit mt-2 bg-zinc-50 !rounded-sm'>
              {printExportTab.map((item,index) => (
              <button onClick={() => setTabActive(item.value)} key={item.value} className={` ${tabActive === item.value && 'bg-[#FA6C2F] text-white'} p-2 text-sm !rounded-md`}>{item.name}</button>
              ))}
            </div>

          <form onSubmit={form.handleSubmit(handleDownload)} className='mt-4'>
            <PrintExportFilterForm form={form} loading={loading} type={tabActive} />
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

export default ExportAllJournalVoucher;

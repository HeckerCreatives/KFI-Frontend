import { IonButton, IonHeader, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import kfiAxios from '../../../../utils/axios';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { useForm } from 'react-hook-form';
import PrintExportFilterForm from '../components/PrintExportFilterForm';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileExportIcon } from 'hugeicons-react';
import { PrintExportFilterFormData, printExportFilterSchema } from '../../../../../validations/print-export-schema';
import { loanReleaseReportTab, printExportTab } from '../../../../../store/data';
import InputSelect from '../../../../ui/forms/InputSelect';
import { useJobStore } from '../../../../../store/fileQueStore';
import { Socket, io } from 'socket.io-client';


const ExportAllLoanRelease = () => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);
  const [tabActive, setTabActive] = useState('by-document')

  const modal = useRef<HTMLIonModalElement>(null);
  const [jobId, setJobId] = useState('')
  const {addJob, updateJob} = useJobStore()
  const socketRef = useRef<Socket | null>(null)

  function dismiss() {
    modal.current?.dismiss();
  }

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
      coaSelected: [],
      reportType: 'by-document'
    },
  });

  const type = form.watch('reportType')

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

    switch (type) {
      case "by-document":
        result = await kfiAxios.get(
          `/transaction/export/by-document/${data.option}`,
          { ...config, params }
        );
        break;

      case "by-date":
        result = await kfiAxios.get(
          `/transaction/export/by-date/${data.option}`,
          { ...config, params }
        );
        break;

      case "by-bank":
        result = await kfiAxios.post(
          `/transaction/export/by-bank`,
          { bankIds: data.bankIds },
          config
        );
        break;

      case "by-accounts":
        result = await kfiAxios.post(
          `/transaction/export/by-accounts/${data.option}`,
          {
            chartOfAccountsIds: data.chartOfAccountsIds,
            dateFrom: data.dateFrom,
            dateTo: data.dateTo,
          },
          config
        );
        break;

      case "past-dues":
        result = await kfiAxios.post(
          `/transaction/export/past-dues`,
          {
            loanReleaseDateFrom: data.loanReleaseDateFrom,
            loanReleaseDateTo: data.loanReleaseDateTo,
          },
          config
        );
        break;

      case "aging-of-loans":
        result = await kfiAxios.post(
          `/transaction/export/aging-of-loans`,
          {
            loanReleaseDateFrom: data.loanReleaseDateFrom,
            loanReleaseDateTo: data.loanReleaseDateTo,
          },
          config
        );
        break;

      case "weekly-collections":
        result = await kfiAxios.post(
          `/transaction/export/weekly-collections`,
          {
            loanReleaseDateFrom: data.loanReleaseDateFrom,
            loanReleaseDateTo: data.loanReleaseDateTo,
          },
          config
        );
        break;

      default:
        throw new Error("Invalid tab selected");
    }

    if (result.status === 200) {
     const contentType = result.headers?.['content-type'];
      const blob = new Blob([result.data])  

      if(contentType.includes('vnd.openxmlformats-officedocument.spreadsheetml.sheet')){
              const fileURL = URL.createObjectURL(blob);
               addJob({
                 jobId: crypto.randomUUID(),
                 label: `Loan Release ${data.reportType}`,
                 type: 'export',
                 progress: 100,
                 status: 'processing',
                 fileType: 'excel',
                 file: '',
                 filename: `loan-release-${data.reportType}.xlsx`,
                 fileUrl: fileURL
               })
            } else {
             const fileURL = URL.createObjectURL(blob);
               addJob({
               jobId: crypto.randomUUID(),
               label: `Loan Release`,
               type: 'export',
               progress: 100,
               status: 'processing',
               fileType: 'zip',
               file: '',
               filename: `loan-release-${data.reportType}.zip`,
               fileUrl: fileURL
             })
            }

            dismiss()

    } else if (result.status === 202) {
      // Decode arraybuffer → JSON for async job response
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

//socket

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
          label: `Loan Release ${type}`,
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
         const message = data.message.toLowerCase();

       if (percent >= 80) return;

        const fileType: 'pdf' | 'excel' | 'zip' =
          message.includes('batch') ? 'zip' : 'excel';


        updateJob(jobId, {
          progress: percent,
          status: 'processing',
          fileType: fileType,
          label: `Loan Release ${type}`

        })


        updateJob(jobId, {
          progress: percent,
          status: 'processing',
          fileType: fileType
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
      <IonButton fill="clear" id="export_all_loan_release" className="h-10 bg-orange-50 text-orange-500 border border-orange-200 capitalize font-semibold rounded-xl" strong>
        <FileExportIcon stroke='.8' size={15} className=' mr-1'/>
        Export
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`export_all_loan_release`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height [--max-width:30rem] [--width:95%]"
      >
       
        <div className="inner-content !p-6">
            <ModalHeader disabled={loading} title="Loan Release - Export" sub="Manage loan release documents." dismiss={dismiss} />

            {/* <div className=' flex items-center w-fit mt-2 bg-zinc-50 !rounded-sm'>
              {printExportTab.map((item,index) => (
              <button onClick={() => setTabActive(item.value)} key={item.value} className={` ${tabActive === item.value && 'bg-[#FA6C2F] text-white'} p-2 text-sm !rounded-md`}>{item.name}</button>
              ))}
            </div> */}

          <form onSubmit={form.handleSubmit(handleDownload)}>
             <InputSelect
                            disabled={loading}
                            name="reportType"
                            control={form.control}
                            clearErrors={form.clearErrors}
                            placeholder="Select here"
                            className="!px-2 !py-2 rounded-md w-full min-w-[17rem] mt-4"
                            labelClassName="truncate w-full !text-slate-600 !text-sm"
                            options={loanReleaseReportTab}
                          />
            <PrintExportFilterForm form={form} loading={loading} type={form.watch('reportType')} />
            <div className="mt-3 flex gap-2">
              {/* <IonButton disabled={loading} type="submit" fill="clear" className="w-full bg-[#FA6C2F] text-white rounded-md font-semibold">
                {loading ? 'Printing...' : 'Print'}
              </IonButton> */}
              <IonButton disabled={loading} type="submit" fill="clear" className="w-full bg-[#FA6C2F] text-white rounded-md font-semibold">
                {loading ? 'Exporting Loan Release...' : 'Export Loan Release'}
              </IonButton>
            </div>
          </form>
        </div>
      </IonModal>
    </>
  );
};

export default ExportAllLoanRelease;

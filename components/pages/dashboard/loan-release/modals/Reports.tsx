import { IonButton, IonHeader, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import kfiAxios from '../../../../utils/axios';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import PrintExportFilterForm from '../components/PrintExportFilterForm';
import { PrinterIcon } from 'hugeicons-react';
import { PrintExportFilterFormData, printExportFilterSchema } from '../../../../../validations/print-export-schema';
import { loanReleaseReports, loanReleaseReportTab, printExportTab } from '../../../../../store/data';
import InputSelect from '../../../../ui/forms/InputSelect';
import WeeklyCollections from './WeeklyCollections';
import { useJobStore } from '../../../../../store/fileQueStore';
import { Socket, io } from 'socket.io-client';


const Reports = () => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);
  const [tabActive, setTabActive] = useState('past-dues')
  

  const modal = useRef<HTMLIonModalElement>(null);
  const [jobId, setJobId] = useState('')
  const {addJob, updateJob} = useJobStore()
  const socketRef = useRef<Socket | null>(null)

  const form = useForm<PrintExportFilterFormData>({
    resolver: zodResolver(printExportFilterSchema),
    defaultValues: {
      docNoFrom: '',
      docNoFromLabel: '',
      docNoTo: '',
      docNoToLabel: '',
      option: 'summary',
      reportType: 'past-dues',
      reportFormat: 'print'
    },
  });

  function dismiss() {
    // form.reset();
    modal.current?.dismiss();
  }

  const type = form.watch('reportType')
  const options = form.watch('reportFormat')


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

        let response;


        switch (type) {


            case "past-dues":
            response = await kfiAxios.post(
            `/transaction/print/past-dues`,
            {
                loanReleaseDateFrom: data.loanReleaseDateFrom,
                loanReleaseDateTo: data.loanReleaseDateTo,
            },
            );
            break;

            case "aging-of-loans":
            response = await kfiAxios.post(
            `/transaction/print/aging-of-loans`,
            {
                loanReleaseDateFrom: data.loanReleaseDateFrom,
                loanReleaseDateTo: data.loanReleaseDateTo,
            },
            );
            break;

            case "weekly-collections":
            response = await kfiAxios.post(
            `/transaction/print/weekly-collections`,
            {
               center: data.center,
               loanReleaseDate: data.loanReleaseDate,
               loanReleaseDueDate: data.loanReleaseDueDate,
               multi: data.multi,
               type: data.type,
               balance: data.balance,
               format: data.format,
               weekNo: Number(data.weekNo)
            },
            );
            break;

        default:
            throw new Error("Invalid tab selected");
        }

        if (response.status === 200) {
              // Immediate blob response — open and print
              const file = new Blob([response.data], { type: 'application/pdf' });
              const fileURL = URL.createObjectURL(file);
              const printWindow = window.open(fileURL);
              printWindow?.addEventListener('load', () => {
                printWindow.print();
              });
              dismiss();

            } else if (response.status === 202) {
              // Async job — wait for socket event
              const { jobId } = response.data;
              setJobId(jobId);
              dismiss();
          }


    } catch (error: any) {
            console.error(error);
            present({
            message: error.response.data.msg || error.response.data.message,
            duration: 1000,
            });
        }  finally {
        setLoading(false);
    }
    }

    async function handleExport(data: PrintExportFilterFormData) {
        setLoading(true);

        try {
            const params = {
            docNoFrom: data.docNoFromLabel,
            docNoTo: data.docNoToLabel,
            dateFrom: data.dateFrom,
            dateTo: data.dateTo,
            bankIds: data.bankIds,
            };
            let response;

            switch (type) {
            
                case "past-dues":
                response = await kfiAxios.post(
                `/transaction/export/past-dues`,
                {
                    loanReleaseDateFrom: data.loanReleaseDateFrom,
                    loanReleaseDateTo: data.loanReleaseDateTo,
                },
                );
                break;

                case "aging-of-loans":
                response = await kfiAxios.post(
                `/transaction/export/aging-of-loans`,
                {
                    loanReleaseDateFrom: data.loanReleaseDateFrom,
                    loanReleaseDateTo: data.loanReleaseDateTo,
                },
                );
                break;

                case "weekly-collections":
                response = await kfiAxios.post(
                `/transaction/export/weekly-collections`,
                {
                    loanReleaseDateFrom: data.loanReleaseDateFrom,
                    loanReleaseDateTo: data.loanReleaseDateTo,
                },
                );
                break;



            default:
                throw new Error("Invalid tab selected");
            }


             if (response.status === 200) {
              // Immediate blob response — open and print
              const file = new Blob([response.data], { type: 'application/pdf' });
              const fileURL = URL.createObjectURL(file);
              const printWindow = window.open(fileURL);
              printWindow?.addEventListener('load', () => {
                printWindow.print();
              });
              dismiss();

            } else if (response.status === 202) {
              // Async job — wait for socket event
              const { jobId } = response.data;
              setJobId(jobId);
              dismiss();
          }


            // form.reset();
        } catch (error: any) {
            console.error(error);
            present({
            message: error.response.data.msg || error.response.data.message,
            duration: 1000,
            });
        } finally {
            setLoading(false);
        }
    }

    async function handleReports(data: PrintExportFilterFormData) {
        if(options === 'print'){
            handlePrint(data)
        } else if(options === 'export'){
            handleExport(data)
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
              label: `Loan Release ${type === 'aging-of-loans' ? 'aging loans': type}`,
              type: `${options === 'print' ? 'print' : 'export'}`,
              progress: 0,
              status: 'processing',
              fileType: `${options === 'print' ? 'pdf' : 'excel'}`,
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
      <IonButton fill="clear" id="reports" className="h-10 bg-orange-50 text-orange-500 border border-orange-200 capitalize font-semibold rounded-xl" strong>
       <PrinterIcon stroke='.8' size={15} className=' mr-1'/> Reports
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`reports`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height [--max-height:90%] [--max-width:30rem] [--width:95%] "
      >
         
        <div className="inner-content !p-6 overflow-y-auto">
            <ModalHeader disabled={loading} title="Reports" sub="Manage report documents." dismiss={dismiss} />

          {/* <div className=' flex items-center w-fit mt-2 bg-zinc-50 !rounded-sm'>
            {printExportTab.map((item,index) => (
            <button onClick={() => setTabActive(item.value)} key={item.value} className={` ${tabActive === item.value && 'bg-[#FA6C2F] text-white'} p-2 text-sm !rounded-md`}>{item.name}</button>
            ))}
          </div> */}

          

          <form onSubmit={form.handleSubmit(handleReports)}>
            <InputSelect
                disabled={loading}
                name="reportType"
                control={form.control}
                clearErrors={form.clearErrors}
                placeholder="Select here"
                className="!px-2 !py-2 rounded-md w-full min-w-[17rem] mt-4"
                labelClassName="truncate w-full !text-slate-600 !text-sm"
                options={loanReleaseReports}
                
              />
              {type === 'weekly-collections' ? (
                <WeeklyCollections form={form}/>
              ) : (
             <PrintExportFilterForm form={form} loading={loading} type={form.watch('reportType')} />

              )}
            <div className="mt-3">
              <IonButton disabled={loading} type="submit" fill="clear" className="w-full capitalize! bg-[#FA6C2F] text-white rounded-md font-semibold">
                <PrinterIcon size={20} stroke='.8' className=' mr-2'/>
                {loading ? 'Loading...' : options}
              </IonButton>

              
            </div>
          </form>
        </div>
      </IonModal>
    </>
  );
};

export default Reports;

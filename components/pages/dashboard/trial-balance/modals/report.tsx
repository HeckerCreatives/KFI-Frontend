import { IonButton, IonContent, IonModal, IonSelect, IonSelectOption, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import { GLFormData, glSchema } from '../../../../../validations/gl.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import kfiAxios from '../../../../utils/axios';
import { FileExportIcon } from 'hugeicons-react';
import { TErrorData, TFormError } from '../../../../../types/types';
import InputCheckbox from '../../../../ui/forms/InputCheckbox';
import InputRadio from '../../../../ui/forms/InputRadio';
import InputText from '../../../../ui/forms/InputText';
import ChartOfAccountSelection from '../../../../ui/selections/ChartOfAccountSelection';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';
import { tbreport, TBReportForm } from '../../../../../validations/trial-balance-schema';
import InputTextarea from '../../../../ui/forms/InputTextarea';
import { File } from 'lucide-react';
import ModalHeader from '../../../../ui/page/ModalHeader';
import classNames from 'classnames';
import { TBS } from '../TrialBalance';
import { useJobStore } from '../../../../../store/fileQueStore';
import { Socket, io } from 'socket.io-client';

type Props = {
  trialBalances: any[]
}

export default function TBReport({ trialBalances }: Props) {
    const [present] = useIonToast();
    const [loading, setLoading] = useState(false);
    const modal = useRef<HTMLIonModalElement>(null);
    const [jobId, setJobId] = useState('')
    const {addJob, updateJob} = useJobStore()
    const socketRef = useRef<Socket | null>(null)

       const form = useForm<TBReportForm>({
          resolver: zodResolver(tbreport),
          defaultValues: {
            dateFrom:'',
            dateTo: '',
            type:'print',
            displayZero: false,
            includeBalance: false,
            summarizeBalance: false,
            message: '',
            accountingYear: ''
          },
        });

        const type = form.watch('type')

        function dismiss() {
            // form.reset();
            modal.current?.dismiss();
        }
        const [data, setData] = useState<TBS>({
              trialBalances: [],
              loading: false,
              totalPages: 0,
              nextPage: false,
              prevPage: false,
            });

           const getList = async () => {
                  try {
                    const result = await kfiAxios.get('/trial-balance');

                    const { data, success,hasPrevPage, hasNextPage, totalPages } = result.data

                    if(success){
                       setData(prev => ({
                      ...prev,
                      trialBalances: data.items,
                      totalPages: totalPages,
                      nextPage: hasNextPage,
                      prevPage: hasPrevPage,
                    }));
                    }

                  } catch (error) {
                  } finally {
                  }

            };

            console.log(type)


       async function onSubmit(data: TBReportForm) {
          setLoading(true);

          try {
            if (data.type === 'print') {
              const result = await kfiAxios.get('/report/print/gl/trial-balance', {
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
                    label: `Trial Balance (PDF)`,
                    type: 'print',
                    progress: 100,
                    status: 'processing',
                    fileType: 'pdf',
                    file: 'zip',
                    filename: `trial-balance.pdf`,
                    fileUrl: fileURL
                  })
              } else {
                const fileURL = URL.createObjectURL(blob);
                   addJob({
                    jobId: crypto.randomUUID(),
                    label: `Trial Balance (PDF)`,
                    type: 'print',
                    progress: 100,
                    status: 'processing',
                    fileType: 'pdf',
                    file: 'zip',
                    filename: `trial-balance.zip`,
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
              const result = await kfiAxios.get('/report/export/gl/trial-balance', {
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
                 label: `Trial Balance (Excel)`,
                 type: 'export',
                 progress: 100,
                 status: 'processing',
                 fileType: 'excel',
                 file: '',
                 filename: `trial-balance.xlsx`,
                 fileUrl: fileURL
               })
            } else {
             const fileURL = URL.createObjectURL(blob);
               addJob({
                 jobId: crypto.randomUUID(),
                 label: `Trial Balance (Excel)`,
                 type: 'export',
                 progress: 100,
                 status: 'processing',
                 fileType: 'excel',
                 file: '',
                 filename: `trial-balance.zip`,
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

          } catch (error: any) {
            present({
              message: "No data found.",
              duration: 1200,
            });

            const errs: TErrorData | string =
              error?.response?.data?.error ||
              error?.response?.data?.msg ||
              error.message;
            const errors: TFormError[] | string = checkError(errs);
            const fields: string[] = Object.keys(form.formState.defaultValues as Object);
            formErrorHandler(errors, form.setError, fields);

          } finally {
            setLoading(false);
          }
        }

          useIonViewWillEnter(() => {
              getList();
            });


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
                label: `Trial Balance (${type === 'print' ? 'Pdf' : 'Excel'})`,
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
      <div className="text-end">
        <IonButton fill="clear" id="report-tb-modal" className="h-10 bg-orange-50 text-orange-500 border border-orange-200 capitalize font-semibold rounded-xl" strong>
          <File size={15} className=' mr-1'/>Report
        </IonButton>
      </div>
      <IonModal
        ref={modal}
        trigger="report-tb-modal"
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height [--width:95%] [--max-width:32rem] "
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader disabled={loading} title="Nature - Add Record" sub="System" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}

       <form onSubmit={form.handleSubmit(onSubmit)} className=' flex flex-col gap-2 bg-white !p-6 w-full rounded-md shadow-md h-full inner-content max-h-[90%]'>
                 <ModalHeader disabled={loading} title="Trial Balance " sub="" dismiss={dismiss} />
                <div className=' w-full flex flex-col gap-2 p-4 border border-zinc-200 rounded-md'>
                  <p className=' text-sm !font-semibold'>Date</p>

                  <div className=' w-full flex items-center gap-2'>
                     <div className='flex flex-col gap-1 w-full'>
                      <p className=' text-xs !font-medium'>From</p>
                      <InputText
                        disabled={false}
                        name="dateFrom"
                        control={form.control}
                        clearErrors={form.clearErrors}
                        placeholder="Type here"
                        type='date'
                        className="!px-2 !py-2 rounded-md"
                        labelClassName="!text-slate-600 truncate min-w-28 !text-sm text-end"
                      />

                    </div>
                    <div className='flex flex-col gap-1 w-full'>
                      <p className=' text-xs !font-medium'>To</p>
                      <InputText
                        disabled={false}
                        name="dateTo"
                        control={form.control}
                        clearErrors={form.clearErrors}
                        placeholder="Type here"
                        type='date'
                        className="!px-2 !py-2 rounded-md"
                        labelClassName="!text-slate-600 truncate min-w-28 !text-sm text-end"
                      />

                    </div>
                  </div>
                  <div className=' w-full flex gap-2  rounded-md mt-2'>
                  <InputCheckbox
                      control={form.control}
                      name='displayZero'
                      disabled={loading}
                      className=' !w-4'

                    />
                  <p className=' text-xs !w-full'>Display Zero Values</p>

                </div>

                </div>
                <div className='flex flex-col gap-1 w-full'>
                      <p className=' text-xs !font-medium'>Accounting Year</p>
                      <InputText
                        disabled={false}
                        name="accountingYear"
                        control={form.control}
                        clearErrors={form.clearErrors}
                        placeholder="Type here"
                        type='number'
                        className="!px-2 !py-2 rounded-md"
                        labelClassName="!text-slate-600 truncate min-w-28 !text-sm text-end"
                      />

                    </div>

                     <div className='flex flex-col gap-1 w-full'>
                      <p className=' text-xs !font-medium'>Report Code</p>
                      {/* <InputText
                        disabled={false}
                        name="reportCode"
                        control={form.control}
                        clearErrors={form.clearErrors}
                        placeholder="Type here"
                        type='text'
                        className="!px-2 !py-2 rounded-md"
                        labelClassName="!text-slate-600 truncate min-w-28 !text-sm text-end"
                      /> */}


                       <IonSelect
                       placeholder='Select report code'
                       labelPlacement="stacked"
                        interface="popover"
                       value={form.watch('reportCode')}
                       onIonChange={e => {
                           form.setValue('reportCode',e.target.value);
                         }}
                        className={classNames(
                           '!border border-zinc-300 [--highlight-color-focused:none] !px-2 !py-1 text-xs !overflow-y-auto !min-w-[12rem] !max-h-[5rem] !min-h-[0.5rem] ',
                         )}
                         >
                           {data.trialBalances?.map((item, index) => (
                             <IonSelectOption key={index}  value={item._id} className="text-xs [--min-height:0.5rem]">
                              {item.reportCode} -{item.reportName}
                             </IonSelectOption>
                           ))}
                         </IonSelect>

                    </div>
                 <div className=' w-full flex gap-2 p-4 border border-zinc-200 rounded-md'>


                  <InputCheckbox
                      control={form.control}
                      name='summarizeBalance'
                      disabled={form.watch('includeBalance')}
                      className=' !w-4'



                    />
                  <p className=' text-xs !w-full'>Summarize Beginning & Ending Balance </p>


                </div>
                <div className=' w-full flex gap-2 p-4 border border-zinc-200 rounded-md'>


                  <InputCheckbox
                      control={form.control}
                      name="includeBalance"
                      disabled={form.watch('summarizeBalance')}
                      className=' !w-4'


                    />
                  <p className=' text-xs !w-full'>Include Beginning & Ending Balance </p>


                </div>

                 <div className='flex flex-col gap-1 w-full'>
                      <p className=' text-xs !font-medium'>Message</p>
                      <InputTextarea
                        disabled={false}
                        name='message'
                        control={form.control}
                        clearErrors={form.clearErrors}
                        placeholder="Type here"
                        className="!px-2 !py-2 rounded-md"
                      />

                    </div>




                <div className=' w-full flex flex-col gap-2 p-4 border border-zinc-200 rounded-md'>
                  <p className=' text-sm !font-semibold'>Select</p>

                  <InputRadio
                    control={form.control}
                    name="type"
                    disabled={loading}
                    clearErrors={form.clearErrors}
                    options={[
                      { label: 'Print', value: 'print' },
                      { label: 'Export', value: 'export' },
                    ]}
                  />

                </div>





                <div className="text-end mt-6 space-x-2">
                  <IonButton disabled={loading} type="submit" fill="clear" className="!text-sm capitalize !bg-[#FA6C2F] text-white rounded-[4px]" strong={true}>
                    <FileExportIcon size={15} stroke='.8' className=' mr-1'/>
                    {loading ? 'Loading...' : `${form.watch('type') === 'print' ? 'Print' : 'Export'}`}
                  </IonButton>


                </div>



              </form>
      </IonModal>
    </>

  )
}

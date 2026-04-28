import { IonButton, IonContent, IonPage, useIonToast } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import PageTitle from '../../../ui/page/PageTitle';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GLFormData, glSchema } from '../../../../validations/gl.schema';
import InputText from '../../../ui/forms/InputText';
import { AccessToken, TErrorData, TFormError } from '../../../../types/types';
import checkError from '../../../utils/check-error';
import formErrorHandler from '../../../utils/form-error-handler';
import kfiAxios from '../../../utils/axios';
import { FileExportIcon } from 'hugeicons-react';
import InputRadio from '../../../ui/forms/InputRadio';
import ChartOfAccountSelection from '../../../ui/selections/ChartOfAccountSelection';
import InputCheckbox from '../../../ui/forms/InputCheckbox';
import CenterSelection from '../../../ui/selections/CenterSelection';
import { GeneratePCFormData, projectcollectiondocument } from '../../../../validations/projected-collection-schema';
import { GeneratePortfolioFormData, portfoliodocument } from '../../../../validations/portfolio-risk-schema';
import ClientSelection from '../../../ui/selections/ClientSelection';
import LoanSelection from '../../../ui/selections/LoanSelection';
import { jwtDecode } from 'jwt-decode';
import { canDoAction } from '../../../utils/permissions';
import { Socket, io } from 'socket.io-client';
import { useJobStore } from '../../../../store/fileQueStore';

const PortfolioAtRisk = () => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);
    const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
    const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')
    const [jobId, setJobId] = useState('')
const {addJob, updateJob} = useJobStore()
const socketRef = useRef<Socket | null>(null)
   const form = useForm<GeneratePortfolioFormData>({
      resolver: zodResolver(portfoliodocument),
      defaultValues: {
     
        type:'print',
        rangeType: 'center',
        collectionType: 'weekly-collection',
        centerType: 'by-center'
      },
    });


async function onSubmit(data: GeneratePortfolioFormData) {
  setLoading(true);
  console.log(data);

  try {
    if (data.type === 'print') {
      const result = await kfiAxios.get('/report/print/gl/portfolio-at-risk', {
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
                    label: `Portfolio at Risk`,
                    type: 'print',
                    progress: 100,
                    status: 'processing',
                    fileType: 'pdf',
                    file: 'pdf',
                    filename: `portfolio-at-risk.pdf`,
                    fileUrl: fileURL
                  })
              } else {
                const fileURL = URL.createObjectURL(blob);
                      addJob({
                    jobId: crypto.randomUUID(),
                    label: `Portfolio at Risk`,
                    type: 'print',
                    progress: 100,
                    status: 'processing',
                    fileType: 'zip',
                    file: 'zip',
                    filename: `portfolio-at-risk.zip`,
                    fileUrl: fileURL
                  })
              }

      } else if (result.status === 202) {
        const text = new TextDecoder().decode(result.data);
        const { jobId } = JSON.parse(text);
        setJobId(jobId);
      }

    } else if (data.type === 'export') {
      const result = await kfiAxios.get('/report/export/gl/portfolio-at-risk', {
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
                 label: `Portfolio at Risk`,
                 type: 'export',
                 progress: 100,
                 status: 'processing',
                 fileType: 'excel',
                 file: '',
                 filename: `portfolio-at-risk.xlsx`,
                 fileUrl: fileURL
               })
            } else {
             const fileURL = URL.createObjectURL(blob);
              addJob({
                 jobId: crypto.randomUUID(),
                 label: `Portfolio at Risk`,
                 type: 'export',
                 progress: 100,
                 status: 'processing',
                 fileType: 'zip',
                 file: '',
                 filename: `portfolio-at-risk.zip`,
                 fileUrl: fileURL
               })
            }

      } else if (result.status === 202) {
        const text = new TextDecoder().decode(result.data);
        const { jobId } = JSON.parse(text);
        setJobId(jobId);
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
                    label: `Portfolio at Risk - ${form.watch('type') === 'print' ? 'Print' : 'Export'}`,
                    type: form.watch('type') === 'print' ? 'print' : 'export',
                    progress: 0,
                    status: 'processing',
                    fileType: `${form.watch('type') === 'print' ? 'pdf' : 'excel'}`,
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
    <IonPage className=" w-full flex items-center justify-center h-full bg-zinc-100">
      <IonContent className="[--background:#F4F4F5] max-w-[1920px] h-full" fullscreen>
        <div className="h-full flex flex-col gap-4 py-6 items-stretch justify-start">
          {/* <PageTitle pages={['General Ledger', 'Portfolio at Risk']} /> */}
          <div className="px-3 pb-3 flex-1">
            <div className=' space-y-1 mb-6'>
              {/* <PageTitle pages={['Dashboard']} /> */}
              <p className=' text-xl text-gray-700 !font-medium'>Projected Collection</p>
              <p className=' text-sm text-gray-500 '>Manage projected collection records.</p>

            </div>
            <div className="relative overflow-auto">

              <form onSubmit={form.handleSubmit(onSubmit)} className=' gap-2 bg-white p-4 w-full max-w-4xl rounded-md shadow-md'>
                <p className=' text-lg !font-semibold'>Generate Report</p>
                <div className=' w-full grid grid-cols-2 gap-2'>
                    <div className=' w-full flex flex-col gap-2 p-4 border border-zinc-200 rounded-md'>
                    <p className=' text-sm !font-semibold text-zinc-500'>Range</p>

                    <div className=' flex flex-col gap-2 p-2 border border-zinc-200 rounded-md'>
                        <p className=' text-sm !font-semibold'>Customer</p>
                        <div className='flex flex-col gap-1 w-full'>
                            <p className=' text-xs !font-medium'>Name</p>
                            <div className="flex items-start gap-2 flex-nowrap">
                                    <InputText
                                        disabled={loading}
                                        readOnly
                                        name="clientFromLabel"
                                        control={form.control}
                                        clearErrors={form.clearErrors}
                                        placeholder="Click find to search for customer"
                                        className=" !p-2 rounded-md !text-[0.7rem]"
                                        labelClassName="truncate min-w-20 !text-[0.7rem] !text-slate-600 text-end"
                                    />

                                    <ClientSelection clientValue='clientFrom' clientLabel='clientFromLabel' clearErrors={form.clearErrors} setValue={form.setValue}/>

                            </div>
                        </div>

                        <div className='flex flex-col gap-1 w-full'>
                            <p className=' text-xs !font-medium'>To</p>
                            <div className="flex items-start gap-2 flex-nowrap">
                                    <InputText
                                        disabled={loading}
                                        readOnly
                                        name="clientToLabel"
                                        control={form.control}
                                        clearErrors={form.clearErrors}
                                        placeholder="Click find to search for center code"
                                        className=" !p-2 rounded-md !text-[0.7rem]"
                                        labelClassName="truncate min-w-20 !text-[0.7rem] !text-slate-600 text-end"
                                    />

                                     <ClientSelection clientValue='clientTo' clientLabel='clientToLabel' clearErrors={form.clearErrors} setValue={form.setValue}/>
                            </div>
                        </div>
                    </div>

                    <div className=' flex flex-col gap-2 p-2 border border-zinc-200 rounded-md'>
                        <p className=' text-sm !font-semibold'>Center</p>

                        <div className='flex flex-col gap-1 w-full'>
                            <p className=' text-xs !font-medium'>From</p>
                                <div className="flex items-start gap-2 flex-nowrap">
                                        <InputText
                                            disabled={loading}
                                            readOnly
                                            name="centerFromLabel"
                                            control={form.control}
                                            clearErrors={form.clearErrors}
                                            placeholder="Click find to search for center code"
                                            className=" !p-2 rounded-md !text-[0.7rem]"
                                            labelClassName="truncate min-w-20 !text-[0.7rem] !text-slate-600 text-end"
                                        />
                                        <CenterSelection centerLabel="centerFromLabel" centerValue="centerFrom" clearErrors={form.clearErrors} setValue={form.setValue} className="text-xs" />
                                </div>
                            </div>

                            <div className='flex flex-col gap-1 w-full'>
                                <p className=' text-xs !font-medium'>To</p>
                                <div className="flex items-start gap-2 flex-nowrap">
                                        <InputText
                                            disabled={loading}
                                            readOnly
                                            name="centerToLabel"
                                            control={form.control}
                                            clearErrors={form.clearErrors}
                                            placeholder="Click find to search for center code"
                                            className=" !p-2 rounded-md !text-[0.7rem]"
                                            labelClassName="truncate min-w-20 !text-[0.7rem] !text-slate-600 text-end"
                                        />
                                        <CenterSelection centerLabel="centerToLabel" centerValue="centerTo" clearErrors={form.clearErrors} setValue={form.setValue} className="text-xs" />
                                </div>
                            </div>
                    </div>

                    <div className=' flex flex-col gap-2 p-2 border border-zinc-200 rounded-md'>
                        <p className=' text-sm !font-semibold'>Loan Release Date</p>
                        <div className=' flex gap-2 items-start'>
                            <div className='flex flex-col gap-1 w-full'>
                        <p className=' text-xs !font-medium'>From</p>
                        <InputText
                            disabled={false}
                            name="loanReleaseDateFrom"
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
                                name="loanReleaseDateTo"
                                control={form.control}
                                clearErrors={form.clearErrors}
                                placeholder="Type here"
                                type='date'
                                className="!px-2 !py-2 rounded-md"
                                labelClassName="!text-slate-600 truncate min-w-28 !text-sm text-end"
                            />

                            </div>
                        </div>

                        
                    </div>

                        <div className=' flex flex-col gap-2 p-2 border border-zinc-200 rounded-md'>
                        <p className=' text-sm !font-semibold'>Date of Payment</p>
                        <div className=' flex gap-2 items-start'>
                            <div className='flex flex-col gap-1 w-full'>
                        <p className=' text-xs !font-medium'>From</p>
                        <InputText
                            disabled={false}
                            name="paymentDateFrom"
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
                                name="paymentDateTo"
                                control={form.control}
                                clearErrors={form.clearErrors}
                                placeholder="Type here"
                                type='date'
                                className="!px-2 !py-2 rounded-md"
                                labelClassName="!text-slate-600 truncate min-w-28 !text-sm text-end"
                            />

                            </div>
                        </div>

                        
                    </div>

                        <InputRadio
                            control={form.control}
                            name="rangeType"
                            disabled={loading}
                            clearErrors={form.clearErrors}
                            options={[
                            { label: 'Center', value: 'center' },
                            { label: 'All', value: 'all' },
                            ]}
                            className=" my-4"
                        />

                        <div className='flex flex-col gap-1 w-full'>
                                <p className=' text-xs !font-medium'>Type of Loan</p>
                                <div className="flex items-start gap-2 flex-nowrap">
                                        <InputText
                                            disabled={loading}
                                            readOnly
                                            name="typeOfLoanLabel"
                                            control={form.control}
                                            clearErrors={form.clearErrors}
                                            placeholder="Click find to search for center code"
                                            className=" !p-2 rounded-md !text-[0.7rem]"
                                            labelClassName="truncate min-w-20 !text-[0.7rem] !text-slate-600 text-end"
                                        />
                                       <LoanSelection clearErrors={form.clearErrors} setValue={form.setValue} loanLabel={"typeOfLoanLabel"} loanValue={"typeOfLoan"}/>
                                </div>
                            </div>
                    
                    </div>

                    <div className=' w-full flex flex-col gap-2'>
                        <div className=' w-full flex flex-col gap-2 p-4 border border-zinc-200 rounded-md'>
                            <p className=' text-sm !font-semibold '>PAR Date Range</p>
                            <div className=' flex gap-2 items-start'>
                                <div className='flex flex-col gap-1 w-full'>
                            <p className=' text-xs !font-medium'>From</p>
                            <InputText
                                disabled={false}
                                name="parDateFrom"
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
                                    name="paymentDateFrom"
                                    control={form.control}
                                    clearErrors={form.clearErrors}
                                    placeholder="Type here"
                                    type='date'
                                    className="!px-2 !py-2 rounded-md"
                                    labelClassName="!text-slate-600 truncate min-w-28 !text-sm text-end"
                                />

                                </div>
                            </div>


                        </div>

                        <div className=' w-full flex flex-col gap-2 p-4 border border-zinc-200 rounded-md'>
                            <p className=' text-xs !font-medium'>Account Officer</p>
                            <div className='flex flex-col gap-1 w-full'>
                                <InputText
                                    disabled={false}
                                    name="accountOfficer"
                                    control={form.control}
                                    clearErrors={form.clearErrors}
                                    placeholder="Type here"
                                    type='text'
                                    className="!px-2 !py-2 rounded-md"
                                    labelClassName="!text-slate-600 truncate min-w-28 !text-sm text-end"
                                />

                                </div>

                            <p className=' text-xs !font-medium'>Less Than As Of Date</p>
                            <div className='flex gap-1 w-full'>
                                    <InputText
                                        disabled={false}
                                        name="lessThanDate"
                                        control={form.control}
                                        clearErrors={form.clearErrors}
                                        placeholder="Type here"
                                        type='date'
                                        className="!px-2 !py-2 rounded-md"
                                        labelClassName="!text-slate-600 truncate min-w-28 !text-sm text-end"
                                    />

                                     <InputText
                                        disabled={false}
                                        name="lessThanDateNumber"
                                        control={form.control}
                                        clearErrors={form.clearErrors}
                                        placeholder="Type here"
                                        type='number'
                                        className="!px-2 !py-2 rounded-md"
                                        labelClassName="!text-slate-600 truncate min-w-28 !text-sm text-end"
                                    />

                             </div>

                             <p className=' text-xs !font-medium'>Greater Than As Of Date</p>
                            <div className='flex gap-1 w-full'>
                                    <InputText
                                        disabled={false}
                                        name="greaterThanDate"
                                        control={form.control}
                                        clearErrors={form.clearErrors}
                                        placeholder="Type here"
                                        type='date'
                                        className="!px-2 !py-2 rounded-md"
                                        labelClassName="!text-slate-600 truncate min-w-28 !text-sm text-end"
                                    />

                                     <InputText
                                        disabled={false}
                                        name="greaterThanDateNumber"
                                        control={form.control}
                                        clearErrors={form.clearErrors}
                                        placeholder="Type here"
                                        type='number'
                                        className="!px-2 !py-2 rounded-md"
                                        labelClassName="!text-slate-600 truncate min-w-28 !text-sm text-end"
                                    />

                             </div>

                        </div>

                         <InputRadio
                            control={form.control}
                            name="collectionType"
                            disabled={loading}
                            clearErrors={form.clearErrors}
                            options={[
                            { label: 'Weekly Collection', value: 'weekly-collection' },
                            { label: 'w/CBU', value: 'with-cbu' },
                            ]}
                            className=' my-4'
                        />

                         <InputRadio
                            control={form.control}
                            name="centerType"
                            disabled={loading}
                            clearErrors={form.clearErrors}
                            options={[
                            { label: 'By Center', value: 'by-center' },
                            { label: 'By Center w/Members', value: 'by-center-with-members' },
                            ]}
                            className=' my-4'
                        />


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



                    </div>
                </div>
               

              
                

                 

                <div className="text-end mt-6 space-x-2">
                     {form.watch('type') === 'print' ? (
                           <>
                           {canDoAction(token.role, permissions, 'portfolio', 'print') && 
                             <IonButton disabled={loading} type="submit" fill="clear" className="!text-sm capitalize !bg-[#FA6C2F] text-white rounded-[4px]" strong={true}>
                               <FileExportIcon size={15} stroke='.8' className=' mr-1'/>
                               {loading ? 'Loading...' : `${form.watch('type') === 'print' ? 'Print' : 'Export'}`}
                             </IonButton>
                           }
                           </>
                         ): (
                           <>
                           {canDoAction(token.role, permissions, 'portfolio', 'export') && 
                             <IonButton disabled={loading} type="submit" fill="clear" className="!text-sm capitalize !bg-[#FA6C2F] text-white rounded-[4px]" strong={true}>
                               <FileExportIcon size={15} stroke='.8' className=' mr-1'/>
                               {loading ? 'Loading...' : `${form.watch('type') === 'print' ? 'Print' : 'Export'}`}
                             </IonButton>
                           }
                           </>
                         )}
                 

                 
                
                </div>



              </form>
            </div>

            <div className=' w-full h-[200px]'>

            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PortfolioAtRisk;

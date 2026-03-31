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
import { jwtDecode } from 'jwt-decode';
import { canDoAction } from '../../../utils/permissions';
import { useJobStore } from '../../../../store/fileQueStore';
import { Socket, io } from 'socket.io-client';

const ProjectedCollections = () => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);
   const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
    const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')
    const [jobId, setJobId] = useState('')
    const {addJob, updateJob} = useJobStore()
     const socketRef = useRef<Socket | null>(null)
   const form = useForm<GeneratePCFormData>({
      resolver: zodResolver(projectcollectiondocument),
      defaultValues: {
      groupBy:'acct-officer',
        type:'print'
      },
    });

    const type = form.watch('type')


  async function onSubmit(data: GeneratePCFormData) {
    setLoading(true);

    try {
      if (data.type === 'print') {
        const result = await kfiAxios.get('/report/print/gl/projected-collection', {
          params: data,
          responseType: 'arraybuffer',
          validateStatus: (status: number) => [200, 202].includes(status),
        });

        if (result.status === 200) {
          const blob = new Blob([result.data], { type: 'application/pdf' });
          const pdfUrl = URL.createObjectURL(blob);
          const printWindow = window.open(pdfUrl, '_blank');
          printWindow?.addEventListener('load', () => {
            printWindow?.print();
            URL.revokeObjectURL(pdfUrl);
          });

        } else if (result.status === 202) {
          const text = new TextDecoder().decode(result.data);
          const { jobId } = JSON.parse(text);
          setJobId(jobId);
        }

      } else if (data.type === 'export') {
        const result = await kfiAxios.get('/report/export/gl/projected-collection', {
          params: data,
          responseType: 'arraybuffer',
          validateStatus: (status: number) => [200, 202].includes(status),
        });

        if (result.status === 200) {
          const blob = new Blob([result.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'projected-collection.xlsx';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);

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
              label: `Projected Collection (${type === 'print' ? 'Pdf' : 'Excel'})`,
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
    <IonPage className=" w-full flex items-center justify-center h-full bg-zinc-100">
      <IonContent className="[--background:#F4F4F5] max-w-[1920px] h-full" fullscreen>
        <div className="h-full flex flex-col gap-4 py-6 items-stretch justify-start">
          <div className="px-3 pb-3 flex-1">
             <div className=' space-y-1 mb-6'>
              {/* <PageTitle pages={['Dashboard']} /> */}
              <p className=' text-xl text-gray-700 !font-medium'>Projected Collection</p>
              <p className=' text-sm text-gray-500 '>Manage projected collection records.</p>

            </div>
            <div className="relative overflow-auto">

              <form onSubmit={form.handleSubmit(onSubmit)} className=' flex flex-col gap-2 bg-white p-4 w-full max-w-md rounded-md shadow-md'>
                <p className=' text-lg !font-semibold'>Generate Report</p>
                <div className=' w-full flex flex-col gap-2 p-4 border border-zinc-200 rounded-md'>
                  <p className=' text-sm !font-semibold'>Start Date</p>

                  <div className=' w-full flex items-center gap-2'>
                     <div className='flex flex-col gap-1 w-full'>
                      <InputText
                        disabled={false}
                        name="startDate"
                        control={form.control}
                        clearErrors={form.clearErrors}
                        placeholder="Type here"
                        type='date'
                        className="!px-2 !py-2 rounded-md"
                        labelClassName="!text-slate-600 truncate min-w-28 !text-sm text-end"
                      />

                    </div>
                  
                  </div>

                   <p className=' text-sm !font-semibold'>Due Date</p>

                  <div className=' w-full flex items-center gap-2'>
                     <div className='flex flex-col gap-1 w-full'>
                      <p className=' text-xs !font-medium'>From</p>
                      <InputText
                        disabled={false}
                        name="dueDateFrom"
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
                        name="dueDateTo"
                        control={form.control}
                        clearErrors={form.clearErrors}
                        placeholder="Type here"
                        type='date'
                        className="!px-2 !py-2 rounded-md"
                        labelClassName="!text-slate-600 truncate min-w-28 !text-sm text-end"
                      />

                    </div>
                  </div>

                    <p className=' text-sm !font-semibold'>Center</p>

                    <div className="flex items-start gap-2 flex-nowrap">
                            <InputText
                                disabled={loading}
                                readOnly
                                name="centerLabel"
                                control={form.control}
                                clearErrors={form.clearErrors}
                                placeholder="Click find to search for center code"
                                className=" !p-2 rounded-md !text-[0.7rem]"
                                labelClassName="truncate min-w-20 !text-[0.7rem] !text-slate-600 text-end"
                            />
                            <CenterSelection centerLabel="centerLabel" centerValue="center" clearErrors={form.clearErrors} setValue={form.setValue} className="text-xs" />
                    </div>

                    <p className=' text-sm !font-semibold'>Account Officer</p>
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

                   
                    
                </div>

                <div className=' w-full flex flex-col gap-2 p-4 border border-zinc-200 rounded-md'>
                  <p className=' text-sm !font-semibold'>Group</p>

                  <InputRadio
                    control={form.control}
                    name="groupBy"
                    disabled={loading}
                    clearErrors={form.clearErrors}
                    options={[
                      { label: 'Group by AO', value: 'acct-officer' },
                      { label: 'Group by Center AO', value: 'center-acct-officer' },
                    ]}
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
                  {form.watch('type') === 'print' ? (
                    <>
                    {canDoAction(token.role, permissions, 'projected collection', 'print') && 
                      <IonButton disabled={loading} type="submit" fill="clear" className="!text-sm capitalize !bg-[#FA6C2F] text-white rounded-[4px]" strong={true}>
                        <FileExportIcon size={15} stroke='.8' className=' mr-1'/>
                        {loading ? 'Loading...' : `${form.watch('type') === 'print' ? 'Print' : 'Export'}`}
                      </IonButton>
                    }
                    </>
                  ): (
                    <>
                    {canDoAction(token.role, permissions, 'projected collection', 'export') && 
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
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProjectedCollections;

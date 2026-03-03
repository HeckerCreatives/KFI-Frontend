import { IonButton, IonContent, IonModal, IonSelect, IonSelectOption, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useRef, useState } from 'react'
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

export default function TBReport() {
     const [present] = useIonToast();
      const [loading, setLoading] = useState(false);
        const modal = useRef<HTMLIonModalElement>(null);
      
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

        function dismiss() {
            form.reset();
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
        
                    const { trialBalances, success,hasPrevPage, hasNextPage, totalPages } = result.data
        
                    if(success){
                       setData(prev => ({
                      ...prev,
                      trialBalances: trialBalances,
                      totalPages: totalPages,
                      nextPage: hasNextPage,
                      prevPage: hasPrevPage,
                    }));
                    }
        
                  } catch (error) {
                  } finally {
                  }
                
            };
    
    
        async function onSubmit(data: TBReportForm) {
          setLoading(true)
    
         
           try {
            if(data.type === 'print'){
               const result = await kfiAxios.get('/report/print/gl/trial-balance',
                {params: data, responseType: 'blob'}
               );
    
                const pdfBlob = new Blob([result.data], { type: 'application/pdf' });
                const pdfUrl = URL.createObjectURL(pdfBlob);
                window.open(pdfUrl, '_blank');
                setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
    
                setLoading(false)
            } else if(data.type === 'export'){
               const result = await kfiAxios.get('/report/export/gl/trial-balance',
                {params: data, responseType: 'blob'}
               );
    
                 const url = window.URL.createObjectURL(new Blob([result.data]));
                const a = document.createElement('a');
                a.href = url;
                a.download = 'trial-balance.xlsx';
                a.click();
                window.URL.revokeObjectURL(url);
    
                setLoading(false)
            }
              
    
            } catch (error: any) {
              setLoading(false)
    
              present({
                message: "No data found.",
                duration: 1200,
              });
    
              
    
              const errs: TErrorData | string = error?.response?.data?.error || error?.response?.data?.msg || error.message;
              const errors: TFormError[] | string = checkError(errs);
              const fields: string[] = Object.keys(form.formState.defaultValues as Object);
              formErrorHandler(errors, form.setError, fields);
            } finally {
            }
          }

          useIonViewWillEnter(() => {
              getList();
            });


  return (
     <>
      <div className="text-end">
        <IonButton fill="clear" id="report-tb-modal" className="max-h-10 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
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
                       placeholder='Due dates'
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
                           {data.trialBalances.map((item, index) => (
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
                      disabled={loading}
                      className=' !w-4'
                      
                    
                    />
                  <p className=' text-xs !w-full'>Summarize Beginning & Ending Balance </p>

                 
                </div>
                <div className=' w-full flex gap-2 p-4 border border-zinc-200 rounded-md'>

                  
                  <InputCheckbox
                      control={form.control}
                      name="includeBalance"
                      disabled={loading}
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

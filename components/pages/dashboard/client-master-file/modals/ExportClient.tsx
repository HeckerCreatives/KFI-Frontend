import { IonButton, IonHeader, IonIcon, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useRef, useState } from 'react';
import kfiAxios from '../../../../utils/axios';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { ClientMasterFile } from '../../../../../types/types';
import { download, print } from 'ionicons/icons';
import { FileExportIcon } from 'hugeicons-react';
import LoanReleaseSelection from '../../../../ui/selections/LoanReleaseSelection';
import { useForm } from 'react-hook-form';
import { SoaFormData, soaSchema } from '../../../../../validations/soa-shema';
import { zodResolver } from '@hookform/resolvers/zod';
import InputText from '../../../../ui/forms/InputText';
import InputRadio from '../../../../ui/forms/InputRadio';

const ExportClient = ({ client }: { client: ClientMasterFile }) => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);

  const modal = useRef<HTMLIonModalElement>(null);
  
    
    const form = useForm<SoaFormData>({
      resolver: zodResolver(soaSchema),
      defaultValues: {
       clientId: client.id,
       type: 'print'
      },
    });

  function dismiss() {
    modal.current?.dismiss();
  }

  async function onSubmit(data:SoaFormData) {
    setLoading(true);
  if(data.type === 'print'){
      try {
      const result = await kfiAxios.get(`/customer/print/soa/${client._id}?loanReleaseId=${data.loanReleaseId}`, { responseType: 'blob' });
       const pdfBlob = new Blob([result.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
    } catch (error: any) {
      present({
        message: 'Failed to print the client profile records. Please try again',
        duration: 1000,
      });
    } finally {
      setLoading(false);
    }
  } else if(data.type === 'export'){
      try {
      const result = await kfiAxios.get(`/customer/export/soa/${client._id}?loanReleaseId=${data.loanReleaseId}`, { responseType: 'blob' });
       const url = window.URL.createObjectURL(new Blob([result.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'clients-soa.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      present({
        message: 'Failed to print the client profile records. Please try again',
        duration: 1000,
      });
    } finally {
      setLoading(false);
    }
  }
  }

  console.log(form.watch('loanReleaseId'))

  return (
    <>
      {/* <div className="text-end">
        <div
          id={`export_client_${client._id}`}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={download} className="text-[1rem]" /> Export
        </div>
      </div> */}
      <IonButton
        type="button"
        fill="clear"
        id={`export_client_${client._id}`}
        className="space-x-1 w-20 h-7 rounded-md ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-pink-50 text-pink-900 capitalize min-h-4 text-xs"
      >
        <IonIcon icon={download} className="text-xs" />
        <span>Soa</span>
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`export_client_${client._id}`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height [--max-width:24rem] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Client - Export" sub="System" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6">
            <ModalHeader disabled={loading} title="Statement of Account" sub="Manage client documents." dismiss={dismiss} />

          <div></div>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <p className=' text-sm mt-4 mb-1'>Loan Release</p>
            <div className=' flex items-center gap-1'>
               <InputText
                name="loanReleaseLabel"
                readOnly
                control={form.control}
                errorClassName=''
                clearErrors={form.clearErrors}
                placeholder="Type here"
                className="!px-2 !py-2 rounded-md w-full"
              />
              <LoanReleaseSelection setValue={form.setValue} clearErrors={form.clearErrors} loanReleaseLabel={'loanReleaseLabel'} loanReleaseValue={'loanReleaseId'}/>

            </div>

            <div className=' w-full flex flex-col gap-2 p-4 border border-zinc-200 rounded-md mt-2'>
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
         
          {/* <div className="text-end mt-4 space-x-2">
            <div className="text-center">
              <IonButton disabled={loading} fill="clear" className="w-full bg-zinc-50 rounded-lg">
                <div className=' flex items-center justify-center gap-2 bg-zinc-50 !border-zinc-300 !border-1 p-3 w-full rounded-md'>
                  <div className=' p-2 bg-green-100 rounded-md flex items-center text-green-800'>
                    <FileExportIcon size={20} stroke='.8' className=' '/>
                  </div>
                  <div className=' flex flex-col !text-sm !text-black !font-medium capitalize text-start'>
                    {loading ? 'Printing...' : 'Statement of Account'}
                    <p className=' text-xs text-zinc-500 capitalize'>Portable Document Format</p>

                  </div>
                </div>
              </IonButton>
              <IonButton fill="clear" className="w-full bg-zinc-50 rounded-lg">
               

                 <div className=' flex items-center justify-center gap-2 bg-zinc-50 !border-zinc-300 !border-1 p-3 w-full rounded-md'>
                  <div className=' p-2 bg-red-100 rounded-md flex items-center text-red-500'>
                    <FileExportIcon size={20} stroke='.8' className=' '/>
                  </div>
                  <div className=' flex flex-col !text-sm !text-black !font-medium capitalize text-start'>
                    {loading ? 'Exporting...' : ' Statement of Account'}
                    <p className=' text-xs text-zinc-500 capitalize'>Spreadsheet Format</p>

                  </div>
                </div>
              </IonButton>
            </div>
          </div> */}
        </div>
      </IonModal>
    </>
  );
};

export default ExportClient;

import { zodResolver } from '@hookform/resolvers/zod';
import { IonButton, IonHeader, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import kfiAxios from '../../../../utils/axios';
import { PrinterIcon } from 'hugeicons-react';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { BegBalanceDocumemtFormData, begbalancedocument } from '../../../../../validations/beginningbalance.schema';
import PrintExportFilterForm from './documentform';


const PrintExport = () => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);
  const [tabActive, setTabActive] = useState('by-document')
  

  const modal = useRef<HTMLIonModalElement>(null);

  const form = useForm<BegBalanceDocumemtFormData>({
      resolver: zodResolver(begbalancedocument),
      defaultValues: {
       type:'print',
       
      },
    });

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }

 async function handlePrint(data: BegBalanceDocumemtFormData) {
  setLoading(true);

  const queryData = {
        year: Number(data.year),
        type: data.type,
       
      }

  try {
   if(data.type === 'print'){
           const result = await kfiAxios.get(`/beginning-balance/print/by-year/${data.year}`,
            {params: queryData, responseType: 'blob'}
           );

            const pdfBlob = new Blob([result.data], { type: 'application/pdf' });
            const pdfUrl = URL.createObjectURL(pdfBlob);
            window.open(pdfUrl, '_blank');
            setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);

            setLoading(false)
        } else if(data.type === 'export'){
           const result = await kfiAxios.get(`/beginning-balance/export/by-year/${data.year}`,
            {params: queryData, responseType: 'blob'}
           );

             const url = window.URL.createObjectURL(new Blob([result.data]));
            const a = document.createElement('a');
            a.href = url;
            a.download = 'beginning-balance.xlsx';
            a.click();
            window.URL.revokeObjectURL(url);

            setLoading(false)
        }
  } catch (error) {
    console.error(error);
    present({
      message:
        "Failed to export the loan release records. Please try again.",
      duration: 1000,
    });
  } finally {
    setLoading(false);
  }
}

const type = form.watch('type')


  return (
    <>
      <IonButton fill="clear" id="print_all_damayan_fund" className="max-h-10 w-32 min-w-32 max-w-32 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
        <PrinterIcon size={15} stroke='.8' className=' mr-1'/>
        
        Print & Export
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`print_all_damayan_fund`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:30rem] md:[--width:100%] lg:[--max-width:30rem] lg:[--width:40%] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Damayan Fund - Print All" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6">
            <ModalHeader disabled={loading} title="Beginning Balance - Print & Export" sub="Manage beginning balance records." dismiss={dismiss} />

        

          <form onSubmit={form.handleSubmit(handlePrint)} className=' mt-4'>
            <PrintExportFilterForm form={form} loading={loading} type={tabActive} />
            <div className="mt-3">
              <IonButton disabled={loading} type="submit" fill="clear" className="w-full capitalize bg-[#FA6C2F] text-white rounded-md font-semibold capitalize">
                
                  <PrinterIcon size={15} stroke='.8' className=' mr-1'/>
                {loading ? `Loading...` : `${type}`}
              </IonButton>
            </div>
          </form>
        </div>
      </IonModal>
    </>
  );
};

export default PrintExport;

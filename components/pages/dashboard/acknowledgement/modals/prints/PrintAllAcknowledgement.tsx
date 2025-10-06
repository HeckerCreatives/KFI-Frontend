import { IonButton, IonHeader, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useRef, useState } from 'react';
import kfiAxios from '../../../../../utils/axios';
import ModalHeader from '../../../../../ui/page/ModalHeader';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import PrintExportFilterForm from '../../components/PrintExportFilterForm';
import { PrinterIcon } from 'hugeicons-react';
import { PrintExportFilterFormData, printExportFilterSchema } from '../../../../../../validations/print-export-schema';

const PrintAllAcknowledgement = () => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);

    const [tabActive, setTabActive] = useState('by-document')
  

  const modal = useRef<HTMLIonModalElement>(null);


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
    form.reset();
    modal.current?.dismiss();
  }

 async function handlePrint(data: PrintExportFilterFormData) {
  setLoading(true);

  try {
    const openAndPrintPDF = (blobData: BlobPart) => {
      const file = new Blob([blobData], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      const printWindow = window.open(fileURL);
      printWindow?.addEventListener("load", () => {
        printWindow.print();
      });
    };

    const params = {
      docNoFrom: data.docNoFromLabel,
      docNoTo: data.docNoToLabel,
      dateFrom: data.dateFrom,
      dateTo: data.dateTo,
      bankIds: data.bankIds,
    };

    let response;

    switch (tabActive) {
      case "by-document":
        response = await kfiAxios.get(
          `/acknowledgement/print/by-document/${data.option}`,
          { responseType: "blob", params }
        );
        break;

      default:
        throw new Error("Invalid tab selected");
    }

    openAndPrintPDF(response.data);

    form.reset();
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

  return (
    <>
      <IonButton fill="clear" id="print_all_acknowledgement" className="max-h-10 w-32 min-w-32 max-w-32 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
        <PrinterIcon size={15} stroke='.8' className=' mr-1'/>
        Print All
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`print_all_acknowledgement`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:30rem] md:[--width:100%] lg:[--max-width:30rem] lg:[--width:50%] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Official Receipt - Print All" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6">
            <ModalHeader disabled={loading} title="Official Receipt - Print" sub="Manage official reciept documents." dismiss={dismiss} />

          <form onSubmit={form.handleSubmit(handlePrint)} className=' mt-4'>
            <PrintExportFilterForm form={form} loading={loading} type={tabActive}/>
            <div className="mt-3">
              <IonButton disabled={loading} type="submit" fill="clear" className="w-full bg-[#FA6C2F] text-white rounded-md font-semibold capitalize">
                <PrinterIcon size={15} stroke='.8' className=' mr-1'/>
                
                {loading ? 'Printing Official Receipt...' : 'Print Official Receipt'}
              </IonButton>
            </div>
          </form>
        </div>
      </IonModal>
    </>
  );
};

export default PrintAllAcknowledgement;

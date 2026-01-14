import { IonButton, IonHeader, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useRef, useState } from 'react';
import kfiAxios from '../../../../utils/axios';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import PrintExportFilterForm from '../components/PrintExportFilterForm';
import { PrinterIcon } from 'hugeicons-react';
import { PrintExportFilterFormData, printExportFilterSchema } from '../../../../../validations/print-export-schema';
import { loanReleaseReportTab, printExportTab } from '../../../../../store/data';
import InputSelect from '../../../../ui/forms/InputSelect';


const PrintAllLoanRelease = () => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);
  const [tabActive, setTabActive] = useState('by-document')
  

  const modal = useRef<HTMLIonModalElement>(null);

  const form = useForm<PrintExportFilterFormData>({
    resolver: zodResolver(printExportFilterSchema),
    defaultValues: {
      docNoFrom: '',
      docNoFromLabel: '',
      docNoTo: '',
      docNoToLabel: '',
      option: 'summary',
      reportType: 'by-document'
    },
  });

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }

  const type = form.watch('reportType')


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

    switch (type) {
      case "by-document":
        response = await kfiAxios.get(
          `/transaction/print/by-document/${data.option}`,
          { responseType: "blob", params }
        );
        break;

      case "by-date":
        response = await kfiAxios.get(
          `/transaction/print/by-date/${data.option}`,
          { responseType: "blob", params }
        );
        break;

      case "by-bank":
        response = await kfiAxios.post(
          `/transaction/print/by-bank`,
          { bankIds: data.bankIds },
          { responseType: "blob" }
        );
        break;

      case "by-accounts":
        response = await kfiAxios.post(
          `/transaction/print/by-accounts/${data.option}`,
          {
            chartOfAccountsIds: data.chartOfAccountsIds,
            dateFrom: data.dateFrom,
            dateTo: data.dateTo,
          },
          { responseType: "blob" }
        );
        break;

        case "past-dues":
        response = await kfiAxios.post(
          `/transaction/print/past-dues`,
          {
            loanReleaseDateFrom: data.loanReleaseDateFrom,
            loanReleaseDateTo: data.loanReleaseDateTo,
          },
          { responseType: "blob" }
        );
        break;

        case "aging-of-loans":
        response = await kfiAxios.post(
          `/transaction/print/aging-of-loans`,
          {
            loanReleaseDateFrom: data.loanReleaseDateFrom,
            loanReleaseDateTo: data.loanReleaseDateTo,
          },
          { responseType: "blob" }
        );
        break;

        case "weekly-collections":
        response = await kfiAxios.post(
          `/transaction/print/weekly-collections`,
          {
            loanReleaseDateFrom: data.loanReleaseDateFrom,
            loanReleaseDateTo: data.loanReleaseDateTo,
          },
          { responseType: "blob" }
        );
        break;

      default:
        throw new Error("Invalid tab selected");
    }

    openAndPrintPDF(response.data);

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

console.log(form.watch('reportType'))



  return (
    <>
      <IonButton fill="clear" id="print_all_loan_release" className="max-h-10 w-fit min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
       <PrinterIcon stroke='.8' size={15} className=' mr-1'/> Reports - Print
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`print_all_loan_release`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height [--max-width:30rem] [--width:95%]"
      >
         
        <div className="inner-content !p-6">
            <ModalHeader disabled={loading} title="Loan Release - Print" sub="Manage loan release documents." dismiss={dismiss} />

          {/* <div className=' flex items-center w-fit mt-2 bg-zinc-50 !rounded-sm'>
            {printExportTab.map((item,index) => (
            <button onClick={() => setTabActive(item.value)} key={item.value} className={` ${tabActive === item.value && 'bg-[#FA6C2F] text-white'} p-2 text-sm !rounded-md`}>{item.name}</button>
            ))}
          </div> */}

          

          <form onSubmit={form.handleSubmit(handlePrint)}>
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
            <div className="mt-3">
              <IonButton disabled={loading} type="submit" fill="clear" className="w-full bg-[#FA6C2F] text-white rounded-md font-semibold">
                <PrinterIcon size={20} stroke='.8' className=' mr-2'/>
                {loading ? 'Printing Loan Release ...' : 'Print Loan Release'}
              </IonButton>
            </div>
          </form>
        </div>
      </IonModal>
    </>
  );
};

export default PrintAllLoanRelease;

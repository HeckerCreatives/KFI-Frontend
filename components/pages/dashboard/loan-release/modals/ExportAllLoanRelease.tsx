import { IonButton, IonHeader, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useRef, useState } from 'react';
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


const ExportAllLoanRelease = () => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);
  const [tabActive, setTabActive] = useState('by-document')

  const modal = useRef<HTMLIonModalElement>(null);

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

    const downloadFile = (blobData: BlobPart, fileName: string) => {
      const blob = new Blob([blobData], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    };

    let response;
    let fileName = "";

    switch (type) {
      case "by-document":
        response = await kfiAxios.get(
          `/transaction/export/by-document/${data.option}`,
          { responseType: "blob", params }
        );
        fileName = "loan-releases-by-document.xlsx";
        break;

      case "by-date":
        response = await kfiAxios.get(
          `/transaction/export/by-date/${data.option}`,
          { responseType: "blob", params }
        );
        fileName = "loan-releases-by-date.xlsx";
        break;

      case "by-bank":
        response = await kfiAxios.post(
          `/transaction/export/by-bank`,
          { bankIds: data.bankIds },
          { responseType: "blob" }
        );
        fileName = "loan-releases-by-banks.xlsx";
        break;

      case "by-accounts":
        response = await kfiAxios.post(
          `/transaction/export/by-accounts/${data.option}`,
          {
            chartOfAccountsIds: data.chartOfAccountsIds,
            dateFrom: data.dateFrom,
            dateTo: data.dateTo,
          },
          { responseType: "blob" }
        );
        fileName = "loan-releases-by-accounts.xlsx";
        break;

        case "past-dues":
        response = await kfiAxios.post(
          `/transaction/export/past-dues`,
          {
            loanReleaseDateFrom: data.loanReleaseDateFrom,
            loanReleaseDateTo: data.loanReleaseDateTo,
          },
          { responseType: "blob" }
        );
        fileName = "loan-releases-past-dues.xlsx";
        break;

        case "aging-of-loans":
        response = await kfiAxios.post(
          `/transaction/export/aging-of-loans`,
          {
            loanReleaseDateFrom: data.loanReleaseDateFrom,
            loanReleaseDateTo: data.loanReleaseDateTo,
          },
          { responseType: "blob" }
        );
        fileName = "loan-releases-aging-of-loans.xlsx";
        break;

        case "weekly-collections":
        response = await kfiAxios.post(
          `/transaction/export/weekly-collections`,
          {
            loanReleaseDateFrom: data.loanReleaseDateFrom,
            loanReleaseDateTo: data.loanReleaseDateTo,
          },
          { responseType: "blob" }
        );
        fileName = "loan-releases-weekly-collections.xlsx";
        break;



      default:
        throw new Error("Invalid tab selected");
    }

    downloadFile(response.data, fileName);

    // form.reset();
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


  return (
    <>
      <IonButton fill="clear" id="export_all_loan_release" className="max-h-10 w-fit min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
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

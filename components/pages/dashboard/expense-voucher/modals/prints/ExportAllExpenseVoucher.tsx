import { IonButton, IonHeader, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useRef, useState } from 'react';
import kfiAxios from '../../../../../utils/axios';
import ModalHeader from '../../../../../ui/page/ModalHeader';
import { useForm } from 'react-hook-form';
import PrintExportFilterForm from '../../components/PrintExportFilterForm';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileExportIcon } from 'hugeicons-react';
import { PrintExportFilterFormData, printExportFilterSchema } from '../../../../../../validations/print-export-schema';
import { printExportTab } from '../../../../../../store/data';

const ExportAllExpenseVoucher = () => {
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
      coaSelected: []
    },
  });


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

    switch (tabActive) {
      case "by-document":
        response = await kfiAxios.get(
          `/expense-voucher/export/by-document/${data.option}`,
          { responseType: "blob", params }
        );
        fileName = "expense-voucher-by-document.xlsx";
        break;

      case "by-date":
        response = await kfiAxios.get(
          `/expense-voucher/export/by-date/${data.option}`,
          { responseType: "blob", params }
        );
        fileName = "expense-voucher-by-date.xlsx";
        break;

      case "by-bank":
        response = await kfiAxios.post(
          `/expense-voucher/export/by-bank`,
          { bankIds: data.bankIds },
          { responseType: "blob" }
        );
        fileName = "expense-voucher-by-banks.xlsx";
        break;

      case "by-accounts":
        response = await kfiAxios.post(
          `/expense-voucher/export/by-accounts/${data.option}`,
          {
            chartOfAccountsIds: data.chartOfAccountsIds,
            dateFrom: data.dateFrom,
            dateTo: data.dateTo,
          },
          { responseType: "blob" }
        );
        fileName = "expense-voucher-by-accounts.xlsx";
        break;

      default:
        throw new Error("Invalid tab selected");
    }

    downloadFile(response.data, fileName);

    form.reset();
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
      <IonButton
        fill="clear"
        id="export_all_expense_voucher"
        className="max-h-10 w-32 min-w-32 max-w-32 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md"
        strong
      >
        <FileExportIcon stroke='.8' size={15} className=' mr-2'/>
        Export All
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`export_all_expense_voucher`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:30rem] md:[--width:100%] lg:[--max-width:30rem] lg:[--width:40%] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Expense Voucher - Export All" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6">
            <ModalHeader disabled={loading} title="Expense Voucher - Export" sub="Manage expense voucher documents." dismiss={dismiss} />

             <div className=' flex items-center w-fit mt-2 bg-zinc-50 !rounded-sm'>
              {printExportTab.map((item,index) => (
              <button onClick={() => setTabActive(item.value)} key={item.value} className={` ${tabActive === item.value && 'bg-[#FA6C2F] text-white'} p-2 text-sm !rounded-md`}>{item.name}</button>
              ))}
            </div>

          <form onSubmit={form.handleSubmit(handlePrint)}>
            <PrintExportFilterForm form={form} loading={loading} type={tabActive} />
            <div className="mt-3">
              <IonButton disabled={loading} type="submit" fill="clear" className="w-full bg-[#FA6C2F] text-white rounded-md font-semibold capitalize">
                <FileExportIcon size={15} stroke='.8' className=' mr-1'/>
                {loading ? 'Exporting Expense Voucher...' : 'Export Expense Voucher'}
              </IonButton>
            </div>
          </form>
        </div>
      </IonModal>
    </>
  );
};

export default ExportAllExpenseVoucher;

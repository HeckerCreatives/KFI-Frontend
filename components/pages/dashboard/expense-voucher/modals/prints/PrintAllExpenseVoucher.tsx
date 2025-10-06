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
import { printExportTab } from '../../../../../../store/data';


const PrintAllExpenseVoucher = () => {
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
          `/expense-voucher/print/by-document/${data.option}`,
          { responseType: "blob", params }
        );
        break;

      case "by-date":
        response = await kfiAxios.get(
          `/expense-voucher/print/by-date/${data.option}`,
          { responseType: "blob", params }
        );
        break;

      case "by-bank":
        response = await kfiAxios.post(
          `/expense-voucher/print/by-bank`,
          { bankIds: data.bankIds },
          { responseType: "blob" }
        );
        break;

      case "by-accounts":
        response = await kfiAxios.post(
          `/expense-voucher/print/by-accounts/${data.option}`,
          {
            chartOfAccountsIds: data.chartOfAccountsIds,
            dateFrom: data.dateFrom,
            dateTo: data.dateTo,
          },
          { responseType: "blob" }
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
      <IonButton fill="clear" id="print_all_expense_voucher" className="max-h-10 w-32 min-w-32 max-w-32 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
        <PrinterIcon size={15} stroke='.8' className=' mr-2'/>
        Print All
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`print_all_expense_voucher`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:30rem] md:[--width:100%] lg:[--max-width:30rem] lg:[--width:40%] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Expense Voucher - Print All" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6">
            <ModalHeader disabled={loading} title="Expense Voucher - Print" sub="Manage expense voucher documents." dismiss={dismiss} />

             <div className=' flex items-center w-fit mt-2 bg-zinc-50 !rounded-sm'>
              {printExportTab.map((item,index) => (
              <button onClick={() => setTabActive(item.value)} key={item.value} className={` ${tabActive === item.value && 'bg-[#FA6C2F] text-white'} p-2 text-sm !rounded-md`}>{item.name}</button>
              ))}
            </div>

          <form onSubmit={form.handleSubmit(handlePrint)}>
            <PrintExportFilterForm form={form} loading={loading} type={tabActive}/>
            <div className="mt-3">
              <IonButton disabled={loading} type="submit" fill="clear" className="w-full bg-[#FA6C2F] text-white rounded-md font-semibold capitalize">
                <PrinterIcon size={20} stroke='.8' className=' mr-1'/>
                {loading ? 'Printing Expense Voucher...' : 'Print Expense Voucher'}
              </IonButton>
            </div>
          </form>
        </div>
      </IonModal>
    </>
  );
};

export default PrintAllExpenseVoucher;

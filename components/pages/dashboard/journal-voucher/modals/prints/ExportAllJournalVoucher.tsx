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

export const journalVoucherFilterSchema = z.object({
  docNoFrom: z.string().optional().or(z.literal('')),
  docNoFromLabel: z.string().optional().or(z.literal('')),
  docNoTo: z.string().optional().or(z.literal('')),
  docNoToLabel: z.string().optional().or(z.literal('')),
  option: z.string().optional().or(z.literal('')),
});

export type JournalVoucherFilterFormData = z.infer<typeof journalVoucherFilterSchema>;

const ExportAllJournalVoucher = () => {
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
    modal.current?.dismiss();
  }


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
              `/journal-voucher/export/by-document/${data.option}`,
              { responseType: "blob", params }
            );
            fileName = "journal-voucher-by-document.xlsx";
            break;

          case "by-date":
            response = await kfiAxios.get(
              `/journal-voucher/export/by-date/${data.option}`,
              { responseType: "blob", params }
            );
            fileName = "journal-voucher-by-date.xlsx";
            break;

          case "by-bank":
            response = await kfiAxios.post(
              `/journal-voucher/export/by-bank`,
              { bankIds: data.bankIds },
              { responseType: "blob" }
            );
            fileName = "journal-voucher-by-banks.xlsx";
            break;

          case "by-accounts":
            response = await kfiAxios.post(
              `/journal-voucher/export/by-accounts/${data.option}`,
              {
                chartOfAccountsIds: data.chartOfAccountsIds,
                dateFrom: data.dateFrom,
                dateTo: data.dateTo,
              },
              { responseType: "blob" }
            );
            fileName = "journal-voucher-by-accounts.xlsx";
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
        id="export_all_journal_voucher"
        className="max-h-10 w-32 min-w-32 max-w-32 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md"
        strong
      >
        <FileExportIcon size={15} stroke='.8' className=' mr-2'/>
        
        Export All
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`export_all_journal_voucher`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height [--max-width:30rem] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Journal Voucher - Export All" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6">
            <ModalHeader disabled={loading} title="Journal Voucher - Export" sub="Manage journal voucher documents." dismiss={dismiss} />

             <div className=' flex items-center w-fit mt-2 bg-zinc-50 !rounded-sm'>
              {printExportTab.map((item,index) => (
              <button onClick={() => setTabActive(item.value)} key={item.value} className={` ${tabActive === item.value && 'bg-[#FA6C2F] text-white'} p-2 text-sm !rounded-md`}>{item.name}</button>
              ))}
            </div>

          <form onSubmit={form.handleSubmit(handlePrint)} className='mt-4'>
            <PrintExportFilterForm form={form} loading={loading} type={tabActive} />
            <div className="mt-3">
              <IonButton disabled={loading} type="submit" fill="clear" className="w-full bg-[#FA6C2F] text-white rounded-md font-semibold capitalize">
                <FileExportIcon size={20} stroke='.8' className=' mr-1'/>
                {loading ? 'Exporting Journal Voucher...' : 'Export Journal Voucher'}
              </IonButton>
            </div>
          </form>
        </div>
      </IonModal>
    </>
  );
};

export default ExportAllJournalVoucher;

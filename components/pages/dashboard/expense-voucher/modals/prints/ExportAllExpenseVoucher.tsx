import { IonButton, IonHeader, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useRef, useState } from 'react';
import kfiAxios from '../../../../../utils/axios';
import ModalHeader from '../../../../../ui/page/ModalHeader';
import { useForm } from 'react-hook-form';
import PrintExportFilterForm from '../../components/PrintExportFilterForm';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileExportIcon } from 'hugeicons-react';


export const expenseVoucherFilterSchema = z.object({
  docNoFrom: z.string().optional().or(z.literal('')),
  docNoFromLabel: z.string().optional().or(z.literal('')),
  docNoTo: z.string().optional().or(z.literal('')),
  docNoToLabel: z.string().optional().or(z.literal('')),
  option: z.string().optional().or(z.literal('')),
});

export type ExpenseVoucherFilterFormData = z.infer<typeof expenseVoucherFilterSchema>;

const ExportAllExpenseVoucher = () => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);

  const modal = useRef<HTMLIonModalElement>(null);

  function dismiss() {
    modal.current?.dismiss();
  }

  const form = useForm<ExpenseVoucherFilterFormData>({
    resolver: zodResolver(expenseVoucherFilterSchema),
    defaultValues: {
      docNoFrom: '',
      docNoFromLabel: '',
      docNoTo: '',
      docNoToLabel: '',
      option: 'summary',
    },
  });

  async function handlePrint(data: ExpenseVoucherFilterFormData) {
    setLoading(true);
    try {
      const params = { docNoFrom: data.docNoFromLabel, docNoTo: data.docNoToLabel };
      const result = await kfiAxios.get(`/expense-voucher/export-all/${data.option}`, { params, responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([result.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'expense-vouchers.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      present({
        message: 'Failed to export the expense voucher records. Please try again',
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
            <ModalHeader disabled={loading} title="Expense Voucher - Export All" sub="Manage expense voucher documents." dismiss={dismiss} />

          <form onSubmit={form.handleSubmit(handlePrint)}>
            <PrintExportFilterForm form={form} loading={loading} />
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

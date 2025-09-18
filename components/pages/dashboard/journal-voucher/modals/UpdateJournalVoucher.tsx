import React, { useEffect, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, IonIcon, useIonToast } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { createSharp } from 'ionicons/icons';
import { JournalVoucherFormData, journalVoucherSchema } from '../../../../../validations/journal-voucher.schema';
import { JournalVoucher, JournalVoucherEntry, TErrorData, TFormError } from '../../../../../types/types';
import { TData } from '../JournalVoucher';
import { formatDateInput } from '../../../../utils/date-utils';
import kfiAxios from '../../../../utils/axios';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';
import JournalVoucherForm from '../components/JournalVoucherForm';
import UpdateJVEntries from '../components/UpdateJVEntries';
import { formatAmount, removeAmountComma } from '../../../../ui/utils/formatNumber';
import Signatures from '../../../../ui/common/Signatures';

type UpdateJournalVoucherProps = {
  journalVoucher: JournalVoucher;
  setData: React.Dispatch<React.SetStateAction<TData>>;
};

const UpdateJournalVoucher = ({ journalVoucher, setData }: UpdateJournalVoucherProps) => {
  const [present] = useIonToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<JournalVoucherEntry[]>(journalVoucher.entries || []);
  const [preventries, setPrevEntries] = useState<JournalVoucherEntry[]>(journalVoucher.entries || []);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  


  const form = useForm<JournalVoucherFormData>({
    resolver: zodResolver(journalVoucherSchema),
    defaultValues: {
      code: '',
      nature: '',
      refNo: '',
      remarks: '',
      date: formatDateInput(new Date().toISOString()),
      acctMonth: `${new Date().getMonth() + 1}`,
      acctYear: `${new Date().getFullYear()}`,
      checkNo: '',
      checkDate: '',
      bank: '',
      bankLabel: '',
      amount: '0',
      mode: 'update',
      entries: [],

    },
  });

  useEffect(() => {
    if (journalVoucher) {
      form.reset({
        code: journalVoucher.code,
        nature: journalVoucher.nature,
        refNo: journalVoucher.refNo,
        remarks: journalVoucher.remarks,
        date: formatDateInput(journalVoucher.date),
        acctMonth: `${journalVoucher.acctMonth}`,
        acctYear: `${journalVoucher.acctYear}`,
        checkNo: `${journalVoucher.checkNo}`,
        checkDate: formatDateInput(journalVoucher.checkDate),
        bank: journalVoucher.bankCode._id,
        bankLabel: `${journalVoucher.bankCode.code}`,
        amount: `${formatAmount(journalVoucher.amount)}`,
        mode: 'update',
         entries: journalVoucher.entries,
      });
    }
  }, [journalVoucher, form]);

  function dismiss() {
    form.reset();
    setIsOpen(false);
    setDeletedIds([])
  }

  async function onSubmit(data: JournalVoucherFormData) {
    setLoading(true);
    

    data.amount = removeAmountComma(data.amount);
    try {

      const finalDeletedIds = deletedIds.filter((id) =>
      preventries.some((e) => e._id === id)
      );

      const prevIds = new Set(preventries.map((e) => e._id));
      const formattedEntries = entries.map((entry, index) => {
        const isExisting = prevIds.has(entry._id);
        return {
          _id: isExisting ? entry._id : undefined,
          client: entry.client?._id ?? "",
          clientLabel: entry.client.name ?? "",
          particular: entry.particular,
          acctCodeId: entry.acctCode?._id ?? "",
          acctCode: entry.acctCode?.code ?? "",
          description: entry.acctCode?.description ?? "",
          debit: entry.debit?.toString() ?? "",
          credit: entry.credit?.toString() ?? "",
          cvForRecompute: entry.cvForRecompute
        };
      });

      const result = await kfiAxios.put(`/journal-voucher/${journalVoucher._id}`, {...data, entries: formattedEntries, deletedIds: finalDeletedIds});
      const { success, journalVoucher: updatedJournalVoucher } = result.data;
      if (success) {
        setData(prev => {
          const index = prev.journalVouchers.findIndex(journalVoucher => journalVoucher._id === updatedJournalVoucher._id);
          if (index < 0) return prev;
          prev.journalVouchers[index] = { ...updatedJournalVoucher };
          return { ...prev };
        });
        present({
          message: 'Journal voucher successfully updated.',
          duration: 1000,
        });
        dismiss()
        return;
      }
      present({
        message: 'Failed to update the journal voucher',
        duration: 1000,
      });
    } catch (error: any) {
      const errs: TErrorData | string = error?.response?.data?.error || error?.response?.data?.msg || error.message;
      const errors: TFormError[] | string = checkError(errs);
      const fields: string[] = Object.keys(form.formState.defaultValues as Object);
      formErrorHandler(errors, form.setError, fields);
    } finally {
      setLoading(false);
    }
  }

  console.log(entries)

  return (
    <>
      {/* <div className="text-end">
        <div
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={createSharp} className="text-[1rem]" /> Edit
        </div>
      </div> */}
      <IonButton
        onClick={() => setIsOpen(true)}
        type="button"
        fill="clear"
        className="space-x-1 rounded-md w-16 h-7 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-blue-50 text-blue-900 capitalize min-h-4 text-xs"
      >
        <IonIcon icon={createSharp} className="text-xs" />
        <span>Edit</span>
      </IonButton>
      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height [--max-width:74rem] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader title="Journal Voucher - Edit Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content max-h-[90%] h-full !p-6 flex flex-col">
            <ModalHeader title="Journal Voucher - Edit Record" sub="Manage journal voucher." dismiss={dismiss} />

          <form onSubmit={form.handleSubmit(onSubmit)} className='mt-4'>
            <div>
              <JournalVoucherForm form={form} loading={loading} />
            </div>
            <div className="text-end space-x-1 px-2 pb-2">
              <IonButton disabled={loading} type="submit" fill="clear" className="!text-sm capitalize !bg-[#FA6C2F] text-white rounded-[4px]" strong={true}>
                {loading ? 'Saving...' : 'Save Changes'}
              </IonButton>
            </div>
          </form>

            {form.formState.errors.root && <div className="text-sm text-red-600 italic text-center">{form.formState.errors.root.message}</div>}

          <div className="border-t border-t-slate-200 mx-2 pt-5 flex-1">
            <UpdateJVEntries isOpen={isOpen} journalVoucher={journalVoucher} 
              entries={entries}
             setEntries={setEntries}
             setPrevEntries={setPrevEntries}
             setDeletedIds={setDeletedIds}
             deletedIds={deletedIds}
            />
          </div>
          <Signatures open={isOpen} type={'journal voucher'}/>
          
        </div>
      </IonModal>
    </>
  );
};

export default UpdateJournalVoucher;

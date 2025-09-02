import React, { useEffect, useRef, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, useIonToast, IonIcon } from '@ionic/react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { EmergencyLoanFormData, emergencyLoanSchema } from '../../../../../validations/emergency-loan.schema';
import EmergencyLoanForm from '../components/EmergencyLoanForm';
import EmergencyLoanFormTable from '../components/EmergencyLoanFormTable';
import kfiAxios from '../../../../utils/axios';
import { EmergencyLoan, EmergencyLoanEntry, TErrorData, TFormError } from '../../../../../types/types';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';
import { createSharp } from 'ionicons/icons';
import { TData } from '../EmergencyLoan';
import UpdateELEntries from '../components/UpdateELEntries';
import { formatDateInput } from '../../../../utils/date-utils';
import { formatAmount, removeAmountComma } from '../../../../ui/utils/formatNumber';

type UpdateEmergencyLoanProps = {
  emergencyLoan: EmergencyLoan;
  setData: React.Dispatch<React.SetStateAction<TData>>;
};

const UpdateEmergencyLoan = ({ emergencyLoan, setData }: UpdateEmergencyLoanProps) => {
  const [present] = useIonToast();

  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [entries, setEntries] = useState<EmergencyLoanEntry[]>(emergencyLoan.entries || []);
  const [preventries, setPrevEntries] = useState<EmergencyLoanEntry[]>(emergencyLoan.entries || []);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  const form = useForm<EmergencyLoanFormData>({
    resolver: zodResolver(emergencyLoanSchema),
    defaultValues: {
      code: '',
      centerLabel: '',
      centerValue: '',
      refNo: '',
      remarks: '',
      date: formatDateInput(new Date().toISOString()),
      acctMonth: `${new Date().getMonth() + 1}`,
      acctYear: `${new Date().getFullYear()}`,
      checkNo: '',
      checkDate: '',
      bankCode: '',
      bankCodeLabel: '',
      amount: '0',
      mode: 'update',
    },
  });

  useEffect(() => {
    if (emergencyLoan) {
      form.reset({
        code: emergencyLoan.code,
        centerLabel: emergencyLoan?.center?.centerNo,
        centerValue: emergencyLoan?.center?._id,
        refNo: emergencyLoan.refNo,
        remarks: emergencyLoan.remarks,
        date: formatDateInput(emergencyLoan.date),
        acctMonth: `${emergencyLoan.acctMonth}`,
        acctYear: `${emergencyLoan.acctYear}`,
        checkNo: emergencyLoan.checkNo,
        checkDate: formatDateInput(emergencyLoan.checkDate),
        bankCode: emergencyLoan.bankCode._id,
        bankCodeLabel: `${emergencyLoan.bankCode.code}`,
        amount: `${formatAmount(emergencyLoan.amount)}`,
        mode: 'update',
      });
    }
  }, [emergencyLoan, form]);

  function dismiss() {
    form.reset();
    setIsOpen(false);
    setDeletedIds([])
  }

  function normalizeCVNumber(cv: string): string {
    if (!cv) return "";

    return cv.replace(/^(CV#)+/, "CV#");
  }

  function removeCVTag(cv: string): string {
    if (!cv) return "";
    return cv.replace(/CV#/g, "");
  }

  

  async function onSubmit(data: EmergencyLoanFormData) {
    setLoading(true);
    try {

       const finalDeletedIds = deletedIds.filter((id) =>
      preventries.some((e) => e._id === id)
      );

      const prevIds = new Set(preventries.map((e) => e._id));

      const formattedEntries = entries.map((entry, index) => {
        const isExisting = prevIds.has(entry._id);
        return {
            _id: isExisting ? entry._id : undefined,
            client: entry.client._id,
            clientLabel: entry.client.name,
            particular: entry.particular,
            acctCodeId: entry.acctCode._id,
            acctCode: entry.acctCode.code,
            description: entry.acctCode.description,
            debit: entry.debit,
            credit: entry.debit
        };
      });
      data.amount = removeAmountComma(data.amount);
      const result = await kfiAxios.put(`emergency-loan/${emergencyLoan._id}`, {...data, entries: formattedEntries, deletedIds: finalDeletedIds});
      const { success, emergencyLoan: updatedEmergencyLoan } = result.data;
      if (success) {
        setData(prev => {
          const index = prev.emergencyLoans.findIndex(emergencyLoan => emergencyLoan._id === updatedEmergencyLoan._id);
          if (index < 0) return prev;
          prev.emergencyLoans[index] = { ...updatedEmergencyLoan };
          return { ...prev };
        });
        present({
          message: 'Emergency loan successfully updated.',
          duration: 1000,
        });
        dismiss()
        return;
      }
      present({
        message: 'Failed to update the emergency loan',
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
        className=" [--border-radius:0.35rem] auto-height [--max-width:84rem] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Emergency Loan - Edit Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content max-h-[90%] h-full !p-6 flex flex-col ">
            <ModalHeader disabled={loading} title="Emergency Loan - Edit Record" sub="Transaction" dismiss={dismiss} />

          <form onSubmit={form.handleSubmit(onSubmit)} className=' mt-4'>
            <div className="mb-3">
              <EmergencyLoanForm form={form} loading={loading} />
            </div>
            <div className="text-end space-x-1 px-2 pb-2">
              <IonButton disabled={loading} type="submit" fill="clear" className="!text-sm capitalize !bg-[#FA6C2F] text-white rounded-[4px]" strong={true}>
                {loading ? 'Saving...' : 'Save'}
              </IonButton>
              <IonButton disabled={loading} onClick={dismiss} color="danger" type="button" className="!text-sm capitalize" strong={true}>
                Cancel
              </IonButton>
            </div>
          </form>
          <div className="border-t border-t-slate-200 mx-2 pt-5 flex-1">
            <UpdateELEntries isOpen={isOpen} emergencyLoan={emergencyLoan} entries={entries} setEntries={setEntries} deletedIds={deletedIds} setDeletedIds={setDeletedIds} setPrevEntries={setPrevEntries} />
          </div>

            {form.formState.errors.root && <div className="text-sm text-red-600 italic text-center">{form.formState.errors.root.message}</div>}

        </div>
      </IonModal>
    </>
  );
};

export default UpdateEmergencyLoan;

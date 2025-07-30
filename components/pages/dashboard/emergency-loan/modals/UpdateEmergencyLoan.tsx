import React, { useEffect, useRef, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, useIonToast, IonIcon } from '@ionic/react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { EmergencyLoanFormData, emergencyLoanSchema } from '../../../../../validations/emergency-loan.schema';
import EmergencyLoanForm from '../components/EmergencyLoanForm';
import EmergencyLoanFormTable from '../components/EmergencyLoanFormTable';
import kfiAxios from '../../../../utils/axios';
import { EmergencyLoan, TErrorData, TFormError } from '../../../../../types/types';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';
import { createSharp } from 'ionicons/icons';
import { TData } from '../EmergencyLoan';
import UpdateELEntries from '../components/UpdateELEntries';
import { formatDateInput } from '../../../../utils/date-utils';

type UpdateEmergencyLoanProps = {
  emergencyLoan: EmergencyLoan;
  setData: React.Dispatch<React.SetStateAction<TData>>;
};

const UpdateEmergencyLoan = ({ emergencyLoan, setData }: UpdateEmergencyLoanProps) => {
  const [present] = useIonToast();

  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm<EmergencyLoanFormData>({
    resolver: zodResolver(emergencyLoanSchema),
    defaultValues: {
      code: '',
      supplier: '',
      supplierLabel: '',
      refNo: '',
      remarks: '',
      date: '',
      acctMonth: '',
      acctYear: '',
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
        supplier: emergencyLoan.supplier._id,
        supplierLabel: `${emergencyLoan.supplier.code} - ${emergencyLoan.supplier.description}`,
        refNo: emergencyLoan.refNo,
        remarks: emergencyLoan.remarks,
        date: formatDateInput(emergencyLoan.date),
        acctMonth: `${emergencyLoan.acctMonth}`,
        acctYear: `${emergencyLoan.acctYear}`,
        checkNo: emergencyLoan.checkNo,
        checkDate: formatDateInput(emergencyLoan.checkDate),
        bankCode: emergencyLoan.bankCode._id,
        bankCodeLabel: `${emergencyLoan.bankCode.code} - ${emergencyLoan.bankCode.description}`,
        amount: `${emergencyLoan.amount}`,
        mode: 'update',
      });
    }
  }, [emergencyLoan, form]);

  function dismiss() {
    form.reset();
    setIsOpen(false);
  }

  async function onSubmit(data: EmergencyLoanFormData) {
    setLoading(true);
    try {
      const result = await kfiAxios.put(`emergency-loan/${emergencyLoan._id}`, data);
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
        className="space-x-1 rounded-lg w-16 h-6 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-[#ff9a00] text-slate-700 capitalize min-h-4 text-xs"
      >
        <IonIcon icon={createSharp} className="text-xs" />
        <span>Edit</span>
      </IonButton>
      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:95%] lg:[--width:95%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Emergency Loan - Edit Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content h-screen !px-0 flex flex-col">
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
          <div className="border-t border-t-slate-400 mx-2 pt-5 flex-1">
            <UpdateELEntries isOpen={isOpen} emergencyLoan={emergencyLoan} />
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default UpdateEmergencyLoan;

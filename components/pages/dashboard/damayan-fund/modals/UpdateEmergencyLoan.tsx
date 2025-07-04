import React, { useEffect, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, useIonToast, IonIcon } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { EmergencyLoanFormData, emergencyLoanSchema } from '../../../../../validations/emergency-loan.schema';
import kfiAxios from '../../../../utils/axios';
import { DamayanFund, TErrorData, TFormError } from '../../../../../types/types';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';
import { createSharp } from 'ionicons/icons';
import { TData } from '../DamayanFund';
import { formatDateInput } from '../../../../utils/date-utils';
import DamayanFundForm from '../components/DamayanFundForm';
import UpdateDFEntries from '../components/UpdateDFEntries';

type UpdateDamayanFundProps = {
  damayanFund: DamayanFund;
  setData: React.Dispatch<React.SetStateAction<TData>>;
};

const UpdateDamayanFund = ({ damayanFund, setData }: UpdateDamayanFundProps) => {
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
    if (damayanFund) {
      form.reset({
        code: damayanFund.code,
        supplier: damayanFund.supplier._id,
        supplierLabel: `${damayanFund.supplier.code} - ${damayanFund.supplier.description}`,
        refNo: damayanFund.refNo,
        remarks: damayanFund.remarks,
        date: formatDateInput(damayanFund.date),
        acctMonth: `${damayanFund.acctMonth}`,
        acctYear: `${damayanFund.acctYear}`,
        checkNo: damayanFund.checkNo,
        checkDate: formatDateInput(damayanFund.checkDate),
        bankCode: damayanFund.bankCode._id,
        bankCodeLabel: `${damayanFund.bankCode.code} - ${damayanFund.bankCode.description}`,
        amount: `${damayanFund.amount}`,
        mode: 'update',
      });
    }
  }, [damayanFund, form]);

  function dismiss() {
    form.reset();
    setIsOpen(false);
  }

  async function onSubmit(data: EmergencyLoanFormData) {
    setLoading(true);
    try {
      const result = await kfiAxios.put(`damayan-fund/${damayanFund._id}`, data);
      const { success, emergencyLoan: updatedEmergencyLoan } = result.data;
      if (success) {
        setData(prev => {
          const index = prev.damayanFunds.findIndex(damayanFund => damayanFund._id === updatedEmergencyLoan._id);
          if (index < 0) return prev;
          prev.damayanFunds[index] = { ...updatedEmergencyLoan };
          return { ...prev };
        });
        present({
          message: 'Damayan fund successfully updated.',
          duration: 1000,
        });
        return;
      }
      present({
        message: 'Failed to update the damayan fund',
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
      <div className="text-end">
        <div
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={createSharp} className="text-[1rem]" /> Edit
        </div>
      </div>
      <IonModal isOpen={isOpen} backdropDismiss={false} className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:95%] lg:[--width:95%]">
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader disabled={loading} title="Damayan Fund - Edit Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content !px-0">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-3">
              <DamayanFundForm form={form} loading={loading} />
            </div>
            <div className="text-end space-x-1 px-2 pb-2">
              <IonButton disabled={loading} color="tertiary" type="submit" className="!text-sm capitalize" strong={true}>
                {loading ? 'Saving...' : 'Save'}
              </IonButton>
              <IonButton disabled={loading} onClick={dismiss} color="danger" type="button" className="!text-sm capitalize" strong={true}>
                Cancel
              </IonButton>
            </div>
          </form>
          <div className="border-t border-t-slate-400 mx-2 pt-5">
            <UpdateDFEntries isOpen={isOpen} damayanFund={damayanFund} />
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default UpdateDamayanFund;

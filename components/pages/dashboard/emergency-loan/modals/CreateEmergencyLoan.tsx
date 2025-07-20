import React, { useRef, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, useIonToast } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { EmergencyLoanFormData, emergencyLoanSchema } from '../../../../../validations/emergency-loan.schema';
import EmergencyLoanForm from '../components/EmergencyLoanForm';
import EmergencyLoanFormTable from '../components/EmergencyLoanFormTable';
import kfiAxios from '../../../../utils/axios';
import { TErrorData, TFormError } from '../../../../../types/types';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';

type CreateEmergencyLoanProps = {
  getEmergencyLoans: (page: number, keyword?: string, sort?: string) => void;
};

const CreateEmergencyLoan = ({ getEmergencyLoans }: CreateEmergencyLoanProps) => {
  const [present] = useIonToast();
  const modal = useRef<HTMLIonModalElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

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
      entries: [],
      mode: 'create',
    },
  });

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }

  async function onSubmit(data: EmergencyLoanFormData) {
    setLoading(true);
    try {
      const result = await kfiAxios.post('/emergency-loan', data);
      const { success } = result.data;
      if (success) {
        getEmergencyLoans(1);
        present({
          message: 'Emergency loan successfully added.',
          duration: 1000,
        });
        dismiss();
        return;
      }
      present({
        message: 'Failed to add a new emergency loan. Please try again.',
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
        <IonButton
          fill="clear"
          id="create-loanRelease-modal"
          className="max-h-10 min-h-6 min-w-32 max-w-32 w-32 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md"
          strong
        >
          + Add Record
        </IonButton>
      </div>
      <IonModal
        ref={modal}
        trigger="create-loanRelease-modal"
        backdropDismiss={false}
        className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:95%] lg:[--width:95%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Emergency Loan - Add Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content !px-0">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-3">
              <EmergencyLoanForm form={form} loading={loading} />
              <EmergencyLoanFormTable form={form} />
            </div>
            <div className="text-end space-x-1 px-2">
              <IonButton disabled={loading} color="tertiary" type="submit" className="!text-sm capitalize" strong={true}>
                {loading ? 'Saving...' : 'Save'}
              </IonButton>
              <IonButton disabled={loading} onClick={dismiss} color="danger" type="button" className="!text-sm capitalize" strong={true}>
                Cancel
              </IonButton>
            </div>
          </form>
        </div>
      </IonModal>
    </>
  );
};

export default CreateEmergencyLoan;

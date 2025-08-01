import React, { useEffect, useRef, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, useIonToast } from '@ionic/react';
import { FieldError, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import LoanReleaseFormTable from '../components/LoanReleaseFormTable';
import LoanReleaseForm from '../components/LoanReleaseForm';
import { EntryFormData, LoanReleaseFormData, loanReleaseSchema } from '../../../../../validations/loan-release.schema';
import kfiAxios from '../../../../utils/axios';
import { TErrorData, TFormError } from '../../../../../types/types';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';

type CreateLoanReleaseProps = {
  getTransactions: (page: number, keyword?: string, sort?: string) => void;
};

const CreateLoanRelease = ({ getTransactions }: CreateLoanReleaseProps) => {
  const [present] = useIonToast();
  const modal = useRef<HTMLIonModalElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<LoanReleaseFormData>({
    resolver: zodResolver(loanReleaseSchema),
    defaultValues: {
      cvNo: '',
      center: '',
      centerLabel: '',
      name: '',
      refNumber: '',
      remarks: '',
      date: '',
      acctMonth: '',
      acctYear: '',
      noOfWeeks: '',
      typeOfLoan: '',
      typeOfLoanLabel: '',
      checkNo: '',
      checkDate: '',
      bankCode: '',
      bankCodeLabel: '',
      amount: '',
      cycle: '',
      interestRate: '',
      isEduc: false,
      entries: [],
    },
  });

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }

  async function onSubmit(data: LoanReleaseFormData) {
    const glEntries = data.entries.filter((entry: EntryFormData) => entry.debit !== '' || entry.credit !== '' || entry.checkNo !== '' || entry.cycle !== '');
    if (glEntries.length < 1) {
      form.setError('entries', { message: 'Atleast 1 entry is required' });
      return;
    }
    data.entries = glEntries;
    setLoading(true);
    try {
      const result = await kfiAxios.post('transaction/loan-release', data);
      const { success } = result.data;
      if (success) {
        getTransactions(1);
        present({
          message: 'Loan release successfully added.',
          duration: 1000,
        });
        dismiss();
        return;
      }
      present({
        message: 'Failed to add a new loan release. Please try again.',
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
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:95%] md:[--width:100%] lg:[--max-width:95%] lg:[--width:95%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Loan Release - Add Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content h-screen !px-0">
          <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col">
            <div className="mb-3 flex-1 flex flex-col">
              <div>
                <LoanReleaseForm form={form} loading={loading} />
              </div>
              <div className="overflow-auto flex-1">
                <LoanReleaseFormTable form={form} />
              </div>
            </div>
            <div className="text-end space-x-1 px-2">
              <IonButton disabled={loading} type="submit" fill="clear" className="!text-sm capitalize !bg-[#FA6C2F] text-white rounded-[4px]" strong={true}>
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

export default CreateLoanRelease;

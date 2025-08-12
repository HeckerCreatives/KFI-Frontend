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
import { formatDateInput } from '../../../../utils/date-utils';
import { formatNumber, removeAmountComma } from '../../../../ui/utils/formatNumber';

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
      date: formatDateInput(new Date().toISOString()),
      acctMonth: `${new Date().getMonth() + 1}`,
      acctYear: `${new Date().getFullYear()}`,
      noOfWeeks: '',
      typeOfLoan: '',
      typeOfLoanLabel: '',
      checkNo: '',
      checkDate: '',
      bankCode: '',
      bankCodeLabel: '',
      amount: '0',
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

    let totalDebit = 0;
    let totalCredit = 0;

    data.entries = glEntries.map(entry => {
      const debit = removeAmountComma(entry.debit as string);
      const credit = removeAmountComma(entry.credit as string);

      totalDebit += Number(debit);
      totalCredit += Number(credit);

      return { ...entry, debit, credit };
    });
    data.amount = removeAmountComma(data.amount);
    data.root = '';

    if (totalCredit !== totalDebit) {
      form.setError('root', { message: 'Debit and Credit must be balanced.' });
      return;
    }

    if (totalCredit + totalDebit !== Number(data.amount)) {
      form.setError('root', { message: 'Total of debit and credit must be balanced with the amount field.' });
      return;
    }

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
              {form.formState.errors.root && <div className="text-sm text-red-600 italic text-center">{form.formState.errors.root.message}</div>}
              <div className="px-3">
                <div className="grid grid-cols-3">
                  <div className="flex items-center justify-start gap-2 text-sm border-4 px-2 py-1 [&>div]:!font-semibold">
                    <div>Diff: </div>
                    <div>{`${formatNumber(Math.abs(form.watch('entries').reduce((acc, current) => acc + Number(removeAmountComma(current.debit as string)), 0) - form.watch('entries').reduce((acc, current) => acc + Number(removeAmountComma(current.credit as string)), 0)))}`}</div>
                  </div>
                  <div className="flex items-center justify-start gap-2 text-sm border-4 px-2 py-1 [&>div]:!font-semibold">
                    <div>Total Debit: </div>
                    <div>{`${formatNumber(form.watch('entries').reduce((acc, current) => acc + Number(removeAmountComma(current.debit as string)), 0))}`}</div>
                  </div>
                  <div className="flex items-center justify-start gap-2 text-sm border-4 px-2 py-1 [&>div]:!font-semibold">
                    <div>Total Credit: </div>
                    <div>{`${formatNumber(form.watch('entries').reduce((acc, current) => acc + Number(removeAmountComma(current.credit as string)), 0))}`}</div>
                  </div>
                </div>
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

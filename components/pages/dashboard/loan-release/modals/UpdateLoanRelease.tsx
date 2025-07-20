import React, { useEffect, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, IonIcon, IonGrid, IonRow, IonCol, useIonToast } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { UpdateLoanReleaseFormData, updateLoanReleaseSchema } from '../../../../../validations/loan-release.schema';
import { createSharp } from 'ionicons/icons';
import { TErrorData, TFormError, Transaction } from '../../../../../types/types';
import { formatDateTable } from '../../../../utils/date-utils';
import LoanReleaseViewCard from '../components/LoanReleaseViewCard';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import InputText from '../../../../ui/forms/InputText';
import UpdateEntries from '../components/UpdateEntries';
import kfiAxios from '../../../../utils/axios';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';
import { TData } from '../LoanRelease';

type UpdateLoanReleaseProps = {
  transaction: Transaction;
  setData: React.Dispatch<React.SetStateAction<TData>>;
};

const UpdateLoanRelease = ({ transaction, setData }: UpdateLoanReleaseProps) => {
  const [present] = useIonToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<UpdateLoanReleaseFormData>({
    resolver: zodResolver(updateLoanReleaseSchema),
    defaultValues: {
      amount: '',
      cycle: '',
      interestRate: '',
    },
  });

  useEffect(() => {
    if (transaction) {
      form.reset({
        amount: `${transaction.amount}`,
        cycle: `${transaction.cycle}`,
        interestRate: `${transaction.interest}`,
      });
    }
  }, [transaction, form]);

  function dismiss() {
    form.reset();
    setIsOpen(false);
  }

  async function onSubmit(data: UpdateLoanReleaseFormData) {
    setLoading(true);
    try {
      const result = await kfiAxios.put(`transaction/loan-release/${transaction._id}`, data);
      const { success, transaction: updatedTransaction } = result.data;
      if (success) {
        setData(prev => {
          const index = prev.transactions.findIndex(transaction => transaction._id === updatedTransaction._id);
          if (index < 0) return prev;
          prev.transactions[index] = { ...updatedTransaction };
          return { ...prev };
        });
        present({
          message: 'Loan release successfully updated.',
          duration: 1000,
        });
        return;
      }
      present({
        message: 'Failed to update the loan release',
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
      <div
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
      >
        <IonIcon icon={createSharp} className="text-[1rem]" /> Edit
      </div>

      <IonModal isOpen={isOpen} backdropDismiss={false} className="auto-height md:[--max-width:95%] md:[--width:100%] lg:[--max-width:95%] lg:[--width:95%]">
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Loan Release - Edit Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content !px-0">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <IonGrid>
                <IonRow>
                  <IonCol size="6" className="space-y-1">
                    <LoanReleaseViewCard label="CV#" value={`CV#${transaction.code}`} />
                    <LoanReleaseViewCard label="Center Code" value={transaction.center.centerNo} />
                    <LoanReleaseViewCard label="Name" value={transaction.center.description} />
                    <LoanReleaseViewCard label="Particular" value={transaction.remarks} />
                    <LoanReleaseViewCard label="Date" value={formatDateTable(transaction.date)} />
                    <IonGrid className="ion-no-padding">
                      <IonRow className="gap-2">
                        <IonCol>
                          <LoanReleaseViewCard label="Account Month" value={`${transaction.acctMonth}`} />
                        </IonCol>
                        <IonCol>
                          <LoanReleaseViewCard label="Account Year" value={`${transaction.acctYear}`} />
                        </IonCol>
                      </IonRow>
                    </IonGrid>

                    <LoanReleaseViewCard label="Encoded By" value={transaction.encodedBy.username} />
                  </IonCol>
                  <IonCol size="6" className="space-y-1">
                    <LoanReleaseViewCard label="Number of Weeks" value={`${transaction.noOfWeeks}`} />
                    <LoanReleaseViewCard label="Type of Loan" value={`${transaction.loan.code}`} />
                    <LoanReleaseViewCard label="Check Number" value={`${transaction.checkNo}`} />
                    <LoanReleaseViewCard label="Check Date" value={formatDateTable(transaction.checkDate)} />
                    <LoanReleaseViewCard label="Bank Code" value={`${transaction.bank.code} - ${transaction.bank.description}`} />
                    <FormIonItem>
                      <InputText
                        disabled={loading}
                        name="amount"
                        control={form.control}
                        clearErrors={form.clearErrors}
                        label="Amount"
                        placeholder="Type here"
                        className="!px-2 !py-2 rounded-md"
                      />
                    </FormIonItem>

                    <FormIonItem className="flex-1">
                      <InputText
                        disabled={loading}
                        name="cycle"
                        control={form.control}
                        clearErrors={form.clearErrors}
                        label="Cycle"
                        placeholder="Type here"
                        className="!px-2 !py-2 rounded-md"
                      />
                    </FormIonItem>

                    <FormIonItem className="flex-1">
                      <InputText
                        disabled={loading}
                        name="interestRate"
                        control={form.control}
                        clearErrors={form.clearErrors}
                        label="Interest Rate (%)"
                        placeholder="Type here"
                        className="!px-2 !py-2 rounded-md"
                      />
                    </FormIonItem>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </div>
            <div className="text-end space-x-1 px-2 pb-2">
              <IonButton disabled={loading} color="tertiary" type="submit" className="!text-sm capitalize" strong={true}>
                {loading ? 'Saving...' : 'Save Changes'}
              </IonButton>
            </div>
          </form>
          <div className="border-t border-t-slate-400 mx-2 pt-5">
            <UpdateEntries isOpen={isOpen} transaction={transaction} />
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default UpdateLoanRelease;

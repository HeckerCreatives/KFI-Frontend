import React, { useEffect, useRef, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, IonIcon } from '@ionic/react';
import { createSharp } from 'ionicons/icons';
import { useForm } from 'react-hook-form';
import ChartOfAccountForm from '../components/ChartOfAccountForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChartOfAccountFormData, chartOfAccountSchema } from '../../../../../validations/chart-of-account.schema';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { ChartOfAccount, TErrorData, TFormError } from '../../../../../types/types';
import { TChartOfAccount } from '../ChartOfAccount';
import kfiAxios from '../../../../utils/axios';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';

const UpdateChartOfAccount = ({ chartAccount, setData }: { chartAccount: ChartOfAccount; setData: React.Dispatch<React.SetStateAction<TChartOfAccount>> }) => {
  const [loading, setLoading] = useState(false);
  const modal = useRef<HTMLIonModalElement>(null);

  const form = useForm<ChartOfAccountFormData>({
    resolver: zodResolver(chartOfAccountSchema),
    defaultValues: {
      code: chartAccount.code,
      description: chartAccount.description,
      classification: chartAccount.classification,
      nature: chartAccount.nature,
      groupAccount: chartAccount.groupAccount,
      fsCode: chartAccount.fsCode,
      mainAcctNo: chartAccount.mainAcctNo,
      subAcctNo: chartAccount.subAcctNo,
      branchCode: chartAccount.branchCode,
      sequence: chartAccount.sequence,
      parent: chartAccount.parent,
      indention: chartAccount.indention,
      detailed: chartAccount.detailed,
    },
  });

  useEffect(() => {
    if (chartAccount) {
      form.reset({
        code: chartAccount.code,
        description: chartAccount.description,
        classification: chartAccount.classification,
        nature: chartAccount.nature,
        groupAccount: chartAccount.groupAccount,
        fsCode: chartAccount.fsCode,
        mainAcctNo: chartAccount.mainAcctNo,
        subAcctNo: chartAccount.subAcctNo,
        branchCode: chartAccount.branchCode,
        sequence: chartAccount.sequence,
        parent: chartAccount.parent,
        indention: chartAccount.indention,
        detailed: chartAccount.detailed,
      });
    }
  }, [chartAccount, form.reset]);

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }

  async function onSubmit(data: ChartOfAccountFormData) {
    setLoading(true);
    try {
      const result = await kfiAxios.put(`/chart-of-account/${chartAccount._id}`, data);
      const { success } = result.data;
      if (success) {
        setData(prev => {
          let clone = [...prev.chartOfAccounts];
          let index = clone.findIndex(e => e._id === result.data.chartOfAccount._id);
          clone[index] = { ...result.data.chartOfAccount };
          return { ...prev, chartOfAccounts: clone };
        });
        dismiss();
        return;
      }
    } catch (error: any) {
      const errs: TErrorData | string = error?.response?.data?.error || error.message;
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
          id={`update-coa-modal-${chartAccount._id}`}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={createSharp} className="text-[1rem]" /> Update
        </div>
      </div>
      <IonModal
        ref={modal}
        trigger={`update-coa-modal-${chartAccount._id}`}
        backdropDismiss={false}
        className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:50%] lg:[--width:50%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader disabled={loading} title="Chart of Account - Edit Record" sub="Manage Account" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content">
          <div>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <ChartOfAccountForm form={form} loading={loading} />
              <div className="text-end border-t mt-2 pt-1 space-x-2">
                <IonButton disabled={loading} color="tertiary" type="submit" className="!text-sm capitalize" strong={true}>
                  {loading ? 'Saving...' : 'Save'}
                </IonButton>
                <IonButton disabled={loading} onClick={dismiss} color="danger" type="button" className="!text-sm capitalize" strong={true}>
                  Cancel
                </IonButton>
              </div>
            </form>
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default UpdateChartOfAccount;

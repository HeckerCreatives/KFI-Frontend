import React, { useEffect, useRef, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, IonIcon, useIonToast } from '@ionic/react';
import { link } from 'ionicons/icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChartOfAccountFormData, chartOfAccountSchema } from '../../../../../validations/chart-of-account.schema';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { ChartOfAccount, TErrorData, TFormError } from '../../../../../types/types';
import { TChartOfAccount } from '../ChartOfAccount';
import kfiAxios from '../../../../utils/axios';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import InputText from '../../../../ui/forms/InputText';
import GroupOfAccountSelection from '../../../../ui/selections/GroupOfAccountSelection';
import ChartOfAccountCard from '../components/ChartOfAccountCard';

const LinkChartOfAccount = ({ chartAccount, setData }: { chartAccount: ChartOfAccount; setData: React.Dispatch<React.SetStateAction<TChartOfAccount>> }) => {
  const [loading, setLoading] = useState(false);
  const modal = useRef<HTMLIonModalElement>(null);
  const [present] = useIonToast();

  const form = useForm<ChartOfAccountFormData>({
    resolver: zodResolver(chartOfAccountSchema),
    defaultValues: {
      groupAccount: '',
      groupAccountLabel: '',
    },
  });

  useEffect(() => {
    if (chartAccount) {
      form.reset({
        groupAccount: chartAccount?.groupOfAccount?._id,
        groupAccountLabel: chartAccount?.groupOfAccount?.code,
      });
    }
  }, [chartAccount, form]);

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }

  async function onSubmit(data: ChartOfAccountFormData) {
    setLoading(true);
    try {
      const result = await kfiAxios.patch(`/chart-of-account/link/${chartAccount._id}`, { groupOfAccount: data.groupAccount });
      const { success } = result.data;
      if (success) {
        setData(prev => {
          let clone = [...prev.chartOfAccounts];
          let index = clone.findIndex(e => e._id === result.data.chartOfAccount._id);
          clone[index] = { ...result.data.chartOfAccount };
          return { ...prev, chartOfAccounts: clone };
        });
        dismiss();
        present({
          message: 'Chart of account successfully linked!',
          duration: 1000,
        });
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
      {/* <div className="text-end">
        <div
          id={`update-coa-modal-${chartAccount._id}`}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={link} className="text-[1rem]" /> Link to Group Account
        </div>
      </div> */}
      <IonButton
        id={`update-coa-modal-${chartAccount._id}`}
        type="button"
        fill="clear"
        className="space-x-1 rounded-lg w-48 h-6 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-[#ffe808] text-slate-700 capitalize min-h-4 text-xs"
      >
        <IonIcon icon={link} className="text-xs" />
        <span>Link to Group Account</span>
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`update-coa-modal-${chartAccount._id}`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:30rem] md:[--width:100%] lg:[--max-width:30rem] lg:[--width:40%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Chart of Account - Link to Group Account" sub="System" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content">
          <div className="space-y-3">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-2">
              <ChartOfAccountCard label="Account Code" value={chartAccount.code} labelClassName="min-w-24 text-end" />
              <ChartOfAccountCard label="Description" value={chartAccount.description} labelClassName="min-w-24 text-end" />
              <ChartOfAccountCard label="Classification" value={chartAccount.classification} labelClassName="min-w-24 text-end" />
              <ChartOfAccountCard label="Nature of Account" value={chartAccount.nature} labelClassName="min-w-24 text-end" />
              <ChartOfAccountCard label="Department Status" value={chartAccount.deptStatus} labelClassName="min-w-24 text-end" />
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex items-start gap-2 flex-nowrap">
                <FormIonItem className="w-full">
                  <InputText
                    disabled={loading}
                    name="groupAccountLabel"
                    control={form.control}
                    clearErrors={form.clearErrors}
                    label="Group of Account"
                    placeholder="Click find to search a group of account"
                    className="!px-2 !py-2 rounded-md "
                    readOnly
                    labelClassName="truncate !text-slate-600"
                  />
                </FormIonItem>
                <div className="mt-1.5">
                  <GroupOfAccountSelection groupOfAccountLabel="groupAccountLabel" groupOfAccountValue="groupAccount" setValue={form.setValue} clearErrors={form.clearErrors} />
                </div>
              </div>
              <div className="text-end border-t mt-2 pt-1 space-x-2">
                <IonButton disabled={loading} type="submit" fill="clear" className="!text-sm capitalize !bg-[#FA6C2F] text-white rounded-[4px]" strong={true}>
                  {loading ? 'Linking...' : 'Link'}
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

export default LinkChartOfAccount;

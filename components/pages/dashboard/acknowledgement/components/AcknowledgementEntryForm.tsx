import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IonCol, IonGrid, IonIcon, IonRow } from '@ionic/react';
import InputText from '../../../../ui/forms/InputText';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import ChartOfAccountSelection from '../../../../ui/selections/ChartOfAccountSelection';
import { close } from 'ionicons/icons';
import { AcknowledgementEntryFormData } from '../../../../../validations/acknowledgement.schema';
import LoanReleaseEntrySelection from '../../../../ui/selections/LoanReleaseEntrySelection';
import classNames from 'classnames';

type TForm = {
  form: UseFormReturn<AcknowledgementEntryFormData>;
  loading?: boolean;
};

const AcknowledgementEntryForm = ({ form, loading = false }: TForm) => {
  const clearAcctCode = () => {
    form.setValue('acctCode', '');
    form.setValue('acctCodeId', '');
  };

  return (
    <IonGrid>
      <IonRow>
        <IonCol size="12" className="space-y-2">
          <div className="flex items-start gap-2 flex-nowrap">
            <div className="flex-1 relative">
              <FormIonItem>
                <InputText
                  label="CV#"
                  placeholder="Click find to select CV#"
                  readOnly
                  control={form.control}
                  name={`cvNo`}
                  clearErrors={form.clearErrors}
                  className="!px-2 !py-2 rounded-md"
                />
              </FormIonItem>
              {form.watch('cvNo') && (
                <IonIcon
                  onClick={clearAcctCode}
                  icon={close}
                  className="absolute top-7 right-2 z-50 h-6 w-6 cursor-pointer hover:text-slate-600 text-slate-500 active:text-slate-400"
                />
              )}
            </div>
            <div className="mt-5">
              <LoanReleaseEntrySelection
                loanReleaseEntryId={`loanReleaseEntryId`}
                cvNo={`cvNo`}
                dueDate={`dueDate`}
                noOfWeeks={`noOfWeeks`}
                name={`name`}
                particular={`particular`}
                setValue={form.setValue}
                clearErrors={form.clearErrors}
              />
            </div>
          </div>
          <FormIonItem>
            <InputText label="Due Date" readOnly control={form.control} name={`dueDate`} clearErrors={form.clearErrors} className="!px-2 !py-2 rounded-md" />
          </FormIonItem>
          <FormIonItem>
            <InputText label="Weeks" readOnly control={form.control} name={`noOfWeeks`} clearErrors={form.clearErrors} className="!px-2 !py-2 rounded-md" />
          </FormIonItem>
          <FormIonItem>
            <InputText label="Name" readOnly control={form.control} name={`name`} clearErrors={form.clearErrors} className="!px-2 !py-2 rounded-md" />
          </FormIonItem>
          <div className="flex items-start gap-2 flex-nowrap">
            <div className="flex-1 relative">
              <FormIonItem>
                <InputText
                  disabled={loading}
                  readOnly
                  name="acctCode"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="Acct. Code"
                  placeholder="Click find to select account code"
                  className="!px-2 !py-2 rounded-md"
                />
              </FormIonItem>
              {form.watch('acctCodeId') && (
                <IonIcon
                  onClick={clearAcctCode}
                  icon={close}
                  className="absolute top-7 right-2 z-50 h-6 w-6 cursor-pointer hover:text-slate-600 text-slate-500 active:text-slate-400"
                />
              )}
            </div>
            <div className="mt-5">
              <ChartOfAccountSelection
                chartOfAccountLabel="acctCode"
                chartOfAccountValue="acctCodeId"
                chartOfAccountDescription="description"
                clearErrors={form.clearErrors}
                setValue={form.setValue}
              />
            </div>
          </div>
          <FormIonItem>
            <InputText
              disabled={loading}
              readOnly
              name="description"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Description"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem>
          <FormIonItem>
            <InputText
              disabled={loading}
              name="debit"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Debit"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem>
          <FormIonItem>
            <InputText
              disabled={loading}
              name="credit"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Credit"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default AcknowledgementEntryForm;

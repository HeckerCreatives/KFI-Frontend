import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IonCol, IonGrid, IonIcon, IonRow } from '@ionic/react';
import InputText from '../../../../ui/forms/InputText';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import ChartOfAccountSelection from '../../../../ui/selections/ChartOfAccountSelection';
import { close } from 'ionicons/icons';
import { EmergencyLoanEntryFormData } from '../../../../../validations/emergency-loan.schema';
import ClientSelection from '../../../../ui/selections/ClientSelection';
import classNames from 'classnames';

type TForm = {
  form: UseFormReturn<EmergencyLoanEntryFormData>;
  loading?: boolean;
};

const ELEntryForm = ({ form, loading = false }: TForm) => {
  const clearAcctCode = () => {
    form.setValue('acctCode', '');
    form.setValue('acctCodeId', '');
  };

  const clearClient = () => {
    form.setValue('client', '');
    form.setValue('clientLabel', '');
    form.setValue('particular', '');
  };

  return (
    <IonGrid>
      <IonRow>
        <IonCol size="12" className="space-y-1">
          <div className="flex items-start gap-2 flex-nowrap">
            <div className="flex-1 relative">
              <FormIonItem>
                <InputText
                  disabled={loading}
                  readOnly
                  name="clientLabel"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="Name"
                  placeholder="Click find to search for name"
                  className="!px-2 !py-2 rounded-md"
                  labelClassName="truncate !text-slate-600 min-w-24 text-end"
                />
              </FormIonItem>
              {form.watch('client') && (
                <IonIcon
                  onClick={clearClient}
                  icon={close}
                  className="absolute top-3 right-2 z-50 h-6 w-6 cursor-pointer hover:text-slate-600 text-slate-500 active:text-slate-400"
                />
              )}
            </div>
            <div className="mt-1.5">
              <ClientSelection clientLabel="clientLabel" clientValue="client" clientParticular="particular" clearErrors={form.clearErrors} setValue={form.setValue} />
            </div>
          </div>
          <FormIonItem>
            <InputText
              disabled={loading}
              readOnly
              name="particular"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Particular"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
              labelClassName="truncate !text-slate-600 min-w-24 text-end"
            />
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
                  placeholder="Click find to search for account code"
                  className="!px-2 !py-2 rounded-md"
                  labelClassName="truncate !text-slate-600 min-w-24 text-end"
                />
              </FormIonItem>
              {form.watch('acctCodeId') && (
                <IonIcon
                  onClick={clearAcctCode}
                  icon={close}
                  className="absolute top-3 right-2 z-50 h-6 w-6 cursor-pointer hover:text-slate-600 text-slate-500 active:text-slate-400"
                />
              )}
            </div>
            <div className={classNames(form.formState.errors.acctCode ? 'mt-0' : 'mt-1.5')}>
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
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
              labelClassName="truncate !text-slate-600 min-w-24 text-end"
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
              labelClassName="truncate !text-slate-600 min-w-24 text-end"
              isAmount
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
              labelClassName="truncate !text-slate-600 min-w-24 text-end"
              isAmount
            />
          </FormIonItem>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default ELEntryForm;

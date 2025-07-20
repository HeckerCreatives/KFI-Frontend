import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IonCol, IonGrid, IonIcon, IonRow } from '@ionic/react';
import InputText from '../../../../ui/forms/InputText';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import { EntryFormData } from '../../../../../validations/loan-release.schema';
import ClientSelection from '../../../../ui/selections/ClientSelection';
import ChartOfAccountSelection from '../../../../ui/selections/ChartOfAccountSelection';
import { close } from 'ionicons/icons';
import classNames from 'classnames';

type TForm = {
  form: UseFormReturn<EntryFormData>;
  center: string;
  centerNo: string;
  loading: boolean;
};

const EntryForm = ({ form, center, centerNo, loading }: TForm) => {
  const name = form.watch(`client`);
  useEffect(() => {
    if (name) {
      form.setValue(`particular`, `${centerNo} - ${name}`);
    }
  }, [name]);

  const clearClient = () => {
    form.setValue('clientId', '');
    form.setValue('client', '');
    form.setValue('particular', '');
  };

  const clearAcctCode = () => {
    form.setValue('acctCodeId', '');
    form.setValue('acctCode', '');
    form.setValue('description', '');
  };

  return (
    <IonGrid class="">
      <IonRow>
        <IonCol size="12" className="space-y-1">
          <div className="flex items-start gap-2 flex-nowrap">
            <div className="flex-1 relative">
              <FormIonItem>
                <InputText
                  disabled={loading}
                  readOnly
                  name="client"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="Name"
                  placeholder="Type here"
                  className="!px-2 !py-2 rounded-md"
                />
              </FormIonItem>
              {form.watch('clientId') && (
                <IonIcon
                  onClick={clearClient}
                  icon={close}
                  className="absolute top-3 right-2 z-50 h-6 w-6 cursor-pointer hover:text-slate-600 text-slate-500 active:text-slate-400"
                />
              )}
            </div>
            <div className={classNames(form.formState.errors.client ? 'mt-0' : 'mt-1.5')}>
              <ClientSelection clientLabel="client" clientValue="clientId" center={center} clearErrors={form.clearErrors} setValue={form.setValue} />
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
                  placeholder="Type here"
                  className="!px-2 !py-2 rounded-md"
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
          <FormIonItem>
            <InputText
              disabled={loading}
              name="interest"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Interest"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem>
          <FormIonItem>
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
          <FormIonItem>
            <InputText
              disabled={loading}
              name="checkNo"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Check No."
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default EntryForm;

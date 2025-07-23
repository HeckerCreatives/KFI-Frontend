import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import InputText from '../../../../ui/forms/InputText';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import CenterSelection from '../../../../ui/selections/CenterSelection';
import InputTextarea from '../../../../ui/forms/InputTextarea';
import BankSelection from '../../../../ui/selections/BankSelection';
import InputSelect from '../../../../ui/forms/InputSelect';
import { ReleaseFormData } from '../../../../../validations/release.schema';
import classNames from 'classnames';

type TForm = {
  form: UseFormReturn<ReleaseFormData>;
  loading?: boolean;
};

const ReleaseForm = ({ form, loading = false }: TForm) => {
  return (
    <IonGrid>
      <IonRow>
        <IonCol size="6" className="space-y-1">
          <FormIonItem>
            <InputText
              disabled={loading}
              name="code"
              control={form.control}
              clearErrors={form.clearErrors}
              label="CV#"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <div className="flex items-start gap-2 flex-nowrap">
              <FormIonItem className="flex-1">
                <InputText
                  disabled={loading}
                  readOnly
                  name="centerLabel"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="Center Code"
                  placeholder="Type here"
                  className="!px-2 !py-2 rounded-md"
                />
              </FormIonItem>
              <div className={classNames(form.formState.errors.centerLabel ? 'mt-0' : 'mt-1.5')}>
                <CenterSelection centerLabel="centerLabel" centerValue="center" centerDescription="centerName" clearErrors={form.clearErrors} setValue={form.setValue} />
              </div>
            </div>
            <FormIonItem>
              <InputText
                disabled={loading}
                name="centerName"
                control={form.control}
                clearErrors={form.clearErrors}
                label="Name"
                placeholder={`Type here`}
                className="!px-2 !py-2 rounded-md"
              />
            </FormIonItem>
          </div>
          {/* <FormIonItem>
            <InputText
              disabled={loading}
              name="refNo"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Reference Number"
              placeholder={`Type here`}
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem> */}
          <FormIonItem>
            <InputText
              disabled={loading}
              name="remarks"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Particular"
              placeholder={`Type here`}
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <FormIonItem>
              <InputSelect
                disabled={loading}
                name="type"
                control={form.control}
                clearErrors={form.clearErrors}
                label="Cash Type"
                placeholder="Type here"
                className="!px-2 !py-2 rounded-md"
                options={[
                  { label: 'Cash', value: 'cash' },
                  { label: 'Direct Deposit', value: 'direct deposit' },
                  { label: 'Check', value: 'check' },
                ]}
              />
            </FormIonItem>
            <FormIonItem>
              <InputText
                disabled={loading}
                name="date"
                type="date"
                control={form.control}
                clearErrors={form.clearErrors}
                label="Date"
                placeholder="Type here"
                className="!px-2 !py-2 rounded-md"
                max="9999-12-31"
              />
            </FormIonItem>
          </div>
          <FormIonItem>
            <InputText
              disabled={loading}
              name="acctOfficer"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Account Officer"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem>
        </IonCol>
        <IonCol size="6" className="space-y-1">
          <IonGrid className="ion-no-padding">
            <IonRow className="gap-2">
              <IonCol size="12" sizeLg="6">
                <FormIonItem>
                  <InputText
                    disabled={loading}
                    name="acctMonth"
                    control={form.control}
                    clearErrors={form.clearErrors}
                    label="Account Month"
                    placeholder="Type here"
                    className="!px-2 !py-2 rounded-md"
                  />
                </FormIonItem>
              </IonCol>
              <IonCol className="px-0">
                <FormIonItem>
                  <InputText
                    disabled={loading}
                    name="acctYear"
                    control={form.control}
                    clearErrors={form.clearErrors}
                    label="Account Year"
                    placeholder="Type here"
                    className="!px-2 !py-2 rounded-md"
                  />
                </FormIonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <FormIonItem>
              <InputText
                disabled={loading}
                name="checkNo"
                control={form.control}
                clearErrors={form.clearErrors}
                label="Check Number"
                placeholder="Type here"
                className="!px-2 !py-2 rounded-md"
              />
            </FormIonItem>
            <FormIonItem>
              <InputText
                disabled={loading}
                name="checkDate"
                type="date"
                control={form.control}
                clearErrors={form.clearErrors}
                label="Check Date"
                placeholder="Type here"
                className="!px-2 !py-2 rounded-md"
                max="9999-12-31"
              />
            </FormIonItem>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <div className="flex items-start gap-2 flex-nowrap">
              <FormIonItem className="flex-1">
                <InputText
                  disabled={loading}
                  name="bankCodeLabel"
                  readOnly
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="Bank Code"
                  placeholder="Type here"
                  className="!px-2 !py-2 rounded-md"
                />
              </FormIonItem>
              <div className={classNames(form.formState.errors.bankCodeLabel ? 'mt-0' : 'mt-1.5')}>
                <BankSelection bankLabel="bankCodeLabel" bankValue="bankCode" setValue={form.setValue} clearErrors={form.clearErrors} />
              </div>
            </div>
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
          </div>

          <div>
            <label className="text-xs block translate-y-1">if Direct Dep. w/ Cash Collection. Enter Cash Amount</label>
            <FormIonItem className="m-0 !py-0">
              <InputText
                disabled={loading}
                name="cashCollection"
                control={form.control}
                clearErrors={form.clearErrors}
                label=""
                placeholder="Type here"
                className="!px-2 !py-2 rounded-md"
              />
            </FormIonItem>
          </div>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default ReleaseForm;

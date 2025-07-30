import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import InputText from '../../../../ui/forms/InputText';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import { LoanReleaseFormData } from '../../../../../validations/loan-release.schema';
import CenterSelection from '../../../../ui/selections/CenterSelection';
import useGetCenterDescription from '../../../../utils/custom/useGetCenterDescription';
import InputTextarea from '../../../../ui/forms/InputTextarea';
import classNames from 'classnames';
import BankSelection from '../../../../ui/selections/BankSelection';
import LoanSelection from '../../../../ui/selections/LoanSelection';
import InputCheckbox from '../../../../ui/forms/InputCheckbox';

type TForm = {
  form: UseFormReturn<LoanReleaseFormData>;
  loading?: boolean;
};

const LoanReleaseForm = ({ form, loading = false }: TForm) => {
  const centerId = form.watch('center');
  const { center, loading: centerLoads } = useGetCenterDescription({ id: centerId });

  useEffect(() => {
    if (center) {
      form.setValue('name', center);
      form.clearErrors('name');
    }
  }, [center, form]);

  return (
    <IonGrid>
      <IonRow>
        <IonCol size="6" className="space-y-1">
          <FormIonItem>
            <InputText
              disabled={loading}
              name="cvNo"
              control={form.control}
              clearErrors={form.clearErrors}
              label="CV#"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md lg:max-w-64"
              labelClassName="truncate min-w-[7.5rem] lg:min-w-24 !text-slate-600"
            />
          </FormIonItem>
          <IonGrid className="ion-no-padding">
            <IonRow className="gap-2">
              <IonCol>
                <div className="flex items-start gap-2 flex-nowrap">
                  <FormIonItem className="flex-1">
                    <InputText
                      disabled={loading}
                      readOnly
                      name="centerLabel"
                      control={form.control}
                      clearErrors={form.clearErrors}
                      label="Center Code"
                      placeholder="Click find to search for center code"
                      className="!px-2 !py-2 rounded-md"
                      labelClassName="truncate min-w-[7.5rem] lg:min-w-24 !text-slate-600"
                    />
                  </FormIonItem>
                  <div className={classNames(form.formState.errors.centerLabel ? 'mt-0' : 'mt-1.5')}>
                    <CenterSelection centerLabel="centerLabel" centerValue="center" clearErrors={form.clearErrors} setValue={form.setValue} />
                  </div>
                </div>
              </IonCol>
              <IonCol size="12" sizeLg="6">
                <FormIonItem>
                  <InputText
                    disabled={loading}
                    readOnly
                    name="name"
                    control={form.control}
                    clearErrors={form.clearErrors}
                    label="Name"
                    placeholder={`${centerLoads ? 'Loading...' : 'Type here'}`}
                    className="!px-2 !py-2 rounded-md"
                    labelClassName="truncate min-w-[7.5rem] !text-slate-600"
                  />
                </FormIonItem>
              </IonCol>
            </IonRow>
          </IonGrid>

          {/* <FormIonItem>
            <InputText
              disabled={loading}
              name="refNumber"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Reference Number"
              placeholder="Type here"
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
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
              labelClassName="truncate min-w-[7.5rem] lg:min-w-24 !text-slate-600"
            />
          </FormIonItem>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
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
                labelClassName="truncate min-w-[7.5rem] lg:min-w-24 !text-slate-600"
              />
            </FormIonItem>
            <FormIonItem>
              <InputText
                disabled={loading}
                name="acctMonth"
                control={form.control}
                clearErrors={form.clearErrors}
                label="Account Month"
                placeholder="Type here"
                className="!px-2 !py-2 rounded-md"
                labelClassName="truncate min-w-[7.5rem] !text-slate-600"
              />
            </FormIonItem>
            <FormIonItem>
              <InputText
                disabled={loading}
                name="acctYear"
                control={form.control}
                clearErrors={form.clearErrors}
                label="Account Year"
                placeholder="Type here"
                className="!px-2 !py-2 rounded-md"
                labelClassName="truncate min-w-[7.5rem] lg:min-w-24 !text-slate-600"
              />
            </FormIonItem>
            <FormIonItem>
              <InputText
                disabled={loading}
                name="noOfWeeks"
                control={form.control}
                clearErrors={form.clearErrors}
                label="Number of Weeks"
                placeholder="Type here"
                className="!px-2 !py-2 rounded-md"
                labelClassName="truncate min-w-[7.5rem] !text-slate-600"
              />
            </FormIonItem>
          </div>
        </IonCol>
        <IonCol size="6" className="space-y-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <div className="flex items-start gap-2">
              <FormIonItem className="flex-1">
                <InputText
                  readOnly
                  disabled={loading}
                  name="typeOfLoanLabel"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="Type of Loan"
                  placeholder="Click find to search for type of loan"
                  className="!px-2 !py-2 rounded-md"
                  labelClassName="truncate min-w-28 !text-slate-600"
                />
              </FormIonItem>
              <div className={classNames(form.formState.errors.typeOfLoanLabel ? 'mt-0' : 'mt-1.5')}>
                <LoanSelection loanLabel="typeOfLoanLabel" loanValue="typeOfLoan" clearErrors={form.clearErrors} setValue={form.setValue} />
              </div>
            </div>
            <div className="flex items-start gap-2 flex-nowrap">
              <FormIonItem className="flex-1">
                <InputText
                  disabled={loading}
                  name="bankCodeLabel"
                  readOnly
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="Bank Code"
                  placeholder="Click find to search for bank code"
                  className="!px-2 !py-2 rounded-md"
                  labelClassName="truncate min-w-28 !text-slate-600"
                />
              </FormIonItem>
              <div className={classNames(form.formState.errors.bankCodeLabel ? 'mt-0' : 'mt-1.5')}>
                <BankSelection bankLabel="bankCodeLabel" bankValue="bankCode" setValue={form.setValue} clearErrors={form.clearErrors} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
            <FormIonItem>
              <InputText
                disabled={loading}
                name="checkNo"
                control={form.control}
                clearErrors={form.clearErrors}
                label="Check Number"
                placeholder="Type here"
                className="!px-2 !py-2 rounded-md"
                labelClassName="truncate min-w-28 !text-slate-600"
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
                labelClassName="truncate min-w-28 !text-slate-600"
              />
            </FormIonItem>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <FormIonItem>
              <InputText
                disabled={loading}
                name="amount"
                control={form.control}
                clearErrors={form.clearErrors}
                label="Amount"
                placeholder="Type here"
                className="!px-2 !py-2 rounded-md"
                labelClassName="truncate min-w-28 !text-slate-600"
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
                labelClassName="truncate min-w-28 !text-slate-600"
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
                labelClassName="truncate min-w-28 !text-slate-600"
              />
            </FormIonItem>
            <FormIonItem>
              <InputCheckbox disabled={loading} name="isEduc" control={form.control} label="EDUC" />
            </FormIonItem>
          </div>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default LoanReleaseForm;

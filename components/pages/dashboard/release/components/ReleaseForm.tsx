import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import InputText from '../../../../ui/forms/InputText';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import CenterSelection from '../../../../ui/selections/CenterSelection';
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
          <FormIonItem className="[--min-height:0]">
            <InputText
              disabled={loading}
              name="code"
              control={form.control}
              clearErrors={form.clearErrors}
              label="CV#"
              placeholder="Type here"
              className="!px-1 !py-1 rounded-md !text-[0.7rem]"
              labelClassName="truncate min-w-[7.5rem] !text-[0.7rem] lg:min-w-24 !text-slate-600 text-end"
            />
          </FormIonItem>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <FormIonItem className="flex-1 [--min-height:0]">
                <InputText
                  disabled={loading}
                  readOnly
                  name="centerLabel"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="Center Code"
                  placeholder="Click find to search center code"
                  className="!px-1 !py-1 rounded-md !text-[0.7rem]"
                  labelClassName="truncate min-w-[7.5rem] !text-[0.7rem] lg:min-w-24 !text-slate-600 text-end"
                />
              </FormIonItem>
              <CenterSelection
                centerLabel="centerLabel"
                centerValue="center"
                centerDescription="centerName"
                clearErrors={form.clearErrors}
                setValue={form.setValue}
                className="!min-h-6 h-[1.65rem] text-xs"
              />
            </div>
            <FormIonItem className="[--min-height:0]">
              <InputText
                disabled={loading}
                name="centerName"
                control={form.control}
                clearErrors={form.clearErrors}
                label="Name"
                placeholder={`Type here`}
                className="!px-1 !py-1 rounded-md !text-[0.7rem]"
                labelClassName="truncate min-w-[7.5rem] !text-[0.7rem] lg:min-w-24 !text-slate-600 text-end"
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
          <FormIonItem className="[--min-height:0]">
            <InputText
              disabled={loading}
              name="remarks"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Particular"
              placeholder={`Type here`}
              className="!px-1 !py-1 rounded-md !text-[0.7rem]"
              labelClassName="truncate min-w-[7.5rem] !text-[0.7rem] lg:min-w-24 !text-slate-600 text-end"
            />
          </FormIonItem>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <FormIonItem className="[--min-height:0]">
              <InputSelect
                disabled={loading}
                name="type"
                control={form.control}
                clearErrors={form.clearErrors}
                label="Cash Type"
                placeholder="Type here"
                options={[
                  { label: 'Cash', value: 'cash' },
                  { label: 'Direct Deposit', value: 'direct deposit' },
                  { label: 'Check', value: 'check' },
                ]}
                className="!px-1 !py-1 rounded-md !text-[0.7rem]"
                labelClassName="truncate min-w-[7.5rem] !text-[0.7rem] lg:min-w-24 !text-slate-600 text-end"
              />
            </FormIonItem>
            <FormIonItem className="[--min-height:0]">
              <InputText
                disabled={loading}
                name="date"
                type="date"
                control={form.control}
                clearErrors={form.clearErrors}
                label="Date"
                placeholder="Type here"
                max="9999-12-31"
                className="!px-1 !py-1 rounded-md !text-[0.7rem]"
                labelClassName="truncate min-w-[7.5rem] !text-[0.7rem] lg:min-w-24 !text-slate-600 text-end"
              />
            </FormIonItem>
          </div>
          <FormIonItem className="[--min-height:0]">
            <InputText
              disabled={loading}
              name="acctOfficer"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Account Officer"
              placeholder="Type here"
              className="!px-1 !py-1 rounded-md !text-[0.7rem]"
              labelClassName="truncate min-w-[7.5rem] !text-[0.7rem] lg:min-w-24 !text-slate-600 text-end"
            />
          </FormIonItem>
        </IonCol>
        <IonCol size="6" className="space-y-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <FormIonItem className="[--min-height:0]">
              <InputText
                disabled={loading}
                name="acctMonth"
                control={form.control}
                clearErrors={form.clearErrors}
                label="Account Month"
                placeholder="Type here"
                className="!px-1 !py-1 rounded-md !text-[0.7rem]"
                labelClassName="truncate min-w-[7.5rem] !text-[0.7rem] lg:min-w-24 !text-slate-600 text-end"
              />
            </FormIonItem>
            <FormIonItem className="[--min-height:0]">
              <InputText
                disabled={loading}
                name="acctYear"
                control={form.control}
                clearErrors={form.clearErrors}
                label="Account Year"
                placeholder="Type here"
                className="!px-1 !py-1 rounded-md !text-[0.7rem]"
                labelClassName="truncate min-w-[7.5rem] !text-[0.7rem] lg:min-w-24 !text-slate-600 text-end"
              />
            </FormIonItem>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <FormIonItem className="[--min-height:0]">
              <InputText
                disabled={loading}
                name="checkNo"
                control={form.control}
                clearErrors={form.clearErrors}
                label="Check Number"
                placeholder="Type here"
                className="!px-1 !py-1 rounded-md !text-[0.7rem]"
                labelClassName="truncate min-w-[7.5rem] !text-[0.7rem] lg:min-w-24 !text-slate-600 text-end"
              />
            </FormIonItem>
            <FormIonItem className="[--min-height:0]">
              <InputText
                disabled={loading}
                name="checkDate"
                type="date"
                control={form.control}
                clearErrors={form.clearErrors}
                label="Check Date"
                placeholder="Type here"
                max="9999-12-31"
                className="!px-1 !py-1 rounded-md !text-[0.7rem]"
                labelClassName="truncate min-w-[7.5rem] !text-[0.7rem] lg:min-w-24 !text-slate-600 text-end"
              />
            </FormIonItem>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <div className="flex items-start gap-2 flex-nowrap">
              <FormIonItem className="flex-1 [--min-height:0]">
                <InputText
                  disabled={loading}
                  name="bankCodeLabel"
                  readOnly
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="Bank Code"
                  placeholder="Click find to search for bank code"
                  className="!px-1 !py-1 rounded-md !text-[0.7rem]"
                  labelClassName="truncate min-w-[7.5rem] !text-[0.7rem] lg:min-w-24 !text-slate-600 text-end"
                />
              </FormIonItem>
              <BankSelection bankLabel="bankCodeLabel" bankValue="bankCode" setValue={form.setValue} clearErrors={form.clearErrors} className="!min-h-6 h-[1.65rem] text-xs" />
            </div>
            <FormIonItem className="[--min-height:0]">
              <InputText
                disabled={loading}
                name="amount"
                control={form.control}
                clearErrors={form.clearErrors}
                label="Amount"
                placeholder="Type here"
                className="!px-1 !py-1 rounded-md !text-[0.7rem]"
                labelClassName="truncate min-w-[7.5rem] !text-[0.7rem] lg:min-w-24 !text-slate-600 text-end"
              />
            </FormIonItem>
          </div>

          <div>
            <label className="!text-[0.7rem] block text-slate-600">if Direct Dep. w/ Cash Collection. Enter Cash Amount</label>
            <FormIonItem className="[--min-height:0]">
              <InputText
                disabled={loading}
                name="cashCollection"
                control={form.control}
                clearErrors={form.clearErrors}
                label=""
                placeholder="Type here"
                className="!px-1 !py-1 rounded-md  !text-[0.7rem]"
                labelClassName="truncate min-w-[7.5rem] !text-[0.7rem] lg:min-w-24 !text-slate-600 text-end"
              />
            </FormIonItem>
          </div>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default ReleaseForm;

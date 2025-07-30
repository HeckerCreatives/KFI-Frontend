import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import InputText from '../../../../ui/forms/InputText';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import BankSelection from '../../../../ui/selections/BankSelection';
import SupplierSelection from '../../../../ui/selections/SupplierSelection';
import { DamayanFundFormData } from '../../../../../validations/damayan-fund.schema';
import classNames from 'classnames';

type TForm = {
  form: UseFormReturn<DamayanFundFormData>;
  loading?: boolean;
};

const DamayanFundForm = ({ form, loading = false }: TForm) => {
  return (
    <IonGrid>
      <IonRow>
        <IonCol size="6" className="space-y-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <FormIonItem>
              <InputText
                disabled={loading}
                name="code"
                control={form.control}
                clearErrors={form.clearErrors}
                label="JV#"
                placeholder="Type here"
                className="!px-2 !py-2 rounded-md"
                labelClassName="truncate !text-slate-600 min-w-16"
              />
            </FormIonItem>
            <div className="flex items-start gap-2 flex-nowrap">
              <FormIonItem className="flex-1">
                <InputText
                  disabled={loading}
                  readOnly
                  name="supplierLabel"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="Supplier"
                  placeholder="Click find to search for supplier"
                  className="!px-2 !py-2 rounded-md"
                  labelClassName="truncate !text-slate-600 min-w-16"
                />
              </FormIonItem>
              <div className={classNames(form.formState.errors.supplierLabel ? 'mt-0' : 'mt-1.5')}>
                <SupplierSelection supplierLabel="supplierLabel" supplierValue="supplier" clearErrors={form.clearErrors} setValue={form.setValue} />
              </div>
            </div>
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
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
              labelClassName="truncate !text-slate-600 min-w-16"
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
              className="!px-2 !py-2 rounded-md lg:max-w-64"
              max="9999-12-31"
              labelClassName="truncate !text-slate-600 min-w-16"
            />
          </FormIonItem>
        </IonCol>
        <IonCol size="6" className="space-y-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <FormIonItem>
              <InputText
                disabled={loading}
                name="acctMonth"
                control={form.control}
                clearErrors={form.clearErrors}
                label="Account Month"
                placeholder="Type here"
                className="!px-2 !py-2 rounded-md"
                labelClassName="truncate !text-slate-600 min-w-[6.3rem]"
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
                labelClassName="truncate !text-slate-600 min-w-[6.3rem]"
              />
            </FormIonItem>
          </div>
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
                labelClassName="truncate !text-slate-600 min-w-[6.3rem]"
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
                labelClassName="truncate !text-slate-600 min-w-[6.3rem]"
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
                  className="!px-2 !py-2 rounded-md "
                  labelClassName="truncate !text-slate-600 min-w-[6.3rem]"
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
                labelClassName="truncate !text-slate-600 min-w-[6.3rem]"
              />
            </FormIonItem>
          </div>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default DamayanFundForm;

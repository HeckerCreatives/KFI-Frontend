import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import InputText from '../../../../ui/forms/InputText';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import { JournalVoucherFormData } from '../../../../../validations/journal-voucher.schema';
import SupplierSelection from '../../../../ui/selections/SupplierSelection';
import InputTextarea from '../../../../ui/forms/InputTextarea';
import BankSelection from '../../../../ui/selections/BankSelection';
import classNames from 'classnames';

type TForm = {
  form: UseFormReturn<JournalVoucherFormData>;
  loading?: boolean;
};

const JournalVoucherForm = ({ form, loading }: TForm) => {
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
              label="JV#"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem>
          <div className="flex items-start gap-2 flex-nowrap">
            <FormIonItem className="flex-1">
              <InputText
                readOnly
                name="supplier"
                control={form.control}
                clearErrors={form.clearErrors}
                label="Supplier"
                placeholder="Click find to select supplier"
                className="!px-2 !py-2 rounded-md"
              />
            </FormIonItem>
            <div className={classNames(form.formState.errors.supplier ? 'mt-0' : 'mt-1.5')}>
              <SupplierSelection supplierLabel="supplier" supplierValue="supplierId" setValue={form.setValue} clearErrors={form.clearErrors} />
            </div>
          </div>
          {/* <FormIonItem>
            <InputText
              name="refNo"
              disabled={loading}
              control={form.control}
              clearErrors={form.clearErrors}
              label="Reference Number"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem> */}
          <FormIonItem>
            <InputText
              name="remarks"
              disabled={loading}
              control={form.control}
              clearErrors={form.clearErrors}
              label="Particular"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem>
          <FormIonItem>
            <InputText
              name="date"
              type="date"
              disabled={loading}
              control={form.control}
              clearErrors={form.clearErrors}
              label="Date"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
              max="9999-12-31"
            />
          </FormIonItem>
        </IonCol>
        <IonCol size="6" className="space-y-1">
          <IonGrid className="ion-no-padding">
            <IonRow className="gap-2">
              <IonCol size="12" sizeLg="6">
                <FormIonItem>
                  <InputText
                    name="acctMonth"
                    disabled={loading}
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
                    name="acctYear"
                    disabled={loading}
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
          <FormIonItem>
            <InputText
              name="checkNo"
              disabled={loading}
              control={form.control}
              clearErrors={form.clearErrors}
              label="Check Number"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem>
          <FormIonItem>
            <InputText
              name="checkDate"
              type="date"
              control={form.control}
              clearErrors={form.clearErrors}
              disabled={loading}
              label="Check Date"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
              max="9999-12-31"
            />
          </FormIonItem>
          <div className="flex items-start gap-2 flex-nowrap">
            <FormIonItem className="flex-1">
              <InputText
                disabled={loading}
                name="bankLabel"
                readOnly
                control={form.control}
                clearErrors={form.clearErrors}
                label="Bank Code"
                placeholder="Click find to select bank code"
                className="!px-2 !py-2 rounded-md"
              />
            </FormIonItem>
            <div className={classNames(form.formState.errors.bankLabel ? 'mt-0' : 'mt-1.5')}>
              <BankSelection bankLabel="bankLabel" bankValue="bank" setValue={form.setValue} clearErrors={form.clearErrors} />
            </div>
          </div>
          <FormIonItem>
            <InputText
              name="amount"
              disabled={loading}
              control={form.control}
              clearErrors={form.clearErrors}
              label="Amount"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default JournalVoucherForm;

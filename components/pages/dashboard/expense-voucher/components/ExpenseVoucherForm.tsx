import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import InputText from '../../../../ui/forms/InputText';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import { ExpenseVoucherFormData, UpdateExpenseVoucherFormData } from '../../../../../validations/expense-voucher.schema';
import BankSelection from '../../../../ui/selections/BankSelection';
import SupplierSelection from '../../../../ui/selections/SupplierSelection';
import InputTextarea from '../../../../ui/forms/InputTextarea';

type TForm = {
  form: UseFormReturn<ExpenseVoucherFormData | UpdateExpenseVoucherFormData>;
  loading?: boolean;
};

const ExpenseVoucherForm = ({ form, loading = false }: TForm) => {
  return (
    <IonGrid>
      <IonRow>
        <IonCol size="6" className="space-y-2">
          <FormIonItem>
            <InputText
              disabled={loading}
              name="code"
              control={form.control}
              clearErrors={form.clearErrors}
              label="EV#"
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
                placeholder="Type here"
                className="!px-2 !py-2 rounded-md"
              />
            </FormIonItem>
            <div className="mt-5">
              <SupplierSelection supplierLabel="supplier" supplierValue="supplierId" setValue={form.setValue} clearErrors={form.clearErrors} />
            </div>
          </div>
          <FormIonItem>
            <InputText
              name="refNo"
              disabled={loading}
              control={form.control}
              clearErrors={form.clearErrors}
              label="Reference Number"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem>
          <FormIonItem>
            <InputTextarea
              name="remarks"
              disabled={loading}
              control={form.control}
              clearErrors={form.clearErrors}
              label="Remark"
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
            />
          </FormIonItem>
        </IonCol>
        <IonCol size="6" className="space-y-2">
          <IonGrid className="ion-no-padding">
            <IonRow className="gap-2">
              <IonCol>
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
              disabled={loading}
              control={form.control}
              clearErrors={form.clearErrors}
              label="Check Date"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
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
                placeholder="Type here"
                className="!px-2 !py-2 rounded-md"
              />
            </FormIonItem>
            <div className="mt-5">
              <BankSelection bankLabel="bankLabel" bankValue="bank" setValue={form.setValue} clearErrors={form.clearErrors} />
            </div>
          </div>
          <FormIonItem>
            <InputText name="amount" control={form.control} clearErrors={form.clearErrors} label="Amount" placeholder="Type here" className="!px-2 !py-2 rounded-md" />
          </FormIonItem>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default ExpenseVoucherForm;

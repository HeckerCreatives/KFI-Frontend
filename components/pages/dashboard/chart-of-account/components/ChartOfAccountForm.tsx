import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import InputSelect from '../../../../ui/forms/InputSelect';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import InputText from '../../../../ui/forms/InputText';
import InputCheckbox from '../../../../ui/forms/InputCheckbox';
import { ChartOfAccountFormData } from '../../../../../validations/chart-of-account.schema';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import InputTextarea from '../../../../ui/forms/InputTextarea';
import InputRadio from '../../../../ui/forms/InputRadio';
import useGroupAccountOptions from '../../../../utils/custom/useGroupAccountOptions';

type TForm = {
  form: UseFormReturn<ChartOfAccountFormData>;
  loading: boolean;
};

const ChartOfAccountForm = ({ form, loading }: TForm) => {
  const { data: gaOptions, loading: gaLoading } = useGroupAccountOptions();

  return (
    <IonGrid className="py-0">
      <IonRow>
        <IonCol size="6" className="space-y-2">
          <FormIonItem>
            <InputText
              disabled={loading}
              name="code"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Code"
              className="!px-2 !py-2 rounded-md"
              placeholder="Type here"
            />
          </FormIonItem>
          <FormIonItem>
            <InputTextarea
              disabled={loading}
              name="description"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Description"
              className="!px-2 !py-2 rounded-md"
              placeholder="Type here"
            />
          </FormIonItem>
          <FormIonItem>
            <InputRadio
              disabled={loading}
              name="classification"
              control={form.control}
              label="Classification"
              clearErrors={form.clearErrors}
              options={[
                { label: 'Assets', value: 'Assets' },
                { label: 'Liabilities', value: 'Liabilities' },
                { label: 'Equity', value: 'Equity' },
                { label: 'Revenue', value: 'Revenue' },
                { label: 'Expense', value: 'Expense' },
                { label: 'Cost of Goods Sold', value: 'Cost of Goods Sold' },
              ]}
            />
          </FormIonItem>
          <FormIonItem>
            <InputRadio
              disabled={loading}
              name="nature"
              control={form.control}
              label="Nature Of Account"
              clearErrors={form.clearErrors}
              options={[
                { label: 'Debit', value: 'Debit' },
                { label: 'Credit', value: 'Credit' },
              ]}
            />
          </FormIonItem>
          <FormIonItem>
            <InputSelect
              disabled={loading || gaLoading}
              options={gaOptions}
              name="groupAccount"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Group Account"
              className="!px-2 !py-2 rounded-md"
              placeholder="Type here"
            />
          </FormIonItem>
        </IonCol>
        <IonCol size="6" className="space-y-2">
          <FormIonItem>
            <InputText
              disabled={loading}
              name="fsCode"
              control={form.control}
              clearErrors={form.clearErrors}
              label="FS Code"
              className="!px-2 !py-2 rounded-md"
              placeholder="Type here"
            />
          </FormIonItem>
          <FormIonItem>
            <InputText
              disabled={loading}
              name="mainAcctNo"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Main Account No."
              className="!px-2 !py-2 rounded-md"
              placeholder="Type here"
            />
          </FormIonItem>
          <FormIonItem>
            <InputText
              disabled={loading}
              name="subAcctNo"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Sub Account No."
              className="!px-2 !py-2 rounded-md"
              placeholder="Type here"
            />
          </FormIonItem>
          <FormIonItem>
            <InputText
              disabled={loading}
              name="branchCode"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Branch Code"
              className="!px-2 !py-2 rounded-md"
              placeholder="Type here"
            />
          </FormIonItem>
          <FormIonItem>
            <InputText
              disabled={loading}
              name="sequence"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Sequence"
              className="!px-2 !py-2 rounded-md"
              placeholder="Type here"
            />
          </FormIonItem>
          <FormIonItem>
            <InputText
              disabled={loading}
              name="parent"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Parent"
              className="!px-2 !py-2 rounded-md"
              placeholder="Type here"
            />
          </FormIonItem>
          <FormIonItem>
            <InputText
              disabled={loading}
              name="indention"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Indention"
              className="!px-2 !py-2 rounded-md"
              placeholder="Type here"
            />
          </FormIonItem>
          <FormIonItem>
            <InputCheckbox disabled={loading} name="detailed" control={form.control} label="Detailed" className="" />
          </FormIonItem>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default ChartOfAccountForm;

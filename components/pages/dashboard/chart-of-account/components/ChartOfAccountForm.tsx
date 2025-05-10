import React from 'react';
import { Form, UseFormReturn } from 'react-hook-form';
import InputSelect from '../../../../ui/forms/InputSelect';
import { IonCol, IonGrid, IonItem, IonRow } from '@ionic/react';
import InputText from '../../../../ui/forms/InputText';
import InputCheckbox from '../../../../ui/forms/InputCheckbox';
import { ChartOfAccountFormData } from '../../../../../validations/chart-of-account.schema';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import InputTextarea from '../../../../ui/forms/InputTextarea';
import InputRadio from '../../../../ui/forms/InputRadio';

type TForm = {
  form: UseFormReturn<ChartOfAccountFormData>;
};

const ChartOfAccountForm = ({ form }: TForm) => {
  return (
    <IonGrid className="py-0">
      <IonRow>
        <IonCol size="6" className="space-y-2">
          <FormIonItem>
            <InputText name="code" control={form.control} clearErrors={form.clearErrors} label="Code" className="!px-2 !py-2 rounded-md" placeholder="Type here" />
          </FormIonItem>
          <FormIonItem>
            <InputTextarea
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
              name="classification"
              control={form.control}
              label="Classification"
              clearErrors={form.clearErrors}
              options={[
                { label: 'Assets', value: 'A' },
                { label: 'Liabilities', value: 'L' },
                { label: 'Equity', value: 'E' },
                { label: 'Revenue', value: 'R' },
                { label: 'Expense', value: 'X' },
                { label: 'Cost of Goods Sold', value: 'C' },
              ]}
            />
          </FormIonItem>
          <FormIonItem>
            <InputRadio
              name="natureOfAccount"
              control={form.control}
              label="Nature Of Account"
              clearErrors={form.clearErrors}
              options={[
                { label: 'Debit', value: 'D' },
                { label: 'Credit', value: 'C' },
              ]}
            />
          </FormIonItem>
          <FormIonItem>
            <InputSelect
              options={[]}
              name="groupAccount"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Group Account"
              className="!px-2 !py-2 rounded-md"
              placeholder="Type here"
            />
          </FormIonItem>
          <FormIonItem>
            <InputSelect
              options={[]}
              name="closingAccount"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Closing Account"
              className="!px-2 !py-2 rounded-md"
              placeholder="Type here"
            />
          </FormIonItem>
        </IonCol>
        <IonCol size="6" className="space-y-2">
          <FormIonItem>
            <InputText name="fsCode" control={form.control} clearErrors={form.clearErrors} label="FS Code" className="!px-2 !py-2 rounded-md" placeholder="Type here" />
          </FormIonItem>
          <FormIonItem>
            <InputText
              name="mainAcctNo"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Main Account No."
              className="!px-2 !py-2 rounded-md"
              placeholder="Type here"
            />
          </FormIonItem>
          <FormIonItem>
            <InputText name="subAcctNo" control={form.control} clearErrors={form.clearErrors} label="Sub Account No." className="!px-2 !py-2 rounded-md" placeholder="Type here" />
          </FormIonItem>
          <FormIonItem>
            <InputText name="branchCode" control={form.control} clearErrors={form.clearErrors} label="Branch Code" className="!px-2 !py-2 rounded-md" placeholder="Type here" />
          </FormIonItem>
          <FormIonItem>
            <InputText name="sequence" control={form.control} clearErrors={form.clearErrors} label="Sequence" className="!px-2 !py-2 rounded-md" placeholder="Type here" />
          </FormIonItem>
          <FormIonItem>
            <InputText name="parent" control={form.control} clearErrors={form.clearErrors} label="Parent" className="!px-2 !py-2 rounded-md" placeholder="Type here" />
          </FormIonItem>
          <FormIonItem>
            <InputText name="indention" control={form.control} clearErrors={form.clearErrors} label="Indention" className="!px-2 !py-2 rounded-md" placeholder="Type here" />
          </FormIonItem>
          <FormIonItem>
            <InputCheckbox name="detailed" control={form.control} label="Detailed" className="" />
          </FormIonItem>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default ChartOfAccountForm;

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import InputText from '../../../../ui/forms/InputText';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import { ProductLoanFormData } from '../../../../../validations/loan.schema';
import LoanCodes from './LoanCodes';

type TForm = {
  form: UseFormReturn<ProductLoanFormData>;
  loading?: boolean;
};

const LoanForm = ({ form, loading = false }: TForm) => {
  return (
    <IonGrid>
      <IonRow>
        <IonCol size="12" sizeMd='6' className="space-y-2">
          <FormIonItem>
            <InputText
              disabled={loading}
              name="code"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Code"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
              labelClassName="truncate !text-slate-600"
            />
          </FormIonItem>
        </IonCol>
        <IonCol size="12" sizeMd='6' className="space-y-2">
          <FormIonItem>
            <InputText
              disabled={loading}
              name="description"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Description"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
              labelClassName="truncate !text-slate-600"
            />
          </FormIonItem>
        </IonCol>
      </IonRow>

      <IonRow>
        <IonCol size="12" className="space-y-2">
          <LoanCodes form={form} loading={loading} />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default LoanForm;

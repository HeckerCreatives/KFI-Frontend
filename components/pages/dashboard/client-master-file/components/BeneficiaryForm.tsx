import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import InputText from '../../../../ui/forms/InputText';
import { BeneficiaryFormData } from '../../../../../validations/beneficiary.schema';
import FormIonItem from '../../../../ui/utils/FormIonItem';

type TForm = {
  form: UseFormReturn<BeneficiaryFormData>;
  loading: boolean;
};

const BeneficiaryForm = ({ form, loading }: TForm) => {
  return (
    <IonGrid>
      <IonRow>
        <IonCol size="12" className="space-y-2">
          <FormIonItem>
            <InputText
              disabled={loading}
              name="name"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Beneficiary Name"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem>
          <FormIonItem>
            <InputText
              disabled={loading}
              name="relationship"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Relationship"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default BeneficiaryForm;

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import InputText from '../../../../ui/forms/InputText';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import { BusinessTypeFormData } from '../../../../../validations/business-type.schema';

type TForm = {
  form: UseFormReturn<BusinessTypeFormData>;
  loading: boolean;
};

const BusinessTypeForm = ({ form, loading }: TForm) => {
  return (
    <IonGrid>
      <IonRow>
        <IonCol size="12" className="space-y-2">
          <FormIonItem>
            <InputText
              disabled={loading}
              name="type"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Business Type"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
              labelClassName="truncate !text-slate-600 "
            />
          </FormIonItem>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default BusinessTypeForm;

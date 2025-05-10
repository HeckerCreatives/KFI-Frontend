import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import InputText from '../../../../ui/forms/InputText';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import { NatureFormData } from '../../../../../validations/nature.schema';

type TForm = {
  form: UseFormReturn<NatureFormData>;
};

const NatureForm = ({ form }: TForm) => {
  return (
    <IonGrid>
      <IonRow>
        <IonCol size="12" className="space-y-2">
          <FormIonItem>
            <InputText name="type" control={form.control} clearErrors={form.clearErrors} label="Business Type" placeholder="Type here" className="!px-2 !py-2 rounded-md" />
          </FormIonItem>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default NatureForm;

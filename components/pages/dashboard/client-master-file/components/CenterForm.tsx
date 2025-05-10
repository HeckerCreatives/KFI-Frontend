import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import InputSelect from '../../../../ui/forms/InputSelect';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import InputText from '../../../../ui/forms/InputText';
import { CenterFormData } from '../../../../../validations/center.schema';

type TForm = {
  form: UseFormReturn<CenterFormData>;
};

const CenterForm = ({ form }: TForm) => {
  return (
    <>
      <IonGrid>
        <IonRow>
          <IonCol size="12">
            <InputText name="centerCode" control={form.control} clearErrors={form.clearErrors} label="Center Code" />
          </IonCol>
          <IonCol size="12">
            <InputText name="description" control={form.control} clearErrors={form.clearErrors} label="Description" />
          </IonCol>
          <IonCol size="12">
            <InputText name="location" control={form.control} clearErrors={form.clearErrors} label="Location" />
          </IonCol>
          <IonCol size="12">
            <InputText name="centerChief" control={form.control} clearErrors={form.clearErrors} label="Center Chief" />
          </IonCol>
          <IonCol size="12">
            <InputText name="treasurer" control={form.control} clearErrors={form.clearErrors} label="Treasurer" />
          </IonCol>
          <IonCol size="12">
            <InputText name="accountOfficer" control={form.control} clearErrors={form.clearErrors} label="Account Officer" />
          </IonCol>
        </IonRow>
      </IonGrid>
    </>
  );
};

export default CenterForm;

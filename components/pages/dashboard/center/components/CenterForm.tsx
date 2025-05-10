import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import InputText from '../../../../ui/forms/InputText';
import { CenterFormData } from '../../../../../validations/center.schema';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import InputTextarea from '../../../../ui/forms/InputTextarea';

type TForm = {
  form: UseFormReturn<CenterFormData>;
};

const CenterForm = ({ form }: TForm) => {
  return (
    <IonGrid>
      <IonRow>
        <IonCol size="6" className="space-y-2">
          <FormIonItem>
            <InputText name="centerCode" control={form.control} clearErrors={form.clearErrors} label="Center Code" placeholder="Type here" className="!px-2 !py-2 rounded-md" />
          </FormIonItem>
          <FormIonItem>
            <InputTextarea
              name="description"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Description"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem>
          <FormIonItem>
            <InputTextarea name="location" control={form.control} clearErrors={form.clearErrors} label="Location" placeholder="Type here" className="!px-2 !py-2 rounded-md" />
          </FormIonItem>
        </IonCol>
        <IonCol size="6" className="space-y-2">
          <FormIonItem>
            <InputText name="centerChief" control={form.control} clearErrors={form.clearErrors} label="Center Chief" placeholder="Type here" className="!px-2 !py-2 rounded-md" />
          </FormIonItem>
          <FormIonItem>
            <InputText name="treasurer" control={form.control} clearErrors={form.clearErrors} label="Treasurer" placeholder="Type here" className="!px-2 !py-2 rounded-md" />
          </FormIonItem>
          <FormIonItem>
            <InputText
              name="accountOfficer"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Account Officer"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default CenterForm;

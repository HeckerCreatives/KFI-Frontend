import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import InputText from '../../../../ui/forms/InputText';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import InputTextarea from '../../../../ui/forms/InputTextarea';
import { WeeklySavingTableFormData } from '../../../../../validations/wst.schema';

type TForm = {
  form: UseFormReturn<WeeklySavingTableFormData>;
};

const WeeklySavingTableForm = ({ form }: TForm) => {
  return (
    <IonGrid>
      <IonRow>
        <IonCol size="12" className="space-y-2">
          <FormIonItem>
            <InputText
              name="rangeAmountFrom"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Range Amount From"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem>
          <FormIonItem>
            <InputTextarea
              name="rangeAmountTo"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Range Amount To"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem>
          <FormIonItem>
            <InputTextarea name="wsf" control={form.control} clearErrors={form.clearErrors} label="WSF" placeholder="Type here" className="!px-2 !py-2 rounded-md" />
          </FormIonItem>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default WeeklySavingTableForm;

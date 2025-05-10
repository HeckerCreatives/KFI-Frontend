import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import InputText from '../../../../ui/forms/InputText';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import { GroupAccountFormData } from '../../../../../validations/group-account.schema';

type TForm = {
  form: UseFormReturn<GroupAccountFormData>;
};

const GroupAccountForm = ({ form }: TForm) => {
  return (
    <IonGrid>
      <IonRow>
        <IonCol size="12" className="space-y-2">
          <FormIonItem>
            <InputText name="code" control={form.control} clearErrors={form.clearErrors} label="Code" placeholder="Type here" className="!px-2 !py-2 rounded-md" />
          </FormIonItem>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default GroupAccountForm;

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import InputText from '../../../../ui/forms/InputText';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import { GroupAccountFormData } from '../../../../../validations/group-account.schema';

type TForm = {
  form: UseFormReturn<GroupAccountFormData>;
  loading: boolean;
};

const GroupAccountForm = ({ form, loading }: TForm) => {
  return (
    <IonGrid className=' !mt-4'>
      <IonRow>
        <IonCol size="12" className="space-y-2">
          <FormIonItem className=' flex items-start !gap-2'>
            <label htmlFor="code" className=' text-xs mr-2'>Code</label>
            <InputText
              disabled={loading}
              name="code"
              control={form.control}
              clearErrors={form.clearErrors}
              // label="Code"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
              labelClassName=' !w-4'
            />
          </FormIonItem>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default GroupAccountForm;

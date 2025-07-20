import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import InputText from '../../../../ui/forms/InputText';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import { UserFormData } from '../../../../../validations/user.schema';
import InputPassword from '../../../../ui/forms/InputPassword';

type TForm = {
  form: UseFormReturn<UserFormData>;
  loading: boolean;
};

const UserForm = ({ form, loading }: TForm) => {
  return (
    <IonGrid>
      <IonRow>
        <IonCol size="12" className="space-y-0">
          <FormIonItem>
            <InputText
              disabled={loading}
              name="name"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Name"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem>
          <FormIonItem>
            <InputText
              disabled={loading}
              name="username"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Username"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem>
          <FormIonItem>
            <InputPassword
              name="password"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Password"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
              disabled={loading}
            />
          </FormIonItem>
          <FormIonItem>
            <InputPassword
              name="confirm_password"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Confirm Password"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
              disabled={loading}
            />
          </FormIonItem>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default UserForm;

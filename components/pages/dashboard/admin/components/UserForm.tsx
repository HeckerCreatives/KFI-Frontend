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
    <div className="grid grid-cols-1">
      <FormIonItem>
        <InputText
          disabled={loading}
          name="name"
          control={form.control}
          clearErrors={form.clearErrors}
          label="Name"
          placeholder="Type here"
          className="!px-2 !py-2 rounded-md"
          labelClassName="truncate min-w-32 !text-slate-600 text-end !text-sm"
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
          labelClassName="truncate min-w-32 !text-slate-600 text-end !text-sm"
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
          labelClassname=" min-w-32 truncate !text-slate-600 text-end"
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
          labelClassname=" min-w-32 truncate !text-slate-600 text-end"
        />
      </FormIonItem>
    </div>
  );
};

export default UserForm;

import React from 'react';
import InputSelect from '../../../../ui/forms/InputSelect';
import InputText from '../../../../ui/forms/InputText';
import { IonButton, IonButtons, IonIcon } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { search } from 'ionicons/icons';

type ICOASearch = {
  code: string;
  filter: string;
};

const ClientMasterFileFilter = () => {
  const form = useForm<ICOASearch>({
    defaultValues: {
      code: '',
      filter: '',
    },
  });

  const onSubmit = (data: ICOASearch) => {
    console.log(data);
  };

  return (
    <div className="my-2">
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
        <InputSelect
          name="filter"
          control={form.control}
          label="Sort By"
          clearErrors={form.clearErrors}
          options={[
            { label: 'Code', value: 'code' },
            { label: 'Description', value: 'description' },
          ]}
        />
        <InputText name="code" control={form.control} clearErrors={form.clearErrors} label="Code" />
        <IonButtons>
          <IonButton fill="solid" color="primary" type="submit" className="h-14 w-14">
            <IonIcon icon={search} size="large" />
          </IonButton>
        </IonButtons>
      </form>
    </div>
  );
};

export default ClientMasterFileFilter;

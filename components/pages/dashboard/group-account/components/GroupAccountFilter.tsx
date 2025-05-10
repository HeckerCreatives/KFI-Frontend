import React from 'react';
import InputSelect from '../../../../ui/forms/InputSelect';
import InputText from '../../../../ui/forms/InputText';
import { IonButton } from '@ionic/react';
import { useForm } from 'react-hook-form';
import FormIonItem from '../../../../ui/utils/FormIonItem';

type TSearchProps = {
  code: string;
  filter: string;
};

const GroupAccountFilter = () => {
  const form = useForm<TSearchProps>({
    defaultValues: {
      code: '',
      filter: '',
    },
  });

  const onSubmit = (data: TSearchProps) => {
    console.log(data);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row flex-wrap items-start md:items-center justify-between ">
      <div className="w-full max-w-80 flex-1 md:flex-none">
        <FormIonItem>
          <InputSelect
            label="Sort By"
            name="filter"
            showLabel={false}
            placeholder="Sort By"
            control={form.control}
            clearErrors={form.clearErrors}
            options={[
              { label: 'Code', value: 'code' },
              { label: 'Description', value: 'description' },
            ]}
            className="border-orange-500 rounded-md"
          />
        </FormIonItem>
      </div>
      <div className="w-full max-w-80 flex-1 md:flex-none">
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center justify-center gap-2">
          <FormIonItem className="flex-1">
            <InputText
              name="code"
              placeholder="Type here"
              type="search"
              control={form.control}
              clearErrors={form.clearErrors}
              className="!px-3 !py-1 !min-h-[1rem] rounded-md !border-orange-500"
            />
          </FormIonItem>
          <IonButton type="submit" fill="clear" id="create-coa-modal" className="max-h-10 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
            Search
          </IonButton>
        </form>
      </div>
    </div>
  );
};

export default GroupAccountFilter;

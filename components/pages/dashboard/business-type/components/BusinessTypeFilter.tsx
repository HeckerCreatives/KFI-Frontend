import React from 'react';
import InputSelect from '../../../../ui/forms/InputSelect';
import InputText from '../../../../ui/forms/InputText';
import { IonButton } from '@ionic/react';
import { useForm } from 'react-hook-form';
import FormIonItem from '../../../../ui/utils/FormIonItem';

type TSearchProps = {
  code: string;
  sort: string;
};

type BusinessTypeFilterProps = {
  getBusinessTypes: (page: number, keyword?: string, sort?: string) => void;
};

const BusinessTypeFilter = ({ getBusinessTypes }: BusinessTypeFilterProps) => {
  const form = useForm<TSearchProps>({
    defaultValues: {
      code: '',
      sort: '',
    },
  });

  const onSubmit = (data: TSearchProps) => {
    if (data.code !== '' || data.sort !== '') {
      getBusinessTypes(1, data.code, data.sort);
    } else {
      getBusinessTypes(1);
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row flex-wrap items-start md:items-center justify-between ">
      <div className="w-full flex-1 md:flex-none">
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center flex-wrap justify-end gap-2">
          <FormIonItem className="w-full max-w-72 min-w-20">
            <InputSelect
              label="Sort By"
              name="sort"
              showLabel={false}
              placeholder="Sort By"
              control={form.control}
              clearErrors={form.clearErrors}
              options={[
                { label: 'Sort By', value: '' },
                { label: 'Business Type A - Z', value: 'type-asc' },
                { label: 'Business Type Z - A', value: 'type-desc' },
              ]}
              className="!border-orange-500 rounded-md !w-full !py-1.5"
            />
          </FormIonItem>
          <div className="flex items-center min-w-20">
            <FormIonItem className="flex-1">
              <InputText
                name="code"
                placeholder="Type here"
                type="search"
                control={form.control}
                clearErrors={form.clearErrors}
                className="!px-3 !min-h-[1rem] rounded-md !border-orange-500"
              />
            </FormIonItem>
            <IonButton type="submit" fill="clear" className="max-h-8 min-h-[2rem] bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
              Search
            </IonButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessTypeFilter;

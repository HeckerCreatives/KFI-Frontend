import React from 'react';
import InputSelect from '../../../../ui/forms/InputSelect';
import InputText from '../../../../ui/forms/InputText';
import { IonButton } from '@ionic/react';
import { useForm } from 'react-hook-form';
import FormIonItem from '../../../../ui/utils/FormIonItem';

type TSearch = {
  code: string;
  sort: string;
  dateTo: string;
  dateFrom: string;
};

type DamayanFundFilterProps = {
  getDamayanFunds: (page: number, keyword?: string, sort?: string, from?: string, to?: string) => void;
};

const DamayanFundFilter = ({ getDamayanFunds }: DamayanFundFilterProps) => {
  const form = useForm<TSearch>({
    defaultValues: {
      code: '',
      sort: '',
      dateTo: '',
      dateFrom: '',
    },
  });

  const onSubmit = (data: TSearch) => {
    if (data.code !== '' || data.sort !== '' || data.dateFrom !== '' || data.dateTo !== '') {
      getDamayanFunds(1, data.code, data.sort, data.dateTo, data.dateFrom);
    } else {
      getDamayanFunds(1);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex items-start flex-wrap gap-2">
      <FormIonItem className="flex-1 min-w-32">
        <InputSelect
          label="Sort By"
          name="sort"
          placeholder="Sort By"
          control={form.control}
          clearErrors={form.clearErrors}
          options={[
            { label: 'Sort By', value: '' },
            { label: 'Code A - Z', value: 'code-asc' },
            { label: 'Code Z - A', value: 'code-desc' },
          ]}
          className="!border-orange-500 rounded-md !w-full !py-[0.35rem]"
        />
      </FormIonItem>

      <FormIonItem className="flex-1 min-w-32">
        <InputText
          label="Date From"
          name="dateFrom"
          type="date"
          control={form.control}
          clearErrors={form.clearErrors}
          className="!px-3 !py-[0.3rem] !min-h-[1.5rem] rounded-md !border-orange-500"
          max="9999-12-31"
        />
      </FormIonItem>
      <FormIonItem className="flex-1 min-w-32">
        <InputText
          name="dateTo"
          label="Date To"
          type="date"
          control={form.control}
          clearErrors={form.clearErrors}
          className="!px-3 !py-[0.3rem] !min-h-[1.5rem] rounded-md !border-orange-500"
          max="9999-12-31"
        />
      </FormIonItem>
      <FormIonItem className="flex-1 min-w-32">
        <InputText
          name="code"
          label="Keyword"
          placeholder="Type here"
          type="search"
          control={form.control}
          clearErrors={form.clearErrors}
          className="!px-3 !py-0.5 !min-h-[1rem] rounded-md !border-orange-500"
        />
      </FormIonItem>
      <IonButton type="submit" fill="clear" className="max-h-10 min-h-[2.3rem] mt-5 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
        Search
      </IonButton>
    </form>
  );
};

export default DamayanFundFilter;

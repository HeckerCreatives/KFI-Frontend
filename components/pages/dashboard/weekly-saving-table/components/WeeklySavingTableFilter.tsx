import React from 'react';
import InputSelect from '../../../../ui/forms/InputSelect';
import { IonButton } from '@ionic/react';
import { useForm } from 'react-hook-form';
import FormIonItem from '../../../../ui/utils/FormIonItem';

type TWeeklySavingTableSearch = {
  sort: string;
};

type WeeklySavingFilterProps = {
  getWeeklySavings: (page: number, keyword?: string, sort?: string) => void;
};

const WeeklySavingTableFilter = ({ getWeeklySavings }: WeeklySavingFilterProps) => {
  const form = useForm<TWeeklySavingTableSearch>({
    defaultValues: {
      sort: '',
    },
  });

  const onSubmit = (data: TWeeklySavingTableSearch) => {
    if (data.sort !== '') {
      getWeeklySavings(1, '', data.sort);
    } else {
      getWeeklySavings(1);
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
                { label: 'Range Amount From Ascending', value: 'from-asc' },
                { label: 'Range Amount From Descending', value: 'from-desc' },
                { label: 'Range Amount To Ascending', value: 'to-asc' },
                { label: 'Range Amount To Descending', value: 'to-desc' },
              ]}
              className="!border-orange-500 rounded-md !w-full !py-1.5"
            />
          </FormIonItem>
          <IonButton type="submit" fill="clear" className="max-h-10 min-h-[2.3rem] bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
            Sort
          </IonButton>
        </form>
      </div>
    </div>
  );
};

export default WeeklySavingTableFilter;

import React from 'react';
import InputSelect from '../../../../ui/forms/InputSelect';
import { IonButton } from '@ionic/react';
import { useForm } from 'react-hook-form';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import { Search01Icon, Sorting01Icon } from 'hugeicons-react';

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
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center flex-wrap lg:justify-end gap-2">
          <FormIonItem className="">
            <InputSelect
              // label="Sort By"
              name="sort"
              showLabel={false}
              placeholder="Sort By"
              control={form.control}
              clearErrors={form.clearErrors}
              options={[
                { label: 'Sort By', value: '' },
                { label: 'Range Amount From A - Z', value: 'from-asc' },
                { label: 'Range Amount From Z - A', value: 'from-desc' },
                { label: 'Range Amount To A - Z', value: 'to-asc' },
                { label: 'Range Amount To Z - A', value: 'to-desc' },
              ]}
              className="!border-orange-500 rounded-md !w-[14rem] !py-1"
            />
          </FormIonItem>
          <IonButton type="submit" fill="clear" className="max-h-8 min-h-[2rem] bg-[#FA6C2F] text-white capitalize font-semibold rounded-md text-xs" strong>
            <Sorting01Icon size={15} stroke='.8' className=' mr-1'/>
            Sort
          </IonButton>
        </form>
      </div>
    </div>
  );
};

export default WeeklySavingTableFilter;

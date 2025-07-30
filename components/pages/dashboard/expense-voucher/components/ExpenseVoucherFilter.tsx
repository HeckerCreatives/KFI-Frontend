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

type ExpenseVoucherFilterProps = {
  getExpenseVouchers: (page: number, keyword?: string, sort?: string, from?: string, to?: string) => void;
};

const ExpenseVoucherFilter = ({ getExpenseVouchers }: ExpenseVoucherFilterProps) => {
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
      getExpenseVouchers(1, data.code, data.sort, data.dateTo, data.dateFrom);
    } else {
      getExpenseVouchers(1);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-fit">
      <div className="flex flex-wrap items-center gap-2 justify-start">
        <FormIonItem className="min-w-32 ![--min-height:1rem]">
          <InputText
            label="Date From"
            name="dateFrom"
            type="date"
            control={form.control}
            clearErrors={form.clearErrors}
            className="!px-3 !py-[0.3rem] !min-h-[1.5rem] rounded-md !border-orange-500 max-w-36"
            max="9999-12-31"
            labelClassName="truncate"
          />
        </FormIonItem>
        <FormIonItem className="min-w-32 ![--min-height:1rem]">
          <InputText
            name="dateTo"
            label="Date To"
            type="date"
            control={form.control}
            clearErrors={form.clearErrors}
            className="!px-3 !py-[0.3rem] !min-h-[1.5rem] rounded-md !border-orange-500 max-w-36"
            max="9999-12-31"
            labelClassName="truncate"
          />
        </FormIonItem>
        <FormIonItem className="min-w-32 ![--min-height:1rem]">
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
            className="!border-orange-500 rounded-md !w-full !py-[0.35rem] !max-w-36 !min-w-36"
            labelClassName="truncate"
          />
        </FormIonItem>
        <FormIonItem className="min-w-32 ![--min-height:1rem]">
          <InputText
            name="code"
            label="Search"
            placeholder="Type here"
            type="search"
            control={form.control}
            clearErrors={form.clearErrors}
            className="!px-3 !min-h-[1rem] rounded-md !border-orange-500 max-w-36"
            labelClassName="truncate"
          />
        </FormIonItem>
        <IonButton type="submit" fill="clear" className="max-h-10 min-h-[2rem] bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
          Search
        </IonButton>
      </div>
    </form>
  );
};

export default ExpenseVoucherFilter;

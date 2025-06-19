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

type LoanReleaseFilterProps = {
  getTransactions: (page: number, keyword?: string, sort?: string, from?: string, to?: string) => void;
};

const LoanReleaseFilter = ({ getTransactions }: LoanReleaseFilterProps) => {
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
      getTransactions(1, data.code, data.sort, data.dateTo, data.dateFrom);
    } else {
      getTransactions(1);
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row flex-wrap items-start md:items-center justify-between ">
      <div className="w-full flex-1 md:flex-none">
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end flex-wrap justify-end gap-2">
          <FormIonItem className="w-full max-w-72 min-w-20">
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
          <IonButton type="submit" fill="clear" className="max-h-10 min-h-[2.3rem] bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
            Search
          </IonButton>
        </form>
      </div>
    </div>
  );
};

export default LoanReleaseFilter;

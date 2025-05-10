import React from 'react';
import InputSelect from '../../../../../ui/forms/InputSelect';
import InputText from '../../../../../ui/forms/InputText';
import { IonButton } from '@ionic/react';
import { useForm } from 'react-hook-form';
import FormIonItem from '../../../../../ui/utils/FormIonItem';

type TSearch = {
  code: string;
  sort: string;
  dateTo: string;
  dateFrom: string;
};

const LoanReleaseFilter = () => {
  const form = useForm<TSearch>({
    defaultValues: {
      code: '',
      sort: '',
      dateTo: '',
      dateFrom: '',
    },
  });

  const onSubmit = (data: TSearch) => {
    console.log(data);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row flex-wrap items-start md:items-center">
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center justify-end gap-2 flex-wrap w-full">
        <FormIonItem className="min-w-56 flex-1">
          <InputSelect
            label="Sort By"
            name="sort"
            showLabel={false}
            placeholder="Sort By"
            control={form.control}
            clearErrors={form.clearErrors}
            options={[
              { label: 'Code', value: 'code' },
              { label: 'Description', value: 'description' },
            ]}
            className="!border-orange-500 rounded-md"
          />
        </FormIonItem>
        <div className="flex items-center gap-2 flex-1 min-w-56">
          <div className="max-h-10 min-h-8 grid place-items-center bg-[#FA6C2F] text-white capitalize font-semibold rounded-md px-3">Date From</div>
          <FormIonItem className="flex-1">
            <InputText
              name="dateFrom"
              placeholder="Type here"
              type="date"
              control={form.control}
              clearErrors={form.clearErrors}
              className="!px-3 !py-1 !min-h-[1rem] rounded-md !border-orange-500"
            />
          </FormIonItem>
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-56">
          <div className="max-h-10 min-h-8 grid place-items-center bg-[#FA6C2F] text-white capitalize font-semibold rounded-md px-3">Date To</div>
          <FormIonItem className="flex-1">
            <InputText
              name="dateTo"
              placeholder="Type here"
              type="date"
              control={form.control}
              clearErrors={form.clearErrors}
              className="!px-3 !py-1 !min-h-[1rem] rounded-md !border-orange-500"
            />
          </FormIonItem>
        </div>
        <FormIonItem className=" flex-1 min-w-56">
          <InputText
            name="code"
            placeholder="Type here"
            type="search"
            control={form.control}
            clearErrors={form.clearErrors}
            className="!px-3 !py-1 !min-h-[1.44rem] rounded-md !border-orange-500"
          />
        </FormIonItem>
        <IonButton type="submit" fill="clear" id="create-coa-modal" className="max-h-10 min-h-8 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
          Search
        </IonButton>
      </form>
    </div>
  );
};

export default LoanReleaseFilter;

import React from 'react';
import InputSelect from '../../../../../ui/forms/InputSelect';
import { IonButton } from '@ionic/react';
import { useForm } from 'react-hook-form';
import FormIonItem from '../../../../../ui/utils/FormIonItem';

type TFilter = {
  sort: string;
};

const CpReportFilter = () => {
  const form = useForm<TFilter>({
    defaultValues: {
      sort: '',
    },
  });

  const onSubmit = (data: TFilter) => {
    console.log(data);
  };

  return (
    <div className="flex-1">
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-row-reverse items-center justify-end gap-1">
        <FormIonItem className=" w-full max-w-[10rem]">
          <InputSelect name="sort" placeholder="Sort By" options={[]} control={form.control} clearErrors={form.clearErrors} className="!px-3 !py-1 !min-h-[1rem] rounded-md" />
        </FormIonItem>
        <IonButton type="submit" fill="clear" className="max-h-10 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
          Print Preview
        </IonButton>
      </form>
    </div>
  );
};

export default CpReportFilter;

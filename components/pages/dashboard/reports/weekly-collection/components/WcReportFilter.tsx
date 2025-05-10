import React from 'react';
import InputSelect from '../../../../../ui/forms/InputSelect';
import { IonButton } from '@ionic/react';
import { useForm } from 'react-hook-form';
import FormIonItem from '../../../../../ui/utils/FormIonItem';
import InputText from '../../../../../ui/forms/InputText';

type TFilter = {
  centerNo: string;
  loanReleaseDate: string;
  dueDate: string;
  include: string;
  prevBalBasis: string;
};

const WcReportFilter = () => {
  const form = useForm<TFilter>({
    defaultValues: {
      centerNo: '',
      loanReleaseDate: '',
      dueDate: '',
      include: '',
      prevBalBasis: '',
    },
  });

  const onSubmit = (data: TFilter) => {
    console.log(data);
  };

  return (
    <div className="flex-1">
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-2 gap-2 mb-2">
          <FormIonItem className=" w-full">
            <InputSelect
              name="centerNo"
              label="Center No."
              placeholder="Select"
              options={[]}
              control={form.control}
              clearErrors={form.clearErrors}
              className="!px-3 !py-1 !min-h-[1rem] rounded-md"
            />
          </FormIonItem>
          <FormIonItem className=" w-full">
            <InputText
              name="loanReleaseDate"
              label="Loan Release Date"
              placeholder="Type here"
              control={form.control}
              clearErrors={form.clearErrors}
              className="!px-3 !py-1 !min-h-[1rem] rounded-md"
            />
          </FormIonItem>
          <FormIonItem className=" w-full">
            <InputText
              name="dueDate"
              label="Due Date"
              placeholder="Type here"
              control={form.control}
              clearErrors={form.clearErrors}
              className="!px-3 !py-1 !min-h-[1rem] rounded-md"
            />
          </FormIonItem>
          <FormIonItem className=" w-full">
            <InputText
              name="include"
              label="Include"
              placeholder="Type here"
              control={form.control}
              clearErrors={form.clearErrors}
              className="!px-3 !py-1 !min-h-[1rem] rounded-md"
            />
          </FormIonItem>
          <FormIonItem className=" w-full">
            <InputText
              name="prevBalBasis"
              label="Previous Balance Basis"
              placeholder="Type here"
              control={form.control}
              clearErrors={form.clearErrors}
              className="!px-3 !py-1 !min-h-[1rem] rounded-md"
            />
          </FormIonItem>
        </div>
        <IonButton type="submit" fill="clear" className="max-h-10 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
          Print Preview
        </IonButton>
      </form>
    </div>
  );
};

export default WcReportFilter;

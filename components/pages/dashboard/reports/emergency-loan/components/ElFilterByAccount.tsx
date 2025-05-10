import React from 'react';
import InputSelect from '../../../../../ui/forms/InputSelect';
import { IonButton } from '@ionic/react';
import { useForm } from 'react-hook-form';
import FormIonItem from '../../../../../ui/utils/FormIonItem';
import InputText from '../../../../../ui/forms/InputText';

type TFilter = {
  account: string;
  option: string;
};

const ElFilterByAccount = () => {
  const form = useForm<TFilter>({
    defaultValues: {
      account: '',
      option: '',
    },
  });

  const onSubmit = (data: TFilter) => {
    console.log(data);
  };

  return (
    <div className="flex-1">
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3">
        <FormIonItem className=" w-full max-w-[40rem]">
          <InputText
            name="account"
            label="Account"
            placeholder="Type here"
            control={form.control}
            clearErrors={form.clearErrors}
            className="!px-3 !py-1 !min-h-[1rem] rounded-md"
          />
        </FormIonItem>
        <FormIonItem className=" w-full max-w-[40rem]">
          <InputSelect
            name="option"
            label="Option"
            placeholder="Detailed/Summary"
            options={[]}
            control={form.control}
            clearErrors={form.clearErrors}
            className="!px-3 !py-1 !min-h-[1rem] rounded-md"
          />
        </FormIonItem>
        <IonButton type="submit" fill="clear" className="max-h-10 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
          Print Preview
        </IonButton>
      </form>
    </div>
  );
};

export default ElFilterByAccount;

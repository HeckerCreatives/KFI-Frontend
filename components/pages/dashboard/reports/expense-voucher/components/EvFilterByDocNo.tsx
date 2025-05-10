import React from 'react';
import InputSelect from '../../../../../ui/forms/InputSelect';
import { IonButton, IonCol, IonGrid, IonRow } from '@ionic/react';
import { useForm } from 'react-hook-form';
import FormIonItem from '../../../../../ui/utils/FormIonItem';
import InputText from '../../../../../ui/forms/InputText';

type TFilter = {
  from: string;
  to: string;
  option: string;
};

const EvFilterByDocNo = () => {
  const form = useForm<TFilter>({
    defaultValues: {
      from: '',
      to: '',
      option: '',
    },
  });

  const onSubmit = (data: TFilter) => {
    console.log(data);
  };

  return (
    <div className="flex-1">
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3 max-w-[40rem]">
        <IonGrid className="ion-no-padding">
          <IonRow className="gap-2">
            <IonCol>
              <FormIonItem className=" w-full">
                <InputText
                  name="from"
                  label="From"
                  type="date"
                  placeholder="Sort By"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  className="!px-3 !py-1 !min-h-[1rem] rounded-md"
                />
              </FormIonItem>
            </IonCol>
            <IonCol>
              <FormIonItem className=" w-full">
                <InputText
                  name="to"
                  label="To"
                  type="date"
                  placeholder="Sort By"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  className="!px-3 !py-1 !min-h-[1rem] rounded-md"
                />
              </FormIonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
        <FormIonItem className=" w-full">
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

export default EvFilterByDocNo;

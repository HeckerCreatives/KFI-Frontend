import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import InputText from '../../../../ui/forms/InputText';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import { WeeklySavingTableFormData } from '../../../../../validations/wst.schema';

type TForm = {
  form: UseFormReturn<WeeklySavingTableFormData>;
  loading: boolean;
};

const WeeklySavingTableForm = ({ form, loading }: TForm) => {
  return (
    <IonGrid>
      <IonRow>
        <IonCol size="12" className="space-y-2">
          <FormIonItem>
            <InputText
              disabled={loading}
              name="rangeAmountFrom"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Range Amount From"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
              labelClassName="truncate !text-slate-600 min-w-[8.3rem]"
            />
          </FormIonItem>
          <FormIonItem>
            <InputText
              disabled={loading}
              name="rangeAmountTo"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Range Amount To"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
              labelClassName="truncate !text-slate-600 min-w-[8.3rem]"
            />
          </FormIonItem>
          <FormIonItem>
            <InputText
              disabled={loading}
              name="weeklySavingsFund"
              control={form.control}
              clearErrors={form.clearErrors}
              label="WSF"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
              labelClassName="truncate !text-slate-600 min-w-[8.3rem]"
            />
          </FormIonItem>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default WeeklySavingTableForm;

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import InputText from '../../../../ui/forms/InputText';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import InputTextarea from '../../../../ui/forms/InputTextarea';
import { SupplierFormData } from '../../../../../validations/supplier.schema';

type TForm = {
  form: UseFormReturn<SupplierFormData>;
  loading: boolean;
};

const SupplierForm = ({ form, loading }: TForm) => {
  return (
    <IonGrid>
      <IonRow>
        <IonCol size="12" className="space-y-2">
          <FormIonItem>
            <InputText
              disabled={loading}
              name="code"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Code"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
              labelClassName="truncate !text-slate-600 min-w-20 !text-sm text-end"
            />
          </FormIonItem>
          <FormIonItem>
            <InputTextarea
              disabled={loading}
              name="description"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Description"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
              labelClassNames="truncate !text-slate-600 min-w-20 !text-sm text-end"
            />
          </FormIonItem>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default SupplierForm;

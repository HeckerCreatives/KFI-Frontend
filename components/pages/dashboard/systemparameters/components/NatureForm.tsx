import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import InputText from '../../../../ui/forms/InputText';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import { NatureFormData } from '../../../../../validations/nature.schema';
import { SystemParamsFormData } from '../../../../../validations/systemparameters';

type TForm = {
  form: UseFormReturn<SystemParamsFormData>;
  loading: boolean;
};

const SystemParamsForm = ({ form, loading }: TForm) => {
  return (
    <IonGrid>
      <IonRow>
        <IonCol size="12" className="space-y-2">
          {/* <FormIonItem>
            <InputText
              disabled={loading}
              name="preparedBy"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Prepared By"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem> */}
          <FormIonItem>
            <InputText
              disabled={loading}
              name="approvedBy"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Approved By"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem>

          <FormIonItem>
            <InputText
              disabled={loading}
              name="checkedBy"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Checked By"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default SystemParamsForm;

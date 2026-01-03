import React from 'react'
import { UseFormReturn } from 'react-hook-form';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import InputText from '../../../../ui/forms/InputText';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import { FSFormData } from '../../../../../validations/financialstatement.schema';
import { TBFormData } from '../../../../../validations/trial-balance-schema';

type TForm = {
  form: UseFormReturn<TBFormData>;
  loading: boolean;
};

export default function TBForm({form, loading}:TForm) {
  return (
    <IonGrid>
          <IonRow>
            <IonCol size="12" className="space-y-2">
              <FormIonItem>
                <InputText
                  disabled={loading}
                  name="reportCode"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="Report Code"
                  placeholder="Type here"
                  className="!px-2 !py-2 rounded-md"
                />
              </FormIonItem>
    
              <FormIonItem>
                <InputText
                  disabled={loading}
                  name="reportName"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="Report Name"
                  placeholder="Type here"
                  className="!px-2 !py-2 rounded-md"
                />
              </FormIonItem>

             
            </IonCol>
          </IonRow>
        </IonGrid>
  )
}

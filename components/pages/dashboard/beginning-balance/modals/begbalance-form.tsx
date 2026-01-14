import React from 'react'
import { UseFormReturn } from 'react-hook-form';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import InputText from '../../../../ui/forms/InputText';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import { FSFormData } from '../../../../../validations/financialstatement.schema';
import { TBFormData } from '../../../../../validations/trial-balance-schema';
import { BegBalanceFormData } from '../../../../../validations/beginningbalance.schema';

type TForm = {
  form: UseFormReturn<BegBalanceFormData>;
  loading: boolean;
};

export default function BegBalanceForm({form, loading}:TForm) {
  return (
    <IonGrid>
          <IonRow>
            <IonCol size="12" className="space-y-2">
              <FormIonItem>
                <InputText
                  disabled={loading}
                  name="year"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="Year"
                  placeholder="Type here"
                  className="!px-2 !py-2 rounded-md"
                  type='number'
                  max={String(new Date().getFullYear())}
                
                />
              </FormIonItem>
    
              <FormIonItem>
                <InputText
                  disabled={loading}
                  name="memo"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="Memo"
                  placeholder="Type here"
                  className="!px-2 !py-2 rounded-md"
                />
              </FormIonItem>

             
            </IonCol>
          </IonRow>
        </IonGrid>
  )
}

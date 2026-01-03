import React from 'react'
import { UseFormReturn } from 'react-hook-form';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import InputText from '../../../../ui/forms/InputText';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import { FSFormData } from '../../../../../validations/financialstatement.schema';

type TForm = {
  form: UseFormReturn<FSFormData>;
  loading: boolean;
};

export default function FinancialStatementForm({form, loading}:TForm) {
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

              <FormIonItem>
                <InputText
                  disabled={loading}
                  name="type"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="Type"
                  placeholder="Type here"
                  className="!px-2 !py-2 rounded-md"
                />
              </FormIonItem>

              <FormIonItem>
                <InputText
                  disabled={loading}
                  name="primaryYear"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="Primary Year"
                  placeholder="Type here"
                  className="!px-2 !py-2 rounded-md"
                />
              </FormIonItem>

              <FormIonItem>
                <InputText
                  disabled={loading}
                  name="primaryMonth"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="Primary Month"
                  placeholder="Type here"
                  className="!px-2 !py-2 rounded-md"
                />
              </FormIonItem>

               <FormIonItem>
                <InputText
                  disabled={loading}
                  name="secondaryYear"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="Secondary Year"
                  placeholder="Type here"
                  className="!px-2 !py-2 rounded-md"
                />
              </FormIonItem>

              <FormIonItem>
                <InputText
                  disabled={loading}
                  name="secondaryMonth"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="Secondary Month"
                  placeholder="Type here"
                  className="!px-2 !py-2 rounded-md"
                />
              </FormIonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
  )
}

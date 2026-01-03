import React from 'react'
import { UseFormReturn } from 'react-hook-form';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import InputText from '../../../../ui/forms/InputText';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import { FSEntriesFormData, FSFormData } from '../../../../../validations/financialstatement.schema';

type TForm = {
  form: UseFormReturn<FSEntriesFormData>;
  loading: boolean;
};

export default function FinancialStatementEntryForm({form, loading}:TForm) {
  return (
    <IonGrid>
        <div className=' grid grid-cols-2'>
            <IonCol size="12" className="space-y-2">
                <FormIonItem>
                <InputText
                  name="reportCode"
                  readOnly={true}
            
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="Report Code"
                  placeholder="Type here"
                  className="!px-2 !py-2 rounded-md"
                />
              </FormIonItem>
    
              <FormIonItem>
                <InputText
                readOnly={true}
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
                   readOnly={true}
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
                   readOnly={true}
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
                  readOnly={true}
                  name="primaryMonth"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="Primary Month"
                  placeholder="Type here"
                  className="!px-2 !py-2 rounded-md"
                />
              </FormIonItem>

             
            

            </IonCol>

            <IonCol size="12" className="space-y-2">
                  <FormIonItem>
                <InputText
                  readOnly={true}
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
                   readOnly={true}
                  name="secondaryMonth"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="Secondary Month"
                  placeholder="Type here"
                  className="!px-2 !py-2 rounded-md"
                />
              </FormIonItem>
               
              <FormIonItem>
                <InputText
                  disabled={loading}
                  name="title"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="Title"
                  placeholder="Type here"
                  className="!px-2 !py-2 rounded-md"
                />
              </FormIonItem>
    
              <FormIonItem>
                <InputText
                  disabled={loading}
                  name="subTitle"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="Description"
                  placeholder="Type here"
                  className="!px-2 !py-2 rounded-md"
                />
              </FormIonItem>

            </IonCol>

        </div>
        
        
        </IonGrid>
  )
}

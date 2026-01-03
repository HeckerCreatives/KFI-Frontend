import React from 'react'
import { UseFormReturn } from 'react-hook-form';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import InputText from '../../../../ui/forms/InputText';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import { FSEntriesFormData, FSFormData } from '../../../../../validations/financialstatement.schema';
import { TBEntriesFormData } from '../../../../../validations/trial-balance-schema';

type TForm = {
  form: UseFormReturn<TBEntriesFormData>;
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
                  name="reportName"
                  readOnly={true}
            
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="Report Name"
                  placeholder="Type here"
                  className="!px-2 !py-2 rounded-md"
                />
              </FormIonItem>
    
         
            </IonCol>

            <IonCol size="12" className="space-y-2">
               
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

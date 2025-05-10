import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import InputText from '../../../../../ui/forms/InputText';
import FormIonItem from '../../../../../ui/utils/FormIonItem';
import { DamayanFundFormData } from '../../../../../../validations/damayan-fund.schema';

type TForm = {
  form: UseFormReturn<DamayanFundFormData>;
};

const LoanReleaseForm = ({ form }: TForm) => {
  return (
    <IonGrid>
      <IonRow>
        <IonCol size="6" className="space-y-2">
          <FormIonItem>
            <InputText name="cvNo" control={form.control} clearErrors={form.clearErrors} label="CV#" placeholder="Type here" className="!px-2 !py-2 rounded-md" />
          </FormIonItem>
          <FormIonItem>
            <InputText name="center" control={form.control} clearErrors={form.clearErrors} label="Center Code" placeholder="Type here" className="!px-2 !py-2 rounded-md" />
          </FormIonItem>
          <FormIonItem>
            <InputText name="name" control={form.control} clearErrors={form.clearErrors} label="Name" placeholder="Type here" className="!px-2 !py-2 rounded-md" />
          </FormIonItem>
          <FormIonItem>
            <InputText name="refNumber" control={form.control} clearErrors={form.clearErrors} label="Reference Number" placeholder="Type here" className="!px-2 !py-2 rounded-md" />
          </FormIonItem>
          <FormIonItem>
            <InputText name="remarks" control={form.control} clearErrors={form.clearErrors} label="Remark" placeholder="Type here" className="!px-2 !py-2 rounded-md" />
          </FormIonItem>
          <FormIonItem>
            <InputText name="date" type="date" control={form.control} clearErrors={form.clearErrors} label="Date" placeholder="Type here" className="!px-2 !py-2 rounded-md" />
          </FormIonItem>
          <IonGrid className="ion-no-padding">
            <IonRow className="gap-2">
              <IonCol>
                <FormIonItem>
                  <InputText
                    name="acctMonth"
                    control={form.control}
                    clearErrors={form.clearErrors}
                    label="Account Month"
                    placeholder="Type here"
                    className="!px-2 !py-2 rounded-md"
                  />
                </FormIonItem>
              </IonCol>
              <IonCol className="px-0">
                <FormIonItem>
                  <InputText
                    name="acctYear"
                    control={form.control}
                    clearErrors={form.clearErrors}
                    label="Account Year"
                    placeholder="Type here"
                    className="!px-2 !py-2 rounded-md"
                  />
                </FormIonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
          <FormIonItem>
            <InputText name="payee" control={form.control} clearErrors={form.clearErrors} label="User" placeholder="Type here" className="!px-2 !py-2 rounded-md" />
          </FormIonItem>
        </IonCol>
        <IonCol size="6" className="space-y-2">
          <FormIonItem>
            <InputText name="noOfWeeks" control={form.control} clearErrors={form.clearErrors} label="Number of Weeks" placeholder="Type here" className="!px-2 !py-2 rounded-md" />
          </FormIonItem>
          <FormIonItem>
            <InputText name="typeOfLoan" control={form.control} clearErrors={form.clearErrors} label="Type of Loan" placeholder="Type here" className="!px-2 !py-2 rounded-md" />
          </FormIonItem>
          <FormIonItem>
            <InputText name="checkNo" control={form.control} clearErrors={form.clearErrors} label="Check Number" placeholder="Type here" className="!px-2 !py-2 rounded-md" />
          </FormIonItem>
          <FormIonItem>
            <InputText
              name="checkDate"
              type="date"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Check Date"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem>
          <FormIonItem>
            <InputText name="bankCode" control={form.control} clearErrors={form.clearErrors} label="Bank Code" placeholder="Type here" className="!px-2 !py-2 rounded-md" />
          </FormIonItem>
          <FormIonItem>
            <InputText name="amount" control={form.control} clearErrors={form.clearErrors} label="Amount" placeholder="Type here" className="!px-2 !py-2 rounded-md" />
          </FormIonItem>
          <FormIonItem>
            <InputText name="cycle" control={form.control} clearErrors={form.clearErrors} label="Cycle" placeholder="Type here" className="!px-2 !py-2 rounded-md" />
          </FormIonItem>
          <FormIonItem>
            <InputText name="interestRate" control={form.control} clearErrors={form.clearErrors} label="Interest Rate" placeholder="Type here" className="!px-2 !py-2 rounded-md" />
          </FormIonItem>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default LoanReleaseForm;

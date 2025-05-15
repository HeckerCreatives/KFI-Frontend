import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ClientMasterFileFormData } from '../../../../../validations/client-master-file.schema';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import InputText from '../../../../ui/forms/InputText';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import InputSelect from '../../../../ui/forms/InputSelect';

type TForm = {
  form: UseFormReturn<ClientMasterFileFormData>;
  loading: boolean;
};

const CMFPersonalForm = ({ form, loading }: TForm) => {
  return (
    <IonGrid>
      <IonRow>
        <IonCol size="6" className="space-y-2">
          <FormIonItem>
            <InputText
              disabled={loading}
              name="name"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Name"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem>
          <FormIonItem>
            <InputText
              disabled={loading}
              name="address"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Address"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem>
          <IonGrid className="ion-no-padding">
            <IonRow className="gap-2">
              <IonCol>
                <FormIonItem>
                  <InputText
                    disabled={loading}
                    name="city"
                    control={form.control}
                    clearErrors={form.clearErrors}
                    label="City"
                    placeholder="Type here"
                    className="!px-2 !py-2 rounded-md"
                  />
                </FormIonItem>
              </IonCol>
              <IonCol>
                <FormIonItem>
                  <InputText
                    disabled={loading}
                    name="zipCode"
                    control={form.control}
                    clearErrors={form.clearErrors}
                    label="Zip Code"
                    placeholder="Type here"
                    className="!px-2 !py-2 rounded-md"
                  />
                </FormIonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
          <IonGrid className="ion-no-padding">
            <IonRow className="gap-2">
              <IonCol>
                <FormIonItem>
                  <InputText
                    disabled={loading}
                    name="telNo"
                    control={form.control}
                    clearErrors={form.clearErrors}
                    label="Telephone No."
                    placeholder="Type here"
                    className="!px-2 !py-2 rounded-md"
                  />
                </FormIonItem>
              </IonCol>
              <IonCol>
                <FormIonItem>
                  <InputText
                    disabled={loading}
                    name="mobileNo"
                    control={form.control}
                    clearErrors={form.clearErrors}
                    label="Mobile"
                    placeholder="Type here"
                    className="!px-2 !py-2 rounded-md"
                  />
                </FormIonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
          <FormIonItem>
            <InputText
              disabled={loading}
              name="birthdate"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Bith Date"
              type="date"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem>
          <FormIonItem>
            <InputText
              disabled={loading}
              name="birthplace"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Birth Place"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem>
        </IonCol>
        <IonCol size="6" className="space-y-2">
          <IonGrid className="ion-no-padding">
            <IonRow className="gap-2">
              <IonCol>
                <FormIonItem>
                  <InputText
                    disabled={loading}
                    name="age"
                    control={form.control}
                    clearErrors={form.clearErrors}
                    label="Age"
                    placeholder="Type here"
                    className="!px-2 !py-2 rounded-md"
                  />
                </FormIonItem>
              </IonCol>
              <IonCol>
                <FormIonItem>
                  <InputSelect
                    disabled={loading}
                    name="sex"
                    control={form.control}
                    clearErrors={form.clearErrors}
                    label="Sex"
                    placeholder="Type here"
                    className="!px-2 !py-2 rounded-md"
                    options={[
                      { label: 'Male', value: 'male' },
                      { label: 'Female', value: 'female' },
                    ]}
                  />
                </FormIonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
          <FormIonItem>
            <InputText
              disabled={loading}
              name="spouse"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Spouse"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem>
          <FormIonItem>
            <InputSelect
              disabled={loading}
              name="civilStatus"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Civil Status"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
              options={[
                { label: 'Single', value: 'single' },
                { label: 'Married', value: 'married' },
                { label: 'Widowed', value: 'widowed' },
                { label: 'Separated', value: 'separated' },
                { label: 'Divorced', value: 'divorced' },
              ]}
            />
          </FormIonItem>
          <FormIonItem>
            <InputText
              disabled={loading}
              name="parent"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Parent"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default CMFPersonalForm;

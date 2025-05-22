import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ClientMasterFileFormData } from '../../../../../validations/client-master-file.schema';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import InputText from '../../../../ui/forms/InputText';
import InputSelect from '../../../../ui/forms/InputSelect';
import useCenterOptions from '../../../../utils/custom/useCenterOptions';
import useBusinessTypesOptions from '../../../../utils/custom/useBusinessTypesOptions';
import CenterSelection from '../../../../ui/selections/CenterSelection';

type TForm = {
  form: UseFormReturn<ClientMasterFileFormData>;
  loading: boolean;
};

const CMFOtherForm = ({ form, loading }: TForm) => {
  const { data: centerOptions, loading: centerLoading } = useCenterOptions();
  const { data: businessOptions, loading: businessLoading } = useBusinessTypesOptions();

  return (
    <IonGrid>
      <IonRow>
        <IonCol size="6" className="space-y-2">
          <FormIonItem>
            <InputText
              disabled={loading}
              name="memberStatus"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Member Status"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem>
          <FormIonItem>
            <InputText
              disabled={loading}
              name="groupNumber"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Group Number"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem>
          <div>
            <FormIonItem>
              <InputSelect
                disabled={loading || centerLoading}
                name="center"
                control={form.control}
                clearErrors={form.clearErrors}
                label="Center"
                placeholder="Type here"
                className="!px-2 !py-2 rounded-md"
                options={centerOptions}
              />
            </FormIonItem>
            <CenterSelection />
          </div>
          <FormIonItem>
            <InputText
              disabled={loading}
              name="acctOfficer"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Account Officer"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem>
          <FormIonItem>
            <InputText
              disabled={loading}
              name="dateRelease"
              type="date"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Date Release"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem>
          <FormIonItem>
            <InputSelect
              disabled={loading || businessLoading}
              name="business"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Business"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
              options={businessOptions}
            />
          </FormIonItem>
        </IonCol>
        <IonCol size="6" className="space-y-2">
          <FormIonItem>
            <InputText
              disabled={loading}
              name="position"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Position"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem>
          <FormIonItem>
            <InputText
              disabled={loading}
              name="acctNumber"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Account Number"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem>
          <FormIonItem>
            <InputText
              disabled={loading}
              name="dateResigned"
              type="date"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Date Resigned"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem>
          <FormIonItem>
            <InputText
              disabled={loading}
              name="newStatus"
              control={form.control}
              clearErrors={form.clearErrors}
              label="New Status"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem>
          <FormIonItem>
            <InputText
              disabled={loading}
              name="reason"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Reason"
              placeholder="Type here"
              className="!px-2 !py-2 rounded-md"
            />
          </FormIonItem>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default CMFOtherForm;

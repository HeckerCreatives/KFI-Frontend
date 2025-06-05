import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ClientMasterFileFormData } from '../../../../../validations/client-master-file.schema';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import InputText from '../../../../ui/forms/InputText';
import CenterSelection from '../../../../ui/selections/CenterSelection';
import BusinessTypeSelection from '../../../../ui/selections/BusinessTypeSelection';
import GroupOfAccountSelection from '../../../../ui/selections/GroupOfAccountSelection';
import InputSelect from '../../../../ui/forms/InputSelect';

type TForm = {
  form: UseFormReturn<ClientMasterFileFormData>;
  loading: boolean;
};

const CMFOtherForm = ({ form, loading }: TForm) => {
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
          <div className="flex items-end gap-2 flex-nowrap">
            <FormIonItem className="flex-1">
              <InputText
                disabled={loading}
                name="groupNumberLabel"
                control={form.control}
                clearErrors={form.clearErrors}
                label="Group Number"
                placeholder="Click find to search a group number"
                className="!px-2 !py-2 rounded-md"
              />
            </FormIonItem>
            <GroupOfAccountSelection groupOfAccountLabel="groupNumberLabel" groupOfAccountValue="groupNumber" setValue={form.setValue} clearErrors={form.clearErrors} />
          </div>
          <div className="flex items-end gap-2 flex-nowrap">
            <FormIonItem className="flex-1">
              <InputText
                disabled={loading}
                name="centerLabel"
                control={form.control}
                clearErrors={form.clearErrors}
                label="Center"
                placeholder="Click find to search a center"
                className="!px-2 !py-2 rounded-md"
                readOnly
              />
            </FormIonItem>
            <CenterSelection centerLabel="centerLabel" centerValue="center" setValue={form.setValue} clearErrors={form.clearErrors} />
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
          <div className="flex items-end gap-2 flex-nowrap">
            <FormIonItem className="flex-1">
              <InputText
                disabled={loading}
                name="businessLabel"
                control={form.control}
                clearErrors={form.clearErrors}
                label="Business"
                placeholder="Click find to search a business"
                className="!px-2 !py-2 rounded-md"
                readOnly
              />
            </FormIonItem>
            <BusinessTypeSelection businessTypeLabel="businessLabel" businessTypeValue="business" setValue={form.setValue} clearErrors={form.clearErrors} />
          </div>
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

          <FormIonItem className="flex-1">
            <InputSelect
              disabled={loading}
              name="newStatus"
              control={form.control}
              clearErrors={form.clearErrors}
              label="New Status"
              placeholder="New Status"
              className="!px-2 !py-2 rounded-md"
              options={[
                { label: 'Status One', value: 'status1' },
                { label: 'Status Two', value: 'status2' },
                { label: 'Status Three', value: 'status3' },
              ]}
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

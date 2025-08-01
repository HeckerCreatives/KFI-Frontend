import React from 'react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { ClientMasterFileFormData } from '../../../../../validations/client-master-file.schema';
import { IonButton, IonCol, IonGrid, IonIcon, IonRow } from '@ionic/react';
import InputText from '../../../../ui/forms/InputText';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import InputSelect from '../../../../ui/forms/InputSelect';
import BusinessTypeSelection from '../../../../ui/selections/BusinessTypeSelection';
import classNames from 'classnames';
import CenterSelection from '../../../../ui/selections/CenterSelection';
import GroupOfAccountSelection from '../../../../ui/selections/GroupOfAccountSelection';
import MemberStatusSelection from '../../../../ui/selections/MemberStatusSelection';
import { add, trash } from 'ionicons/icons';

type TForm = {
  form: UseFormReturn<ClientMasterFileFormData>;
  loading: boolean;
};

const CMFPersonalForm = ({ form, loading }: TForm) => {
  const beneficiary = useFieldArray({
    control: form.control,
    name: 'beneficiary',
  });

  const children = useFieldArray({
    control: form.control,
    name: 'children',
  });

  return (
    <div>
      <IonGrid className="py-0">
        <IonRow>
          <IonCol size="6" className="space-y-1">
            <FormIonItem>
              <InputText
                disabled={loading}
                name="name"
                control={form.control}
                clearErrors={form.clearErrors}
                label="Name"
                placeholder="Type here"
                className="!px-2 !py-2 rounded-md max-w-96"
                labelClassName="truncate min-w-28 !text-slate-600 !text-sm text-end"
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
                labelClassName="truncate min-w-28 !text-slate-600 !text-sm text-end"
              />
            </FormIonItem>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <FormIonItem>
                <InputText
                  disabled={loading}
                  name="city"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="City"
                  placeholder="Type here"
                  className="!px-2 !py-2 rounded-md"
                  labelClassName="truncate min-w-28 !text-slate-600 !text-sm text-end"
                />
              </FormIonItem>
              <FormIonItem>
                <InputText
                  disabled={loading}
                  name="zipCode"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="Zip Code"
                  placeholder="Type here"
                  className="!px-2 !py-2 rounded-md"
                  labelClassName="truncate min-w-28 !text-slate-600 !text-sm text-end"
                />
              </FormIonItem>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <FormIonItem>
                <InputText
                  disabled={loading}
                  name="telNo"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="Telephone No."
                  placeholder="Type here (523XXXX)"
                  className="!px-2 !py-2 rounded-md"
                  labelClassName="truncate min-w-28 !text-slate-600 !text-sm text-end"
                />
              </FormIonItem>
              <FormIonItem>
                <InputText
                  disabled={loading}
                  name="mobileNo"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="Mobile"
                  placeholder="Type here (639XXXXXXXXX)"
                  className="!px-2 !py-2 rounded-md"
                  labelClassName="truncate min-w-28 !text-slate-600 !text-sm text-end"
                />
              </FormIonItem>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
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
                  max="9999-12-31"
                  labelClassName="truncate min-w-28 !text-slate-600 !text-sm text-end"
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
                  labelClassName="truncate min-w-28 !text-slate-600 !text-sm text-end"
                />
              </FormIonItem>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <FormIonItem>
                <InputText
                  disabled={loading}
                  name="age"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="Age"
                  placeholder="Type here"
                  className="!px-2 !py-2 rounded-md"
                  labelClassName="truncate min-w-28 !text-slate-600 !text-sm text-end"
                />
              </FormIonItem>
              <FormIonItem>
                <InputSelect
                  disabled={loading}
                  name="sex"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="Sex"
                  placeholder="Type here"
                  className="!px-2 !py-2 rounded-md"
                  labelClassName="truncate min-w-28 !text-slate-600 !text-sm text-end"
                  options={[
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' },
                  ]}
                />
              </FormIonItem>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <FormIonItem>
                <InputText
                  disabled={loading}
                  name="parent"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="Parent"
                  placeholder="Type here"
                  className="!px-2 !py-2 rounded-md"
                  labelClassName="truncate min-w-28 !text-slate-600 !text-sm text-end"
                />
              </FormIonItem>
              <FormIonItem>
                <InputText
                  disabled={loading}
                  name="spouse"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="Spouse"
                  placeholder="Type here"
                  className="!px-2 !py-2 rounded-md"
                  labelClassName="truncate min-w-28 !text-slate-600 !text-sm text-end"
                />
              </FormIonItem>
            </div>
          </IonCol>
          <IonCol size="6" className="space-y-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
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
                  labelClassName="truncate min-w-28 !text-slate-600 !text-sm text-end"
                />
              </FormIonItem>
              <FormIonItem>
                <InputText
                  disabled={loading}
                  name="position"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="Position"
                  placeholder="Type here"
                  className="!px-2 !py-2 rounded-md"
                  labelClassName="truncate min-w-28 !text-slate-600 !text-sm text-end"
                />
              </FormIonItem>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-2">
                <div className="flex items-start gap-2 flex-nowrap">
                  <FormIonItem className="flex-1">
                    <InputText
                      disabled={loading}
                      name="memberStatusLabel"
                      control={form.control}
                      clearErrors={form.clearErrors}
                      label="Member Status"
                      placeholder="Click find to search for member status"
                      className="!px-2 !py-2 rounded-md"
                      labelClassName="truncate min-w-28 !text-slate-600 !text-sm text-end"
                      readOnly
                    />
                  </FormIonItem>
                  <div className={classNames(form.formState.errors.memberStatusLabel ? 'mt-0' : 'mt-1.5')}>
                    <MemberStatusSelection memberStatusLabel="memberStatusLabel" memberStatusValue="memberStatus" setValue={form.setValue} clearErrors={form.clearErrors} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-1 gap-2">
                <div className="flex items-start gap-2 flex-nowrap">
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
                      labelClassName="truncate min-w-28 lg:min-w-28 !text-slate-600 !text-sm text-end"
                    />
                  </FormIonItem>
                  <div className={classNames(form.formState.errors.centerLabel ? 'mt-0' : 'mt-1.5')}>
                    <CenterSelection centerLabel="centerLabel" centerValue="center" setValue={form.setValue} clearErrors={form.clearErrors} />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <FormIonItem>
                <InputText
                  disabled={loading}
                  name="acctOfficer"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="Account Officer"
                  placeholder="Type here"
                  className="!px-2 !py-2 rounded-md"
                  labelClassName="truncate min-w-28 !text-slate-600 !text-sm text-end"
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
                  max="9999-12-31"
                  labelClassName="truncate min-w-28 lg:min-w-28 !text-slate-600 !text-sm text-end"
                />
              </FormIonItem>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <div className="flex items-start gap-2 flex-nowrap">
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
                    labelClassName="truncate min-w-28 lg:min-w-28 !text-slate-600 !text-sm text-end"
                  />
                </FormIonItem>
                <div className={classNames(form.formState.errors.businessLabel ? 'mt-0' : 'mt-1.5')}>
                  <BusinessTypeSelection businessTypeLabel="businessLabel" businessTypeValue="business" setValue={form.setValue} clearErrors={form.clearErrors} />
                </div>
              </div>
              <FormIonItem>
                <InputText
                  disabled={loading}
                  name="acctNumber"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="Account Number"
                  placeholder="Type here"
                  className="!px-2 !py-2 rounded-md"
                  labelClassName="truncate !text-slate-600 !text-sm text-end"
                />
              </FormIonItem>
            </div>
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
                max="9999-12-31"
                labelClassName="truncate min-w-28 !text-slate-600 !text-sm text-end"
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
                labelClassName="truncate min-w-28 !text-slate-600 !text-sm text-end"
              />
            </FormIonItem>
            {children.fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <FormIonItem className="flex-1">
                  <InputText
                    disabled={loading}
                    name={`children.${index}.name`}
                    control={form.control}
                    clearErrors={form.clearErrors}
                    label="Children"
                    placeholder="Type here"
                    className="!px-2 !py-2 rounded-md"
                    labelClassName="truncate min-w-28 !text-slate-600 !text-sm text-end"
                  />
                </FormIonItem>
                <IonButton
                  onClick={() => children.append({ name: '' })}
                  fill="clear"
                  className="max-h-9 min-h-9 btn-color text-white capitalize font-semibold rounded-md m-0"
                  strong
                >
                  <IonIcon icon={add} />
                </IonButton>
                {children.fields.length > 1 && (
                  <IonButton onClick={() => children.remove(index)} fill="clear" className="max-h-9 min-h-9 bg-red-600 text-white capitalize font-semibold rounded-md m-0" strong>
                    <IonIcon icon={trash} />
                  </IonButton>
                )}
              </div>
            ))}
            {beneficiary.fields.map((field, index) => (
              <div key={field.id} className="flex items-center flex-wrap gap-2">
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2">
                  <FormIonItem className="flex-1">
                    <InputText
                      disabled={loading}
                      name={`beneficiary.${index}.name`}
                      control={form.control}
                      clearErrors={form.clearErrors}
                      label="Beneficiary"
                      placeholder="Type here"
                      className="!px-2 !py-2 rounded-md"
                      labelClassName="truncate min-w-28 !text-slate-600 !text-sm text-end"
                    />
                  </FormIonItem>
                  <FormIonItem className="flex-1">
                    <InputText
                      disabled={loading}
                      name={`beneficiary.${index}.relationship`}
                      control={form.control}
                      clearErrors={form.clearErrors}
                      label="Relationship"
                      placeholder="Type here"
                      className="!px-2 !py-2 rounded-md"
                      labelClassName="truncate min-w-28 !text-slate-600 !text-sm text-end"
                    />
                  </FormIonItem>
                </div>
                <IonButton
                  onClick={() => beneficiary.append({ name: '', relationship: '' })}
                  fill="clear"
                  className="max-h-9 min-h-9 btn-color text-white capitalize font-semibold rounded-md m-0"
                  strong
                >
                  <IonIcon icon={add} />
                </IonButton>
                {beneficiary.fields.length > 1 && (
                  <IonButton
                    onClick={() => beneficiary.remove(index)}
                    fill="clear"
                    className="max-h-9 min-h-9 bg-red-600 text-white capitalize font-semibold rounded-md m-0"
                    strong
                  >
                    <IonIcon icon={trash} />
                  </IonButton>
                )}
              </div>
            ))}
          </IonCol>
        </IonRow>
      </IonGrid>
    </div>
  );
};

export default CMFPersonalForm;

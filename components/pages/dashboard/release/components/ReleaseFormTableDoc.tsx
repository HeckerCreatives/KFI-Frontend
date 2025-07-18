import React from 'react';
import { AcknowledgementFormData } from '../../../../../validations/acknowledgement.schema';
import { UseFieldArrayRemove, UseFormReturn } from 'react-hook-form';
import { TableCell, TableRow } from '../../../../ui/table/Table';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import InputText from '../../../../ui/forms/InputText';
import classNames from 'classnames';
import ChartOfAccountSelection from '../../../../ui/selections/ChartOfAccountSelection';
import { IonButton, IonIcon } from '@ionic/react';
import { trash } from 'ionicons/icons';
import LoanReleaseEntrySelection from '../../../../ui/selections/LoanReleaseEntrySelection';
import { ReleaseEntryFormData } from '../../../../../validations/release.schema';

type ReleaseFormTableDocProps = {
  entry: ReleaseEntryFormData;
  remove: UseFieldArrayRemove;
  form: UseFormReturn<AcknowledgementFormData>;
  index: number;
};

const ReleaseFormTableDoc = ({ entry, remove, form, index }: ReleaseFormTableDocProps) => {
  return (
    <TableRow className="border-b-0 [&>td]:border-4 [&>td]:!py-0 [&>td]:!px-2 [&>td]:align-text-top">
      <TableCell className="min-w-fit">
        <div className="flex items-start gap-1">
          <FormIonItem>
            <InputText readOnly control={form.control} name={`entries.${index}.cvNo`} clearErrors={form.clearErrors} className="!px-2 !min-w-32 rounded-sm" />
          </FormIonItem>
          <div className={classNames('mt-2.5', form?.formState.errors?.entries && form.formState.errors.entries[index]?.cvNo && '!mt-0.5')}>
            <LoanReleaseEntrySelection
              loanReleaseEntryId={`entries.${index}.loanReleaseEntryId`}
              cvNo={`entries.${index}.cvNo`}
              dueDate={`entries.${index}.dueDate`}
              noOfWeeks={`entries.${index}.noOfWeeks`}
              name={`entries.${index}.name`}
              particular={`entries.${index}.particular`}
              setValue={form.setValue}
              clearErrors={form.clearErrors}
              className="!min-h-3.5 text-[0.5rem]"
            />
          </div>
        </div>
      </TableCell>
      <TableCell className="min-w-fit">
        <FormIonItem>
          <InputText readOnly control={form.control} name={`entries.${index}.dueDate`} clearErrors={form.clearErrors} className="!px-2 !min-w-16 rounded-sm" />
        </FormIonItem>
      </TableCell>
      <TableCell className="min-w-fit">
        <FormIonItem>
          <InputText readOnly control={form.control} name={`entries.${index}.noOfWeeks`} clearErrors={form.clearErrors} className="!px-2 !min-w-16 rounded-sm" />
        </FormIonItem>
      </TableCell>
      <TableCell>
        <FormIonItem>
          <InputText readOnly control={form.control} name={`entries.${index}.name`} clearErrors={form.clearErrors} className="!px-2 !min-w-64 rounded-sm" />
        </FormIonItem>
      </TableCell>
      <TableCell>
        <div className="flex items-start gap-1">
          <FormIonItem>
            <InputText control={form.control} readOnly name={`entries.${index}.acctCode`} clearErrors={form.clearErrors} className="!px-2 !min-w-24 rounded-sm" />
          </FormIonItem>
          <div className={classNames('mt-2.5', form?.formState.errors?.entries && form.formState.errors.entries[index]?.acctCode && '!mt-0.5')}>
            <ChartOfAccountSelection
              chartOfAccountLabel={`entries.${index}.acctCode`}
              chartOfAccountValue={`entries.${index}.acctCodeId`}
              chartOfAccountDescription={`entries.${index}.description`}
              setValue={form.setValue}
              clearErrors={form.clearErrors}
              className="!min-h-3.5 text-[0.5rem]"
            />
          </div>
        </div>
      </TableCell>
      <TableCell>
        <FormIonItem>
          <InputText control={form.control} readOnly name={`entries.${index}.description`} clearErrors={form.clearErrors} className="!px-2 !min-w-96 rounded-sm" />
        </FormIonItem>
      </TableCell>
      <TableCell>
        <FormIonItem>
          <InputText control={form.control} name={`entries.${index}.debit`} clearErrors={form.clearErrors} className="!px-2 !min-w-10 rounded-sm text-end" />
        </FormIonItem>
      </TableCell>
      <TableCell>
        <FormIonItem>
          <InputText control={form.control} name={`entries.${index}.credit`} clearErrors={form.clearErrors} className="!px-2 !min-w-10 rounded-sm text-end" />
        </FormIonItem>
      </TableCell>
      <TableCell>
        <div className="text-center">
          <IonButton
            onClick={() => remove(index)}
            title="Delete Entry"
            fill="clear"
            className="bg-red-600 rounded-md text-white ![--padding-start:0.25rem] ![--padding-end:0.25rem] [--padding-top:0.25rem] [--padding-bottom:0.25rem] min-h-0"
          >
            <IonIcon icon={trash} />
          </IonButton>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ReleaseFormTableDoc;

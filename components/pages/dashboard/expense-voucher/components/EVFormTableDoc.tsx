import React from 'react';
import { TableCell, TableRow } from '../../../../ui/table/Table';
import { EntryFormData } from '../../../../../validations/loan-release.schema';
import { UseFormReturn } from 'react-hook-form';
import { ExpenseVoucherFormData } from '../../../../../validations/expense-voucher.schema';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import InputText from '../../../../ui/forms/InputText';
import { IonButton, IonIcon } from '@ionic/react';
import { trash } from 'ionicons/icons';
import ChartOfAccountSelection from '../../../../ui/selections/ChartOfAccountSelection';
import classNames from 'classnames';
import ClientSelection from '../../../../ui/selections/ClientSelection';

type EVFormTableDocProps = {
  index: number;
  entry: EntryFormData & { id: string };
  remove: (index: number) => void;
  form: UseFormReturn<ExpenseVoucherFormData>;
  loading?: boolean;
};

const EVFormTableDoc = ({ index, entry, remove, form, loading = false }: EVFormTableDocProps) => {
  return (
    <TableRow className="border-b-0 [&>td]:border-4 [&>td]:!py-0 [&>td]:!px-2">
      <TableCell className="min-w-fit">
        <div className="flex items-start gap-1">
          <FormIonItem>
            <InputText readOnly control={form.control} name={`entries.${index}.clientLabel`} clearErrors={form.clearErrors} className="!px-2 !min-w-64 rounded-sm" />
          </FormIonItem>
          <div className={classNames('mt-2.5', form?.formState.errors?.entries && form.formState.errors.entries[index]?.clientLabel && '!mt-0.5')}>
            <ClientSelection
              clientLabel={`entries.${index}.clientLabel`}
              clientValue={`entries.${index}.client`}
              clientParticular={`entries.${index}.particular`}
              setValue={form.setValue}
              clearErrors={form.clearErrors}
              className="!min-h-3.5 text-[0.5rem]"
            />
          </div>
        </div>
      </TableCell>
      <TableCell>
        <FormIonItem>
          <InputText disabled={loading} control={form.control} name={`entries.${index}.particular`} clearErrors={form.clearErrors} className="!px-2 !min-w-64 rounded-sm" />
        </FormIonItem>
      </TableCell>
      <TableCell>
        <div className="flex items-start gap-1">
          <FormIonItem>
            <InputText control={form.control} readOnly name={`entries.${index}.acctCode`} clearErrors={form.clearErrors} className="!px-2 !min-w-24 rounded-sm" />
          </FormIonItem>
          <div className={classNames(form?.formState.errors?.entries && form.formState.errors.entries[index]?.acctCode ? 'mt-0' : 'mt-2.5')}>
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
          <InputText control={form.control} name={`entries.${index}.debit`} clearErrors={form.clearErrors} className="!px-2 !min-w-64 rounded-sm" />
        </FormIonItem>
      </TableCell>
      <TableCell>
        <FormIonItem>
          <InputText control={form.control} name={`entries.${index}.credit`} clearErrors={form.clearErrors} className="!px-2 !min-w-64 rounded-sm" />
        </FormIonItem>
      </TableCell>
      <TableCell>
        <FormIonItem>
          <InputText control={form.control} name={`entries.${index}.cvForRecompute`} clearErrors={form.clearErrors} className="!px-2 !min-w-64 rounded-sm" />
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

export default EVFormTableDoc;

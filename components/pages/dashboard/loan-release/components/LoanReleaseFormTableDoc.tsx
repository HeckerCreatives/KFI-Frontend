import React, { useEffect } from 'react';
import { TableCell, TableRow } from '../../../../ui/table/Table';
import { IonButton, IonIcon } from '@ionic/react';
import { trash } from 'ionicons/icons';
import { EntryFormData, LoanReleaseFormData } from '../../../../../validations/loan-release.schema';
import { UseFieldArrayRemove, UseFormReturn } from 'react-hook-form';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import InputText from '../../../../ui/forms/InputText';
import ChartOfAccountSelection from '../../../../ui/selections/ChartOfAccountSelection';
import classNames from 'classnames';
import ClientSelection from '../../../../ui/selections/ClientSelection';

type LoanReleaseFormTableDocProps = {
  entry: EntryFormData;
  index: number;
  remove: UseFieldArrayRemove;
  form: UseFormReturn<LoanReleaseFormData>;
};

const LoanReleaseFormTableDoc = ({ entry, index, remove, form }: LoanReleaseFormTableDocProps) => {
  const debit = form.watch(`entries.${index}.debit`);
  const credit = form.watch(`entries.${index}.credit`);
  const cycle = form.watch(`entries.${index}.cycle`);
  const checkNo = form.watch(`entries.${index}.checkNo`);
  const name = form.watch(`entries.${index}.client`);

  useEffect(() => {
    if (debit !== '' || credit !== '' || checkNo !== '' || cycle !== '') {
      form.clearErrors('entries');
    }
  }, [debit, credit, cycle, checkNo, form]);

  useEffect(() => {
    if (name) {
      form.setValue(`entries.${index}.particular`, `${form.watch('centerLabel')} - ${name}`);
    }
  }, [name]);

  return (
    <TableRow className="border-b-0 [&>td]:border-4 [&>td]:!py-0 [&>td]:!px-2">
      <TableCell className="text-center">{index + 1}</TableCell>
      <TableCell className="min-w-fit">
        <div className="flex items-start gap-1">
          <FormIonItem>
            <InputText readOnly control={form.control} name={`entries.${index}.client`} clearErrors={form.clearErrors} className="!px-2 !min-w-64 rounded-sm" />
          </FormIonItem>
          <div className={classNames('mt-2.5', form?.formState.errors?.entries && form.formState.errors.entries[index]?.acctCode && 'mt-0.5')}>
            <ClientSelection
              clientLabel={`entries.${index}.client`}
              clientValue={`entries.${index}.clientId`}
              setValue={form.setValue}
              clearErrors={form.clearErrors}
              className="!min-h-3.5 text-[0.5rem]"
              center={form.watch('center')}
            />
          </div>
        </div>
      </TableCell>
      <TableCell>
        <FormIonItem>
          <InputText readOnly control={form.control} name={`entries.${index}.particular`} clearErrors={form.clearErrors} className="!px-2 !min-w-64 rounded-sm" />
        </FormIonItem>
      </TableCell>
      <TableCell>
        <div className="flex items-start gap-1">
          <FormIonItem>
            <InputText control={form.control} readOnly name={`entries.${index}.acctCode`} clearErrors={form.clearErrors} className="!px-2 !min-w-24 rounded-sm" />
          </FormIonItem>
          <div className={classNames('mt-2.5', form?.formState.errors?.entries && form.formState.errors.entries[index]?.acctCode && 'mt-0.5')}>
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
          <InputText control={form.control} name={`entries.${index}.debit`} clearErrors={form.clearErrors} className="!px-2 !min-w-24 rounded-sm" />
        </FormIonItem>
      </TableCell>
      <TableCell>
        <FormIonItem>
          <InputText control={form.control} name={`entries.${index}.credit`} clearErrors={form.clearErrors} className="!px-2 !min-w-24 rounded-sm" />
        </FormIonItem>
      </TableCell>
      <TableCell>
        <FormIonItem>
          <InputText control={form.control} name={`entries.${index}.interest`} clearErrors={form.clearErrors} className="!px-2 !min-w-24 rounded-sm" />
        </FormIonItem>
      </TableCell>
      <TableCell>
        <FormIonItem>
          <InputText control={form.control} name={`entries.${index}.cycle`} clearErrors={form.clearErrors} className="!px-2 !min-w-24 rounded-sm" />
        </FormIonItem>
      </TableCell>
      <TableCell>
        <FormIonItem>
          <InputText control={form.control} name={`entries.${index}.checkNo`} clearErrors={form.clearErrors} className="!px-2 !min-w-24 rounded-sm" />
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

export default LoanReleaseFormTableDoc;

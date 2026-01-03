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
import { FSEntriesFormData } from '../../../../../validations/financialstatement.schema';
import InputSelect from '../../../../ui/forms/InputSelect';
import { TBEntriesFormData } from '../../../../../validations/trial-balance-schema';

type FSFormTableDocProps = {
  index: number;
  entry: EntryFormData & { id: string };
  remove: (index: number) => void;
  form: UseFormReturn<TBEntriesFormData>;
  loading?: boolean;
};

const FSFormTableDoc = ({ index, entry, remove, form, loading = false }: FSFormTableDocProps) => {

     const handleRemove = () => {
        remove(index);
    
    };
  return (
    <TableRow className="[&>td]:border-2 [&>td]:!py-0 [&>td]:!px-2 [&>td]:!bg-white">
      <TableCell className="text-center">{index + 1}</TableCell>
      <TableCell className="sticky left-0 min-w-[20rem] max-w-[20rem] z-10">
        <div className="flex items-start gap-1">
          <FormIonItem>
            <InputText readOnly control={form.control} name={`entries.${index}.acctCodeName`} clearErrors={form.clearErrors} className="!px-2 !min-w-64 rounded-sm" />
          </FormIonItem>
          <div className={classNames('mt-2.5', form?.formState.errors?.entries && form.formState.errors.entries[index]?.acctCode && '!mt-0.5')}>
             <ChartOfAccountSelection
                chartOfAccountLabel={`entries.${index}.acctCodeName`}
                chartOfAccountValue={`entries.${index}.acctCode`}
                chartOfAccountDescription={`entries.${index}.acctCodeDescription`}
                setValue={form.setValue}
                clearErrors={form.clearErrors}
                className="!min-h-3.5 text-[0.5rem]"
              />
          </div>
        </div>
      </TableCell>
      <TableCell className="sticky left-[20rem] min-w-[20rem] max-w-[20rem] z-10">
        <FormIonItem>
          <InputText disabled={loading} control={form.control} name={`entries.${index}.remarks`} clearErrors={form.clearErrors} className="!px-2 !min-w-64 rounded-sm" />
        </FormIonItem>
      </TableCell>

     
      <TableCell>
              <div className="text-center">
                <IonButton
                  onClick={handleRemove}
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

export default FSFormTableDoc;

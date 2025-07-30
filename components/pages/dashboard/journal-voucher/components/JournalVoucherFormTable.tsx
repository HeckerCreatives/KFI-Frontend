import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../../ui/table/Table';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { JournalVoucherEntryFormData, JournalVoucherFormData } from '../../../../../validations/journal-voucher.schema';
import { IonButton } from '@ionic/react';
import TableNoRows from '../../../../ui/forms/TableNoRows';
import JVFormTableDoc from './JVFormTableDoc';

type JournalVoucherFormTableProps = {
  form: UseFormReturn<JournalVoucherFormData>;
  loading?: boolean;
};

const JournalVoucherFormTable = ({ form, loading }: JournalVoucherFormTableProps) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'entries',
  });

  const addEntry = () => {
    form.clearErrors('entries');
    append({ client: '', clientLabel: '', particular: '', acctCodeId: '', acctCode: '', description: '', debit: '0', credit: '0', cvForRecompute: '' });
  };

  const deleteEntry = (index: number) => {
    remove(index);
  };

  return (
    <div className="px-2">
      <div className="text-start">
        <IonButton disabled={loading} onClick={addEntry} type="button" fill="clear" className="max-h-10 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
          + Add Entries
        </IonButton>
      </div>
      <div className="relative overflow-auto">
        <Table>
          <TableHeader>
            <TableHeadRow className="border-4 bg-slate-100 [&>th]:border-4 [&>th]:!font-normal [&>th]:!py-1.5">
              <TableHead>Name</TableHead>
              <TableHead>Particular</TableHead>
              <TableHead>Acct. Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Debit</TableHead>
              <TableHead>Credit</TableHead>
              <TableHead>CV# For Recompute</TableHead>
              <TableHead>Actions</TableHead>
            </TableHeadRow>
          </TableHeader>
          <TableBody>
            {fields.length < 1 && <TableNoRows label="No Entry Added Yet" colspan={7} />}
            {fields.length > 0 &&
              fields.map((field: JournalVoucherEntryFormData & { id: string }, index: number) => (
                <JVFormTableDoc key={field.id} index={index} entry={field} remove={deleteEntry} form={form} loading={loading} />
              ))}
          </TableBody>
        </Table>
      </div>
      {form.formState.errors.entries && <div className="text-red-600 text-xs text-center my-2">{form.formState.errors.entries.message}</div>}
    </div>
  );
};

export default JournalVoucherFormTable;

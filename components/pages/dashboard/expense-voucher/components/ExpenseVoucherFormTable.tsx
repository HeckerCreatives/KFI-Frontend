import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../../ui/table/Table';
import { ExpenseVoucherFormData } from '../../../../../validations/expense-voucher.schema';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { EntryFormData } from '../../../../../validations/loan-release.schema';
import { IonButton } from '@ionic/react';
import EVFormTableDoc from './EVFormTableDoc';
import TableNoRows from '../../../../ui/forms/TableNoRows';

type ExpenseVoucherFormTableProps = {
  form: UseFormReturn<ExpenseVoucherFormData>;
  loading?: boolean;
};

const ExpenseVoucherFormTable = ({ form, loading = false }: ExpenseVoucherFormTableProps) => {
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
        <Table className="border-2">
          <TableHeader>
            <TableHeadRow className="bg-slate-100 [&>th]:border-2 [&>th]:!font-normal [&>th]:!py-1.5 [&>th]:!text-xs">
              <TableHead className="sticky left-0 min-w-[5rem] z-10">Line</TableHead>
              <TableHead className="sticky left-0 min-w-[22rem] z-10">Name</TableHead>
              <TableHead className="sticky left-[20rem] min-w-[22rem]  z-10">Particular</TableHead>
              <TableHead className="sticky left-[40rem] min-w-[12rem]  z-10">Acct. Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Debit</TableHead>
              <TableHead>Credit</TableHead>
              <TableHead>CV# for Recompute</TableHead>
              <TableHead>Actions</TableHead>
            </TableHeadRow>
          </TableHeader>
          <TableBody>
            {fields.length < 1 && <TableNoRows label="No Entry Added Yet" colspan={7} />}
            {fields.length > 0 &&
              fields.map((field: EntryFormData & { id: string }, index: number) => (
                <EVFormTableDoc key={field.id} index={index} entry={field} remove={deleteEntry} form={form} loading={loading} />
              ))}
          </TableBody>
        </Table>
      </div>
      {form.formState.errors.entries && <div className="text-red-600 text-xs text-center my-2">{form.formState.errors.entries.message}</div>}
    </div>
  );
};

export default ExpenseVoucherFormTable;

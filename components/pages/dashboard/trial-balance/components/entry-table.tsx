import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableHeadRow } from '../../../../ui/table/Table';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { EntryFormData } from '../../../../../validations/loan-release.schema';
import { IonButton, IonIcon } from '@ionic/react';
import TableNoRows from '../../../../ui/forms/TableNoRows';
import EVFormTableDoc from './entry-doc';
import { TBEntriesFormData } from '../../../../../validations/trial-balance-schema';
import { arrowBack, arrowForward } from 'ionicons/icons';

type ExpenseVoucherFormTableProps = {
  form: UseFormReturn<TBEntriesFormData>;
  loading?: boolean;
};

const FSFormTable = ({ form, loading = false }: ExpenseVoucherFormTableProps) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'entries',
  });

  const watchedEntries = form.watch('entries') || [];

  const [page, setPage] = useState(1);
  const limit = 5;

  // Add entry
  const addEntry = () => {
    form.clearErrors('entries');
    append({
      line: fields.length + 1,
      acctCode: '',
      remarks: '',
      _synced: false,
      action: 'create',
    });
  };

  // Delete entry
  const deleteEntry = (index: number) => {
    const entry = form.getValues(`entries.${index}`);

    if (entry?._id) {
      form.setValue(`entries.${index}.action`, 'delete');
      form.setValue(`entries.${index}._synced`, false);
    } else {
      remove(index);
    }
  };

  // Filter deleted rows
  const filteredEntries = watchedEntries.filter((e) => e?.action !== 'delete');

  const totalPages = Math.ceil(filteredEntries.length / limit) || 1;

  // Paginated entries
  const paginatedEntries = filteredEntries.slice((page - 1) * limit, page * limit);

  // Prevent empty page after delete
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [filteredEntries.length]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  return (
    <div className="px-2">
      <div className="text-start">
        <IonButton
          disabled={loading}
          onClick={addEntry}
          type="button"
          fill="clear"
          className="max-h-10 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md"
          strong
        >
          + Add Entries
        </IonButton>
      </div>

      <div className="relative overflow-auto">
        <Table className="border-2">
          <TableHeader>
            <TableHeadRow className="bg-slate-100 [&>th]:border-2 [&>th]:!font-normal [&>th]:!py-1.5 [&>th]:!text-xs">
              <TableHead className="sticky left-0 min-w-[5rem] z-10">Line</TableHead>
              <TableHead className="sticky left-0 min-w-[22rem] z-10">Acct. Code</TableHead>
              <TableHead className="sticky left-[20rem] min-w-[22rem] z-10">Remarks</TableHead>
              <TableHead>Actions</TableHead>
            </TableHeadRow>
          </TableHeader>

          <TableBody>
            {filteredEntries.length === 0 && (
              <TableNoRows label="No Entry Added Yet" colspan={7} />
            )}

            {paginatedEntries.map((entry) => {
              const index = watchedEntries.findIndex((e) => e === entry);
              const field = fields[index];

              return (
                <EVFormTableDoc
                  key={field.id}
                  index={index}
                  entry={field}
                  remove={deleteEntry}
                  form={form}
                  loading={loading}
                />
              );
            })}
          </TableBody>
        </Table>
      </div>

      {form.formState.errors.entries && (
        <div className="text-red-600 text-xs text-center my-2">
          {form.formState.errors.entries.message}
        </div>
      )}

      {filteredEntries.length > 0 && (
        <div className="w-full pb-3">
          <div className="flex items-center justify-center gap-2 py-1 px-5 rounded-md w-fit mx-auto">
            <IonButton
              onClick={handlePrevPage}
              disabled={page === 1}
              fill="clear"
              className="max-h-10 min-h-6 h-8 bg-[#FA6C2F] text-white font-semibold rounded-md"
            >
              <IonIcon icon={arrowBack} />
            </IonButton>

            <div className="text-sm font-semibold px-3 py-1.5 rounded-lg text-slate-700">
              {page} / {totalPages}
            </div>

            <IonButton
              onClick={handleNextPage}
              disabled={page === totalPages}
              fill="clear"
              className="max-h-10 min-h-6 h-8 bg-[#FA6C2F] text-white font-semibold rounded-md"
            >
              <IonIcon icon={arrowForward} />
            </IonButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default FSFormTable;
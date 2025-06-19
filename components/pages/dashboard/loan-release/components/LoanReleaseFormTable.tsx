import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../../ui/table/Table';
import { IonButton } from '@ionic/react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { EntryFormData, LoanReleaseFormData } from '../../../../../validations/loan-release.schema';
import kfiAxios from '../../../../utils/axios';
import LoanReleaseFormTableDoc from './LoanReleaseFormTableDoc';

type LoanReleaseFormTableProps = {
  form: UseFormReturn<LoanReleaseFormData>;
  action?: string;
};

const LoanReleaseFormTable = ({ form }: LoanReleaseFormTableProps) => {
  const [loading, setLoading] = useState(false);
  const [didLoad, setDidLoad] = useState(false);

  const { fields, replace, remove, append } = useFieldArray({
    control: form.control,
    name: 'entries',
  });

  const center = form.watch('center');
  const typeOfLoan = form.watch('typeOfLoan');
  const isEduc = form.watch('isEduc');

  const handleLoadEntries = async () => {
    if (center === '') {
      form.setError('centerLabel', { message: 'Center is required' });
      return;
    }

    if (typeOfLoan === '') {
      form.setError('typeOfLoanLabel', { message: 'Type of loan is required' });
      return;
    }

    try {
      setLoading(true);
      const result = await kfiAxios.post(`transaction/load/entries`, {
        typeOfLoan,
        center,
        isEduc,
      });
      const { success, entries } = result.data;
      if (success) {
        replace(entries);
        setDidLoad(true);
        return;
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2">
      <div className="text-start my-2">
        <IonButton
          disabled={loading || center === '' || typeOfLoan === ''}
          onClick={handleLoadEntries}
          type="button"
          fill="clear"
          className="max-h-10 min-h-6 bg-[#FA6C2F] w-40 text-white capitalize font-semibold rounded-md"
          strong
        >
          Load
        </IonButton>
      </div>

      <div className="relative overflow-auto">
        <Table>
          <TableHeader>
            <TableHeadRow className="border-4 bg-slate-100 [&>th]:border-4">
              <TableHead>Line</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Particular</TableHead>
              <TableHead>Acct. Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Debit</TableHead>
              <TableHead>Credit</TableHead>
              <TableHead>Interest</TableHead>
              <TableHead>Cycle</TableHead>
              <TableHead>Check No.</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableHeadRow>
          </TableHeader>
          <TableBody>
            {fields.length < 1 && (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
                  No Entries Yet
                </TableCell>
              </TableRow>
            )}
            {fields.map((entry: EntryFormData & { id: string }, i: number) => (
              <LoanReleaseFormTableDoc key={`entry-${entry.id}`} entry={entry} index={i} remove={remove} form={form} />
            ))}
          </TableBody>
        </Table>
      </div>
      {form.formState.errors.entries && <div className="text-red-600 text-xs text-center my-2">{form.formState.errors.entries.message}</div>}
      <div className="text-start my-2">
        <IonButton
          onClick={() =>
            append({
              client: '',
              particular: '',
              acctCodeId: '',
              acctCode: '',
              description: '',
              debit: '',
              credit: '',
              cycle: '',
              checkNo: '',
            })
          }
          disabled={!didLoad}
          type="button"
          fill="clear"
          className="max-h-10 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md"
          strong
        >
          + Add Entries
        </IonButton>
      </div>
    </div>
  );
};

export default LoanReleaseFormTable;

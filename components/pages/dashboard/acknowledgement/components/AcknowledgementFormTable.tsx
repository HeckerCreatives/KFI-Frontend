import { IonButton } from '@ionic/react';
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../../ui/table/Table';
import kfiAxios from '../../../../utils/axios';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { AcknowledgementEntryFormData, AcknowledgementFormData } from '../../../../../validations/acknowledgement.schema';
import AcknowledgementFormTableDoc from './AcknowledgementFormTableDoc';
import { formatDateTable } from '../../../../utils/date-utils';

type AcknowledgementFormTableProps = {
  form: UseFormReturn<AcknowledgementFormData>;
};

type EntryOption = {
  _id: string;
  cvNo: string;
  dueDate: string;
  noOfWeeks: number;
  name: string;
  centerNo: string;
};

const AcknowledgementFormTable = ({ form }: AcknowledgementFormTableProps) => {
  const [loading, setLoading] = useState(false);
  const [didLoad, setDidLoad] = useState(false);

  const center = form.watch('center');

  const { fields, replace, remove, append } = useFieldArray({
    control: form.control,
    name: 'entries',
  });

  const handleLoadEntries = async () => {
    if (center === '') {
      form.setError('centerLabel', { message: 'Center is required' });
      return;
    }

    try {
      setLoading(true);
      const result = await kfiAxios.post(`transaction/entries/load`, { centerLabel: center });
      const { success, entries } = result.data;
      if (success) {
        replace(
          entries.map((entry: EntryOption) => ({
            loanReleaseEntryId: entry._id,
            cvNo: `${entry.cvNo}`,
            dueDate: formatDateTable(entry.dueDate),
            noOfWeeks: `${entry.noOfWeeks}`,
            name: entry.name,
            particular: `${entry.centerNo} - ${entry.name}`,
            acctCodeId: '',
            acctCode: '',
            description: '',
            debit: '0',
            credit: '0',
          })),
        );
        setDidLoad(true);
        return;
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = () =>
    append({ loanReleaseEntryId: '', dueDate: '', noOfWeeks: '', name: '', particular: '', acctCodeId: '', acctCode: '', description: '', debit: '0', credit: '0' });

  return (
    <div className="p-2">
      <div className="text-start my-2">
        <IonButton
          disabled={!center || didLoad}
          onClick={handleLoadEntries}
          type="button"
          fill="clear"
          className="max-h-10 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md"
          strong
        >
          {loading ? 'Loading Entries...' : 'Load Entries'}
        </IonButton>
      </div>
      <div className="relative overflow-auto">
        <Table>
          <TableHeader>
            <TableHeadRow className="border-4 bg-slate-100 [&>th]:border-4 [&>th]:!font-normal [&>th]:!py-1.5 [&>th]:!text-xs">
              <TableHead>CV#</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Week</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Account Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Debit</TableHead>
              <TableHead>Credit</TableHead>
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
            {fields.map((entry: AcknowledgementEntryFormData & { id: string }, i: number) => (
              <AcknowledgementFormTableDoc key={`entry-${entry.id}`} entry={entry} index={i} remove={remove} form={form} />
            ))}
          </TableBody>
        </Table>
      </div>
      {form.formState.errors.entries && <div className="text-red-600 text-xs text-center my-2">{form.formState.errors.entries.message}</div>}
      <div className="text-start my-2">
        <IonButton
          disabled={!didLoad}
          onClick={handleAddEntry}
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

export default AcknowledgementFormTable;

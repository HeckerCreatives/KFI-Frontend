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
      <div className="relative overflow-auto flex">
          <Table className=' sticky left-0 z-50 hidden md:table'>
          <TableHeader>
            <TableHeadRow className="border-2 bg-slate-100 [&>th]:border-2 [&>th]:!font-normal [&>th]:!py-1.5 [&>th]:!text-xs">
              <TableHead className="min-w-56 max-w-56 sticky left-[0rem] whitespace-nowrap">CV#</TableHead>
              <TableHead className="min-w-32 max-w-32 sticky left-[12rem] whitespace-nowrap hidden lg:table-cell">Due Date</TableHead>
              <TableHead className="min-w-20 max-w-20 sticky left-[20rem] whitespace-nowrap hidden lg:table-cell">Week</TableHead>
              <TableHead className="min-w-60 max-w-60 sticky left-[25rem] whitespace-nowrap hidden lg:table-cell">Name</TableHead>
              <TableHead className="min-w-48 max-w-48 sticky left-[40rem] whitespace-nowrap hidden lg:table-cell">Account Code</TableHead>
             
            </TableHeadRow>
          </TableHeader>
          <TableBody>
            {/* {fields.length < 1 && (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
                  No Entries Yet
                </TableCell>
              </TableRow>
            )} */}
            {fields.map((entry: AcknowledgementEntryFormData & { id: string }, i: number) => (
              <AcknowledgementFormTableDoc key={`entry-${entry.id}`} entry={entry} index={i} remove={remove} form={form} sticky={true} />
            ))}
          </TableBody>
        </Table>
        <Table>
          <TableHeader>
            <TableHeadRow className="border-2 bg-slate-100 [&>th]:border-2 [&>th]:!font-normal [&>th]:!py-1.5 [&>th]:!text-xs">
              <TableHead className="min-w-56 max-w-56 whitespace-nowrap table-cell md:hidden">CV#</TableHead>
              <TableHead className="min-w-32 max-w-32 whitespace-nowrap table-cell lg:hidden">Due Date</TableHead>
              <TableHead className="min-w-20 max-w-20 whitespace-nowrap table-cell lg:hidden">Week</TableHead>
              <TableHead className="min-w-60 max-w-60 whitespace-nowrap table-cell lg:hidden">Name</TableHead>
              <TableHead className="min-w-48 max-w-48 whitespace-nowrap table-cell lg:hidden">Account Code</TableHead>
              <TableHead className=' whitespace-nowrap'>Description</TableHead>
              <TableHead className=' whitespace-nowrap'>Debit</TableHead>
              <TableHead className=' whitespace-nowrap'>Credit</TableHead>
              <TableHead className="text-center whitespace-nowrap">Actions</TableHead>
            </TableHeadRow>
          </TableHeader>
          <TableBody>
            {/* {fields.length < 1 && (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
                  No Entries Yet
                </TableCell>
              </TableRow>
            )} */}
            {fields.map((entry: AcknowledgementEntryFormData & { id: string }, i: number) => (
              <AcknowledgementFormTableDoc key={`entry-${entry.id}`} entry={entry} index={i} remove={remove} form={form} />
            ))}
          </TableBody>
        </Table>
      </div>
       {fields.length < 1 && (
        <p className=' text-xs text-zinc-800 w-full text-center mt-4'>No Entries Yet</p>   
      )}
      
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

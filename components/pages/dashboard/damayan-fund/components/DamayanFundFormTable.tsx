import { IonButton } from '@ionic/react';
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../../ui/table/Table';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { EmergencyLoanEntryFormData } from '../../../../../validations/emergency-loan.schema';
import { DamayanFundFormData } from '../../../../../validations/damayan-fund.schema';
import DamayanFundFormTableDoc from './DamayanFundFormTableDoc';

type EmergencyLoanFormTableProps = {
  form: UseFormReturn<DamayanFundFormData>;
};

const DamayanFundFormTable = ({ form }: EmergencyLoanFormTableProps) => {
  const { fields, remove, append } = useFieldArray({
    control: form.control,
    name: 'entries',
  });

  const handleAddEntry = () => append({ client: '', clientLabel: '', particular: '', acctCodeId: '', acctCode: '', description: '', debit: '0', credit: '0' });

  return (
    <div className="p-2">
      <div className="text-start my-2">
        <IonButton onClick={handleAddEntry} type="button" fill="clear" className="max-h-10 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
          + Add Entries
        </IonButton>
      </div>
      <div className="relative overflow-auto flex">
        <Table className=' sticky left-0 md:table hidden z-50'>
          <TableHeader>
            <TableHeadRow className="border-4 bg-slate-100 [&>th]:border-4 [&>th]:!py-1.5  [&>th]:!font-normal [&>th]:!text-xs">
              <TableHead className=' whitespace-nowrap md:table-cell hidden'>Name</TableHead>
              <TableHead className=' whitespace-nowrap lg:table-cell hidden'>Particular</TableHead>
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
            {fields.map((entry: EmergencyLoanEntryFormData & { id: string }, i: number) => (
              <DamayanFundFormTableDoc key={`entry-${entry.id}`} entry={entry} index={i} remove={remove} form={form} sticky={true} />
            ))}
          </TableBody>
        </Table>
        <Table>
          <TableHeader>
            <TableHeadRow className="border-4 bg-slate-100 [&>th]:border-4 [&>th]:!py-1.5  [&>th]:!font-normal [&>th]:!text-xs">
              <TableHead className=' whitespace-nowrap table-cell md:hidden'>Name</TableHead>
              <TableHead className=' whitespace-nowrap table-cell lg:hidden'>Particular</TableHead>
              <TableHead className=' whitespace-nowrap'>Acct. Code</TableHead>
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
            {fields.map((entry: EmergencyLoanEntryFormData & { id: string }, i: number) => (
              <DamayanFundFormTableDoc key={`entry-${entry.id}`} entry={entry} index={i} remove={remove} form={form} />
            ))}
          </TableBody>
        </Table>
      </div>
       {fields.length < 1 && (
        <p className=' text-xs text-zinc-800 w-full text-center mt-4'>No Entries Yet</p>   
      )}
      {form.formState.errors.entries && <div className="text-red-600 text-xs text-center my-2">{form.formState.errors.entries.message}</div>}
    </div>
  );
};

export default DamayanFundFormTable;

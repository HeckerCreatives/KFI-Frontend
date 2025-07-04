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
      <div className="relative overflow-auto">
        <Table>
          <TableHeader>
            <TableHeadRow className="border-4 bg-slate-100 [&>th]:border-4">
              <TableHead>Name</TableHead>
              <TableHead>Particular</TableHead>
              <TableHead>Acct. Code</TableHead>
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
            {fields.map((entry: EmergencyLoanEntryFormData & { id: string }, i: number) => (
              <DamayanFundFormTableDoc key={`entry-${entry.id}`} entry={entry} index={i} remove={remove} form={form} />
            ))}
          </TableBody>
        </Table>
      </div>
      {form.formState.errors.entries && <div className="text-red-600 text-xs text-center my-2">{form.formState.errors.entries.message}</div>}
    </div>
  );
};

export default DamayanFundFormTable;

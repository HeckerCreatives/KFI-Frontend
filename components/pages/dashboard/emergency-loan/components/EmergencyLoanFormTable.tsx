import { IonButton, IonIcon } from '@ionic/react';
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../../ui/table/Table';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { EmergencyLoanEntryFormData, EmergencyLoanFormData } from '../../../../../validations/emergency-loan.schema';
import EmergencyLoanFormTableDoc from './EmergencyLoanFormTableDoc';
import { arrowBack, arrowForward } from 'ionicons/icons';

type EmergencyLoanFormTableProps = {
  form: UseFormReturn<EmergencyLoanFormData>;
};

const EmergencyLoanFormTable = ({ form }: EmergencyLoanFormTableProps) => {
  const { fields, replace, remove, append } = useFieldArray({
    control: form.control,
    name: 'entries',
  });

  const handleAddEntry = () => append({ client: '', clientLabel: '', particular: '', acctCodeId: '', acctCode: '', description: '', debit: '0', credit: '0' });

  const [page, setPage] = useState(1);
  const limit = 5;

    const handleNextPage = () => {
    if (page !== Math.ceil(fields.length / limit)) {
      setPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(prev => prev - 1);
    }
  };

  const currentPageItems = React.useMemo(() => {
      return fields.slice((page - 1) * limit, page * limit);
    }, [fields, page, limit]);

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
            <TableHeadRow className="border-4 bg-slate-100 [&>th]:border-4 [&>th]:!py-1.5 [&>th]:!font-normal [&>th]:!text-xs">
              <TableHead className=' whitespace-nowrap hidden md:table-cell'>Line</TableHead>
              <TableHead className=' whitespace-nowrap hidden md:table-cell'>Name</TableHead>
              <TableHead className=' whitespace-nowrap hidden lg:table-cell'>Particular</TableHead>
              
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
            {currentPageItems.map((entry: EmergencyLoanEntryFormData & { id: string }, i: number) => (
              <EmergencyLoanFormTableDoc key={`entry-${entry.id}`} entry={entry} index={((page - 1) * limit) + i} remove={remove} form={form} sticky={true} />
            ))}
          </TableBody>
        </Table>
        <Table>
          <TableHeader>
            <TableHeadRow className="border-4 bg-slate-100 [&>th]:border-4 [&>th]:!py-1.5 [&>th]:!font-normal [&>th]:!text-xs">
              <TableHead className=' whitespace-nowrap md:hidden'>Line</TableHead>
              <TableHead className=' whitespace-nowrap md:hidden'>Name</TableHead>
              <TableHead className=' whitespace-nowrap lg:hidden'>Particular</TableHead>
              <TableHead className=' whitespace-nowrap '>Acct. Code</TableHead>
              <TableHead className=' whitespace-nowrap '>Description</TableHead>
              <TableHead className=' whitespace-nowrap '>Debit</TableHead>
              <TableHead className=' whitespace-nowrap '>Credit</TableHead>
              <TableHead className="text-center">Actions</TableHead>
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
            {currentPageItems.map((entry: EmergencyLoanEntryFormData & { id: string }, i: number) => (
              <EmergencyLoanFormTableDoc key={`entry-${entry.id}`} entry={entry} index={((page - 1) * limit) + i} remove={remove} form={form} />
            ))}
          </TableBody>
        </Table>
      </div>
       {fields.length < 1 && (
        <p className=' text-xs text-zinc-800 w-full text-center mt-4'>No Entries Yet</p>   
      )}

      {fields.length > 0 && (
                  <div className="w-full pb-3">
                    <div className="flex items-center justify-center gap-2 py-1 px-5 rounded-md w-fit mx-auto">
                      <div>
                        <IonButton onClick={handlePrevPage} disabled={page === 1} fill="clear" className="max-h-10 min-h-6 h-8 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md">
                          <IonIcon icon={arrowBack} />
                        </IonButton>
                      </div>
                      <div>
                        <div className="text-sm !font-semibold  px-3 py-1.5 rounded-lg text-slate-700">
                          {page} / {Math.ceil(fields.length / limit)}
                        </div>
                      </div>
                      <div>
                        <IonButton
                          onClick={handleNextPage}
                          disabled={page === Math.ceil(fields.length / limit)}
                          fill="clear"
                          className="max-h-10 min-h-6 h-8 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md"
                        >
                          <IonIcon icon={arrowForward} />
                        </IonButton>
                      </div>
                    </div>
                  </div>
                )}
      {form.formState.errors.entries && <div className="text-red-600 text-xs text-center my-2">{form.formState.errors.entries.message}</div>}
    </div>
  );
};

export default EmergencyLoanFormTable;

import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../../ui/table/Table';
import { IonButton, IonIcon } from '@ionic/react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { EntryFormData, LoanReleaseFormData } from '../../../../../validations/loan-release.schema';
import kfiAxios from '../../../../utils/axios';
import LoanReleaseFormTableDoc from './LoanReleaseFormTableDoc';
import { arrowBack, arrowForward } from 'ionicons/icons';

type LoanReleaseFormTableProps = {
  form: UseFormReturn<LoanReleaseFormData>;
  action?: string;
};

const LoanReleaseFormTable = ({ form }: LoanReleaseFormTableProps) => {
  const [loading, setLoading] = useState(false);
  const [didLoad, setDidLoad] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 15;

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
    <div className="px-2">
      <div className="text-start my-2">
        <IonButton
          disabled={loading || center === '' || typeOfLoan === '' || didLoad}
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
            <TableHeadRow className="border-2 bg-slate-100 [&>th]:border-2 [&>th]:!py-1.5 [&>th]:!font-normal [&>th]:!text-xs">
              <TableHead>Line</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Particular</TableHead>
              <TableHead className="min-w-40 max-w-40 sticky left-0">Acct. Code</TableHead>
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
            {currentPageItems.map((entry: EntryFormData & { id: string }, i: number) => (
              <LoanReleaseFormTableDoc
                key={`entry-${entry.id}`}
                entry={entry}
                index={(page - 1) * limit + i}
                remove={remove}
                form={form}
                setPage={setPage}
                currentLength={currentPageItems.length}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      {form.formState.errors.entries && <div className="text-red-600 text-xs text-center my-2">{form.formState.errors.entries.message}</div>}
      <div>
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
      </div>
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

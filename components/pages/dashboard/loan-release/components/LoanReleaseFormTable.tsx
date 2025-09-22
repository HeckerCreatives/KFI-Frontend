import React, { useEffect, useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../../ui/table/Table';
import { IonButton, IonIcon, IonInput, IonModal } from '@ionic/react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { EntryFormData, LoanReleaseFormData } from '../../../../../validations/loan-release.schema';
import kfiAxios from '../../../../utils/axios';
import LoanReleaseFormTableDoc from './LoanReleaseFormTableDoc';
import { arrowBack, arrowForward } from 'ionicons/icons';
import classNames from 'classnames';
import { ArrowLeft01Icon, ArrowRight01Icon, Search01Icon } from 'hugeicons-react';
import TableLoadingRow from '../../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../../ui/forms/TableNoRows';
import TablePagination from '../../../../ui/forms/TablePagination';
import SelectionHeader from '../../../../ui/selections/SelectionHeader';
import FormIonItem from '../../../../ui/utils/FormIonItem';

type LoanReleaseFormTableProps = {
  form: UseFormReturn<LoanReleaseFormData>;
  action?: string;
};

type SelectClient = {
  _id: string,
  name: string   
}

const LoanReleaseFormTable = ({ form }: LoanReleaseFormTableProps) => {
  const [loading, setLoading] = useState(false);
  const [didLoad, setDidLoad] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  

  const [page, setPage] = useState(1);
  const limit = 15;

  const { fields, replace, remove, append } = useFieldArray({
    control: form.control,
    name: 'entries',
  });
  const [client, setClient] = useState<SelectClient[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [clientpage, setClientPage] = useState(1)

  const totalPages = Math.ceil(client.length / limit)


  const handleClientNextPage = () => {
    if (clientpage < totalPages) {
      setClientPage((prev) => prev + 1)
    }
  }

  const handleClientPrevPage = () => {
    if (clientpage > 1) {
      setClientPage((prev) => prev - 1)
    }
  }

  const currentClientItems = useMemo(() => {
    return client.slice((clientpage - 1) * limit, clientpage * limit)
  }, [client, clientpage, limit])

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const center = form.watch('center');
  const typeOfLoan = form.watch('typeOfLoan');
  const isEduc = form.watch('isEduc');

  const handleSelectEntries = async () => {
   

    try {
      setLoading(true);
      const result = await kfiAxios.get(`/customer/by-center/${center}`,);
      const { success, entries } = result.data;
      if (success) {
        setClient(result.data.clients)
        // replace(entries);
        // setDidLoad(true);
        return;
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

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
      const result = await kfiAxios.post(`/transaction/load/entries`,{center, typeOfLoan, isEduc, clients: selectedIds});
      const { success, entries } = result.data;
      if (success) {
         replace(entries);
         setDidLoad(true);
         setIsOpen(false)
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

  

   function dismiss() {
    setIsOpen(false);
  }

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <div className="px-2">
      <div className="text-start my-2">
        <IonButton
          disabled={loading || center === '' || typeOfLoan === '' || didLoad}
          onClick={() => {handleSelectEntries(), handleOpen()}}
          type="button"
          fill="clear"
          className="max-h-10 min-h-6 bg-[#FA6C2F] w-40 text-white capitalize font-semibold rounded-md"
          strong
        >
          Load
        </IonButton>

          <IonModal
                isOpen={isOpen}
                backdropDismiss={false}
                className=" [--border-radius:0.35rem] auto-height [--max-width:32rem] [--width:95%]"
              >
              
                <div className="inner-content !p-6  border-2 !border-slate-100">
                    <SelectionHeader dismiss={dismiss} disabled={loading} title="Loan Type Selection" />
        
                  
                  <div className="relative overflow-auto !mt-4">
                     <Table>
                    <TableHeader>
                      <TableHeadRow className="border-b-0 bg-slate-100">
                        <TableHead className="!py-2 w-12">
                          {/* optional: select all */}
                          <input
                            type="checkbox"
                            checked={client?.length > 0 && selectedIds.length === client?.length}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedIds(client.map((c) => c._id))
                              } else {
                                setSelectedIds([])
                              }
                            }}
                          />
                        </TableHead>
                        <TableHead className="!py-2">Client Name</TableHead>
                      </TableHeadRow>
                    </TableHeader>
                    <TableBody>
                      {!loading && client?.length < 1 && (
                        <TableRow><TableCell colSpan={2}>No loan type found</TableCell></TableRow>
                      )}
                      {!loading &&
                        currentClientItems?.map((data) => (
                          <TableRow key={data._id} className="border-b-0 [&>td]:!py-1">
                            <TableCell className="w-12">
                              <input
                                type="checkbox"
                                checked={selectedIds.includes(data._id)}
                                onChange={() => handleToggle(data._id)}
                              />
                            </TableCell>
                            <TableCell>{data.name}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                  </div>

                      {loading && <p className=' w-full text-center'>Loading...</p>}

                       <div className="flex items-center justify-center gap-2 py-1 px-5 rounded-md w-fit mx-auto">
                        <div>
                          <IonButton onClick={handleClientPrevPage} disabled={clientpage === 1} fill="clear" className="max-h-10 min-h-6 h-8 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md">
                            <IonIcon icon={arrowBack} />
                          </IonButton>
                        </div>
                        <div>
                          <div className="text-sm !font-semibold  px-3 py-1.5 rounded-lg text-slate-700">
                            {clientpage} / {Math.ceil(client.length / limit)}
                          </div>
                        </div>
                        <div>
                          <IonButton
                            onClick={handleClientNextPage}
                            disabled={clientpage === Math.ceil(client.length / limit)}
                            fill="clear"
                            className="max-h-10 min-h-6 h-8 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md"
                          >
                            <IonIcon icon={arrowForward} />
                          </IonButton>
                        </div>
                      </div>

                   {/* <div className="flex items-center justify-center gap-2 mt-6">
                      <button
                        className="px-3 py-1 border rounded disabled:opacity-50 bg-orange-600 text-black"
                        onClick={handleClientPrevPage}
                        disabled={clientpage === 1}
                      >
                        <ArrowLeft01Icon size={20}/>
                      </button>
                      
                      <button
                        className="px-3 py-1 border rounded disabled:opacity-50 bg-orange-600 text-black"
                        onClick={handleClientNextPage}
                        disabled={clientpage === totalPages}
                      >
                      <ArrowRight01Icon size={20}/>
                      </button>
                    </div> */}



                  <div className=' w-full flex items-center justify-end !mt-6'>
                    <IonButton
                      onClick={dismiss}
                      type="button"
                      fill="clear"
                      className="max-h-10 min-h-6 bg-zinc-100 w-40 text-black capitalize font-semibold rounded-md"
                      strong
                    >
                      Cancel
                    </IonButton>

                    <IonButton
                    disabled={selectedIds.length === 0}
                      onClick={handleLoadEntries}
                      type="button"
                      fill="clear"
                      className="max-h-10 min-h-6 bg-[#FA6C2F] w-40 text-white capitalize font-semibold rounded-md"
                      strong
                    >
                      Load
                    </IonButton>
                  </div>
                   
                </div>
              </IonModal>
      </div>

      <div className="relative overflow-auto flex">
        <Table className=' hidden md:table sticky left-0 z-50 translate-x-1 '>
          <TableHeader>
            <TableHeadRow className="border-2 [&>th]:border-2 [&>th]:!py-1.5 [&>th]:!font-normal [&>th]:!text-xs ">
              <TableHead>Line</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className='hidden lg:table-cell'>Particular</TableHead>
              <TableHead className="min-w-48  sticky left-0 hidden lg:table-cell">Acct. Code</TableHead>
             
            </TableHeadRow>
          </TableHeader>
          <TableBody>
           
            {currentPageItems.map((entry: EntryFormData & { id: string }, i: number) => (
              <LoanReleaseFormTableDoc
                key={`entry-${entry.id}`}
                entry={entry}
                index={(page - 1) * limit + i}
                remove={remove}
                form={form}
                setPage={setPage}
                currentLength={currentPageItems.length}
                sticky={true}
              />
            ))}
          </TableBody>
        </Table>
        <Table>
          <TableHeader>
            <TableHeadRow className="border-2 bg-slate-100 [&>th]:border-2 [&>th]:!py-1.5 [&>th]:!font-normal [&>th]:!text-xs">
              <TableHead className=' table-cell md:hidden whitespace-nowrap'>Line</TableHead>
              <TableHead className=' table-cell md:hidden whitespace-nowrap'>Name</TableHead>
              <TableHead className=' table-cell lg:hidden whitespace-nowrap'>Particular</TableHead>
              <TableHead className=' table-cell lg:hidden whitespace-nowrap'>Acct. Code</TableHead>
              <TableHead className=' whitespace-nowrap'>Description</TableHead>
              <TableHead className=' whitespace-nowrap'>Debit</TableHead>
              <TableHead className=' whitespace-nowrap'>Credit</TableHead>
              <TableHead className=' whitespace-nowrap'>Interest</TableHead>
              <TableHead className=' whitespace-nowrap'>Cycle</TableHead>
              <TableHead className=' whitespace-nowrap'>Check No.</TableHead>
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
            {currentPageItems.map((entry: EntryFormData & { id: string }, i: number) => (
              <LoanReleaseFormTableDoc
                key={`entry-${entry.id}`}
                entry={entry}
                index={(page - 1) * limit + i}
                remove={remove}
                form={form}
                setPage={setPage}
                currentLength={currentPageItems.length}
                sticky={false}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      {fields.length < 1 && (
        <p className=' text-xs text-zinc-800 w-full text-center mt-4'>No Entries Yet</p>   
      )}
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

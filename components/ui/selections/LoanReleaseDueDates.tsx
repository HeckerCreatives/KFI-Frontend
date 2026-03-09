import { IonButton, IonHeader, IonInput, IonModal, IonToolbar } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import SelectionHeader from './SelectionHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../table/Table';
import FormIonItem from '../utils/FormIonItem';
import classNames from 'classnames';
import kfiAxios from '../../utils/axios';
import TableLoadingRow from '../forms/TableLoadingRow';
import TableNoRows from '../forms/TableNoRows';
import { FieldValues, Path, PathValue, UseFormClearErrors, UseFormSetValue } from 'react-hook-form';
import TablePagination from '../forms/TablePagination';
import { formatDateTable } from '../../utils/date-utils';
import { Search01Icon } from 'hugeicons-react';

type Option = {
  _id: string,
    transaction: {
        _id: string,
        code: string,
        date: string
    },
    week: number,
    date: string
};

export type TLoanReleaseEntries = {
  loanEntries: Option[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

type LoanReleaseEntrySelectionProps<T extends FieldValues> = {
  setValue: UseFormSetValue<T>;
  clearErrors: UseFormClearErrors<T>;
  center?: Path<T>;
  loanReleaseDate?: Path<T>;
  loanReleaseDueDate?: Path<T>;
  weekNo?: Path<T>;
  centerId: string

};

const LoanReleaseDueDatesSelections = <T extends FieldValues>({
  setValue,
  clearErrors,
  centerId,
  center,
  loanReleaseDate, loanReleaseDueDate, weekNo
}: LoanReleaseEntrySelectionProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ionInputRef = useRef<HTMLIonInputElement>(null);
  const [allEntries, setAllEntries] = useState<Option[]>([]);
    const [filteredEntries, setFilteredEntries] = useState<Option[]>([]);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [data, setData] = useState<TLoanReleaseEntries>({
    loanEntries: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  function dismiss() {
    setIsOpen(false);
  }

  const handleOpen = () => {
    setIsOpen(true);
  };

  const fetchEntries = async () => {
//   if (!centerId) return;

  setLoading(true);

  try {
    const result = await kfiAxios.get(`/transaction/due-dates/${centerId}`);

    const { success, dueDates } = result.data;

    if (success) {
      setAllEntries(dueDates);
      setFilteredEntries(dueDates);
    }

  } catch (error) {
  } finally {
    setLoading(false);
  }
};

  const handleSelect = (loanEntry: Option) => {
    loanReleaseDate && setValue(loanReleaseDate as Path<T>, loanEntry.transaction.date.split('T')[0] as any);
    loanReleaseDueDate && setValue(loanReleaseDueDate as Path<T>, loanEntry.date.split('T')[0] as any);
    weekNo && setValue(weekNo as Path<T>, String(loanEntry.week) as any);
    dismiss();
  };

  const handleSearch = () => {
    const keyword = (ionInputRef.current?.value || '') as string;

    console.log(keyword)

    const filtered = allEntries.filter(item =>
        item.transaction.code.toLowerCase().includes(keyword)
    );

    setFilteredEntries(filtered);
    setCurrentPage(1);
    };

    const PAGE_SIZE = 10;

    const totalPages = Math.ceil(filteredEntries.length / PAGE_SIZE);

    const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
    );

    const handlePagination = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    };

  useEffect(() => {
  if (isOpen) {
    fetchEntries();
    setCurrentPage(1);
  }
}, [isOpen]);

  return (
    <>
      <div className="text-end">
        <IonButton onClick={handleOpen} fill="clear" className={classNames('max-h-9 min-h-9 btn-color text-white capitalize font-semibold rounded-md m-0 text-xs')} strong>
          <Search01Icon size={15} stroke='.8' className=' mr-1'/>
          Find
        </IonButton>
      </div>
      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className=" [--border-radius:0.7rem] auto-height md:[--max-width:70%] md:[--width:100%] lg:[--max-width:50%] lg:[--width:50%]"
      >
       
        <div className="inner-content !p-6  border-2 !border-slate-200">
            <SelectionHeader dismiss={dismiss} disabled={loading} title="Loan Release Selection" />

          <div className="">
            <div className="flex items-center flex-wrap justify-start gap-2">
              <div className="flex items-center min-w-20">
                <FormIonItem className="flex-1">
                  <IonInput
                    ref={ionInputRef}
                    clearInput
                    type="search"
                    aria-label="Type here"
                    placeholder="Type here"
                    disabled={data.loading}
                    className={classNames(
                      'text-sm !bg-white rounded-md !px-2 ![--highlight-color-focused:none] md:![--padding-bottom:0] ![--padding-top:0] ![--padding-start:0] border border-slate-400 ![--min-height:1rem] !min-h-[1rem]',
                    )}
                  />
                </FormIonItem>
                <IonButton
                  disabled={data.loading}
                  onClick={() => handleSearch()}
                  type="button"
                  fill="clear"
                  className="max-h-10 min-h-[2rem] bg-[#FA6C2F] text-white capitalize font-semibold rounded-md text-xs"
                  strong
                >
                  <Search01Icon size={15} stroke='.8' className=' mr-1'/>

                  {data.loading ? 'Finding...' : 'Find'}
                </IonButton>
              </div>
            </div>
          </div>
          <div className="relative overflow-auto">
            <Table>
              <TableHeader>
                <TableHeadRow className="border-b-0 bg-slate-100">
                  <TableHead className="!py-2">CV#</TableHead>
                  <TableHead className="!py-2">Week</TableHead>
                  <TableHead className="!py-2">Date</TableHead>
                  <TableHead className="!py-2">Due Date</TableHead>
                </TableHeadRow>
              </TableHeader>
              <TableBody>
                {loading && <TableLoadingRow colspan={4} />}
                {!loading && paginatedEntries.length < 1 && <TableNoRows colspan={4} label="No data found" />}
                {!loading &&
                  paginatedEntries.map((data: Option) => (
                    <TableRow onClick={() => handleSelect(data)} key={data._id} className="border-b-0 [&>td]:!py-1 cursor-pointer">
                      <TableCell className="">{data.transaction.code}</TableCell>
                      <TableCell className="">{data.week}</TableCell>
                      <TableCell className="">{formatDateTable(data.transaction.date)}</TableCell>
                      <TableCell className="">{formatDateTable(data.date)}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePagination}
            disabled={loading}
            />
        </div>
      </IonModal>
    </>
  );
};

export default LoanReleaseDueDatesSelections;


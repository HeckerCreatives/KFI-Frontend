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

type Option = {
  _id: string;
  code: string;
};

export type TJournalVoucher = {
  journalVouchers: { _id: string; code: string }[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

type JournalVoucherSelectionProps<T extends FieldValues> = {
  setValue: UseFormSetValue<T>;
  clearErrors: UseFormClearErrors<T>;
  journalVoucherLabel: Path<T>;
  journalVoucherValue: Path<T>;
  className?: string;
};

const JournalVoucherSelection = <T extends FieldValues>({ journalVoucherLabel, journalVoucherValue, setValue, clearErrors, className = '' }: JournalVoucherSelectionProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ionInputRef = useRef<HTMLIonInputElement>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [data, setData] = useState<TJournalVoucher>({
    journalVouchers: [],
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

  const handleSearch = async (page: number) => {
    const value = ionInputRef.current?.value || '';
    setLoading(true);
    try {
      const filter: any = { keyword: value, page, limit: 10 };
      const result = await kfiAxios.get('journal-voucher/selection', { params: filter });
      const { success, journalVouchers, hasPrevPage, hasNextPage, totalPages } = result.data;
      if (success) {
        setData(prev => ({
          ...prev,
          journalVouchers: journalVouchers,
          totalPages: totalPages,
          nextPage: hasNextPage,
          prevPage: hasPrevPage,
        }));
        setCurrentPage(page);
        return;
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSelectExpenseVoucher = (journalVoucher: Option) => {
    const jvCode = journalVoucher.code as PathValue<T, Path<T>>;
    const jvId = journalVoucher._id as PathValue<T, Path<T>>;

    setValue(journalVoucherLabel as Path<T>, jvCode as any);
    setValue(journalVoucherValue as Path<T>, jvId as any);
    clearErrors(journalVoucherLabel);
    clearErrors(journalVoucherValue);
    setData({
      journalVouchers: [],
      loading: false,
      totalPages: 0,
      nextPage: false,
      prevPage: false,
    });
    dismiss();
  };

  const handlePagination = (page: number) => handleSearch(page);

  useEffect(() => {
    isOpen && handleSearch(1);
  }, [isOpen]);

  return (
    <>
      <div className="text-end">
        <IonButton onClick={handleOpen} fill="clear" className={classNames('max-h-9 min-h-9 btn-color text-white capitalize font-semibold rounded-md m-0', className)} strong>
          Find
        </IonButton>
      </div>
      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:70%] md:[--width:100%] lg:[--max-width:50%] lg:[--width:50%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-10">
            <SelectionHeader dismiss={dismiss} disabled={loading} title="Journal Voucher Selection" />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content !p-2  border-2 !border-slate-400">
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
                  onClick={() => handleSearch(1)}
                  type="button"
                  fill="clear"
                  className="max-h-10 min-h-[2rem] bg-[#FA6C2F] text-white capitalize font-semibold rounded-md"
                  strong
                >
                  {data.loading ? 'Finding...' : 'Find'}
                </IonButton>
              </div>
            </div>
          </div>
          <div className="relative overflow-auto">
            <Table>
              <TableHeader>
                <TableHeadRow className="border-b-0 bg-slate-100">
                  <TableHead className="!py-2">Document No.</TableHead>
                </TableHeadRow>
              </TableHeader>
              <TableBody>
                {loading && <TableLoadingRow colspan={1} />}
                {!loading && data.journalVouchers.length < 1 && <TableNoRows colspan={1} label="No journal voucher found" />}
                {!loading &&
                  data.journalVouchers.map((data: Option) => (
                    <TableRow onClick={() => handleSelectExpenseVoucher(data)} key={data._id} className="border-b-0 [&>td]:!py-1 cursor-pointer">
                      <TableCell className="">{data.code}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          <TablePagination currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePagination} disabled={data.loading} />
        </div>
      </IonModal>
    </>
  );
};

export default JournalVoucherSelection;

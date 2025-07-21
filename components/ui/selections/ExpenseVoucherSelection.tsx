import { IonButton, IonHeader, IonInput, IonModal, IonToolbar } from '@ionic/react';
import React, { useRef, useState } from 'react';
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

export type TExpenseVoucher = {
  expenseVouchers: { _id: string; code: string }[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

type ExpenseVoucherSelectionProps<T extends FieldValues> = {
  setValue: UseFormSetValue<T>;
  clearErrors: UseFormClearErrors<T>;
  expenseVoucherLabel: Path<T>;
  expenseVoucherValue: Path<T>;
  className?: string;
};

const ExpenseVoucherSelection = <T extends FieldValues>({ expenseVoucherLabel, expenseVoucherValue, setValue, clearErrors, className = '' }: ExpenseVoucherSelectionProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ionInputRef = useRef<HTMLIonInputElement>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [data, setData] = useState<TExpenseVoucher>({
    expenseVouchers: [],
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
      const filter: any = { keyword: value, page };
      const result = await kfiAxios.get('expense-voucher/selection', { params: filter });
      const { success, expenseVouchers, hasPrevPage, hasNextPage, totalPages } = result.data;
      if (success) {
        setData(prev => ({
          ...prev,
          expenseVouchers: expenseVouchers,
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

  const handleSelectExpenseVoucher = (expenseVoucher: Option) => {
    const evCode = expenseVoucher.code as PathValue<T, Path<T>>;
    const evId = expenseVoucher._id as PathValue<T, Path<T>>;

    setValue(expenseVoucherLabel as Path<T>, evCode as any);
    setValue(expenseVoucherValue as Path<T>, evId as any);
    clearErrors(expenseVoucherLabel);
    clearErrors(expenseVoucherValue);
    setData({
      expenseVouchers: [],
      loading: false,
      totalPages: 0,
      nextPage: false,
      prevPage: false,
    });
    dismiss();
  };

  const handlePagination = (page: number) => handleSearch(page);

  return (
    <>
      <div className="text-end">
        <IonButton onClick={handleOpen} fill="clear" className={classNames('max-h-9 min-h-9 btn-color text-white capitalize font-semibold rounded-md m-0', className)} strong>
          Find
        </IonButton>
      </div>
      <IonModal isOpen={isOpen} backdropDismiss={false} className="auto-height md:[--max-width:70%] md:[--width:100%] lg:[--max-width:50%] lg:[--width:50%]">
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-10">
            <SelectionHeader dismiss={dismiss} disabled={loading} title="Expense Voucher Selection" />
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
                {data.loading && <TableLoadingRow colspan={1} />}
                {!data.loading && data.expenseVouchers.length < 1 && <TableNoRows colspan={1} label="No expense voucher found" />}
                {!data.loading &&
                  data.expenseVouchers.map((data: Option) => (
                    <TableRow onClick={() => handleSelectExpenseVoucher(data)} key={data._id} className="border-b-0 [&>td]:!py-1 cursor-pointer">
                      <TableCell className="">CV#{data.code}</TableCell>
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

export default ExpenseVoucherSelection;

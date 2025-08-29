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
import { Search01Icon } from 'hugeicons-react';

type Option = {
  _id: string;
  code: string;
  description: string;
};

export type TSupplier = {
  suppliers: { _id: string; code: string; description: string }[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

type SupplierSelectionProps<T extends FieldValues> = {
  setValue: UseFormSetValue<T>;
  clearErrors: UseFormClearErrors<T>;
  supplierLabel: Path<T>;
  supplierValue: Path<T>;
  className?: string;
};

const SupplierSelection = <T extends FieldValues>({ supplierLabel, supplierValue, setValue, clearErrors, className = '' }: SupplierSelectionProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ionInputRef = useRef<HTMLIonInputElement>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [data, setData] = useState<TSupplier>({
    suppliers: [],
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
      const result = await kfiAxios.get('supplier/selection', { params: filter });
      const { success, suppliers, hasPrevPage, hasNextPage, totalPages } = result.data;
      if (success) {
        setData(prev => ({
          ...prev,
          suppliers: suppliers,
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

  const handleSelect = (supplier: Option) => {
    const supplierCode = `${supplier.description}` as PathValue<T, Path<T>>;
    const supplierId = supplier._id as PathValue<T, Path<T>>;

    setValue(supplierLabel as Path<T>, supplierCode as any);
    setValue(supplierValue as Path<T>, supplierId as any);
    clearErrors(supplierLabel);
    clearErrors(supplierValue);
    setData({
      suppliers: [],
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
      <IonButton onClick={handleOpen} fill="clear" className={classNames('max-h-9 min-h-9 btn-color text-white capitalize font-semibold rounded-md !m-0 text-xs', className)} strong>
        <Search01Icon size={15} stroke='.8' className=' mr-1'/>
        Find
      </IonButton>
      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className=" ![--border-radius:1rem] auto-height [--max-width:48rem] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-10">
            <SelectionHeader dismiss={dismiss} disabled={loading} title="Supplier Selection" />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6  border-2 !border-slate-400">
          <SelectionHeader dismiss={dismiss} disabled={loading} title="Supplier Selection" />

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
                  disabled={loading}
                  onClick={() => handleSearch(1)}
                  type="button"
                  fill="clear"
                  className="max-h-10 min-h-[2rem] bg-[#FA6C2F] text-white capitalize font-semibold rounded-md text-xs"
                  strong
                >
                  <Search01Icon size={15} stroke='.8' className=' mr-1'/>
                  {loading ? 'Finding...' : 'Find'}
                </IonButton>
              </div>
            </div>
          </div>
          <div className="relative overflow-auto">
            <Table>
              <TableHeader>
                <TableHeadRow className="border-b-0 bg-slate-100">
                  <TableHead className="!py-2">Code</TableHead>
                  <TableHead className="!py-2">Description</TableHead>
                </TableHeadRow>
              </TableHeader>
              <TableBody>
                {loading && <TableLoadingRow colspan={2} />}
                {!loading && data.suppliers.length < 1 && <TableNoRows colspan={2} label="No supplier found" />}
                {!loading &&
                  data.suppliers.map((data: Option) => (
                    <TableRow onClick={() => handleSelect(data)} key={data._id} className="border-b-0 [&>td]:!py-1 cursor-pointer">
                      <TableCell className="">{data.code}</TableCell>
                      <TableCell className="">{data.description}</TableCell>
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

export default SupplierSelection;

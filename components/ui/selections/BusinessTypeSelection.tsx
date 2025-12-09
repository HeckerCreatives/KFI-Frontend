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
import { Search01Icon } from 'hugeicons-react';
import { useOnlineStore } from '../../../store/onlineStore';
import { TABLE_LIMIT } from '../../utils/constants';
import { db } from '../../../database/db';

type Option = {
  _id: string;
  type: string;
};

type BusinessTypeSelectionProps<T extends FieldValues> = {
  setValue: UseFormSetValue<T>;
  clearErrors: UseFormClearErrors<T>;
  businessTypeLabel: Path<T>;
  businessTypeValue: Path<T>;
};

export type TData = {
  datas: Option[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const BusinessTypeSelection = <T extends FieldValues>({ businessTypeLabel, businessTypeValue, setValue, clearErrors }: BusinessTypeSelectionProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ionInputRef = useRef<HTMLIonInputElement>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const online = useOnlineStore((state) => state.online);
  

  const [data, setData] = useState<TData>({
    datas: [],
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
    const value = ionInputRef.current?.value;
    if(online){
         setLoading(true);
        try {
          const filter: any = { keyword: value, page, limit: 10 };
          const result = await kfiAxios.get('/business-type/selection', { params: filter });
          const { success, businessTypes, totalPages, hasNextPage, hasPrevPage } = result.data;
          if (success) {
            setData(prev => ({
              ...prev,
              datas: businessTypes,
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
    } else {
       try {
                  const limit = TABLE_LIMIT;
            
                  let allData = await db.businessTypes.toArray();

                  console.log(allData)
      
                  let allOptions: Option[] = allData.map(data => ({
                    _id: data._id,
                    type: data.type || '',       
                  }));
      
                   if (value) {
                    allOptions = allOptions.filter(
                      opt =>
                        opt.type.includes(String(value))
                    );
                  }
      
            
                 const totalItems = allOptions.length;
                  const totalPages = Math.ceil(totalItems / limit);
      
                  const start = (page - 1) * limit;
                  const end = start + limit;
      
                  const types = allOptions.slice(start, end);
      
                  const hasPrevPage = page > 1;
                  const hasNextPage = page < totalPages;
            
                  setData(prev => ({
                     ...prev,
                    datas: types,
                    totalPages: totalPages,
                    nextPage: hasNextPage,
                    prevPage: hasPrevPage,
                  }));
            
                  setCurrentPage(page);
                } catch (error) {
                  console.error("Offline clients fetch error:", error);
                
                } finally {
                  setData(prev => ({ ...prev, loading: false }));
                }
          }
 
  };

  const handleSelectBusinessType = (businessType: Option) => {
    const typeValue = businessType.type as PathValue<T, Path<T>>;
    const idValue = businessType._id as PathValue<T, Path<T>>;
    setValue(businessTypeLabel as Path<T>, typeValue as any);
    setValue(businessTypeValue as Path<T>, idValue as any);
    clearErrors(businessTypeLabel);
    clearErrors(businessTypeValue);
    setData({
      datas: [],
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
        <IonButton onClick={handleOpen} fill="clear" className="max-h-9 min-h-9 btn-color text-white capitalize font-semibold rounded-md m-0 text-xs" strong>
          <Search01Icon size={15} stroke='.8' className=' mr-1'/>
          Find
        </IonButton>
      </div>
      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className=" ![--border-radius:.8rem] auto-height [--max-width:32rem] [--width:100%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-10">
            <SelectionHeader dismiss={dismiss} disabled={loading} title="Business Type Selection" />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6  border-2 !border-slate-100">
            <SelectionHeader dismiss={dismiss} disabled={loading} title="Business Type Selection" />

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
                    disabled={loading}
                    className={classNames(
                      'text-sm !bg-white rounded-md !px-2 ![--highlight-color-focused:none] md:![--padding-bottom:0] ![--padding-top:0] ![--padding-start:0] border border-zinc-300 ![--min-height:1rem] !min-h-[1rem]',
                    )}
                  />
                </FormIonItem>
                <IonButton
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
                  <TableHead className="!py-2">Type</TableHead>
                </TableHeadRow>
              </TableHeader>
              <TableBody>
                {loading && <TableLoadingRow colspan={2} />}
                {!loading && data.datas.length < 1 && <TableNoRows colspan={2} label="No business type found" />}
                {!loading &&
                  data.datas.map((data: Option) => (
                    <TableRow onClick={() => handleSelectBusinessType(data)} key={data._id} className="border-b-0 [&>td]:!py-1 cursor-pointer">
                      <TableCell className="">{data.type}</TableCell>
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

export default BusinessTypeSelection;

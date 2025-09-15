import { IonButton, IonHeader, IonIcon, IonInput, IonModal, IonToolbar } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import SelectionHeader from './SelectionHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../table/Table';
import FormIonItem from '../utils/FormIonItem';
import classNames from 'classnames';
import kfiAxios from '../../utils/axios';
import TableLoadingRow from '../forms/TableLoadingRow';
import TableNoRows from '../forms/TableNoRows';
import { FieldValues, Path, PathValue, UseFormClearErrors, UseFormReturn, UseFormSetValue } from 'react-hook-form';
import TablePagination from '../forms/TablePagination';
import { Search01Icon } from 'hugeicons-react';
import { EmergencyLoanFormData } from '../../../validations/emergency-loan.schema';
import { arrowBack, arrowForward } from 'ionicons/icons';

type Option = {
  _id: string;
 name: string

};

type CenterSelectionProps<T extends FieldValues> = {
    centerid?: string, 
  setValue: UseFormSetValue<T>;
  clearErrors: UseFormClearErrors<T>;
  centerLabel: Path<T>;
  centerValue: Path<T>;
  clientLabel?: Path<T>;
  clientValue?: Path<T>;
  acctOfficer?: Path<T>;
  centerDescription?: Path<T>;
  className?: string;
};

export type TData = {
  clients: Option[];
   loading: boolean,
    totalPages: number,
    nextPage: boolean,
    prevPage: boolean,
 
};

const CenterClientSelection = <T extends FieldValues>({ centerid, centerLabel, centerValue, clientLabel, clientValue, centerDescription, setValue, clearErrors, className = '' , acctOfficer}: CenterSelectionProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ionInputRef = useRef<HTMLIonInputElement>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
    const [page, setPage] = useState(1);
    const limit = 15;
    

  const [data, setData] = useState<TData>({
    clients: [],
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
    setLoading(true);
    try {
      const filter: any = { keyword: value, page, limit: 10 };
     const result = await kfiAxios.get(`/customer/by-center/${centerid}`);
      const { success, clients, totalPages, hasNextPage, hasPrevPage } = result.data;

       if (success) {
         setData(prev => ({
           ...prev,
           clients: clients,
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

  const handleSelectClient = async (data: Option) => {

    const nameValue = data.name as PathValue<T, Path<T>>;
    const idValue = data._id as PathValue<T, Path<T>>;

    setValue(clientLabel as Path<T>, nameValue  as any);


    setValue(clientValue as Path<T>, idValue as any);
    clearErrors(clientValue);
    clearErrors(clientLabel);




    dismiss();
  };

  const handlePagination = (page: number) => handleSearch(page);

  useEffect(() => {
    isOpen && handleSearch(1);
  }, [isOpen]);

  
    const handleNextPage = () => {
      if (page !== Math.ceil(data.clients.length / limit)) {
        setPage(prev => prev + 1);
      }
    };
  
    const handlePrevPage = () => {
      if (page > 0) {
        setPage(prev => prev - 1);
      }
    };
  
  
    const currentPageItems = React.useMemo(() => {
      return data.clients.slice((page - 1) * limit, page * limit);
    }, [data, page, limit]);

  return (
    <>
      <IonButton onClick={handleOpen} fill="clear" className={classNames('max-h-9 min-h-9 btn-color text-white capitalize font-semibold !m-0 rounded-md text-xs', className)} strong>
        <Search01Icon size={15} stroke='.8' className=' mr-1'/>
        Find
      </IonButton>

      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className=" ![--border-radius:1rem] auto-height [--width:95%] [--max-width:32rem]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-10">
            <SelectionHeader dismiss={dismiss} disabled={loading} title="Center Selection" />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6  border-2 !border-slate-400">
            <SelectionHeader dismiss={dismiss} disabled={loading} title="Client Selection" />

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
                  <TableHead className="!py-2">Name</TableHead>
                </TableHeadRow>
              </TableHeader>
              <TableBody>
                {loading && <TableLoadingRow colspan={2} />}
                {!loading && data.clients.length < 1 && <TableNoRows colspan={2} label="No client found" />}
                {!loading &&
                  currentPageItems.map((data: Option) => (
                    <TableRow onClick={() => handleSelectClient(data)} key={data._id} className="border-b-0 [&>td]:!py-1 cursor-pointer">
                      <TableCell className="">{data.name}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-center gap-2 py-1 px-5 rounded-md w-fit mx-auto">
          <div>
            <IonButton onClick={handlePrevPage} disabled={page === 1} fill="clear" className="max-h-10 min-h-6 h-8 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md">
              <IonIcon icon={arrowBack} />
            </IonButton>
          </div>
          <div>
            <div className="text-sm !font-semibold  px-3 py-1.5 rounded-lg text-slate-700">
              {page} / {Math.ceil(data.clients.length / limit)}
            </div>
          </div>
          <div>
            <IonButton
              onClick={handleNextPage}
              disabled={page === Math.ceil(data.clients.length / limit)}
              fill="clear"
              className="max-h-10 min-h-6 h-8 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md"
            >
              <IonIcon icon={arrowForward} />
            </IonButton>
          </div>
        </div>
          
        </div>
      </IonModal>
    </>
  );
};

export default CenterClientSelection;

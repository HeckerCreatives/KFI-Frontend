import React, { useEffect, useState } from 'react';
import InputSelect from '../../../../ui/forms/InputSelect';
import InputText from '../../../../ui/forms/InputText';
import { IonButton } from '@ionic/react';
import { useForm } from 'react-hook-form';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import { Search01Icon } from 'hugeicons-react';
import { useOnlineStore } from '../../../../../store/onlineStore';
import { TData } from '../ExpenseVoucher';
import kfiAxios from '../../../../utils/axios';
import SearchInput from '../../../../ui/forms/InputSearch';

type TSearch = {
  code: string;
  sort: string;
  dateTo: string;
  dateFrom: string;
};

type ExpenseVoucherFilterProps = {
  getExpenseVouchers: (page: number, keyword?: string, sort?: string, from?: string, to?: string) => void;
};

const ExpenseVoucherFilter = ({ getExpenseVouchers }: ExpenseVoucherFilterProps) => {
  const form = useForm<TSearch>({
    defaultValues: {
      code: '',
      sort: '',
      dateTo: '',
      dateFrom: '',
    },
  });

 

  const onSubmit = (data: TSearch) => {
    if (data.code !== '' || data.sort !== '' || data.dateFrom !== '' || data.dateTo !== '') {
      getExpenseVouchers(1, data.code, data.sort, data.dateTo, data.dateFrom);
    } else {
      getExpenseVouchers(1);
    }
  };

  const online = useOnlineStore((state) => state.online);
    
    const code = form.watch('code');
    const sort = form.watch('sort');
    const dateTo = form.watch('dateTo');
    const dateFrom = form.watch('dateFrom');
    
      useEffect(() => {
        const fetchData = () => {
          if (online) {
            getExpenseVouchers(1, code, sort, dateTo, dateFrom);
          } else {
            getExpenseVouchers(1, code, sort, dateTo, dateFrom);
          }
        };
        fetchData();
      }, [sort, online, dateTo, dateFrom]);

 const [data, setData] = useState<TData>({
        expenseVouchers: [],
        loading: false,
        totalPages: 0,
        nextPage: false,
        prevPage: false,
      });
      
    useEffect(() => {
       const getData = async () => {
      setData(prev => ({ ...prev, loading: true }));

      try {
        const result = await kfiAxios.get('/expense-voucher', { params: { limit: 5, search: code, page: 1 } });
         const { success, expenseVouchers, hasPrevPage, hasNextPage, totalPages } = result.data;
        if (success) {
          setData(prev => ({
            ...prev,
            expenseVouchers: expenseVouchers,
            totalPages: totalPages,
            nextPage: hasNextPage,
            prevPage: hasPrevPage,
          }));
        }
      } catch (error) {
        // handle error
      } finally {
        setData(prev => ({ ...prev, loading: false }));
      }
    };

    const timer = setTimeout(() => {
      getData();
    }, 800);

    return () => clearTimeout(timer);
   
  }, [code]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-fit">
      <div className="flex flex-wrap gap-2 items-end ">
       <FormIonItem className="min-w-32 ![--min-height:1rem] pb-1">
          <div className=' flex flex-col gap-1'>
            <label htmlFor="dateFrom" className=' text-xs'>Date From</label>
             <InputText
              // label="Date From"
              name="dateFrom"
              type="date"
              control={form.control}
              clearErrors={form.clearErrors}
              className="!px-3 !py-2 !min-h-[1rem] rounded-xl   text-xs"
              max="9999-12-31"
              labelClassName="truncate !text-xs pt-1.5"
            />
          </div>


         
        </FormIonItem>
        <FormIonItem className="min-w-32 ![--min-height:1rem] pb-1">

          <div className=' flex flex-col gap-1'>
            <label htmlFor="dateTo" className=' text-xs'>Date To</label>
             <InputText
              name="dateTo"
              // label="Date To"
              type="date"
              control={form.control}
              clearErrors={form.clearErrors}
              className="!px-3 !py-2 !min-h-[1rem] rounded-xl   text-xs"
              max="9999-12-31"
              labelClassName="truncate !text-xs pt-1.5"
            />
          </div>
         
        </FormIonItem>
        <FormIonItem className="min-w-32 ![--min-height:1rem] pb-1">

          <div className=' flex flex-col gap-1 min-w-36'>
            <label htmlFor="sortBy" className=' text-xs'>Sort By</label>
             <InputSelect
                // label="Sort By"
                name="sort"
                placeholder="Sort By"
                control={form.control}
                clearErrors={form.clearErrors}
                options={[
                  { label: 'All', value: '' },
                  { label: 'Code A - Z', value: 'code-asc' },
                  { label: 'Code Z - A', value: 'code-desc' },
                ]}
                className="!px-3 !py-2 !min-h-[1rem] rounded-xl   text-xs"
                labelClassName="truncate !text-xs pt-1.5"
              />
          </div>
          
        </FormIonItem>
        <FormIonItem className="min-w-32 ![--min-height:1rem] pb-1">

          <div className=' flex flex-col gap-1'>
            <label htmlFor="search" className=' text-xs'>Search</label>
              <SearchInput
                  name="code"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  // label="Code"
                  placeholder="Search ..."
                  className="!px-3 !py-1 rounded-xl"
                  suggestions={data.expenseVouchers.map((item) => item.code || '')}
                />
          </div>
          
        </FormIonItem>
        <IonButton type="submit" fill="clear" className=" h-10 bg-[#FA6C2F] text-white capitalize font-semibold rounded-xl text-xs" strong>
          <Search01Icon size={15} stroke='.8' className=' '/>
         
        </IonButton>
      </div>
    </form>
  );
};

export default ExpenseVoucherFilter;

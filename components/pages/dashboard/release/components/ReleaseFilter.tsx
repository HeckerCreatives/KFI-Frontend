import React, { useEffect, useState } from 'react';
import InputSelect from '../../../../ui/forms/InputSelect';
import InputText from '../../../../ui/forms/InputText';
import { IonButton } from '@ionic/react';
import { useForm } from 'react-hook-form';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import { Search01Icon } from 'hugeicons-react';
import { useOnlineStore } from '../../../../../store/onlineStore';
import { TData } from '../Release';
import kfiAxios from '../../../../utils/axios';
import SearchInput from '../../../../ui/forms/InputSearch';

type TSearch = {
  code: string;
  sort: string;
  dateTo: string;
  dateFrom: string;
};

type ReleaseFilterProps = {
  getReleases: (page: number, keyword?: string, sort?: string, from?: string, to?: string) => void;
  suggestions: string[],
  setSearchKey: React.Dispatch<React.SetStateAction<string>>
  setFrom: React.Dispatch<React.SetStateAction<string>>
  setTo: React.Dispatch<React.SetStateAction<string>>
};

const ReleaseFilter = ({ getReleases, setSearchKey, setTo, setFrom, suggestions }: ReleaseFilterProps) => {
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
      getReleases(1, data.code, data.sort, data.dateTo, data.dateFrom);
    } else {
      getReleases(1, data.code, data.sort, data.dateTo, data.dateFrom);
    }
  };

  const online = useOnlineStore((state) => state.online);
      
      const code = form.watch('code');
      const sort = form.watch('sort');
      const dateTo = form.watch('dateTo');
      const dateFrom = form.watch('dateFrom');
      
      useEffect(() => {
         const timer = setTimeout(() => {
           setSearchKey(code)
           setFrom(dateFrom)
           setTo(dateTo)
         }, 500);
       
         return () => clearTimeout(timer);
        
       }, [code, dateFrom, dateTo]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-fit">
       <div className="flex flex-wrap items-end gap-2">
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
        {/* <FormIonItem className="min-w-32 ![--min-height:1rem] pb-1">

          <div className=' flex flex-col gap-1 min-w-36'>
            <label htmlFor="sortBy" className=' text-xs'>Sort By</label>
             <InputSelect
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
          
        </FormIonItem> */}
        <FormIonItem className="min-w-32 ![--min-height:1rem] pb-1">

          <div className=' flex flex-col gap-1'>
            <label htmlFor="search" className=' text-xs'>Search</label>
            
          <SearchInput
                  name="code"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  // label="Code"
                  placeholder="Search ..."
                  className="!px-3 !py-1 !min-h-[1rem] rounded-xl   text-xs"
                  suggestions={suggestions}
                />
          </div>
          
        </FormIonItem>
        {/* <IonButton type="submit" fill="clear" className="h-10 bg-[#FA6C2F] text-white capitalize font-semibold rounded-xl text-xs" strong>
          <Search01Icon size={15} stroke='.8' className=''/>
          
        </IonButton> */}
      </div>
    </form>
  );
};

export default ReleaseFilter;

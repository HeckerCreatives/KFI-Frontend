import React from 'react';
import InputSelect from '../../../../ui/forms/InputSelect';
import InputText from '../../../../ui/forms/InputText';
import { IonButton } from '@ionic/react';
import { useForm } from 'react-hook-form';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import { Search01Icon } from 'hugeicons-react';

type TSearch = {
  code: string;
  sort: string;
  dateTo: string;
  dateFrom: string;
};

type AcknowledgementFilterProps = {
  getAcknowledgements: (page: number, keyword?: string, sort?: string, from?: string, to?: string) => void;
};

const AcknowledgementFilter = ({ getAcknowledgements }: AcknowledgementFilterProps) => {
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
      getAcknowledgements(1, data.code, data.sort, data.dateTo, data.dateFrom);
    } else {
      getAcknowledgements(1);
    }
  };

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
              className="!px-3 !py-[0.3rem] !min-h-[1rem] rounded-md !border-orange-500 max-w-36 text-xs"
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
              className="!px-3 !py-[0.3rem] !min-h-[1rem] rounded-md !border-orange-500 max-w-36 text-xs"
              max="9999-12-31"
              labelClassName="truncate !text-xs pt-1.5"
            />
          </div>
         
        </FormIonItem>
        <FormIonItem className="min-w-32 ![--min-height:1rem] pb-1">

          <div className=' flex flex-col gap-1 !min-w-36'>
            <label htmlFor="sortBy" className=' text-xs'>Sort By</label>
             <InputSelect
                // label="Sort By"
                name="sort"
                placeholder="Sort By"
                control={form.control}
                clearErrors={form.clearErrors}
                options={[
                  { label: 'Sort By', value: '' },
                  { label: 'Code A - Z', value: 'code-asc' },
                  { label: 'Code Z - A', value: 'code-desc' },
                ]}
                className="!border-orange-500 rounded-md !w-full !py-[0.35rem] !max-w-36 !min-w-36 !min-h-[1rem] text-xs"
                labelClassName="truncate !text-xs pt-1.5"
              />
          </div>
          
        </FormIonItem>
        <FormIonItem className="min-w-32 ![--min-height:1rem] pb-1">

          <div className=' flex flex-col gap-1'>
            <label htmlFor="search" className=' text-xs'>Search</label>
             <InputText
            name="code"
            // label="Search"
            placeholder="Type here"
            type="search"
            control={form.control}
            clearErrors={form.clearErrors}
            className="!px-3 !min-h-[1rem] rounded-md !border-orange-500 max-w-36 text-xs"
            labelClassName="truncate !text-xs pt-1.5"
          />
          </div>
          
        </FormIonItem>
        <IonButton type="submit" fill="clear" className=" h-fit bg-[#FA6C2F] text-white capitalize font-semibold rounded-md text-xs" strong>
          <Search01Icon size={15} stroke='.8' className=' mr-1'/>
          Search
        </IonButton>
      </div>
    </form>
  );
};

export default AcknowledgementFilter;

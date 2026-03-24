import React, { useEffect } from 'react';
import InputSelect from '../../../../ui/forms/InputSelect';
import InputText from '../../../../ui/forms/InputText';
import { IonButton } from '@ionic/react';
import { useForm } from 'react-hook-form';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import { Search01Icon } from 'hugeicons-react';
import { useOnlineStore } from '../../../../../store/onlineStore';
import SearchInput from '../../../../ui/forms/InputSearch';
import { BusinessType } from '../../../../../types/types';

type TSearchProps = {
  code: string;
  sort: string;
};

type BusinessTypeFilterProps = {
  getBusinessTypes: (page: number, keyword?: string, sort?: string) => void;
  data: BusinessType[]
};

const BusinessTypeFilter = ({ getBusinessTypes, data }: BusinessTypeFilterProps) => {
  const form = useForm<TSearchProps>({
    defaultValues: {
      code: '',
      sort: '',
    },
  });

  const onSubmit = (data: TSearchProps) => {
    if (data.code !== '' || data.sort !== '') {
      getBusinessTypes(1, data.code, data.sort);
    } else {
      getBusinessTypes(1);
    }
  };

   const online = useOnlineStore((state) => state.online);
            const sort = form.watch('sort');
            const code = form.watch('code');
              useEffect(() => {
                const delayDebounce = setTimeout(() => {
                 if (online) {
                    getBusinessTypes(1,code, sort);
                  } else {
                    getBusinessTypes(1,code, sort);
                  }
                }, 500);

                return () => clearTimeout(delayDebounce);
           
              }, [sort, online, code]);

  return (
    <div className="flex-1 flex flex-col md:flex-row flex-wrap items-start md:items-center justify-between ">
      <div className="w-full flex-1 md:flex-none">
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center flex-wrap lg:justify-end gap-2">
          <FormIonItem className="">
            <p className=" text-xs whitespace-nowrap mr-1">Sort By</p>

            <InputSelect
              // label="Sort By"
              name="sort"
              showLabel={false}
              placeholder="Sort By"
              control={form.control}
              clearErrors={form.clearErrors}
              options={[
                { label: 'All', value: '' },
                { label: 'Business Type A - Z', value: 'type-asc' },
                { label: 'Business Type Z - A', value: 'type-desc' },
              ]}
              className="!border-orange-500 rounded-md !w-[12rem] !py-1"
            />
          </FormIonItem>
          <div className="flex items-center min-w-20">
            <FormIonItem className="flex-1">
              {/* <InputText
                name="code"
                placeholder="Type here"
                type="search"
                control={form.control}
                clearErrors={form.clearErrors}
                className="!px-3 !min-h-[1rem] rounded-md !border-orange-500 max-w-[12rem]"
              /> */}
               <SearchInput
                  name="code"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  // label="Code"
                  placeholder="Search..."
                   className="!px-3 !min-h-[1rem] rounded-md !border-orange-500"
                  suggestions={data.map(item => item.type)}
                />
            </FormIonItem>
            <IonButton type="submit" fill="clear" className="max-h-8 min-h-[2rem] bg-[#FA6C2F] text-white capitalize font-semibold rounded-md text-xs" strong>
              <Search01Icon size={15} stroke='.8' className=' mr-1'/>
              Search
            </IonButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessTypeFilter;

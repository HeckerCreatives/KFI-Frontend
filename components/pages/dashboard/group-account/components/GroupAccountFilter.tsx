import React, { useEffect, useState } from 'react';
import InputSelect from '../../../../ui/forms/InputSelect';
import InputText from '../../../../ui/forms/InputText';
import { IonButton } from '@ionic/react';
import { useForm } from 'react-hook-form';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import { Search01Icon } from 'hugeicons-react';
import { useOnlineStore } from '../../../../../store/onlineStore';
import SearchInput from '../../../../ui/forms/InputSearch';
import { TGroupAccount } from '../GroupAccount';
import kfiAxios from '../../../../utils/axios';

type TSearchProps = {
  code: string;
  sort: string;
};

type GroupAccountFilterProps = {
  getGroupAccounts: (page: number, keyword?: string, sort?: string) => void;
};

const GroupAccountFilter = ({ getGroupAccounts }: GroupAccountFilterProps) => {
  const form = useForm<TSearchProps>({
    defaultValues: {
      code: '',
      sort: '',
    },
  });

  const onSubmit = (data: TSearchProps) => {
    if (data.code !== '' || data.sort !== '') {
      getGroupAccounts(1, data.code, data.sort);
    } else {
      getGroupAccounts(1);
    }
  };


  const online = useOnlineStore((state) => state.online);
        
        const code = form.watch('code');
        const sort = form.watch('sort');

        
          useEffect(() => {
            const fetchData = () => {
              if (online) {
                getGroupAccounts(1, code, sort);
              } else {
                getGroupAccounts(1, code, sort);
              }
            };
            fetchData();
          }, [sort, online]);


          const [data, setData] = useState<TGroupAccount>({
              groupAccounts: [],
              loading: false,
              totalPages: 0,
              nextPage: false,
              prevPage: false,
            });
                
              useEffect(() => {
                 const getData = async () => {
                setData(prev => ({ ...prev, loading: true }));
          
                try {
                  const result = await kfiAxios.get('/group-account', { params: { limit: 5, search: code, page: 1 } });
                  const { success, groupAccounts, hasPrevPage, hasNextPage, totalPages } = result.data;
                  if (success) {
                    setData(prev => ({
                      ...prev,
                      groupAccounts: groupAccounts,
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
    <div className="flex-1 flex flex-wrap gap-2 items-start justify-start ">
      <div className="w-full flex flex-wrap items-start justify-start">
        <form onSubmit={form.handleSubmit(onSubmit)} className=" w-full lg:justify-end flex flex-wrap gap-2">
          <FormIonItem className=" ">
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
                { label: 'Code A - Z', value: 'code-asc' },
                { label: 'Code Z - A', value: 'code-desc' },
                // { label: 'Description A - Z', value: 'description-asc' },
                // { label: 'Description Z - A', value: 'description-desc' },
              ]}
              className="!border-orange-500 rounded-md !w-[12rem] !py-1"
            />
          </FormIonItem>
          <div className="flex items-center min-w-20">
            <FormIonItem className="flex-1">
                <SearchInput
                  name="code"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  // label="Code"
                  placeholder="Search ..."
                  className="!px-3 !min-h-[1rem] rounded-md !border-orange-500"
                  suggestions={data.groupAccounts.map((item) => item.code || '')}
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

export default GroupAccountFilter;

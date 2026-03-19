import React, { useEffect, useState } from 'react';
import InputSelect from '../../../../ui/forms/InputSelect';
import InputText from '../../../../ui/forms/InputText';
import { IonButton } from '@ionic/react';
import { useForm } from 'react-hook-form';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import { useOnlineStore } from '../../../../../store/onlineStore';
import SearchInput from '../../../../ui/forms/InputSearch';
import kfiAxios from '../../../../utils/axios';
import { TClientMasterFile } from '../ClientMasterFile';

type TSearch = {
  code: string;
  sort: string;
};

type ClientMasterFileFilterProps = {
  getClients: (page: number, keyword?: string, sort?: string) => void;
  getClientsOffline: (page: number, keyword?: string, sort?: string) => void;
  clients: string[],
  setSearchKey: React.Dispatch<React.SetStateAction<string>>
  setSorthKey: React.Dispatch<React.SetStateAction<string>>
};

const ClientMasterFileFilter = ({ getClients, getClientsOffline, clients, setSearchKey, setSorthKey }: ClientMasterFileFilterProps) => {
  const form = useForm<TSearch>({
    defaultValues: {
      code: '',
      sort: '',
    },
  });

  //online checker
  const online = useOnlineStore((state) => state.online);
  const [data, setData] = useState<TClientMasterFile>({
      clients: [],
      loading: false,
      totalPages: 0,
      nextPage: false,
      prevPage: false,
    });
  

  const onSubmit = (data: TSearch) => {
    setSearchKey(data.code)
    setSorthKey(data.sort)
    
    if (data.code !== '' || data.sort !== '') {
      if(online){
      getClients(1, data.code, data.sort);
        
      }else{
        getClientsOffline(1, data.code, data.sort)
      }
    } else {
      if(online){
      getClients(1);

      }else{
        getClientsOffline(1)
      }
    }
  };

  const code = form.watch('code');
  const sort = form.watch('sort');

  useEffect(() => {
    const fetchData = () => {
      if (online) {
        getClients(1, code, sort);
      } else {
        getClientsOffline(1, code, sort);
      }
    };

    fetchData();
  }, [sort, online]);

  useEffect(() => {
       const getClients = async () => {
      setData(prev => ({ ...prev, loading: true }));

      try {
        const result = await kfiAxios.get('/customer', { params: { limit: 10, search: code } });
        const { success, customers, hasPrevPage, hasNextPage, totalPages } = result.data;
        if (success) {
          setData(prev => ({
            ...prev,
            clients: customers,
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
      getClients();
    }, 800);

    return () => clearTimeout(timer);
   
  }, [code]);


  return (
    <div className="flex-1 flex flex-col md:flex-row flex-wrap items-start md:items-center justify-between overflow-visible!">
      <div className="w-full flex-1 md:flex-none">
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center flex-wrap lg:justify-end gap-2">
          <FormIonItem className=" min-w-56">
            <p className=' text-xs flex whitespace-nowrap'>Sort By</p>
            <InputSelect
              // label="Sort By"
              name="sort"
              showLabel={false}
              placeholder="Sort By"
              labelClassName=''
              control={form.control}
              clearErrors={form.clearErrors}
              options={[
                { label: 'All', value: '' },
                { label: 'Account No. A - Z', value: 'acctno-asc' },
                { label: 'Account No. Z - A', value: 'acctno-desc' },
                { label: 'Name A - Z', value: 'name-asc' },
                { label: 'Name Z - A', value: 'name-desc' },
              ]}
              className="!border-orange-500 rounded-md !min-w-20 !py-1"
            />
          </FormIonItem>
          <div className="flex items-center min-w-20 overflow-visible!">
            <FormIonItem className="flex-1 overflow-visible!">
              {/* <InputText
                name="code"
                placeholder="Type here"
                type="search"
                control={form.control}
                clearErrors={form.clearErrors}
                className="!px-3 !min-h-[1rem] rounded-md !border-orange-500"
              /> */}

              <SearchInput
                name="code"
                control={form.control}
                clearErrors={form.clearErrors}
                // label="Code"
                placeholder="Search..."
                 className="!px-3 !min-h-[1rem] rounded-md !border-orange-500"
                suggestions={data.clients.map(item => item.name)}
              />
            </FormIonItem>
            <IonButton type="submit" fill="clear" className="max-h-8 min-h-[2rem] bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
              Search
            </IonButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientMasterFileFilter;

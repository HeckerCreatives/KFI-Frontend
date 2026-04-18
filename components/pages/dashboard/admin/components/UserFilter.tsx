import React, { useEffect, useState } from 'react';
import InputSelect from '../../../../ui/forms/InputSelect';
import InputText from '../../../../ui/forms/InputText';
import { IonButton } from '@ionic/react';
import { useForm } from 'react-hook-form';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import SearchInput from '../../../../ui/forms/InputSearch';
import kfiAxios from '../../../../utils/axios';
import { useOnlineStore } from '../../../../../store/onlineStore';
import { set } from 'zod';

type TSearch = {
  code: string;
  sort: string;
  status: string
};

type UserFilterProps = {
  getUsers: (page: number, keyword?: string, sort?: string, status?: string) => void;
  setStatus: React.Dispatch<React.SetStateAction<string>>
  setSearchKey: React.Dispatch<React.SetStateAction<string>>
};

const UserFilter = ({ getUsers, setStatus, setSearchKey }: UserFilterProps) => {
  const online = useOnlineStore((state) => state.online);
  
  const form = useForm<TSearch>({
    defaultValues: {
      code: '',
      sort: '',
      status: '',
    },
  });

  const onSubmit = (data: TSearch) => {
    // if (data.code !== '' || data.sort !== '') {
    //   getUsers(1, data.code, data.sort);
    // } else {
    //   getUsers(1);
    // }
  };

    const [items, setItems] = useState<string[]>([])
    const code = form.watch('code')
    const status = form.watch('status')
  

     useEffect(() => {
      setStatus(status)
      setSearchKey(code)
      if(online){
         const getData = async () => {
    
          try {
            const result = await kfiAxios.get('/user', {params: {search: code, status: status}});
             const { success, users } = result.data;
            if (success) {
              setItems(users.map((item: any) => item.username));
            }
          } catch (error) {
            // handle error
          } finally {
          }
        };
    
        const timer = setTimeout(() => {
          getData();
          getUsers(1,code,'', status)
        }, 500);
    
        return () => clearTimeout(timer);
      }
          
       
      }, [code, status]);
    

  return (
    <div className="flex-1 flex flex-col md:flex-row flex-wrap items-start md:items-center justify-between ">
      <div className="w-full flex-1 md:flex-none">
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-wrap items-center justify-start md:justify-end gap-2">
          <FormIonItem className="w-full max-w-32 min-w-20">
            <InputSelect
              // label="Status"
              name="status"
              showLabel={false}
              placeholder="Status"
              control={form.control}
              clearErrors={form.clearErrors}
              options={[
                { label: 'All Status', value: '' },
                { label: 'Active', value: 'active' },
                { label: 'Banned', value: 'banned' },
               
              ]}
              className=" rounded-xl !w-full !py-1.5"
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
                className="!px-3 !py-0 !min-h-[1rem] rounded-md !border-orange-500"
              /> */}

               <SearchInput
                  name='code'
                  control={form.control}
                  clearErrors={form.clearErrors}
                  // label="Code"
                  placeholder="Search ..."
                  className="!px-3 !py-1 rounded-xl "
                  suggestions={items}
                />
            </FormIonItem>
          
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFilter;

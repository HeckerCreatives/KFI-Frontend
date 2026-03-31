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
  suggestions: string[];
  setSearchKey: React.Dispatch<React.SetStateAction<string>>;
  setSortKey: React.Dispatch<React.SetStateAction<string>>;
};

const GroupAccountFilter = ({ getGroupAccounts, suggestions, setSearchKey, setSortKey }: GroupAccountFilterProps) => {
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
              const timer = setTimeout(() => {
                setSearchKey(code)
              }, 500);
              return () => clearTimeout(timer);
          }, [code]);



  return (
    <div className="flex-1 flex flex-wrap gap-2 items-start justify-start ">
      <div className="w-full flex flex-wrap items-start justify-start">
        <form onSubmit={form.handleSubmit(onSubmit)} className=" w-full lg:justify-end flex flex-wrap gap-2">
        
          <div className="flex items-center min-w-20">
            <FormIonItem className="flex-1">
                <SearchInput
                  name="code"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  // label="Code"
                  placeholder="Search ..."
                  className="!px-3 !py-1 !min-h-[1rem] rounded-xl   text-xs"
                  suggestions={suggestions}
                />
            </FormIonItem>
           
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupAccountFilter;

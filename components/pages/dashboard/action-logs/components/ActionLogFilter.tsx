import React, { useEffect } from 'react';
import InputSelect from '../../../../ui/forms/InputSelect';
import InputText from '../../../../ui/forms/InputText';
import { IonButton } from '@ionic/react';
import { useForm } from 'react-hook-form';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import { Search01Icon } from 'hugeicons-react';
import SearchInput from '../../../../ui/forms/InputSearch';

type TSearch = {
  code: string;
  sort: string;
};

type ActionLogFilterProps = {
  getActions: (page: number, keyword?: string, sort?: string) => void;
  setSearchKey: React.Dispatch<React.SetStateAction<string>>
  suggestions: string[]
};

const ActionLogFilter = ({ getActions, setSearchKey, suggestions }: ActionLogFilterProps) => {
  const form = useForm<TSearch>({
    defaultValues: {
      code: '',
      sort: '',
    },
  });

  const onSubmit = (data: TSearch) => {
    if (data.code !== '' || data.sort !== '') {
      getActions(1, data.code, data.sort);
    } else {
      getActions(1);
    }
  };
  const code = form.watch('code');
        useEffect(() => {
                  const timer = setTimeout(() => {
                    setSearchKey(code)
                  }, 500);
                  return () => clearTimeout(timer);
              }, [code]);

  return (
    <div className="flex-1 flex flex-col md:flex-row flex-wrap items-start md:items-center justify-between ">
      <div className="w-full flex-1 md:flex-none">
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center flex-wrap justify-end gap-2">
          
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

export default ActionLogFilter;

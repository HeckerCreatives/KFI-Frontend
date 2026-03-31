import React, { useEffect } from 'react';
import InputSelect from '../../../../ui/forms/InputSelect';
import InputText from '../../../../ui/forms/InputText';
import { IonButton } from '@ionic/react';
import { useForm } from 'react-hook-form';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import { Search01Icon } from 'hugeicons-react';
import { useOnlineStore } from '../../../../../store/onlineStore';
import SearchInput from '../../../../ui/forms/InputSearch';

type TLoanSearch = {
  code: string;
  sort: string;
};

type LoanFilterProps = {
  getLoans: (page: number, keyword?: string, sort?: string) => {};
  setSearchKey: React.Dispatch<React.SetStateAction<string>>;
  suggestion: string[]
};

const LoanFilter = ({ getLoans, setSearchKey, suggestion }: LoanFilterProps) => {
  const form = useForm<TLoanSearch>({
    defaultValues: {
      code: '',
      sort: '',
    },
  });

  const onSubmit = (data: TLoanSearch) => {
    if (data.code !== '' || data.sort !== '') {
      getLoans(1, data.code, data.sort);
    } else {
      getLoans(1);
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
    <div className="flex-1 flex flex-col md:flex-row flex-wrap items-start md:items-center justify-between ">
      <div className="w-full flex-1 md:flex-none">
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center flex-wrap lg:justify-end gap-2">
      
          <div className="flex items-center min-w-20">
            <FormIonItem className="flex-1">
                <SearchInput
                  name="code"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  // label="Code"
                  placeholder="Search ..."
                  className="!px-3 !py-1 !min-h-[1rem] rounded-xl   text-xs"
                  suggestions={suggestion}
                />
            </FormIonItem>
           
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoanFilter;

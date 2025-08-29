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
};

type ActionLogFilterProps = {
  getActions: (page: number, keyword?: string, sort?: string) => void;
};

const ActionLogFilter = ({ getActions }: ActionLogFilterProps) => {
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

  return (
    <div className="flex-1 flex flex-col md:flex-row flex-wrap items-start md:items-center justify-between ">
      <div className="w-full flex-1 md:flex-none">
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center flex-wrap justify-end gap-2">
          <FormIonItem className="w-full max-w-72 min-w-20 hidden">
            <InputSelect
              label="Sort By"
              name="sort"
              showLabel={false}
              placeholder="Sort By"
              control={form.control}
              clearErrors={form.clearErrors}
              options={[
                { label: 'Sort By', value: '' },
                { label: 'Username A - Z', value: 'username-asc' },
                { label: 'Username Z - A', value: 'username-desc' },
              ]}
              className="!border-orange-500 rounded-md !w-full !py-1.5 max-w-[12rem]"
            />
          </FormIonItem>
          <div className="flex items-center min-w-20">
            <FormIonItem className="flex-1">
              <InputText
                name="code"
                placeholder="Type here"
                type="search"
                control={form.control}
                clearErrors={form.clearErrors}
                className="!px-3 !py-0.5 !min-h-[1rem] rounded-md !border-orange-500"
              />
            </FormIonItem>
            <IonButton type="submit" fill="clear" className="max-h-10 min-h-[2.3rem] bg-[#FA6C2F] text-white capitalize font-semibold rounded-md text-xs" strong>
              <Search01Icon size={15} stroke='.8' className=' mr-1'/>
              Search
            </IonButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActionLogFilter;

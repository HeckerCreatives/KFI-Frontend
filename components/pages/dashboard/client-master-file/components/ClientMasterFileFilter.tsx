import React from 'react';
import InputSelect from '../../../../ui/forms/InputSelect';
import InputText from '../../../../ui/forms/InputText';
import { IonButton } from '@ionic/react';
import { useForm } from 'react-hook-form';
import FormIonItem from '../../../../ui/utils/FormIonItem';

type TSearch = {
  code: string;
  sort: string;
};

type ClientMasterFileFilterProps = {
  getClients: (page: number, keyword?: string, sort?: string) => void;
};

const ClientMasterFileFilter = ({ getClients }: ClientMasterFileFilterProps) => {
  const form = useForm<TSearch>({
    defaultValues: {
      code: '',
      sort: '',
    },
  });

  const onSubmit = (data: TSearch) => {
    if (data.code !== '' || data.sort !== '') {
      getClients(1, data.code, data.sort);
    } else {
      getClients(1);
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row flex-wrap items-start md:items-center justify-between ">
      <div className="w-full flex-1 md:flex-none">
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center flex-wrap lg:justify-end gap-2">
          <FormIonItem className=" min-w-44 ">
            <InputSelect
              // label="Sort By"
              name="sort"
              showLabel={false}
              placeholder="Sort By"
              control={form.control}
              clearErrors={form.clearErrors}
              options={[
                { label: 'Sort By', value: '' },
                { label: 'Account No. A - Z', value: 'acctno-asc' },
                { label: 'Account No. Z - A', value: 'acctno-desc' },
                { label: 'Name A - Z', value: 'name-asc' },
                { label: 'Name Z - A', value: 'name-desc' },
              ]}
              className="!border-orange-500 rounded-md !min-w-20 !py-1"
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
                className="!px-3 !min-h-[1rem] rounded-md !border-orange-500"
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

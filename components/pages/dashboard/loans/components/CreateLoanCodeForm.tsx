import React, { useState } from 'react';
import { TableCell, TableRow } from '../../../../ui/table/Table';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import InputSelect from '../../../../ui/forms/InputSelect';
import InputText from '../../../../ui/forms/InputText';
import ChartOfAccountSelection from '../../../../ui/selections/ChartOfAccountSelection';
import { IonButton, IonIcon } from '@ionic/react';
import { save, trashBin } from 'ionicons/icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoanCodeFormData, loanCodeSchema } from '../../../../../validations/loan.schema';
import { TLoan } from '../Loans';
import formErrorHandler from '../../../../utils/form-error-handler';
import { TErrorData, TFormError } from '../../../../../types/types';
import checkError from '../../../../utils/check-error';
import kfiAxios from '../../../../utils/axios';

type CreateLoanCodeFormProps = {
  productId: string;
  setData: React.Dispatch<React.SetStateAction<TLoan>>;
};

const CreateLoanCodeForm = ({ productId, setData }: CreateLoanCodeFormProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(loanCodeSchema),
    defaultValues: {
      module: '',
      loanType: '',
      acctCodeLabel: '',
      acctCode: '',
      sortOrder: '',
    },
  });

  const onSubmit = async (data: LoanCodeFormData) => {
    setLoading(true);
    try {
      const result = await kfiAxios.post(`/loan/code`, { loan: productId, ...data });
      const { success } = result.data;
      if (success) {
        setData(prev => {
          let clone = [...prev.loans];
          let index = clone.findIndex(e => e._id === result.data.loan._id);
          clone[index] = { ...result.data.loan };
          return { ...prev, loans: clone };
        });
        form.reset();
        return;
      }
    } catch (error: any) {
      const errs: TErrorData | string = error?.response?.data?.error || error.message;
      const errors: TFormError[] | string = checkError(errs);
      const fields: string[] = Object.keys(form.formState.defaultValues as Object);
      formErrorHandler(errors, form.setError, fields);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 items-center !flex-wrap mb-2">
      <FormIonItem className="flex-1 !min-w-32">
        <InputSelect
          disabled={loading}
          name={`module`}
          control={form.control}
          clearErrors={form.clearErrors}
          placeholder="Type here"
          className="!px-2 !py-2 rounded-md !min-w-32"
          options={[
            { label: 'LR - Loan Release', value: 'LR' },
            { label: 'OR - Official Receipt', value: 'OR' },
          ]}
        />
      </FormIonItem>

      <FormIonItem className="flex-1 !min-w-32">
        <InputSelect
          disabled={loading}
          name={`loanType`}
          control={form.control}
          clearErrors={form.clearErrors}
          placeholder="Loan type"
          className="!px-2 !py-2 rounded-md !min-w-32"
          options={[
            { label: 'OTHER ( For LR )', value: 'OTHER' },
            { label: 'EDUC - Educational ( For LR & OR )', value: 'EDUC' },
            { label: 'GRP - Group ( For OR )', value: 'GRP' },
            { label: 'SEA - Seasonal ( For OR )', value: 'SEA' },
            { label: 'IND - Individual ( For OR )', value: 'IND' },
          ]}
        />
      </FormIonItem>

      <div className="flex items-center justify-start gap-1 flex-wrap">
        <FormIonItem className="flex-1">
          <InputText
            disabled={loading}
            name={`acctCodeLabel`}
            control={form.control}
            clearErrors={form.clearErrors}
            placeholder="Account Code"
            className="!px-2 !py-2 rounded-md"
            readOnly
          />
        </FormIonItem>
        <div className="">
          <ChartOfAccountSelection chartOfAccountLabel={`acctCodeLabel`} chartOfAccountValue={`acctCode`} setValue={form.setValue} clearErrors={form.clearErrors} />
        </div>
      </div>

      <FormIonItem>
        <InputText disabled={loading} name={`sortOrder`} control={form.control} clearErrors={form.clearErrors} placeholder="Sort Order" className="!px-2 !py-2 rounded-md" />
      </FormIonItem>

      <div>
        <IonButton
          type="submit"
          disabled={loading}
          title="Save changes"
          fill="clear"
          className="max-h-10 min-h-10 btn-color text-white capitalize font-semibold rounded-md m-0"
          strong
        >
          {loading ? 'Adding' : 'Add'}
        </IonButton>
      </div>
    </form>
  );
};

export default CreateLoanCodeForm;

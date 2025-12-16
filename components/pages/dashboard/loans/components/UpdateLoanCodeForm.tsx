import React, { useEffect, useState } from 'react';
import { TableCell, TableRow } from '../../../../ui/table/Table';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import InputSelect from '../../../../ui/forms/InputSelect';
import InputText from '../../../../ui/forms/InputText';
import ChartOfAccountSelection from '../../../../ui/selections/ChartOfAccountSelection';
import { IonButton, IonIcon, useIonToast } from '@ionic/react';
import { save, trashBin } from 'ionicons/icons';
import { useForm } from 'react-hook-form';
import { LoanCode, TErrorData, TFormError } from '../../../../../types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoanCodeFormData, loanCodeSchema } from '../../../../../validations/loan.schema';
import { TLoan } from '../Loans';
import kfiAxios from '../../../../utils/axios';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';
import { useOnlineStore } from '../../../../../store/onlineStore';
import { db } from '../../../../../database/db';

type UpdateLoanCodeFormProps = {
  loanCode: LoanCode;
  setData: React.Dispatch<React.SetStateAction<TLoan>>;
  productId: string;
};

const UpdateLoanCodeForm = ({ loanCode, setData, productId }: UpdateLoanCodeFormProps) => {
  const [loading, setLoading] = useState(false);
  const [present] = useIonToast();
  const online = useOnlineStore((state) => state.online);
  

  const form = useForm({
    resolver: zodResolver(loanCodeSchema),
    defaultValues: {
      module: loanCode.module,
      loanType: loanCode.loanType,
      acctCodeLabel: `${loanCode?.acctCode?.code} - ${loanCode?.acctCode?.description}`,
      acctCode: `${loanCode?.acctCode?._id}`,
      sortOrder: `${loanCode.sortOrder}`,
    },
  });

  useEffect(() => {
    if (loanCode) {
      form.reset({
        module: loanCode.module,
        loanType: loanCode.loanType,
        acctCodeLabel: `${loanCode?.acctCode?.code} - ${loanCode?.acctCode?.description}`,
        acctCode: `${loanCode?.acctCode?._id}`,
        sortOrder: `${loanCode.sortOrder}`,
      });
    }
  }, [form, loanCode]);

  const onSubmit = async (data: LoanCodeFormData) => {
    setLoading(true);
    try {
      const result = await kfiAxios.put(`/loan/code/${loanCode._id}`, { loan: loanCode.loan, ...data });
      const { success } = result.data;
      if (success) {
        setData(prev => {
          let clone = [...prev.loans];
          let index = clone.findIndex(e => e._id === result.data.loan._id);
          clone[index] = { ...result.data.loan };
          return { ...prev, loans: clone };
        });
        form.reset();
        present({
          message: 'Loan code successfully updated!.',
          duration: 1000,
        });
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

  const handleDelete = async () => {
    if(online){
      setLoading(true);
      try {
        const result = await kfiAxios.delete(`/loan/code/${loanCode._id}`);
        const { success } = result.data;
        if (success) {
          setData(prev => {
            let clone = [...prev.loans];
            let index = clone.findIndex(e => e._id === result.data.loan._id);
            clone[index] = { ...result.data.loan };
            return { ...prev, loans: clone };
          });
          form.reset();
          present({
            message: 'Loan code successfully deleted!.',
            duration: 1000,
          });
          return;
        }
      } catch (error: any) {
        present({
          message: 'Failed to delete the loan code. Please try again',
          duration: 1000,
        });
      } finally {
        setLoading(false);
      }
    } else {
       try {
        const product = await db.loanProducts.get(productId);

        if (!product) {
          present({
            message: "Product not found.",
            duration: 1000,
          });
          return;
        }

        const updatedLoanCodes = product.loanCodes.filter(
          (item: any) => item.acctCode !== loanCode.acctCode
        );

        await db.loanProducts.update(product.id, {
          ...product,
          loanCodes: updatedLoanCodes,
          _synced: false,
          action: "update",
        });

        setData(prev => {
          const clone = [...prev.loans];
          const idx = clone.findIndex(l => l.id === product.id);
          if (idx !== -1) clone[idx] = { ...product, loanCodes: updatedLoanCodes };
          return { ...prev, loans: clone };
        });

        present({
          message: "Data successfully deleted!",
          duration: 1000,
        });
      } catch (error) {
        console.log(error)
        present({
          message: "Failed to delete record. Please try again.",
          duration: 1200,
        });
      }
    }
  };

  return (
    <TableRow className="border-b-0">
      <TableCell className="border-4 border-slate-100 align-top max-w-40 min-w-40">
        <FormIonItem className="flex-1">
          <InputSelect
            disabled={loading}
            name={`module`}
            control={form.control}
            clearErrors={form.clearErrors}
            placeholder="Type here"
            className="!px-2 !py-2 rounded-md"
            options={[
              { label: 'LR - Loan Release', value: 'LR' },
              { label: 'OR - Official Receipt', value: 'OR' },
            ]}
          />
        </FormIonItem>
      </TableCell>
      <TableCell className="border-4 border-slate-100 align-top max-w-40 min-w-40">
        <FormIonItem>
          <InputSelect
            disabled={loading}
            name={`loanType`}
            control={form.control}
            clearErrors={form.clearErrors}
            placeholder="Loan type"
            className="!px-2 !py-2 rounded-md w-[10rem]"
            options={[
              { label: 'OTHER ( For LR )', value: 'OTHER' },
              { label: 'EDUC - Educational ( For LR & OR )', value: 'EDUC' },
              { label: 'GRP - Group ( For OR )', value: 'GRP' },
              { label: 'SEA - Seasonal ( For OR )', value: 'SEA' },
              { label: 'IND - Individual ( For OR )', value: 'IND' },
            ]}
          />
        </FormIonItem>
      </TableCell>
      <TableCell className="border-4 border-slate-100 align-top">
        <div className="flex items-center justify-start gap-1">
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
      </TableCell>
      <TableCell className="border-4 border-slate-100 align-top max-w-24 min-w-24">
        <FormIonItem>
          <InputText disabled={loading} name={`sortOrder`} control={form.control} clearErrors={form.clearErrors} placeholder="Sort Order" className="!px-2 !py-2 rounded-md" />
        </FormIonItem>
      </TableCell>

      <TableCell className="border-4 border-slate-100 text-center align-top">
        <div className="space-x-1">
          <IonButton
            onClick={form.handleSubmit(onSubmit)}
            disabled={loading}
            type="button"
            title="Save changes"
            fill="clear"
            className="max-h-8 min-h-8 !p-0 bg-green-600 text-white capitalize font-semibold rounded-md m-0"
            strong
          >
            <IonIcon icon={save} className="text-sm" />
          </IonButton>
          <IonButton
            disabled={loading}
            onClick={handleDelete}
            type="button"
            title="Remove loan code"
            fill="clear"
            className="max-h-8 min-h-8 !p-0 bg-red-600 text-white capitalize font-semibold rounded-md m-0"
            strong
          >
            <IonIcon icon={trashBin} className="text-sm" />
          </IonButton>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default UpdateLoanCodeForm;

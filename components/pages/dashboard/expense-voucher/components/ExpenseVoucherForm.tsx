import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import InputText from '../../../../ui/forms/InputText';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import { ExpenseVoucherFormData, UpdateExpenseVoucherFormData } from '../../../../../validations/expense-voucher.schema';
import BankSelection from '../../../../ui/selections/BankSelection';
import SupplierSelection from '../../../../ui/selections/SupplierSelection';
import InputTextarea from '../../../../ui/forms/InputTextarea';
import classNames from 'classnames';

type TForm = {
  form: UseFormReturn<ExpenseVoucherFormData | UpdateExpenseVoucherFormData>;
  loading?: boolean;
};

const ExpenseVoucherForm = ({ form, loading = false }: TForm) => {
  return (
    <div className="space-y-1 px-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 ">
          <div className="space-y-2">
            <FormIonItem className="[--min-height:0]">
              <InputText
                disabled={loading}
                name="code"
                control={form.control}
                clearErrors={form.clearErrors}
                label="CV#"
                placeholder="Type here"
                className="!p-2 rounded-md !text-[0.7rem]"
                labelClassName="truncate min-w-20 !text-[0.7rem] !text-slate-600 text-end"
              />
            </FormIonItem>
            <div className="flex items-end gap-2 flex-nowrap">
              <FormIonItem className="flex-1 [--min-height:0]">
                <InputText
                  readOnly
                  name="supplier"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="Supplier"
                  placeholder="Click find to search for supplier"
                  className="!p-2 rounded-md !text-[0.7rem]"
                  labelClassName="truncate min-w-20 !text-[0.7rem] !text-slate-600 text-end"
                />
              </FormIonItem>
              <SupplierSelection
                supplierLabel="supplier"
                supplierValue="supplierId"
                setValue={form.setValue}
                clearErrors={form.clearErrors}
                className=" text-xs"
              />
            </div>
          </div>
          <div className="space-y-2">
            <FormIonItem className="[--min-height:0]">
              <InputText
                name="date"
                type="date"
                disabled={loading}
                control={form.control}
                clearErrors={form.clearErrors}
                label="Date"
                placeholder="Type here"
                className="!p-2 rounded-md !text-[0.7rem]"
                labelClassName="truncate min-w-24 !text-[0.7rem] !text-slate-600 text-end"
                max="9999-12-31"
                readOnly
              />
            </FormIonItem>
            <FormIonItem className="[--min-height:0]">
              <InputText
                name="acctMonth"
                disabled={loading}
                control={form.control}
                clearErrors={form.clearErrors}
                label="Account Month"
                placeholder="Type here"
                className="!p-2 rounded-md !text-[0.7rem]"
                labelClassName="truncate !text-[0.7rem] min-w-24 !text-slate-600 text-end"
                readOnly
              />
            </FormIonItem>
            <FormIonItem className="[--min-height:0]">
              <InputText
                name="acctYear"
                disabled={loading}
                control={form.control}
                clearErrors={form.clearErrors}
                label="Account Year"
                placeholder="Type here"
                className="!p-2 rounded-md !text-[0.7rem]"
                labelClassName="truncate !text-[0.7rem] min-w-24 !text-slate-600 text-end"
                readOnly
              />
            </FormIonItem>
          </div>
        
          <div className="space-y-2">
            <FormIonItem className="[--min-height:0]">
              <InputText
                name="checkNo"
                disabled={loading}
                control={form.control}
                clearErrors={form.clearErrors}
                label="Check Number"
                placeholder="Type here"
                className="!p-2 rounded-md !text-[0.7rem]"
                labelClassName="truncate !text-[0.7rem] min-w-24 !text-slate-600 text-end"
              />
            </FormIonItem>
            <FormIonItem className="[--min-height:0]">
              <InputText
                name="checkDate"
                type="date"
                disabled={loading}
                control={form.control}
                clearErrors={form.clearErrors}
                label="Check Date"
                placeholder="Type here"
                max="9999-12-31"
                className="!p-2 rounded-md !text-[0.7rem]"
                labelClassName="truncate !text-[0.7rem] min-w-24 !text-slate-600 text-end"
              />
            </FormIonItem>
            <div className="flex gap-2 w-full">
              <FormIonItem className="[--min-height:0]">
                <InputText
                  disabled={loading}
                  name="bankLabel"
                  readOnly
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="Bank Code"
                  placeholder="Type here"
                  className="!p-2 rounded-md !text-[0.7rem] flex-1 w-full"
                  labelClassName="truncate !text-[0.7rem] !text-slate-600 text-end"
                />
              </FormIonItem>

              <BankSelection bankLabel="bankLabel" bankValue="bank" setValue={form.setValue} clearErrors={form.clearErrors} className=" text-xs" />
            </div>
            <FormIonItem className="[--min-height:0]">
              <InputText
                name="amount"
                control={form.control}
                clearErrors={form.clearErrors}
                label="Amount"
                placeholder="Type here"
                className="!p-2 rounded-md !text-[0.7rem]"
                labelClassName="truncate !text-[0.7rem] min-w-24 !text-slate-600 text-end"
                isAmount
              />
            </FormIonItem>
          </div>

          <div className=" lg:col-span-3 space-y-1">
            <FormIonItem className="[--min-height:0]">
              <InputText
                name="remarks"
                disabled={loading}
                control={form.control}
                clearErrors={form.clearErrors}
                label="Particular"
                placeholder="Type here"
                className="!p-2 rounded-md !text-[0.7rem]"
                labelClassName="truncate !text-[0.7rem] min-w-24 !text-slate-600 text-end"
              />
            </FormIonItem>
          </div>

        
      </div>
    </div>
  );
};

export default ExpenseVoucherForm;

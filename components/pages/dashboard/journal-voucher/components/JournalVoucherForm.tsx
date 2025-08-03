import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import InputText from '../../../../ui/forms/InputText';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import { JournalVoucherFormData } from '../../../../../validations/journal-voucher.schema';
import SupplierSelection from '../../../../ui/selections/SupplierSelection';
import InputTextarea from '../../../../ui/forms/InputTextarea';
import BankSelection from '../../../../ui/selections/BankSelection';
import classNames from 'classnames';

type TForm = {
  form: UseFormReturn<JournalVoucherFormData>;
  loading?: boolean;
};

const JournalVoucherForm = ({ form, loading }: TForm) => {
  return (
    <div className="space-y-1 px-2">
      <div className="grid grid-cols-3">
        <div className="space-y-1">
          <FormIonItem className="[--min-height:0]">
            <InputText
              disabled={loading}
              name="code"
              control={form.control}
              clearErrors={form.clearErrors}
              label="JV#"
              placeholder="Type here"
              className="!px-1 !py-1 rounded-md !text-[0.7rem]"
              labelClassName="truncate !text-[0.7rem] min-w-14 !text-slate-600 text-end"
            />
          </FormIonItem>
          <div className="flex items-start gap-2 flex-nowrap">
            <FormIonItem className="flex-1 [--min-height:0]">
              <InputText
                readOnly
                name="supplier"
                control={form.control}
                clearErrors={form.clearErrors}
                label="Supplier"
                placeholder="Click find to search for supplier"
                className="!px-1 !py-1 rounded-md !text-[0.7rem]"
                labelClassName="truncate !text-[0.7rem] min-w-14 !text-slate-600 text-end"
              />
            </FormIonItem>
            <SupplierSelection
              supplierLabel="supplier"
              supplierValue="supplierId"
              setValue={form.setValue}
              clearErrors={form.clearErrors}
              className="!min-h-6 h-[1.65rem] text-xs"
            />
          </div>
        </div>
        <div className="space-y-1">
          <FormIonItem className="[--min-height:0]">
            <InputText
              name="date"
              type="date"
              disabled={loading}
              control={form.control}
              clearErrors={form.clearErrors}
              label="Date"
              placeholder="Type here"
              max="9999-12-31"
              className="!px-1 !py-1 rounded-md !text-[0.7rem]"
              labelClassName="truncate !text-[0.7rem] min-w-24 !text-slate-600 text-end"
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
              className="!px-1 !py-1 rounded-md !text-[0.7rem]"
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
              className="!px-1 !py-1 rounded-md !text-[0.7rem]"
              labelClassName="truncate !text-[0.7rem] min-w-24 !text-slate-600 text-end"
              readOnly
            />
          </FormIonItem>
        </div>
        <div className="space-y-1">
          <FormIonItem className="[--min-height:0]">
            <InputText
              name="checkNo"
              disabled={loading}
              control={form.control}
              clearErrors={form.clearErrors}
              label="Check Number"
              placeholder="Type here"
              className="!px-1 !py-1 rounded-md !text-[0.7rem]"
              labelClassName="truncate !text-[0.7rem] min-w-24 !text-slate-600 text-end"
            />
          </FormIonItem>
          <FormIonItem className="[--min-height:0]">
            <InputText
              name="checkDate"
              type="date"
              control={form.control}
              clearErrors={form.clearErrors}
              disabled={loading}
              label="Check Date"
              placeholder="Type here"
              className="!px-1 !py-1 rounded-md !text-[0.7rem]"
              labelClassName="truncate !text-[0.7rem] min-w-24 !text-slate-600 text-end"
              max="9999-12-31"
            />
          </FormIonItem>
          <div className="flex items-start gap-2 flex-nowrap">
            <FormIonItem className="flex-1 [--min-height:0]">
              <InputText
                disabled={loading}
                name="bankLabel"
                readOnly
                control={form.control}
                clearErrors={form.clearErrors}
                label="Bank Code"
                placeholder="Click find to search for bank code"
                className="!px-1 !py-1 rounded-md !text-[0.7rem]"
                labelClassName="truncate !text-[0.7rem] min-w-24 !text-slate-600 text-end"
              />
            </FormIonItem>
            <BankSelection bankLabel="bankLabel" bankValue="bank" setValue={form.setValue} clearErrors={form.clearErrors} className="!min-h-6 h-[1.65rem] text-xs" />
          </div>
          <FormIonItem className="[--min-height:0]">
            <InputText
              name="amount"
              disabled={loading}
              control={form.control}
              clearErrors={form.clearErrors}
              label="Amount"
              placeholder="Type here"
              className="!px-1 !py-1 rounded-md !text-[0.7rem]"
              labelClassName="truncate !text-[0.7rem] min-w-24 !text-slate-600 text-end"
            />
          </FormIonItem>
        </div>
      </div>
      <div>
        <FormIonItem className="[--min-height:0]">
          <InputText
            name="remarks"
            disabled={loading}
            control={form.control}
            clearErrors={form.clearErrors}
            label="Particular"
            placeholder="Type here"
            className="!px-1 !py-1 rounded-md !text-[0.7rem]"
            labelClassName="truncate !text-[0.7rem] min-w-14 !text-slate-600 text-end"
          />
        </FormIonItem>
      </div>
    </div>
  );
};

export default JournalVoucherForm;

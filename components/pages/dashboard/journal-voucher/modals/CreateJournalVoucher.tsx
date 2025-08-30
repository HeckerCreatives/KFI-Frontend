import React, { useRef, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, useIonToast } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import classNames from 'classnames';
import { JournalVoucherFormData, journalVoucherSchema } from '../../../../../validations/journal-voucher.schema';
import JournalVoucherForm from '../components/JournalVoucherForm';
import JournalVoucherFormTable from '../components/JournalVoucherFormTable';
import kfiAxios from '../../../../utils/axios';
import { TErrorData, TFormError } from '../../../../../types/types';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';
import { formatDateInput } from '../../../../utils/date-utils';
import { removeAmountComma } from '../../../../ui/utils/formatNumber';

type CreateJournalVoucherProps = {
  getJournalVouchers: (page: number, keyword?: string, sort?: string) => void;
};

const CreateJournalVoucher = ({ getJournalVouchers }: CreateJournalVoucherProps) => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<JournalVoucherFormData>({
    resolver: zodResolver(journalVoucherSchema),
    defaultValues: {
      code: '',
      nature: '',
      refNo: '',
      date: formatDateInput(new Date().toISOString()),
      acctMonth: `${new Date().getMonth() + 1}`,
      acctYear: `${new Date().getFullYear()}`,
      checkNo: '',
      checkDate: '',
      bank: '',
      bankLabel: '',
      amount: '0',
      remarks: '',
      entries: [],
      mode: 'create',
    },
  });

  function dismiss() {
    form.reset();
    setIsOpen(false);
  }

  async function onSubmit(data: JournalVoucherFormData) {
    setLoading(true);
    try {
      data.amount = removeAmountComma(data.amount);
      data.entries = data.entries ? data.entries.map(entry => ({ ...entry, debit: removeAmountComma(entry.debit), credit: removeAmountComma(entry.credit) })) : [];
      const result = await kfiAxios.post('journal-voucher', data);
      const { success } = result.data;
      if (success) {
        getJournalVouchers(1);
        present({
          message: 'Journal voucher successfully added.',
          duration: 1000,
        });
        dismiss();
        return;
      }
      present({
        message: 'Failed to add a new journal voucher. Please try again.',
        duration: 1000,
      });
    } catch (error: any) {
      const errs: TErrorData | string = error?.response?.data?.error || error?.response?.data?.msg || error.message;
      const errors: TFormError[] | string = checkError(errs);
      const fields: string[] = Object.keys(form.formState.defaultValues as Object);
      formErrorHandler(errors, form.setError, fields);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <IonButton fill="clear" onClick={() => setIsOpen(true)} className="max-h-10 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
        + Add Record
      </IonButton>
      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height [--max-width:74rem] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader title="Journal Voucher - Add Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content h-screen !p-6 flex flex-col">
            <ModalHeader title="Journal Voucher - Add Record" sub="Manage journal voucher." dismiss={dismiss} />

          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col mt-4">
            <div>
              <JournalVoucherForm form={form} loading={loading} />
            </div>
            <div className="flex-1 mt-4">
              <JournalVoucherFormTable form={form} loading={loading} />
            </div>
            {form.formState.errors.root && <div className="text-sm text-red-600 italic text-center">{form.formState.errors.root.message}</div>}

            <div className="text-end border-t mt-2 pt-1 space-x-2 px-3">
              <IonButton disabled={loading} type="submit" fill="clear" className="!text-sm capitalize !bg-[#FA6C2F] text-white rounded-[4px]" strong={true}>
                Save
              </IonButton>
              <IonButton onClick={dismiss} color="danger" type="button" className="!text-sm capitalize" strong={true}>
                Cancel
              </IonButton>
            </div>
          </form>
        </div>
      </IonModal>
    </>
  );
};

export default CreateJournalVoucher;

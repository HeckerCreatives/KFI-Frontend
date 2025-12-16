import React, { useRef, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, useIonToast } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import kfiAxios from '../../../../utils/axios';
import { TErrorData, TFormError } from '../../../../../types/types';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';
import { DamayanFundFormData, damayanFundSchema } from '../../../../../validations/damayan-fund.schema';
import DamayanFundForm from '../components/DamayanFundForm';
import DamayanFundFormTable from '../components/DamayanFundFormTable';
import { formatDateInput } from '../../../../utils/date-utils';
import { removeAmountComma } from '../../../../ui/utils/formatNumber';
import Signatures from '../../../../ui/common/Signatures';
import { useOnlineStore } from '../../../../../store/onlineStore';
import { formatEVEntries } from '../../../../ui/utils/fomatData';
import { db } from '../../../../../database/db';

type CreateDamayanFundProps = {
  getDamayanFunds: (page: number, keyword?: string, sort?: string) => void;
};

const CreateDamayanFund = ({ getDamayanFunds }: CreateDamayanFundProps) => {
  const [present] = useIonToast();
  const modal = useRef<HTMLIonModalElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const online = useOnlineStore((state) => state.online);
  
  

  const form = useForm<DamayanFundFormData>({
    resolver: zodResolver(damayanFundSchema),
    defaultValues: {
      code: '',
      centerValue: '',
      centerLabel: '',
      refNo: '',
      remarks: '',
      date: formatDateInput(new Date().toISOString()),
      acctMonth: `${new Date().getMonth() + 1}`,
      acctYear: `${new Date().getFullYear()}`,
      checkNo: '',
      checkDate: formatDateInput(new Date().toISOString()),
      bankCode: '',
      bankCodeLabel: '',
      amount: '0',
      entries: [],
      mode: 'create',
    },
  });

  function dismiss() {
    form.reset();
   setIsOpen(false)
  }

  async function onSubmit(data: DamayanFundFormData) {
    if(online){
      setLoading(true);
      try {
        data.amount = removeAmountComma(data.amount);
        data.entries = data.entries ? data.entries.map((entry, index) => ({ ...entry, debit: removeAmountComma(entry.debit), credit: removeAmountComma(entry.credit), line: index + 1 })) : [];
        const result = await kfiAxios.post('/damayan-fund', data);
        const { success } = result.data;
        if (success) {
          getDamayanFunds(1);
          present({
            message: 'Damayan fund successfully added.',
            duration: 1000,
          });
          dismiss();
          return;
        }
        present({
          message: 'Failed to add a new damayan fund. Please try again.',
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
    } else{
      try {
         const entries = formatEVEntries(data.entries || [])
         // const entries = data.entries
         await db.damayanFunds.add({
           ...data,
           entries: entries,
           encodedBy: '',
           _synced: false,  
           action: "create",
         });
         getDamayanFunds(1);
         dismiss();
         present({
           message: "Data successfully created!",
           duration: 1000,
         });
       } catch (error) {
         present({
           message: "Failed to save record. Please try again.",
           duration: 1200,
         });
       }
    }
  }

  return (
    <>
      <div className="text-end">
        <IonButton
        onClick={() => setIsOpen(true)}
          fill="clear"
          id="create-damayan-fund-modal"
          className="max-h-10 min-h-6 min-w-32 max-w-32 w-32 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md"
          strong
        >
          + Add Record
        </IonButton>
      </div>
      <IonModal
        isOpen={isOpen}
        trigger="create-damayan-fund-modal"
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height [--max-width:84rem] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Damayan Fund - Add Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content max-h-[90%] !p-6">
            <ModalHeader disabled={loading} title="Damayan Fund - Add Record" sub="Manage damayan fund records." dismiss={dismiss} />

          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full mt-4">
            <div className="mb-3 flex-1">
              <DamayanFundForm form={form} loading={loading} />
              <DamayanFundFormTable form={form} />
            </div>
            <Signatures open={isOpen} type={'damayan fund'}/>
            
            {form.formState.errors.root && <div className="text-sm text-red-600 italic text-center">{form.formState.errors.root.message}</div>}

            <div className="text-end space-x-1 px-2">
              <IonButton disabled={loading} type="submit" fill="clear" className="!text-sm capitalize !bg-[#FA6C2F] text-white rounded-[4px]" strong={true}>
                {loading ? 'Saving...' : 'Save'}
              </IonButton>
              <IonButton disabled={loading} onClick={dismiss} color="danger" type="button" className="!text-sm capitalize" strong={true}>
                Cancel
              </IonButton>
            </div>
          </form>
        </div>
      </IonModal>
    </>
  );
};

export default CreateDamayanFund;

import React, { useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, useIonToast } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { AcknowledgementFormData, acknowledgementSchema } from '../../../../../validations/acknowledgement.schema';
import AcknowledgementForm from '../components/AcknowledgementForm';
import AcknowledgementFormTable from '../components/AcknowledgementFormTable';
import kfiAxios from '../../../../utils/axios';
import { TErrorData, TFormError } from '../../../../../types/types';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';
import { formatDateInput } from '../../../../utils/date-utils';
import { formatNumber, removeAmountComma } from '../../../../ui/utils/formatNumber';
import Signatures from '../../../../ui/common/Signatures';
import { useOnlineStore } from '../../../../../store/onlineStore';
import { db } from '../../../../../database/db';

type CreateAcknowledgementProps = {
  getAcknowledgements: (page: number, keyword?: string, sort?: string) => void;
};

const CreateAcknowledgement = ({ getAcknowledgements }: CreateAcknowledgementProps) => {
  const [present] = useIonToast();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const online = useOnlineStore((state) => state.online);
  const user = localStorage.getItem('user')

  

  const form = useForm<AcknowledgementFormData>({
    resolver: zodResolver(acknowledgementSchema),
    defaultValues: {
      code: '',
      center: '',
      centerLabel: '',
      centerName: '',
      refNo: '',
      remarks: '',
      date: formatDateInput(new Date().toISOString()),
      acctMonth: `${new Date().getMonth() + 1}`,
      acctYear: `${new Date().getFullYear()}`,
      acctOfficer: '',
      checkNo: '',
      checkDate: formatDateInput(new Date().toISOString()),
      type: '',
      bankCode: '',
      bankCodeLabel: '',
      amount: '',
      cashCollection: '',
      entries: [],
      mode: 'create',
    },
  });

  function dismiss() {
    form.reset();
    setIsOpen(false);
  }

  async function onSubmit(data: AcknowledgementFormData) {
    if(online){
      setLoading(true);
      try {
        data.amount = (removeAmountComma(data.amount));
        data.cashCollection = data.cashCollection !== '' ? removeAmountComma(data.cashCollection as string) : data.cashCollection;
        data.entries = data.entries
          ? data.entries.map((entry: any, index: number) => ({
              ...entry,
              clientId: entry.clientId,
              clientName: entry.name,
              loanReleaseEntryId: entry.loanReleaseEntryId || entry.loanReleaseId || '',
              loanReleaseId: entry.loanReleaseId || '',
              week: entry.week,
              cctCodeDesc: entry.description,
              debit: Number(removeAmountComma(entry.debit)),
              credit: Number(removeAmountComma(entry.credit)),
              dueDate: entry.dueDate.split("T")[0] || '',
              line: index + 1,
            }))
          : [];

          
         const result = await kfiAxios.post('acknowledgement', data);
         const { success } = result.data;
         if (success) {
           getAcknowledgements(1);
           present({
             message: 'Official Receipt successfully added.',
             duration: 1000,
           });
           dismiss();
           return;
         }
         present({
           message: 'Failed to add a new official receipt. Please try again.',
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
    } else {
       try {
         // const entries = data.entries
         await db.acknowledgementReceipts.add({
           ...data,
          entries: data.entries?.map((item) => ({
              ...item,
              client: {
                name: item.clientName,
                _id: item.client || item.clientId
              },
              acctCode: {
                code: item.acctCode,
                description: item.acctCodeDesc,
                _id: item.acctCodeId
              },
              loanRelease:{
                code: item.cvNo,
                _id: item.loanReleaseId || item.loanReleaseEntryId
              },

              action: 'create',
              _synced: false,
              week: item.week
            })),
            center: {
              _id: data.center,
              centerNo: data.centerName,
              description: data.centerLabel
            },
            bankCode: {
              _id: data.bankCode,
              code: data.bankCodeLabel,
              description: data.bankCodeLabel,
            },
            encodedBy:{
              username: user
            },
           _synced: false,  
           action: "create",
         });
         getAcknowledgements(1);
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

  const amount = form.watch('amount')

  return (
    <>
      <div className="text-end">
        <IonButton
          fill="clear"
          onClick={() => setIsOpen(true)}
          className="max-h-10 min-h-6 min-w-32 max-w-32 w-32 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md"
          strong
        >
          + Add Record
        </IonButton>
      </div>
      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height [--max-width:84rem] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Official Receipt - Add Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content max-h-[90%] h-full !p-6">
            <ModalHeader disabled={loading} title="Official Receipt - Add Record" sub="Manage official reciept." dismiss={dismiss} />

          <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col mt-6">
            <div className="mb-3 flex-1">
              <div>
                <AcknowledgementForm form={form} loading={loading} />
              </div>
              <div>
                <AcknowledgementFormTable form={form} />
              </div>
            </div>

             <div className="px-3">
              <div className="grid grid-cols-3">
                <div className="flex items-center justify-start gap-2 text-sm border-4 px-2 py-1 [&>div]:!font-semibold">
                  <div>Diff: </div>
                  <div>{`${formatNumber(Math.abs((form.watch('entries') || []).reduce((acc, current) => acc + Number(removeAmountComma(current.debit as string)), 0) - (form.watch('entries') || []).reduce((acc, current) => acc + Number(removeAmountComma(current.credit as string)), 0)))}`}</div>
                </div>
                <div className="flex items-center justify-start gap-2 text-sm border-4 px-2 py-1 [&>div]:!font-semibold col-span-2">
                  <div>Total: </div>
                  <div>{`${amount.toLocaleString()}`}</div>
                </div>
              </div>
            </div>
           
            <Signatures open={isOpen} type={'official receipt'} preparedBy={user || ''} recieveByorDate={form.watch('date')}/>

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

export default CreateAcknowledgement;

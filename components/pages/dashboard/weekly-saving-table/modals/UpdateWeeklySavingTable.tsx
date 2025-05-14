import React, { useEffect, useRef, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, IonIcon } from '@ionic/react';
import { createSharp } from 'ionicons/icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { WeeklySavingTableFormData, weeklySavingTableSchema } from '../../../../../validations/wst.schema';
import WeeklySavingTableForm from '../components/WeeklySavingTableForm';
import kfiAxios from '../../../../utils/axios';
import { TErrorData, TFormError, WeeklySavings } from '../../../../../types/types';
import { TWeeklySavingsTable } from '../WeeklySavingTable';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';

type UpdateWeeklySavingTableProps = {
  saving: WeeklySavings;
  setData: React.Dispatch<React.SetStateAction<TWeeklySavingsTable>>;
};

const UpdateWeeklySavingTable = ({ saving, setData }: UpdateWeeklySavingTableProps) => {
  const [loading, setLoading] = useState(false);
  const modal = useRef<HTMLIonModalElement>(null);

  const form = useForm<WeeklySavingTableFormData>({
    resolver: zodResolver(weeklySavingTableSchema),
    defaultValues: {
      rangeAmountFrom: `${saving.rangeAmountFrom}`,
      rangeAmountTo: `${saving.rangeAmountTo}`,
      weeklySavingsFund: `${saving.weeklySavingsFund}`,
    },
  });

  useEffect(() => {
    if (saving) {
      form.reset({
        rangeAmountFrom: `${saving.rangeAmountFrom}`,
        rangeAmountTo: `${saving.rangeAmountTo}`,
        weeklySavingsFund: `${saving.weeklySavingsFund}`,
      });
    }
  }, [saving, form.reset]);

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }

  async function onSubmit(data: WeeklySavingTableFormData) {
    setLoading(true);
    try {
      const result = await kfiAxios.put(`/weekly-saving/${saving._id}`, data);
      const { success } = result.data;
      if (success) {
        setData(prev => {
          let clone = [...prev.savings];
          let index = clone.findIndex(e => e._id === result.data.weeklySaving._id);
          clone[index] = { ...result.data.weeklySaving };
          return { ...prev, savings: clone };
        });
        dismiss();
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
  }

  return (
    <>
      <div className="text-end">
        <div
          id={`update-weekly-savings-modal-${saving._id}`}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={createSharp} className="text-[1rem]" /> Update
        </div>
      </div>
      <IonModal
        ref={modal}
        trigger={`update-weekly-savings-modal-${saving._id}`}
        backdropDismiss={false}
        className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:50%] lg:[--width:50%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader disabled={loading} title="Weekly Saving Table - Edit Record" sub="All Files" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content">
          <div>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <WeeklySavingTableForm form={form} loading={loading} />
              <div className="text-end border-t mt-2 pt-1 space-x-2">
                <IonButton disabled={loading} color="tertiary" type="submit" className="!text-sm capitalize" strong={true}>
                  Save
                </IonButton>
                <IonButton disabled={loading} onClick={dismiss} color="danger" type="button" className="!text-sm capitalize" strong={true}>
                  Cancel
                </IonButton>
              </div>
            </form>
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default UpdateWeeklySavingTable;

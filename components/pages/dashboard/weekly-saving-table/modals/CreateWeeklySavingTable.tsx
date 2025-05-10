import React, { useRef } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import WeeklySavingTableForm from '../components/WeeklySavingTableForm';
import { WeeklySavingTableFormData, weeklySavingTableSchema } from '../../../../../validations/wst.schema';

const CreateWeeklySavingTable = () => {
  const modal = useRef<HTMLIonModalElement>(null);
  const input = useRef<HTMLIonInputElement>(null);

  const form = useForm<WeeklySavingTableFormData>({
    resolver: zodResolver(weeklySavingTableSchema),
    defaultValues: {
      rangeAmountFrom: '',
      rangeAmountTo: '',
      wsf: '',
    },
  });

  function confirm() {
    modal.current?.dismiss(input.current?.value, 'confirm');
  }

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }

  function onSubmit(data: WeeklySavingTableFormData) {
    console.log(data);
  }

  return (
    <>
      <div className="text-end">
        <IonButton fill="clear" id="create-weekly-savings-modal" className="max-h-10 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
          + Add Record
        </IonButton>
      </div>
      <IonModal
        ref={modal}
        trigger="create-weekly-savings-modal"
        backdropDismiss={false}
        className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:50%] lg:[--width:50%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader title="Weekly Saving Table - Add Record" sub="All Files" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content">
          <div>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <WeeklySavingTableForm form={form} />
              <div className="text-end border-t mt-2 pt-1 space-x-2">
                <IonButton color="tertiary" type="submit" className="!text-sm capitalize" strong={true}>
                  Save
                </IonButton>
                <IonButton onClick={dismiss} color="danger" type="button" className="!text-sm capitalize" strong={true}>
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

export default CreateWeeklySavingTable;

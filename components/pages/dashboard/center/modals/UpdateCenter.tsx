import React, { useRef } from 'react';
import { IonButton, IonModal, IonHeader, IonContent, IonToolbar, IonIcon, IonTitle } from '@ionic/react';
import { closeSharp, createSharp } from 'ionicons/icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CenterFormData, centerSchema } from '../../../../../validations/center.schema';
import CenterForm from '../components/CenterForm';
import ModalHeader from '../../../../ui/page/ModalHeader';

const UpdateCenter = ({ index }: { index: number }) => {
  const modal = useRef<HTMLIonModalElement>(null);
  const input = useRef<HTMLIonInputElement>(null);

  const form = useForm<CenterFormData>({
    resolver: zodResolver(centerSchema),
    defaultValues: {
      centerCode: '',
      description: '',
      location: '',
      centerChief: '',
      treasurer: '',
      accountOfficer: '',
    },
  });

  function confirm() {
    modal.current?.dismiss(input.current?.value, 'confirm');
  }

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }

  function onSubmit(data: CenterFormData) {
    console.log(data);
  }

  return (
    <>
      <div className="text-end">
        <div
          id={`update-center-modal-${index}`}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={createSharp} className="text-[1rem]" /> Update
        </div>
      </div>
      <IonModal
        ref={modal}
        trigger={`update-center-modal-${index}`}
        backdropDismiss={false}
        className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:50%] lg:[--width:50%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader title="Center - Edit Record" sub="All Files" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content">
          <div>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CenterForm form={form} />
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

export default UpdateCenter;

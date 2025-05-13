import React, { useRef } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, IonIcon, IonGrid, IonRow, IonCol } from '@ionic/react';
import { cogSharp } from 'ionicons/icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import InputText from '../../../../ui/forms/InputText';
import { LoanSetUpCodeFormData, loanSetUpCodeSchema } from '../../../../../validations/loan.schema';
import { Loan } from '../../../../../types/types';

const SetUpCodeLoan = ({ loan }: { loan: Loan }) => {
  const modal = useRef<HTMLIonModalElement>(null);
  const input = useRef<HTMLIonInputElement>(null);

  const form = useForm<LoanSetUpCodeFormData>({
    resolver: zodResolver(loanSetUpCodeSchema),
    defaultValues: {
      loanCode: '',
      module: '',
      loanType: '',
      acctCode: '',
      sortOrder: '',
    },
  });

  function confirm() {
    modal.current?.dismiss(input.current?.value, 'confirm');
  }

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }

  function onSubmit(data: LoanSetUpCodeFormData) {
    console.log(data);
  }

  return (
    <>
      <div className="text-end">
        <div
          id={`update-set-code-modal-${loan._id}`}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={cogSharp} className="text-[1rem]" /> Set Up Code
        </div>
      </div>
      <IonModal
        ref={modal}
        trigger={`update-set-code-modal-${loan._id}`}
        backdropDismiss={false}
        className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:50%] lg:[--width:50%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader title="Loan - Set Up Code" sub="All Files" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content">
          <div>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <IonGrid>
                <IonRow>
                  <IonCol size="6" className="space-y-2">
                    <FormIonItem>
                      <InputText
                        name="loanCode"
                        control={form.control}
                        clearErrors={form.clearErrors}
                        label="Loan Code"
                        placeholder="Type here"
                        className="!px-2 !py-2 rounded-md"
                      />
                    </FormIonItem>
                    <FormIonItem>
                      <InputText name="module" control={form.control} clearErrors={form.clearErrors} label="Module" placeholder="Type here" className="!px-2 !py-2 rounded-md" />
                    </FormIonItem>
                    <FormIonItem>
                      <InputText
                        name="loanType"
                        control={form.control}
                        clearErrors={form.clearErrors}
                        label="Loan Type"
                        placeholder="Type here"
                        className="!px-2 !py-2 rounded-md"
                      />
                    </FormIonItem>
                  </IonCol>
                  <IonCol size="6" className="space-y-2">
                    <FormIonItem>
                      <InputText
                        name="acctCode"
                        control={form.control}
                        clearErrors={form.clearErrors}
                        label="Account Code"
                        placeholder="Type here"
                        className="!px-2 !py-2 rounded-md"
                      />
                    </FormIonItem>
                    <FormIonItem>
                      <InputText
                        name="sortOrder"
                        control={form.control}
                        clearErrors={form.clearErrors}
                        label="Sort Order"
                        placeholder="Type here"
                        className="!px-2 !py-2 rounded-md"
                      />
                    </FormIonItem>
                  </IonCol>
                </IonRow>
              </IonGrid>
              <div className="text-end border-t mt-2 pt-1 space-x-2">
                <IonButton onClick={dismiss} color="success" type="button" className="!text-sm capitalize" strong={true}>
                  Delete Entry
                </IonButton>
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

export default SetUpCodeLoan;

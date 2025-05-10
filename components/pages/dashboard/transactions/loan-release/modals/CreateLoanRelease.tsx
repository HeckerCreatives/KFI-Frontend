import React, { useRef, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../../ui/page/ModalHeader';
import LoanReleaseFormTable from '../components/LoanReleaseFormTable';
import classNames from 'classnames';
import LoanReleaseForm from '../components/LoanReleaseForm';
import { LoanReleaseFormData, loanReleaseSchema } from '../../../../../../validations/loan-release.schema';

const CreateLoanRelease = () => {
  const [active, setActive] = useState('form');

  const modal = useRef<HTMLIonModalElement>(null);
  const input = useRef<HTMLIonInputElement>(null);

  const form = useForm<LoanReleaseFormData>({
    resolver: zodResolver(loanReleaseSchema),
    defaultValues: {
      cvNo: '',
      center: '',
      name: '',
      refNumber: '',
      remarks: '',
      date: '',
      acctMonth: '',
      acctYear: '',
      payee: '',
      noOfWeeks: '',
      typeOfLoan: '',
      checkNo: '',
      checkDate: '',
      bankCode: '',
      amount: '',
      cycle: '',
      interestRate: '',
    },
  });

  function confirm() {
    modal.current?.dismiss(input.current?.value, 'confirm');
  }

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }

  function onSubmit(data: LoanReleaseFormData) {
    console.log(data);
  }

  return (
    <>
      <div className="text-end lg:mt-1">
        <IonButton fill="clear" id="create-loanRelease-modal" className="max-h-10 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
          + Add Record
        </IonButton>
      </div>
      <IonModal
        ref={modal}
        trigger="create-loanRelease-modal"
        backdropDismiss={false}
        className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:70%] lg:[--width:70%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader title="Transaction - Loan Release - Add Record" sub="All Actions" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content !px-0">
          <div>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div>
                <div className="bg-slate-100 p-3 my-2">
                  <IonButton
                    type="button"
                    fill="clear"
                    onClick={() => setActive('form')}
                    className={classNames(
                      'max-h-10 min-h-6 w-40 bg-white text-black shadow-lg capitalize font-semibold rounded-md',
                      active === 'form' && '!bg-[#FA6C2F] !text-white',
                    )}
                    strong
                  >
                    Fill-up
                  </IonButton>
                  <IonButton
                    type="button"
                    fill="clear"
                    onClick={() => setActive('table')}
                    className={classNames(
                      'max-h-10 min-h-6 w-40 bg-white text-black shadow-lg capitalize font-semibold rounded-md',
                      active === 'table' && '!bg-[#FA6C2F] !text-white',
                    )}
                    strong
                  >
                    Table
                  </IonButton>
                </div>
                <div className={classNames(active !== 'form' && 'hidden')}>
                  <LoanReleaseForm form={form} />
                </div>
                <div className={classNames('px-3', active !== 'table' && 'hidden')}>
                  <LoanReleaseFormTable />
                </div>
              </div>
              <div className="text-end border-t mt-2 pt-1 space-x-2 px-3">
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

export default CreateLoanRelease;

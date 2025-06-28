import React, { useRef, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, IonIcon } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import LoanReleaseFormTable from '../components/ExpenseVoucherFormTable';
import classNames from 'classnames';
import LoanReleaseForm from '../components/ExpenseVoucherForm';
import { createSharp } from 'ionicons/icons';
import { ExpenseVoucherFormData, expenseVoucherSchema } from '../../../../../validations/expense-voucher.schema';

const UpdateExpenseVoucher = ({ index }: { index: number }) => {
  const [active, setActive] = useState('form');

  const modal = useRef<HTMLIonModalElement>(null);
  const input = useRef<HTMLIonInputElement>(null);

  const form = useForm<ExpenseVoucherFormData>({
    resolver: zodResolver(expenseVoucherSchema),
    defaultValues: {
      code: '',
      supplier: '',
      supplierId: '',
      refNo: '',
      remarks: '',
      date: '',
      acctMonth: '',
      acctYear: '',
      checkNo: '',
      checkDate: '',
      bank: '',
      bankLabel: '',
      amount: '',
    },
  });

  function confirm() {
    modal.current?.dismiss(input.current?.value, 'confirm');
  }

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }

  function onSubmit(data: ExpenseVoucherFormData) {
    console.log(data);
  }

  return (
    <>
      <div className="text-end">
        <div
          id={`update-expenseVoucher-modal-${index}`}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={createSharp} className="text-[1rem]" /> Edit
        </div>
      </div>
      <IonModal
        ref={modal}
        trigger={`update-expenseVoucher-modal-${index}`}
        backdropDismiss={false}
        className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:70%] lg:[--width:70%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader title="Transaction - Expense Voucher - Edit Record" sub="All Actions" dismiss={dismiss} />
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
                  <LoanReleaseFormTable form={form} />
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

export default UpdateExpenseVoucher;

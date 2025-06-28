import React, { useRef, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import classNames from 'classnames';
import { ExpenseVoucherFormData, expenseVoucherSchema } from '../../../../../validations/expense-voucher.schema';
import ExpenseVoucherFormTable from '../components/ExpenseVoucherFormTable';
import ExpenseVoucherForm from '../components/ExpenseVoucherForm';

const CreateExpenseVoucher = () => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<ExpenseVoucherFormData>({
    resolver: zodResolver(expenseVoucherSchema),
    defaultValues: {
      code: '',
      supplier: '',
      refNo: '',
      date: '',
      acctMonth: '',
      acctYear: '',
      checkNo: '',
      checkDate: '',
      bank: '',
      bankLabel: '',
      amount: '',
      remarks: '',
      entries: [],
    },
  });

  function dismiss() {
    form.reset();
    setIsOpen(false);
  }

  function onSubmit(data: ExpenseVoucherFormData) {
    console.log(data);
  }

  return (
    <>
      <div className="text-end lg:mt-1">
        <IonButton onClick={() => setIsOpen(true)} fill="clear" className="max-h-10 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
          + Add Record
        </IonButton>
      </div>
      <IonModal isOpen={isOpen} backdropDismiss={false} className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:70%] lg:[--width:70%]">
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader title="Expense Voucher - Add Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content !px-0">
          <div>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <ExpenseVoucherForm form={form} />
              <ExpenseVoucherFormTable form={form} />
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

export default CreateExpenseVoucher;

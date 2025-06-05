import React, { useEffect, useRef, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, IonIcon } from '@ionic/react';
import { createSharp } from 'ionicons/icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import GroupAccountForm from '../components/GroupAccountForm';
import { GroupAccountFormData, groupAccountSchema } from '../../../../../validations/group-account.schema';
import { TGroupAccount } from '../GroupAccount';
import { GroupAccount, TErrorData, TFormError } from '../../../../../types/types';
import kfiAxios from '../../../../utils/axios';
import formErrorHandler from '../../../../utils/form-error-handler';
import checkError from '../../../../utils/check-error';

type UpdateGroupAccountProps = {
  groupAccount: GroupAccount;
  setData: React.Dispatch<React.SetStateAction<TGroupAccount>>;
};

const UpdateGroupAccount = ({ groupAccount, setData }: UpdateGroupAccountProps) => {
  const [loading, setLoading] = useState(false);
  const modal = useRef<HTMLIonModalElement>(null);

  const form = useForm<GroupAccountFormData>({
    resolver: zodResolver(groupAccountSchema),
    defaultValues: {
      code: groupAccount.code,
    },
  });

  useEffect(() => {
    if (groupAccount) {
      form.reset({
        code: groupAccount.code,
      });
    }
  }, [groupAccount, form.reset]);

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }

  async function onSubmit(data: GroupAccountFormData) {
    setLoading(true);
    try {
      const result = await kfiAxios.put(`/group-account/${groupAccount._id}`, data);
      const { success } = result.data;
      if (success) {
        setData(prev => {
          let clone = [...prev.groupAccounts];
          let index = clone.findIndex(e => e._id === result.data.groupAccount._id);
          clone[index] = { ...result.data.groupAccount };
          return { ...prev, groupAccounts: clone };
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
          id={`update-group-account-modal-${groupAccount._id}`}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={createSharp} className="text-[1rem]" /> Edit
        </div>
      </div>
      <IonModal
        ref={modal}
        trigger={`update-group-account-modal-${groupAccount._id}`}
        backdropDismiss={false}
        className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:50%] lg:[--width:50%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader title="Group Account - Edit Record" sub="All Files" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content">
          <div>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <GroupAccountForm form={form} loading={loading} />
              <div className="text-end border-t mt-2 pt-1 space-x-2">
                <IonButton disabled={loading} color="tertiary" type="submit" className="!text-sm capitalize" strong={true}>
                  {loading ? 'Saving...' : 'Save'}
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

export default UpdateGroupAccount;

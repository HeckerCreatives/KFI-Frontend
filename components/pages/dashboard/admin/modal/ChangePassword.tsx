import { IonButton, IonHeader, IonIcon, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useRef, useState } from 'react';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChangePasswordFormData, changePasswordSchema } from '../../../../../validations/change-password.schema';
import kfiAxios from '../../../../utils/axios';
import { TErrorData, TFormError, User } from '../../../../../types/types';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';
import { documentLockSharp } from 'ionicons/icons';
import InputPassword from '../../../../ui/forms/InputPassword';
import FormIonItem from '../../../../ui/utils/FormIonItem';

type ChangePasswordProps = {
  user: User;
};

const ChangePassword = ({ user }: ChangePasswordProps) => {
  const [loading, setLoading] = useState(false);
  const [present] = useIonToast();

  const modal = useRef<HTMLIonModalElement>(null);

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: '',
      confirm_password: '',
    },
  });

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }

  async function onSubmit(data: ChangePasswordFormData) {
    setLoading(true);
    try {
      const result = await kfiAxios.put(`/user/change-password`, { ...data, username: user.username });
      const { success } = result.data;
      if (success) {
        dismiss();
        present({
          message: 'Password changed successfully!.',
          duration: 1000,
        });
        return;
      }
    } catch (error: any) {
      const errs: TErrorData | string = error?.response?.data?.error || error?.response?.data?.error || error.message;
      const errors: TFormError[] | string = checkError(errs);
      const fields: string[] = Object.keys(form.formState.defaultValues as Object);
      formErrorHandler(errors, form.setError, fields);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* <div className="text-end">
        <div
          id={`update-password-modal-${user._id}`}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={documentLockSharp} className="text-[1rem]" /> Change Password
        </div>
      </div> */}
      <IonButton
        fill="clear"
        id={`update-password-modal-${user._id}`}
        className="space-x-1 rounded-lg w-40 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-[#ff9a00] text-slate-700 capitalize min-h-4 px-2 py-1 text-xs"
      >
        <IonIcon icon={documentLockSharp} className="text-xs" />
        <span>Change Password</span>
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`update-password-modal-${user._id}`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:30rem] lg:[--width:40%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Admin - Change Password" sub="Manage Account" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content">
          <div>
            <h6 className="font-bold">
              Change Password for <span className="text-orange-600">{user.username}</span>
            </h6>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormIonItem>
                <InputPassword
                  name="password"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="New Password"
                  placeholder="Type here"
                  className="!px-2 !py-2 rounded-md"
                  disabled={loading}
                  labelClassname="truncate min-w-40 !text-slate-600 !text-sm text-end"
                  topClass="-top-[0.1rem]"
                />
              </FormIonItem>
              <FormIonItem>
                <InputPassword
                  name="confirm_password"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  label="Confirm New Password"
                  placeholder="Type here"
                  className="!px-2 !py-2 rounded-md"
                  disabled={loading}
                  labelClassname="truncate min-w-40 !text-slate-600 !text-sm text-end"
                  topClass="-top-[0.1rem]"
                />
              </FormIonItem>
              {form.formState.errors.root && <div className="text-sm text-red-600 italic text-center">{form.formState.errors.root.message}</div>}
              <div className="text-end border-t pt-1 space-x-2">
                <IonButton disabled={loading} type="submit" fill="clear" className="!text-sm capitalize !bg-[#FA6C2F] text-white rounded-[4px]" strong={true}>
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

export default ChangePassword;

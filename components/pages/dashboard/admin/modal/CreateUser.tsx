import React, { useRef, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, useIonToast, IonIcon } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import kfiAxios from '../../../../utils/axios';
import { TErrorData, TFormError } from '../../../../../types/types';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';
import UserForm from '../components/UserForm';
import { UserFormData, userSchema } from '../../../../../validations/user.schema';
import { personAdd } from 'ionicons/icons';

type CreateUserProps = {
  getUsers: (page: number, keyword?: string, sort?: string) => void;
};

const CreateUser = ({ getUsers }: CreateUserProps) => {
  const [loading, setLoading] = useState(false);
  const [present] = useIonToast();

  const modal = useRef<HTMLIonModalElement>(null);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      username: '',
      password: '',
      confirm_password: '',
    },
  });

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }

  async function onSubmit(data: UserFormData) {
    setLoading(true);
    try {
      const result = await kfiAxios.post('/user', data);
      const { success } = result.data;
      if (success) {
        getUsers(1);
        dismiss();
        present({
          message: 'Account successfully created!.',
          duration: 1000,
        });
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
        <IonButton fill="clear" id="create-user-modal" className="max-h-10 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
          + Create Account
        </IonButton>
      </div>
      <IonModal
        ref={modal}
        trigger="create-user-modal"
        backdropDismiss={false}
        className=" [--border-radius:0.7rem] auto-height [--width:95%] [--max-width:36rem]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Admin - Create Account" sub="Manage Account" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className=" p-6 flex flex-col gap-6">
            <ModalHeader disabled={loading} title="Admin - Create Account" sub="Enter admin details below." dismiss={dismiss} />

          <div>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <UserForm form={form} loading={loading} />
              <div className="text-end mt-8 space-x-2">
                 <IonButton disabled={loading} onClick={dismiss} color="light" type="button" className="!text-xs !shadow-none capitalize rounded-md">
                  Cancel
                </IonButton>
                <IonButton disabled={loading} type="submit" fill="clear" className="!text-sm capitalize !bg-[#FA6C2F] text-white rounded-[4px rounded-md" strong={true}>
                  {loading ? 'Saving...' : 'Save'}
                </IonButton>
               
              </div>
            </form>
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default CreateUser;

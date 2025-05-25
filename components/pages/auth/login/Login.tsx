import { IonButton, IonContent, IonPage, IonSpinner, isPlatform, useIonRouter } from '@ionic/react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import FormIonItem from '../../../ui/utils/FormIonItem';
import InputText from '../../../ui/forms/InputText';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormData, loginSchema } from '../../../../validations/login.schema';
import kfiAxios from '../../../utils/axios';
import checkError from '../../../utils/check-error';
import { TErrorData, TFormError } from '../../../../types/types';
import formErrorHandler from '../../../utils/form-error-handler';
import InputPassword from '../../../ui/forms/InputPassword';
import logo from '../../../assets/images/logo-nobg.png';
import Image from 'next/image';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const router = useIonRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      const result = await kfiAxios.post('/auth/login', data);
      const { success, access } = result.data;
      if (success) {
        localStorage.setItem('auth', access);
        router.push('/dashboard/home');
        if (isPlatform('capacitor')) {
          (window as any).location.reload(true);
        } else if (isPlatform('electron')) {
          (window as any).ipcRenderer.send('reload-window');
        } else {
          (window as any).location.reload();
        }
      }
    } catch (error: any) {
      const errs: TErrorData | string = error?.response?.data?.error || error?.response?.data?.msg || error.message;
      const errors: TFormError[] | string = checkError(errs);
      const fields: string[] = Object.keys(form.formState.defaultValues as Object);
      formErrorHandler(errors, form.setError, fields);
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="w-full h-full bg-gradient-to-br from-[#F76B2E] via-[#FFF4DE] to-[#F76B2E] via-50% from-1% to-100%">
          <div className="grid place-items-center h-full">
            <div className=" bg-[#FFF0E3] grid place-items-center max-w-[40rem] rounded-2xl shadow-lg">
              <div className="px-10 space-y-8 py-20">
                <div>
                  <div className="pb-8">
                    <Image alt="logo" src={logo} className="h-20 w-auto mx-auto" />
                  </div>

                  <h6 className="text-xl font-semibold m-0">Login</h6>
                  <p>Please sign in to access your account and manage your services securely.</p>
                </div>
                <div>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormIonItem>
                      <InputText
                        disabled={loading}
                        name="username"
                        required
                        control={form.control}
                        clearErrors={form.clearErrors}
                        label="User's Code"
                        className="!px-3 !py-2 shadow-lg mb-1 border-none"
                      />
                    </FormIonItem>
                    <FormIonItem>
                      <InputPassword
                        disabled={loading}
                        name="password"
                        required
                        control={form.control}
                        clearErrors={form.clearErrors}
                        label="Password"
                        className="!px-3 !py-2 shadow-lg mb-1 border-none"
                      />
                    </FormIonItem>
                    {form.formState.errors.root && <div className="text-sm text-red-600 italic text-center">{form.formState.errors.root.message}</div>}
                    <div className="text-end">
                      <IonButton disabled={loading} slot="end" type="submit" className="min-h-8 w-full !text-sm [--background:#FB5000] capitalize" strong={true}>
                        {loading ? <IonSpinner name="lines-small" /> : 'Login'}
                      </IonButton>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;

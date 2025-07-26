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
import { Capacitor } from '@capacitor/core';

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

  // const getDeviceName = async (): string => {
  //   if (!Capacitor.isNativePlatform()) return 'Web Browser';

  //   if (Capacitor.getPlatform() === 'electron') {
  //     if (typeof window !== 'undefined' && window.require) {
  //       const { hostname } = window.require('os');
  //       return hostname();
  //     }
  //     return 'Unknown PC';
  //   }

  //   const {} = await import("@capaitor/device")

  // };

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
        <div className="w-full h-full bg-[#FFF0E3] bg-desktop bg-no-repeat bg-bottom bg-contain">
          <div className="h-full mx-auto pt-[10%]">
            <div className=" bg-[FFF0E3] grid place-items-center max-w-[27.5rem] min-w-[27.5rem] rounded-2xl mx-auto">
              <div className="px-10 w-full space-y-8">
                <div className="text-center">
                  <div className="mb-7 w-fit mx-auto p-2 rounded-lg bg-[FFF0E3]">
                    <Image alt="logo" src={logo} className="h-20 w-auto mx-auto filter drop-shadow-[1px_1px_0px_white]" />
                  </div>
                  <div className="space-y-6">
                    <h6 className="text-slate-900 text-2xl font-semibold m-0">Login</h6>
                    <p className="text-slate-900">Please sign in to access your account.</p>
                  </div>
                </div>
                <div>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <FormIonItem>
                      <InputText
                        disabled={loading}
                        name="username"
                        required
                        control={form.control}
                        clearErrors={form.clearErrors}
                        placeholder="User's Code"
                        className="!px-3 !py-3 shadow-lg mb-1 rounded-lg border-none"
                      />
                    </FormIonItem>
                    <FormIonItem>
                      <InputPassword
                        disabled={loading}
                        name="password"
                        required
                        control={form.control}
                        clearErrors={form.clearErrors}
                        placeholder="Password"
                        className="!px-3 !py-3 shadow-lg mb-1 rounded-lg border-none"
                      />
                    </FormIonItem>
                    {form.formState.errors.root && <div className="text-sm text-red-600 italic text-center">{form.formState.errors.root.message}</div>}
                    <div className="text-end">
                      <IonButton
                        disabled={loading}
                        slot="end"
                        fill="clear"
                        type="submit"
                        className="min-h-10 w-full !text-sm bg-[#FB5000] text-white capitalize !rounded-lg"
                        strong={true}
                      >
                        {loading ? <IonSpinner name="lines-small" color="light" /> : 'Login'}
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

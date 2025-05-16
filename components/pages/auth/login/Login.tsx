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
import logo from '../../../assets/images/logo.png';
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
        router.push('/dashboard/chart-of-account');
        if (isPlatform('capacitor')) {
          (window as any).location.reload(true);
        } else if (isPlatform('electron')) {
          (window as any).ipcRenderer.send('reload-window');
        } else {
          (window as any).location.reload();
        }
      }
    } catch (error: any) {
      const errs: TErrorData | string = error?.response?.data?.error || error.message;
      const errors: TFormError[] | string = checkError(errs);
      const fields: string[] = Object.keys(form.formState.defaultValues as Object);
      formErrorHandler(errors, form.setError, fields);
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="flex flex-col h-full text-slate-600">
          <div className="min-h-16 w-full shadow-lg relative z-10 px-2 flex items-center">
            <Image alt="logo" src={logo} className="h-12 w-auto" />
          </div>
          <div className="flex-1 grid grid-cols-12">
            <div className="hidden md:col-span-6 lg:col-span-7 xl:col-span-8 2xl:col-span-9 bg-desktop bg-cover md:flex md:items-center md:justify-end">
              <h6 className="text-[3rem] lg:text-[4rem] font-bold text-slate-950 px-10">
                Kaalalay
                <br />
                Foundation,
                <br />
                INC.
              </h6>
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-5 xl:col-span-4 2xl:col-span-3 bg-[#FFF0E3] grid place-items-center">
              <div className="px-10 space-y-8">
                <div>
                  <h6 className="text-xl font-bold m-0">Login</h6>
                  <p>Lorem ipsum is simply dummy test of the print</p>
                </div>
                <div>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                    <FormIonItem>
                      <InputText
                        disabled={loading}
                        name="username"
                        required
                        control={form.control}
                        clearErrors={form.clearErrors}
                        label="Username"
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
          <div className="min-h-16 w-full relative z-10" />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;

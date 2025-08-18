import { IonButton, IonContent, IonIcon, IonPage, IonSpinner, isPlatform, useIonRouter } from '@ionic/react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import FormIonItem from '../../../ui/utils/FormIonItem';
import InputText from '../../../ui/forms/InputText';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormData, loginSchema } from '../../../../validations/login.schema';
import kfiAxios from '../../../utils/axios';
import checkError from '../../../utils/check-error';
import { AccessToken, TErrorData, TFormError } from '../../../../types/types';
import formErrorHandler from '../../../utils/form-error-handler';
import InputPassword from '../../../ui/forms/InputPassword';
import logo from '../../../assets/images/logo-nobg.png';
import Image from 'next/image';
import { Capacitor } from '@capacitor/core';
import { lockClosed, person } from 'ionicons/icons';
import { jwtDecode } from 'jwt-decode';
import { arrangedResource } from '../../../utils/constants';

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
        const token = jwtDecode(access) as AccessToken;
        const permissions = token.permissions;
        let path = '';
        if (token.role === 'superadmin') {
          path = '/dashboard/home';
        } else {
          let i = 0;
          while (i <= arrangedResource.length && !path) {
            const resource = permissions.find(e => e.resource === arrangedResource[i].resource);
            if (resource?.actions.visible) {
              path = arrangedResource[i].path;
            }
            i++;
          }
        }
        localStorage.setItem('auth', access);
        router.push(path);
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
          <div className="h-full mx-auto pt-[7%]">
            <div className=" bg-white py-10 border-t-4 border-orange-400 shadow-lg grid place-items-center max-w-[27.5rem] min-w-[27.5rem] rounded-lg mx-auto">
              <div className="px-10 w-full space-y-8">
                <div className="text-center">
                  <div className="mb-5 w-fit mx-auto p-2 rounded-lg bg-[FFF0E3]">
                    <Image alt="logo" src={logo} className="h-20 w-auto mx-auto filter drop-shadow-[1px_1px_0px_white]" />
                  </div>
                  <div className="space-y-2">
                    <h6 className="text-orange-700 text-[1.3rem] !font-[600] m-0">Welcome Back!</h6>
                    <p className="text-slate-600 text-sm ">Login to your account</p>
                  </div>
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
                        placeholder="Enter your user's code"
                        className="!px-3 !py-3 rounded-lg !border-orange-200"
                        containerClassnames="flex flex-col"
                        labelClassName="!text-xs !text-orange-800 !font-[600]"
                        icon={person}
                      />
                    </FormIonItem>
                    <FormIonItem>
                      <InputPassword
                        disabled={loading}
                        name="password"
                        placeholder="Enter your password"
                        required
                        control={form.control}
                        clearErrors={form.clearErrors}
                        label="Password"
                        className="!px-3 !py-3 rounded-lg !border-orange-200"
                        containerClassNames="flex flex-col"
                        labelClassname="!text-xs !text-orange-800 !font-[600]"
                        icon={lockClosed}
                      />
                    </FormIonItem>
                    {form.formState.errors.root && <div className="text-sm text-red-600 italic text-center">{form.formState.errors.root.message}</div>}
                    <div className="text-end">
                      <IonButton
                        disabled={loading}
                        slot="end"
                        fill="clear"
                        type="submit"
                        className="min-h-10 w-full !text-sm bg-[linear-gradient(90deg,rgba(245,157,13,1)30%,rgba(250,117,22,1)100%)] text-white capitalize border-1 border-orange-200 !rounded-lg"
                        strong={true}
                      >
                        {loading ? (
                          <IonSpinner name="lines-small" color="light" />
                        ) : (
                          <span className="flex items-center gap-1">
                            <IonIcon icon={lockClosed} className="text-sm" />
                            Login
                          </span>
                        )}
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

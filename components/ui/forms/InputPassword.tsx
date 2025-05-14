import { IonButton, IonIcon, IonInput, IonLabel, IonText } from '@ionic/react';
import classNames from 'classnames';
import { eye, eyeOff } from 'ionicons/icons';
import React, { useState } from 'react';
import { Control, Controller, FieldPath, FieldValues, UseFormClearErrors } from 'react-hook-form';

type TFormInput<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  clearErrors: UseFormClearErrors<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
};

const InputPassword = <T extends FieldValues>({ name, control, clearErrors, label, placeholder = '', required = false, disabled = false }: TFormInput<T>) => {
  const [show, setShow] = useState(false);

  const toggleShow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShow(prev => !prev);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="w-full">
          <div className="flex justify-between">
            {label && (
              <IonLabel class="custom" className="!text-sm font-bold tracking-wide !text-slate-600">
                {label}
              </IonLabel>
            )}
            {label && required && <span className="text-slate-500 text-xs italic">Required</span>}
          </div>
          <div className="relative my-1 shadow-md">
            <IonInput
              {...field}
              type={show ? 'text' : 'password'}
              placeholder={placeholder}
              onIonInput={e => {
                field.onChange(e.detail.value);
                clearErrors(name);
              }}
              disabled={disabled}
              onIonBlur={field.onBlur}
              className={classNames(
                'text-sm  ![--padding-start:0] !bg-white ![--padding-end:0] ![--highlight-color-focused:none] ![--padding-top:0] ![--padding-bottom:0] !px-3 !py-2',
                error && '![--border-color:red] !border-red-600',
              )}
            />
            <IonButton fill="clear" type="button" onClick={toggleShow} className="[--ripple-color:transparent] w-fit h-fit absolute top-[0.12rem] right-0.5 z-50">
              {show ? <IonIcon icon={eye} className="cursor-pointer h-5 w-5 fill-slate-500" /> : <IonIcon icon={eyeOff} className="cursor-pointer h-5 w-5 fill-slate-500" />}
            </IonButton>
          </div>
          {error && (
            <IonText slot="error" color="danger" className="text-xs font-semibold block">
              {error.message}
            </IonText>
          )}
        </div>
      )}
    />
  );
};

export default InputPassword;

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
  className?: string;
  containerClassName?: string;
};

const InputPassword = <T extends FieldValues>({
  name,
  control,
  clearErrors,
  label,
  placeholder = '',
  required = false,
  disabled = false,
  className = '',
  containerClassName = '',
}: TFormInput<T>) => {
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
        <div className="w-full space-y-0">
          <div className="flex justify-between">
            {label && (
              <IonLabel class="custom" className="!text-sm font-semibold tracking-wide !text-slate-600">
                {label}
              </IonLabel>
            )}
            {label && required && <span className="text-slate-500 text-xs italic">Required</span>}
          </div>
          <div className={classNames('relative my-1', containerClassName)}>
            <IonInput
              {...field}
              aria-label={label || 'no label'}
              type={show ? 'text' : 'password'}
              placeholder={placeholder}
              onIonInput={e => {
                field.onChange(e.detail.value);
                clearErrors(name);
                clearErrors('root');
              }}
              disabled={disabled}
              onIonBlur={field.onBlur}
              className={classNames(
                'text-sm !bg-white ![--highlight-color-focused:none] ![--padding-bottom:0] ![--padding-top:0] ![--padding-start:0] border border-slate-400 ![--min-height:1rem] !min-h-[1rem]',
                error && '![--border-color:red] !border-red-600',
                className,
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

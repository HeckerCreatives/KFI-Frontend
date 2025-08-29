import { IonButton, IonIcon, IonInput, IonLabel, IonText } from '@ionic/react';
import classNames from 'classnames';
import { eye, eyeOff } from 'ionicons/icons';
import React, { useState } from 'react';
import { Control, Controller, FieldPath, FieldValues, UseFormClearErrors } from 'react-hook-form';
import { ViewIcon, ViewOffIcon } from 'hugeicons-react';

type TFormInput<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  clearErrors: UseFormClearErrors<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  containerClassNames?: string;
  labelClassname?: string;
  icon?: string;
  topClass?: string;
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
  containerClassNames = '',
  labelClassname = '',
  icon = '',
  topClass = 'top-[0.12rem]',
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
        <div className="w-full">
          <div className={classNames('w-full flex items-start gap-1', containerClassNames)}>
            {label && (
              <div className="flex justify-between">
                <IonLabel class="custom" className={classNames('!text-xs !text-black !font-medium w-24 text-end ')}>
                  {label}
                </IonLabel>
              </div>
            )}
            <div className={classNames('relative w-full')}>
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
                  'text-xs !bg-white ![--background:white] ![--padding-bottom:0] ![--padding-top:0] ![--padding-start:0] border border-zinc-300 ![--min-height:1rem] !min-h-[1rem]',
                  error && '![--border-color:red] !border-red-600 !text-black',
                  className,
                )}
              >
                {icon && <IonIcon slot="start" icon={icon} aria-hidden="true" className="fill-orange-400"></IonIcon>}
              </IonInput>
              <IonButton fill="clear" type="button" onClick={toggleShow} className={classNames('[--ripple-color:transparent] w-fit h-fit absolute right-0.5 z-50', topClass)}>
                {show ? <ViewIcon size={15} className="cursor-pointer h-5 w-5 text-orange-600" /> : <ViewOffIcon  className="cursor-pointer h-5 w-5 text-orange-500" />}
              </IonButton>
            </div>
          </div>
          <div className="text-end">
            {error && (
              <IonText slot="error" color="danger" className="text-xs font-semibold block">
                {error.message}
              </IonText>
            )}
          </div>
        </div>
      )}
    />
  );
};

export default InputPassword;

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
  containerClassNames?: string;
  labelClassname?: string;
  icon?: string;
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
          <div className={classNames('w-full flex items-start gap-2', containerClassNames)}>
            {label && (
              <div className="flex justify-between">
                <IonLabel class="custom" className={classNames('!text-sm font-semibold !text-slate-600 truncate', labelClassname)}>
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
                  'text-sm !bg-white ![--highlight-color-focused:none] ![--padding-bottom:0] ![--padding-top:0] ![--padding-start:0] border border-slate-400 ![--min-height:1rem] !min-h-[1rem]',
                  error && '![--border-color:red] !border-red-600',
                  className,
                )}
              >
                {icon && <IonIcon slot="start" icon={icon} aria-hidden="true" className="fill-orange-400"></IonIcon>}
              </IonInput>
              <IonButton fill="clear" type="button" onClick={toggleShow} className="[--ripple-color:transparent] w-fit h-fit absolute top-[0.12rem] right-0.5 z-50">
                {show ? <IonIcon icon={eye} className="cursor-pointer h-5 w-5 fill-slate-500" /> : <IonIcon icon={eyeOff} className="cursor-pointer h-5 w-5 fill-slate-500" />}
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

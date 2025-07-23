import { IonInput, IonLabel, IonText } from '@ionic/react';
import classNames from 'classnames';
import React from 'react';
import { Control, Controller, FieldPath, FieldValues, UseFormClearErrors } from 'react-hook-form';

type TFormInput<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  clearErrors: UseFormClearErrors<T>;
  label?: string;
  type?: 'text' | 'number' | 'email' | 'password' | 'tel' | 'url' | 'search' | 'date';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  readOnly?: boolean;
  max?: string;
  labelClassName?: string;
};

const InputText = <T extends FieldValues>({
  name,
  control,
  clearErrors,
  label,
  type = 'text',
  placeholder = '',
  required = false,
  disabled = false,
  className,
  labelClassName = '',
  readOnly = false,
  max = '',
}: TFormInput<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="w-full">
          <div className="w-full flex items-start gap-2">
            {label && (
              <div className="flex justify-between">
                <IonLabel class="custom" className={classNames('!text-sm font-semibold !text-slate-600', labelClassName)}>
                  {label}
                </IonLabel>
              </div>
            )}

            <div className="w-full">
              <IonInput
                clearInput={type === 'search'}
                {...field}
                type={type}
                aria-label={label || 'no label'}
                placeholder={placeholder}
                onIonInput={e => {
                  field.onChange(e.detail.value);
                  clearErrors(name);
                  clearErrors('root');
                }}
                disabled={disabled}
                onIonBlur={field.onBlur}
                className={classNames(
                  'text-sm !bg-white ![--highlight-color-focused:none] md:![--padding-bottom:0] ![--padding-top:0] ![--padding-start:0] border border-slate-400 ![--min-height:0.75rem] !min-h-[1rem]',
                  error && '![--border-color:red] !border-red-600',
                  className,
                )}
                readonly={readOnly}
                max={max}
              />
              <div className="text-start">
                {error && (
                  <IonText slot="error" color="danger" className="text-xs font-semibold block">
                    {error.message}
                  </IonText>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    />
  );
};

export default InputText;

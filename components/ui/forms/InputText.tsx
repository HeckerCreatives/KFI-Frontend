import { IonIcon, IonInput, IonLabel, IonText } from '@ionic/react';
import classNames from 'classnames';
import { person } from 'ionicons/icons';
import React from 'react';
import { Control, Controller, FieldPath, FieldValues, UseFormClearErrors } from 'react-hook-form';
import { formatAmount, formatNumber, removeAmountComma } from '../utils/formatNumber';

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
  containerClassnames?: string;
  icon?: string;
  errorClassName?: string;
  isAmount?: boolean;
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
  containerClassnames = '',
  icon = '',
  errorClassName = '',
  isAmount = false,
}: TFormInput<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="w-full">
          <div className={classNames('w-full flex items-start gap-2', containerClassnames)}>
            {label && (
              <div className="flex justify-between">
                <IonLabel class="custom" className={classNames('text-sm font-semibold text-slate-600', labelClassName)}>
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
                  const value = e.detail.value;
                  clearErrors(name);
                  clearErrors('root');
                  field.onChange(value);
                }}
                disabled={disabled}
                onIonBlur={field.onBlur}
                onBlur={() => {
                  if (isAmount) field.onChange(formatAmount(field.value));
                }}
                onFocus={() => {
                  if (isAmount) field.onChange(removeAmountComma(field.value));
                }}
                className={classNames(
                  'text-sm !bg-white ![--highlight-color-focused:none] md:![--padding-bottom:0] ![--padding-top:0] ![--padding-start:0] border border-slate-400 ![--min-height:0.75rem] !min-h-[0.75rem]',
                  error && '![--border-color:red] !border-red-600',
                  className,
                )}
                readonly={readOnly}
                max={max}
              >
                {icon && <IonIcon slot="start" icon={icon} aria-hidden="true" className="fill-orange-400"></IonIcon>}
              </IonInput>
              <div className="text-start">
                {error && (
                  <IonText slot="error" color="danger" className={classNames('text-xs font-semibold block', errorClassName)}>
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

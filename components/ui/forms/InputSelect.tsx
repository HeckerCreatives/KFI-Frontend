import { IonItem, IonLabel, IonSelect, IonSelectOption, IonText } from '@ionic/react';
import classNames from 'classnames';
import React from 'react';
import { Control, Controller, FieldPath, FieldValues, UseFormClearErrors } from 'react-hook-form';

type Option = {
  label: string;
  value: string | number;
};

type TFormInputSelect<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  clearErrors: UseFormClearErrors<T>;
  label?: string;
  type?: 'text' | 'number' | 'email' | 'password' | 'tel' | 'url';
  placeholder?: string;
  required?: boolean;
  options: Option[];
  showLabel?: boolean;
  className?: string;
  disabled?: boolean;
  containerClassnames?: string;
  labelClassName?: string;
};

const InputSelect = <T extends FieldValues>({
  name,
  control,
  clearErrors,
  label,
  placeholder = '',
  required = false,
  options = [],
  showLabel = true,
  className,
  disabled = false,
  containerClassnames = '',
  labelClassName = '',
}: TFormInputSelect<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={classNames('w-full flex items-start gap-2', containerClassnames)}>
          {label && showLabel && (
            <IonLabel class="custom" className={classNames('text-sm font-semibold text-slate-600', labelClassName)}>
              {label}
              {required && <span className="text-red-500"> *</span>}
            </IonLabel>
          )}
          <div className="flex-1">
            <IonSelect
              aria-label={label || 'no label'}
              disabled={disabled}
              interface="popover"
              {...field}
              placeholder={placeholder}
              onIonChange={e => {
                field.onChange(e.detail.value);
                clearErrors(name);
                clearErrors('root');
              }}
              labelPlacement="stacked"
              onIonBlur={field.onBlur}
              className={classNames(
                '!border border-slate-400 [--highlight-color-focused:none] !px-2 !py-1 text-sm !min-h-[0.75rem] min-w-full',
                error && '![--border-color:red] !border-red-600',
                className,
              )}
            >
              {options.map(option => (
                <IonSelectOption key={option.value} value={option.value} className="text-sm [--min-height:0.5rem]">
                  {option.label}
                </IonSelectOption>
              ))}
            </IonSelect>
            <div className="text-start">
              {error && (
                <IonText slot="error" color="danger" className="text-xs font-semibold block">
                  {error.message}
                </IonText>
              )}
            </div>
          </div>
        </div>
      )}
    />
  );
};

export default InputSelect;

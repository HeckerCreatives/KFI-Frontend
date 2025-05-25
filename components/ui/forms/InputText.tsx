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
  readOnly = false,
}: TFormInput<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="w-full">
          <div className="flex justify-between">
            {label && (
              <IonLabel class="custom" className="!text-sm font-semibold tracking-wide !text-slate-600">
                {label}
              </IonLabel>
            )}
            {label && required && <span className="text-slate-500 text-xs italic">Required</span>}
          </div>

          <IonInput
            clearInput={type === 'search'}
            {...field}
            type={type}
            aria-label={label || 'no label'}
            placeholder={placeholder}
            onIonInput={e => {
              field.onChange(e.detail.value);
              clearErrors(name);
            }}
            disabled={disabled}
            onIonBlur={field.onBlur}
            className={classNames(
              'text-sm !bg-white ![--highlight-color-focused:none] md:![--padding-bottom:0] ![--padding-top:0] ![--padding-start:0] border border-slate-400 ![--min-height:1rem] !min-h-[1rem]',
              error && '![--border-color:red] !border-red-600',
              className,
            )}
            readonly={readOnly}
          />

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

export default InputText;

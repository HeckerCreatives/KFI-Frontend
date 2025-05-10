import { IonLabel, IonRadio, IonRadioGroup, IonText } from '@ionic/react';
import classNames from 'classnames';
import React from 'react';
import { Control, Controller, FieldPath, FieldValues, UseFormClearErrors } from 'react-hook-form';

type TOptions = {
  label: string;
  value: string;
};

type TFormInput<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  clearErrors: UseFormClearErrors<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  options?: TOptions[];
};

const InputRadio = <T extends FieldValues>({
  name,
  control,
  clearErrors,
  label = '',
  required = false,
  placeholder = '',
  disabled = false,
  className = '',
  options = [],
}: TFormInput<T>) => {
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

          <IonRadioGroup
            {...field}
            onIonChange={e => {
              field.onChange(e.detail.value);
              clearErrors(name);
            }}
            className={classNames(
              'text-sm !bg-white ![--highlight-color-focused:none] ![--padding-bottom:0] ![--padding-top:0] ![--padding-start:0] ![--min-height:1rem] grid grid-cols-2',
              error && '![--border-color:red] !border-red-600',
              className,
            )}
          >
            {options.map((option: TOptions) => (
              <IonRadio key={option.value} value={option.value} labelPlacement="end" justify="start" className="![--color-checked:#FA6C2F]">
                {option.label}
              </IonRadio>
            ))}
          </IonRadioGroup>

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

export default InputRadio;

import { IonInput, IonItem, IonLabel, IonList, IonSearchbar, IonText } from '@ionic/react';
import classNames from 'classnames';
import React from 'react';
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
};

const InputDropdownSearch = <T extends FieldValues>({ name, control, clearErrors, label, placeholder = '', required = false, disabled = false, className }: TFormInput<T>) => {
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

          <div className="relative">
            <IonSearchbar
              {...field}
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
            />
            <IonList class="absolute top-0">
              <IonItem>Item 1</IonItem>
              <IonItem>Item 2</IonItem>
              <IonItem>Item 3</IonItem>
            </IonList>
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

export default InputDropdownSearch;

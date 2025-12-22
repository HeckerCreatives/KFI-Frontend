import { IonCheckbox, IonText } from '@ionic/react';
import classNames from 'classnames';
import React from 'react';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

type TFormInputCheckbox<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
};

const InputCheckbox = <T extends FieldValues>({ name, control, label, required = false, className = '', disabled = false }: TFormInputCheckbox<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="w-fit">
          <IonCheckbox
            aria-label={label || 'no label'}
            disabled={disabled}
            {...field}
            checked={field.value}
            onIonChange={e => {
              field.onChange(e.detail.checked);
            }}
            onIonBlur={field.onBlur}
            className={classNames('text-sm h-fit !w-4 font-semibold', error ? 'ion-invalid' : '', className)}
            justify="start"
            labelPlacement="end"
          >
            {label}
          </IonCheckbox>
          {error && (
            <IonText slot="error" color="danger" className="text-sm block mt-1">
              {error.message}
            </IonText>
          )}
        </div>
      )}
    />
  );
};

export default InputCheckbox;

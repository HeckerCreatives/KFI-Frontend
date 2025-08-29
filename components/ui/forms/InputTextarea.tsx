import { IonInput, IonLabel, IonText, IonTextarea } from '@ionic/react';
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
  rows?: number;
  labelClassNames?: string;
  containerClassnames?: string;
};

const InputTextarea = <T extends FieldValues>({
  name,
  control,
  clearErrors,
  label,
  placeholder = '',
  required = false,
  disabled = false,
  className,
  rows = 4,
  labelClassNames = '',
  containerClassnames = '',
}: TFormInput<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="w-full">
          <div className={classNames('w-full flex items-start gap-1', containerClassnames)}>
            {label && (
              <IonLabel class="custom" className={classNames('!text-xs text-end !text-black !font-medium w-[7.5rem]',)}>
                {label}
              </IonLabel>
            )}

            <div className="w-full">
              <IonTextarea
                aria-label={label || 'no label'}
                rows={rows}
                {...field}
                placeholder={placeholder}
                onIonInput={e => {
                  field.onChange(e.detail.value);
                  clearErrors(name);
                  clearErrors('root');
                }}
                disabled={disabled}
                onIonBlur={field.onBlur}
                className={classNames(
                  'text-sm !bg-white ![--highlight-color-focused:none] ![--padding-bottom:0] !mt-0 ![--padding-top:0] ![--padding-start:0] border border-slate-200 ![--min-height:1rem]',
                  error && '![--border-color:red] !border-red-600 !text-xs !text-black',
                  className,
                )}
              />
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

export default InputTextarea;

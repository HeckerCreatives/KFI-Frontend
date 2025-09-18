import { IonLabel, IonText } from "@ionic/react"
import classNames from "classnames"
import React from "react"
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  UseFormClearErrors,
} from "react-hook-form"

type TFormFile<T extends FieldValues> = {
  name: FieldPath<T>
  control: Control<T>
  clearErrors: UseFormClearErrors<T>
  label?: string
  required?: boolean
  disabled?: boolean
  className?: string
  labelClassName?: string
  containerClassnames?: string
  errorClassName?: string
  accept?: string // "image/*", ".jpg,.png" etc.
}

const InputFile = <T extends FieldValues>({
  name,
  control,
  clearErrors,
  label,
  required = false,
  disabled = false,
  className,
  labelClassName = "",
  containerClassnames = "",
  errorClassName = "",
  accept = "image/*",
}: TFormFile<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="w-full">
          <div
            className={classNames(
              "w-full flex items-start gap-1",
              containerClassnames
            )}
          >
            {label && (
              <div>
                <IonLabel
                  className={classNames(
                    "!text-xs !text-black !font-medium text-end w-24",
                    labelClassName
                  )}
                >
                  {label}
                </IonLabel>
              </div>
            )}

            <div className="w-full">
              <input
                type="file"
                accept={accept}
                disabled={disabled}
                className={classNames(
                  "block w-full text-xs text-black border border-zinc-300 rounded-md cursor-pointer file:mr-3 file:py-1 file:px-2 file:border-0 file:text-xs file:font-medium file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200",
                  error && "!border-red-600",
                  className
                )}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  clearErrors(name)
                  clearErrors("root")
                  field.onChange(file)
                }}
                onBlur={field.onBlur}
              />

              <div className="text-start">
                {error && (
                  <IonText
                    slot="error"
                    color="danger"
                    className={classNames(
                      "text-xs font-semibold block",
                      errorClassName
                    )}
                  >
                    {error.message}
                  </IonText>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    />
  )
}

export default InputFile

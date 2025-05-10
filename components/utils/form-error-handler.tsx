import { UseFormSetValue, FieldValues, FieldError, UseFormSetError } from 'react-hook-form';
import { TFormError } from '../../types/types';

const formErrorHandler = <T extends FieldValues>(errors: TFormError[] | string, setError: UseFormSetError<T>, fields: string[] = []) => {
  if (typeof errors === 'string') {
    setError('root' as never, { type: 'manual', message: errors } as FieldError);
    return;
  }

  errors.map(error => {
    if (fields.includes(error.path)) {
      setError(error.path as never, { type: 'custom', message: error.msgs[0] } as FieldError);
      return;
    }
    setError('root' as never, { type: 'custom', message: error.msgs[0] } as FieldError);
  });
};

export default formErrorHandler;

import { FieldValues, FieldError, UseFormSetError } from 'react-hook-form';
import { TFormError } from '../../types/types';

const formErrorHandler = <T extends FieldValues>(errors: TFormError[] | string, setError: UseFormSetError<T>, fields: string[] = []) => {
  if (typeof errors === 'string') {
    setError('root' as never, { type: 'manual', message: errors } as FieldError);
    return;
  }

  errors.map(error => {
    const path = error.path.replace(/\[(\d+)\]/g, '.$1');
    const pathCheck = path.split('.')[0];
    if (fields.includes(pathCheck)) {
      if (pathCheck === 'center') {
        setError('centerLabel' as never, { type: 'custom', message: error.msgs[0] } as FieldError);
        return;
      }

      if (pathCheck === 'bankCode') {
        setError('bankCodeLabel' as never, { type: 'custom', message: error.msgs[0] } as FieldError);
        return;
      }

      if (pathCheck === 'typeOfLoan') {
        setError('typeOfLoanLabel' as never, { type: 'custom', message: error.msgs[0] } as FieldError);
        return;
      }

      if (path.split('.').length > 1 && path.split('.')[2] === 'acctCodeId') {
        setError(path as never, { type: 'custom', message: error.msgs[0] } as FieldError);
        return;
      }

      setError(error.path as never, { type: 'custom', message: error.msgs[0] } as FieldError);
      return;
    }
    setError('root' as never, { type: 'custom', message: error.msgs[0] } as FieldError);
  });
};

export default formErrorHandler;

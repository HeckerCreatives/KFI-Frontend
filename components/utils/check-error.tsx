import { TErrorData, TFormError } from '../../types/types';

const checkError = (error: TErrorData | string, defaultMsg: string = 'Something went wrong. Please try again'): TFormError[] | string => {
  if (typeof error === 'string') {
    return error;
  }
  const { formErrors, message } = error;
  if (formErrors) return formErrors;
  if (message) return message;
  return defaultMsg;
};

export default checkError;

import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api/v1';

console.log('API URL:', API_URL);

const kfiAxios: AxiosInstance = axios.create({
  baseURL: API_URL,

  // baseURL: 'https://kfiapi.axcela-ph.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const Request = async (request: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
  const token = localStorage.getItem('auth');
  if (token && request.headers) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
};

const RequestError = async (error: AxiosError): Promise<never> => {
 
  return Promise.reject(error);
};

const Response = (response: AxiosResponse): AxiosResponse => {
  if (response.config.method?.toLowerCase() !== 'get') {
    const data = response?.data as { msg?: string; message?: string } | undefined;
    const successMsg = data?.msg || data?.message || 'Success';
    const toastId = response.config.url || 'default';

    toast.success(successMsg, { id: toastId }); 
  }

  return response;
};

const ResponseError = async (error: AxiosError): Promise<never> => {
  const data = error.response?.data as { msg?: string } | undefined;
  const errMsg = data?.msg || 'An error occurred';
  if (error.response?.status === 401) {
    localStorage.removeItem('auth');
    window.dispatchEvent(new Event('unauthorized'));
    // window.location.reload();
  } else {
    toast.error(errMsg)
  }
  return Promise.reject(error);
};

kfiAxios.interceptors.request.use(Request, RequestError);
kfiAxios.interceptors.response.use(Response, ResponseError);

export default kfiAxios;

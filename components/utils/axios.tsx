import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export const kfiAxios: AxiosInstance = axios.create();

export const Request = async (request: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
  return request;
};

export const RequestError = async (error: AxiosError): Promise<never> => {
  return Promise.reject(error);
};

export const Response = (response: AxiosResponse): AxiosResponse => {
  return response;
};

export const ResponseError = async (error: AxiosError): Promise<never> => {
  return Promise.reject(error);
};

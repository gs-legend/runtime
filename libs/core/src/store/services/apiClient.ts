import axios, { AxiosError } from 'axios';
import { message } from 'antd';


import { selectToken, logoutAction } from './auth';
import { store } from '@kagami/core';
import dataService from '../../helpers/data.service';

axios.defaults.headers.get['Accept'] = 'application/json, text/plain, */*';
axios.defaults.headers['Cache-Control'] = 'no-cache, no-store';
axios.defaults.headers.source = 'runtime';
axios.defaults.withCredentials = true;

const apiClient = axios.create({
  baseURL: dataService.BASE_URL,
  withCredentials:true
});

apiClient.interceptors.request.use(async (config) => {
  const token = selectToken(store.getState());

  if (token) {
    // config.headers.common = config.headers.common ?? {};

    config.headers.common['Authorization'] = `Bearer ${token}`;
    // config.headers.common['cookie'] = `${token};`;
    // config.headers.common['crossDomain'] = true;
    // config.headers.common['Cache-Control'] = "no-cache";
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    if (!axios.isCancel(error)) {
      console.log(error)
      if (error.response?.status === 401) {
        store.dispatch(logoutAction());
      }
      showErrorMessage(error);
      throw error;
    }
  }
);

export default apiClient;

function showErrorMessage(error: AxiosError) {
  const errorMsg = extractErrorMsg(error);

  if (Array.isArray(errorMsg)) {
    errorMsg.forEach((err) => message.error(`${err}`, 5));
  } else {
    message.error(`${errorMsg}`);
  }
}

function extractErrorMsg(error: AxiosError): string | string[] {
  const { response, message } = error;
  const request: XMLHttpRequest | undefined = error.request;
  if (response) {
    if (response.data?.message) {
      return response.data.message;
    } else if (response.data?.error?.message) {
      return response.data.error.message;
    } else if (response.data?.error?.inner) {
      return response.data.error.inner;
    }
    else if (response.data?.errorMessage) {
      return response.data.errorMessage;
    }

    return response.statusText;
  }
  else if (request) {
    return 'Unexpected error occured';
  }
  return message;
}

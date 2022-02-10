import { selectDomain, store } from '@kagami/core';
import { SHA256 } from 'crypto-js';
import dataService from '../../helpers/data.service';
import apiClient from './apiClient';
import { AuthResponse, ForgottenPasswordPayload, LoginPayload } from './ApiTypes';

import { trackProgress } from './trackProgress';


export const apiCallIds = {
  LOGIN: 'LOGIN',
  FORGOTTEN_PASSWORD: 'FORGOTTEN_PASSWORD',
  GET_DOMAIN: 'GET_DOMAIN',
  GET_LOGO: 'GET_LOGO'
};


export const API = {
  login: (data: LoginPayload) => {
    const hash = "" + SHA256(data.password);
    const userDomain = selectDomain(store.getState());

    const newData: LoginPayload = {
      username: data.username,
      password: hash,
      authServerHost: dataService.BASE_URL,
      userDomain: userDomain
    };
    return trackProgress(apiClient.post<AuthResponse>(dataService.BASE_URL + 'api/auth/login', newData, { withCredentials: false }));
  },

  logout: () =>
    trackProgress(apiClient.get(dataService.BASE_URL + 'api/auth/logout')),

  forgottenPassword: (data: ForgottenPasswordPayload) =>
    trackProgress(apiClient.post(dataService.BASE_URL + 'api/auth/forgotten-password', data)),

  getDomain: () =>
    trackProgress(apiClient.get(dataService.BASE_URL + 'api/auth/getDomain')),

  getLogo: () =>
    trackProgress(apiClient.post(dataService.BASE_URL + 'api/auth/getLogo', {})),

  getUser: () =>
    trackProgress(apiClient.get(dataService.BASE_URL + 'role/role/getUser', { withCredentials: true })),

  getDashboard: () =>
    trackProgress(apiClient.post(dataService.BASE_URL + 'api/presentation/getDashboard', {}, { withCredentials: true })),

  getAppAndUserContext: () =>
    trackProgress(apiClient.get(dataService.BASE_URL + 'bpm/cache/getAppAndUserContext', { withCredentials: true })),

  process: (data: any) =>
    trackProgress(apiClient.post(dataService.BASE_URL + 'bpm/bpm/process', data, { withCredentials: true })),
};

export default API;
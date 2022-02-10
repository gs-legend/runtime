import { history, rootPath } from '@kagami/core';
import { AxiosResponse } from 'axios';
import { push } from 'connected-react-router';
import { call, delay, put, takeLatest } from 'redux-saga/effects';
import { ActionType, createAction } from 'typesafe-actions';
import { domainActions, loginActions, logoActions, logoutAction } from '.';
import api from '../api';
import { AuthResponse, ForgottenPasswordPayload, GetDomainResponse, GetLogoResponse } from '../ApiTypes';


/**
 * ACTIONS
 */
export const forgottenPasswordAction = createAction('auth/FORGOTTEN_PASSWORD')<
  ForgottenPasswordPayload
>();

const actions = {
  forgottenPasswordAction
};
export type AuthAction = ActionType<typeof actions>;


function* login({ payload }: ReturnType<typeof loginActions.request>) {
  try {
    const resp: AxiosResponse<AuthResponse> = yield call(api.login, payload);
    yield put(loginActions.success(resp.data));
    yield delay(200);
    if (resp.data && resp.data.continueTo) {
      document.cookie = resp.data.token;
      window.location.pathname = rootPath;
    }
  } catch {
    yield put(loginActions.failure(null, null));
  }
}

function* logout() {
  try {
    const resp: any = yield call(api.logout);
    if (resp) {
      window.location.pathname = rootPath;
    }
  } catch {
  }
}


function* forgottenPassword({ payload }: ReturnType<typeof forgottenPasswordAction>) {
  try {
    yield call(api.forgottenPassword, payload);
    yield put(push(rootPath));
  } catch { }
}

function* getDomain() {
  try {
    const resp: AxiosResponse<GetDomainResponse> = yield call(api.getDomain);
    // yield put(logoActions.request({}));
    yield put(domainActions.success(resp.data));
  } catch {
    yield put(domainActions.failure(null, null));
  }
}

function* getLogo() {
  try {
    const resp: AxiosResponse<GetLogoResponse> = yield call(api.getLogo);
    if (resp.data && resp.data.logodata) {
      yield put(logoActions.success(resp.data));
    }
  } catch {
    yield put(logoActions.failure(null, null));
  }
}


export function* authSaga() {
  yield takeLatest(loginActions.request, login);
  yield takeLatest(logoutAction, logout);
  yield takeLatest(forgottenPasswordAction, forgottenPassword);
  yield takeLatest(domainActions.request, getDomain);
  yield takeLatest(logoActions.request, getLogo);
}

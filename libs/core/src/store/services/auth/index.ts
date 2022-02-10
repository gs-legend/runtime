import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import { ActionType, createAction, createAsyncAction, createReducer } from 'typesafe-actions';
import { RootState } from '../..';
import { AuthResponse, GetDomainResponse, GetLogoResponse, LoginPayload, Token, User } from '../ApiTypes';

type AuthServiceState = Readonly<{
  user: User;
  token: Token;
  isAuthenticating: boolean;
  domain: string;
  logo: string;
}>;

const initialState: AuthServiceState = {
  isAuthenticating: false,
  user: null as any,
  token: null as any,
  domain: null as any,
  logo: null as any
};

/**
 * ACTIONS
 */
export const loginActions = createAsyncAction(
  'authService/LOGIN_REQUEST',
  'authService/LOGIN_SUCCESS',
  'authService/LOGIN_FAILURE'
)<LoginPayload, AuthResponse>();

export const logoutAction = createAction('authService/LOGOUT')();

export const domainActions = createAsyncAction(
  'authService/GET_DOMAIN',
  'authService/GET_DOMAIN_SUCCESS',
  'authService/GET_DOMAIN_FAILURE'
)<{}, GetDomainResponse>();

export const logoActions = createAsyncAction(
  'authService/GET_LOGO',
  'authService/GET_LOGO_SUCCESS',
  'authService/GET_LOGO_FAILURE'
)<{}, GetLogoResponse>();

const actions = { loginActions, logoutAction, domainActions, logoActions };
export type AuthServiceAction = ActionType<typeof actions>;


/**
 * REDUCERS
 */

const isAuthenticating = createReducer(initialState.isAuthenticating)
  .handleAction([loginActions.request], () => true)
  .handleAction([loginActions.success, loginActions.failure], () => false);

const user = createReducer(initialState.user)
  .handleAction(loginActions.success, (_, { payload: { username } }) => username)
  .handleAction(loginActions.failure, () => null as any);

const token = createReducer(initialState.token)
  .handleAction(loginActions.success, (_, { payload: { token } }) => token)
  .handleAction(loginActions.failure, () => initialState.token);

const logout = createReducer(initialState.token)
  .handleAction(logoutAction, () => "");


const domain = createReducer(initialState.domain)
  .handleAction(domainActions.success, (_, { payload: { domain } }) => {
    return domain
  })
  .handleAction(domainActions.failure, () => {
    return initialState.domain
  });

const logo = createReducer(initialState.logo)
  .handleAction(logoActions.success, (_, { payload: { logodata } }) => {
    return logodata ;
  })
  .handleAction(logoActions.failure, () => {
    return null;
  });


export const authServiceReducer = combineReducers({
  isAuthenticating,
  user,
  token,
  domain,
  logo,
  logout
});

/**
 * SELECTORS
 */
export const selectAuthServiceState = (state: RootState) => state.authService;
export const selectIsAuthenticating = (state: RootState) => selectAuthServiceState(state).isAuthenticating;
export const selectUser = (state: RootState) => selectAuthServiceState(state).user;
export const selectToken = (state: RootState) => selectAuthServiceState(state).token;
export const selectDomain = (state: RootState) => selectAuthServiceState(state).domain as string;
export const selectLogo = (state: RootState) => selectAuthServiceState(state).logo;

export const selectIsLoggedIn: any = createSelector(selectToken, (token) => !!token);

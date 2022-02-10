import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { authServiceReducer, logoutAction } from './services/auth';
import { isActionOf } from 'typesafe-actions';
import { CacheServiceReducer, kgmServiceReducer, presentationServiceReducer, processServiceReducer, roleServiceReducer, tabsViewReducer } from './services/process';

export default function createRootReducer(history: History) {
  const rootReducer = combineReducers({
    authService: authServiceReducer,
    roleService: roleServiceReducer,
    presentationService: presentationServiceReducer,
    cacheService: CacheServiceReducer,
    kgmService: kgmServiceReducer,
    processService: processServiceReducer,
    tabsView: tabsViewReducer,
    router: connectRouter(history),
  });

  return (state, action) =>
    isActionOf(logoutAction, action)
      ? rootReducer(state ? ({ router: state.router }) as any : undefined, action)
      : rootReducer(state, action);
}

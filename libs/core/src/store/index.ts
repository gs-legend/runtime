import { RouterAction } from 'connected-react-router';

import createRootReducer from './rootReducer';
import { AuthAction, CacheServiceAction, KgmServiceAction, PresentationServiceAction, ProcessServiceAction, RoleServiceAction } from './services';
import { AuthServiceAction } from './services/auth';

export { store } from './configureStore';

export type RootState = ReturnType<ReturnType<typeof createRootReducer>>;

type RootAction = RouterAction;

declare module 'typesafe-actions' {
  interface Types {
    RootAction: RootAction | AuthServiceAction | AuthAction | RoleServiceAction | PresentationServiceAction | CacheServiceAction | KgmServiceAction | ProcessServiceAction;
  }
}
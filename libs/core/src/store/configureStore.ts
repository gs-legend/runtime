import { applyMiddleware, createStore } from 'redux';
import { createMigrate, persistReducer, persistStore, MigrationManifest } from 'redux-persist';
import localForage from 'localforage';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'connected-react-router';
import { history } from "../helpers";
import createRootReducer from './rootReducer';
import rootSaga from './rootSaga';
import { isDev } from '../helpers';
import { Store } from '@reduxjs/toolkit';
import { RootState } from '.';
import { composeWithDevTools } from '@redux-devtools/extension';

const sagaMiddleware = createSagaMiddleware();

const migrations: MigrationManifest = {
  // Add redux migrations here
};

const persistedReducer = persistReducer(
  {
    key: 'root',
    version: 1,
    storage: localForage,
    whitelist: ['authService'],
    blacklist: ['router'],
    debug: isDev,
    migrate: createMigrate(migrations, { debug: isDev }),
  },
  createRootReducer(history)
);

const middlewares = [
  sagaMiddleware,
  routerMiddleware(history)
];

if (isDev) {
  const { createLogger } = require('redux-logger');
  const ImmutableStateInvariant = require('redux-immutable-state-invariant').default;

  middlewares.push(createLogger(), ImmutableStateInvariant());
}

const store: Store<RootState> = createStore(persistedReducer, composeWithDevTools(applyMiddleware(...middlewares)));

const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

export { store, persistor };

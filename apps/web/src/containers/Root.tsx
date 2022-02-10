import { rootPath, store, AUTH_ROUTER_PATHS } from '@kagami/core';
import { ErrorBoundary, Loader, NotFound } from '@kagami/design-system';
import { Suspense } from 'react';
import { Provider } from 'react-redux';
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { PersistGate } from 'redux-persist/lib/integration/react';
import ForgottenPassword from '../components/ForgottenPassword';
import Login from '../components/Login';
import Logout from '../components/Logout';
import RootLayout from './RootLayout/RootLayout';

function Root() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loader />}>
        <Provider store={store}>
          <PersistGate loading={<Loader />} persistor={persistor}>
            <Router>
              <Routes>
                <Route path={rootPath} element={<RootLayout />}></Route>
                <Route path={AUTH_ROUTER_PATHS.login} element={<Login />} />
                <Route path={AUTH_ROUTER_PATHS.logout} element={<Logout />} />
                <Route path={AUTH_ROUTER_PATHS.forgottenPassword} element={<ForgottenPassword />} />
                <Route path="*" element={<NotFound />} ></Route>
              </Routes>
            </Router>
          </PersistGate>
        </Provider>
      </Suspense>
    </ErrorBoundary>
  );
}

export default Root;

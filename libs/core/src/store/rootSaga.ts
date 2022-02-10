import { all, fork } from 'redux-saga/effects';
import { authSaga, kgmSaga } from './services';

export default function* rootSaga() {
  yield all([fork(authSaga), fork(kgmSaga)]);
}

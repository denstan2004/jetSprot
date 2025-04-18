import { all } from 'redux-saga/effects';
import userSaga from './user/UserSaga';

export default function* rootSaga() {
  yield all([userSaga()]);
}

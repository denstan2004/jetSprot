import { call, CallEffect, put, PutEffect, takeLatest } from 'redux-saga/effects';
import {
  fetchUserRequest,
  fetchUserSuccess,
  fetchUserFailure,
} from './UserSlice';
import { setStoredUser } from '@/store/mmkv';
import { User } from '@/types/User';

const user: User = {
    id: "123",
    password: '123456',
    username: 'john.doe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    token: '',
    refreshToken: '',
    profilePicture: '',
    rating: 0
}
// fake API call or actual one
function fetchUserApi() {
  return new Promise((resolve) =>
        setTimeout(() => resolve(user), 1000)
    );
}

function* fetchUserWorker(): Generator<CallEffect | PutEffect, void, User> {
  try {
    const user: User = yield call(fetchUserApi);
    yield put(fetchUserSuccess(user));
    yield call(setStoredUser, user);
  } catch (error) {
    if (error instanceof Error) {
      yield put(fetchUserFailure(error.message));
    } else {
      yield put(fetchUserFailure('An unknown error occurred'));
    }
  }
}

export default function* userSaga() {
  yield takeLatest(fetchUserRequest.type, fetchUserWorker);
}

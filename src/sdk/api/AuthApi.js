import Http from './HttpModel';
import { AUTH_PATH } from 'constants/apiPaths';

export default class AuthApi {
  static login({ username, password }) {
    return Http.post(`${AUTH_PATH}/login`, { username, password });
  }

  static resetPassword({ email }) {
    return Http.post(`${AUTH_PATH}/reset`, { email });
  }

  static confirmPassword({ token, password }) {
    return Http.post(`${AUTH_PATH}/confirm`, { confirm_token: token, new_password: password });
  }
}

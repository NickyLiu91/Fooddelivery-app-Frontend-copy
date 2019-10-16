import Http from './HttpModel';

export const AUTH_PATH = '/auth/email';

export default class AuthApi {
  static login({ email, password }) {
    return Http.post(`${AUTH_PATH}/login`, { email, password });
  }

  static resetPassword({ email }) {
    return Http.post(`${AUTH_PATH}/reset`, { email });
  }

  static confirmPassword({ token, password }) {
    return Http.post(`${AUTH_PATH}/confirm`, { confirm_token: token, new_password: password });
  }

  static logout() {
    return Http.post(`${AUTH_PATH}/logout`);
  }
}

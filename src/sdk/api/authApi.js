import Http from './HttpModel';

export const AUTH_PATH = '/auth/email';

export default class AuthApi {
  static login({ email, password }) {
    return Http.post(`${AUTH_PATH}/login`, { email, password });
  }

  static logout() {
    return Http.post(`${AUTH_PATH}/logout`);
  }
}

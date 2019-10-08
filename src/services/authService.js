// import jwtDecode from 'jwt-decode';

import AuthApi from 'sdk/api/authApi';
import { store } from 'reducers/store';
import { loginSuccess } from 'actions/authActions';

export default class AutService {
  static async login(email, password) {
    const response = await AuthApi.login({ email, password });
    // JWT decode token to get user data
    store.dispatch(loginSuccess(response.data.token, response.data.refresh_token));
  }

  static async logout() {
    await AuthApi.logout();
  }
}

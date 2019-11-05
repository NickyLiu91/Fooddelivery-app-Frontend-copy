import AuthApi from 'sdk/api/authApi';
import { store } from 'reducers/store';
import { loginSuccess, setUser } from 'actions/authActions';
import { UsersApi } from 'sdk/api';

export default class AutService {
  static async login({ email, password }) {
    const response = await AuthApi.login({ username: email, password });
    store.dispatch(loginSuccess(response.data.token, response.data.refresh_token));
    const { data } = await UsersApi.getSelf();
    store.dispatch(setUser(data));
    return data;
  }

  static async resetPassword(email) {
    const response = await AuthApi.resetPassword({ email });
    console.log('response', response);
  }

  static async confirmPassword({ token, password }) {
    const response = await AuthApi.confirmPassword({ token, password });
    console.log('response', response);
  }

  static async logout() {
    await AuthApi.logout();
  }
}

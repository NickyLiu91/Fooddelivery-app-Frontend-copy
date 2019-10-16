import AuthApi from 'sdk/api/authApi';
import { store } from 'reducers/store';
import { loginSuccess } from 'actions/authActions';

export default class AutService {
  static async login(data) {
    const response = await AuthApi.login(data);
    store.dispatch(loginSuccess(response.data.token, response.data.refresh_token));
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

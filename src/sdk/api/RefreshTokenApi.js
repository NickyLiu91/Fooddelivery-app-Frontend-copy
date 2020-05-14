import axios from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies

import { store } from 'reducers/store';
import { loginSuccess, logout } from 'actions/authActions';
import { HTTP } from 'constants/http';
import ENV from 'config/env';
import { notifyService } from 'services';

export const BASE_URL = ENV.REACT_APP_API_URL;

class RefreshTokenApi {
  constructor() {
    this.refreshRequest = null;
  }

  refresh = async () => {
    let refreshResponse;
    try {
      if (!this.refreshRequest) {
        this.refreshRequest = axios.post(`${BASE_URL}/security/refresh`, {
          refresh_token: store.getState().auth.refreshToken,
        });
      }
      refreshResponse = await this.refreshRequest;
      this.refreshRequest = null;
    } catch (refreshError) {
      notifyService.showError(refreshError.response
        && refreshError.response.status === HTTP.UNAUTHORIZED
        ? 'Session time is out' : 'Unknown error');
      store.dispatch(logout());
    }

    if (refreshResponse) {
      store.dispatch(loginSuccess(
        refreshResponse.data.token,
        refreshResponse.data.refresh_token,
      ));
    }
  }
}

export default new RefreshTokenApi();

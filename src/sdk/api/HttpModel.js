import axios from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import MockAdapter from 'axios-mock-adapter';

import { store } from 'reducers/store';
import { loginSuccess } from 'actions/authActions';
import { HTTP } from 'constants/http';

// TODO: setup environment
export const BASE_URL = process.env.REACT_APP_FOS_FRONTEND_BASE_URL;

// Temporary mock API
export const mock = new MockAdapter(axios, { delayResponse: 700 });
mock
  .onPost(`${BASE_URL}/auth/email/login`).replyOnce(200, {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoicm9vdCJ9.t5-3Wx56tLv-PeOdH359ojpGNlQOd40G3Z60PONOf1Q',
    refresh_token: 'xxx00a7a9e970f9bbe076e05743....',
  })
  .onPost(`${BASE_URL}/auth/email/login`).replyOnce(HTTP.UNAUTHORIZED, {
    message: 'UNAUTHORIZED',
  })
  .onPost(`${BASE_URL}/auth/email/login`)
  .replyOnce(HTTP.FORBIDDEN, {
    message: "Email doesn't exist",
  });

mock
  .onPost(`${BASE_URL}/auth/email/refresh`).reply(200, {
    token: 'new_eyJ0eXAiOiJKV1QiLCJhbG...',
    refresh_token: 'new_xxx00a7a9e970f9bbe076e05743....',
  });


class Http {
  constructor() {
    this.client = axios.create();
    this.refreshRequest = null;

    this.client.interceptors.request.use(
      (config) => {
        if (!store.getState().auth.authenticated) {
          return config;
        }

        const newConfig = {
          headers: {},
          ...config,
        };

        newConfig.headers.Authorization = `Bearer ${store.getState().auth.token}`;
        return newConfig;
      },
      e => Promise.reject(e),
    );

    this.client.interceptors.response.use(
      r => r,
      async error => {
        if (
          !store.getState().auth.authenticated
          || error.response.status !== HTTP.UNAUTHORIZED
          || error.config.retryAuth
        ) {
          throw error;
        }

        if (!this.refreshRequest) {
          this.refreshRequest = this.client.post(`${BASE_URL}/auth/email/refresh`, {
            refresh_token: store.getState().auth.refreshToken,
          });
        }

        const { data } = await this.refreshRequest;
        this.refreshRequest = null;
        store.dispatch(loginSuccess(data.token, data.refresh_token));
        const newRequest = {
          ...error.config,
          retryAuth: true,
        };

        return this.client(newRequest);
      },
    );
  }

  get(path) {
    return this.client.get(`${BASE_URL}${path}`);
  }

  post(path, payload) {
    return this.client.request({
      method: 'POST',
      url: `${BASE_URL}${path}`,
      responseType: 'json',
      data: payload,
    });
  }

  put(path, payload) {
    return this.client.request({
      method: 'PUT',
      url: `${BASE_URL}${path}`,
      responseType: 'json',
      data: payload,
    });
  }

  delete(path, payload) {
    return this.client.request({
      method: 'DELETE',
      url: `${BASE_URL}${path}`,
      responseType: 'json',
      data: payload,
    });
  }
}

export default new Http();

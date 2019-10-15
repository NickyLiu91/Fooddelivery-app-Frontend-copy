import axios from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import MockAdapter from 'axios-mock-adapter';

import { store } from 'reducers/store';
import { loginSuccess } from 'actions/authActions';
import { HTTP } from 'constants/http';
import { fakeUsersList, fakeSelectData } from './mockData';

// TODO: setup environment
export const BASE_URL = process.env.REACT_APP_FOS_FRONTEND_BASE_URL;

// Temporary mock API
export const mock = new MockAdapter(axios, { delayResponse: 700 });
mock
  .onPost(`${BASE_URL}/auth/email/login`).replyOnce(200, {
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiUk9MRV9TVVBFUl9BRE1JTiIsImp0aSI6ImZmOWQ5MzY0LWI2YmQtNDUzNC04YjY5LWM0ZTc3NDRhMzA5YSIsImlhdCI6MTU3MDcwOTUyMCwiZXhwIjoxNTcwNzEzMTIwfQ.KfUBPaKYtOoTF5lSv4kCeoYI5VkeIQ5s2vMg5PAs_yw',
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

const usersPath = `${BASE_URL}/users`;
const usersUrl = new RegExp(`${usersPath}/*`);

const usersRestaurantPath = `${BASE_URL}/restaurants`;
const usersRestaurantUrl = new RegExp(`${usersRestaurantPath}/.*/users*`);

mock
  .onGet(usersUrl).reply(200, fakeUsersList);
mock
  .onGet(usersRestaurantUrl).reply(200, fakeUsersList.slice(0, 6));

mock
  .onGet(`${BASE_URL}/restaurants`).reply(200, fakeSelectData);


class Http {
  constructor() {
    this.client = axios.create();
    this.refreshRequest = null;

    this.client.interceptors.request.use(
      (config) => {
        console.log('[API request] config:', config);
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

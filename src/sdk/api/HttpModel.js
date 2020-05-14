import axios from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies

import { store } from 'reducers/store';
import { HTTP } from 'constants/http';
import ENV from 'config/env';
import history from 'browserHistory';
import ROUTES from 'constants/routes';
// import { fakeUsersList, fakeSelectData, fakeSelfData, fakeHours } from './mockData';
import { AUTH_PATH } from 'constants/apiPaths';
import RefreshTokenApi from './RefreshTokenApi';

export const BASE_URL = ENV.REACT_APP_API_URL;

class Http {
  constructor() {
    this.client = axios.create();

    this.client.interceptors.request.use(
      (config) => {
        if (!store.getState().auth.token) {
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
        console.log('[interceptors.response] error', error.response);
        if (
          !store.getState().auth.authenticated
          || !error.response
          || error.response.status !== HTTP.UNAUTHORIZED
          || error.response.config.url === `${BASE_URL}${AUTH_PATH}/login`
          || error.response.config.url === `${BASE_URL}/security/refresh`
          || error.config.retryAuth
        ) {
          if (error.response.status === HTTP.FORBIDDEN) {
            history.replace(ROUTES.ACCESS_DENIED);
          } else if (error.response.status === HTTP.NOT_FOUND) {
            history.replace(ROUTES.NOT_FOUND);
          }
          throw error;
        }

        await RefreshTokenApi.refresh();

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

  getFile(path) {
    return this.client.request({
      method: 'GET',
      url: `${BASE_URL}${path}`,
      responseType: 'blob',
    });
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

  customRequest(path, method, responseType) {
    return this.client.request({
      method,
      url: `${BASE_URL}${path}`,
      responseType,
    });
  }
}

export default new Http();

// sockets: mock new order notification
// setInterval(async () => {
//   await axios.get('https://dev-fooddelivery-socket.jarvis.syberry.net/api/v1/orders/mock-created');
// }, 10000);

import io from 'socket.io-client';

import ENV from 'config/env';
import { store } from 'reducers/store';
import RefreshTokenApi from 'sdk/api/RefreshTokenApi';
import notifyService from './notifyService';

const SOCKET_URL = ENV.REACT_APP_SOCKET_URL;

class SocketService {
  constructor() {
    this.instance = null;
    this.isConnected = false;
  }

  connect = () => {
    console.log('[SocketService] connect');
    const { token, user } = store.getState().auth;
    if (this.instance) this.instance.disconnect();
    this.instance = io.connect(`${SOCKET_URL}/${user.restaurant.id}`, {
      query: {
        token,
      },
    });
    this.instance.on('reconnect_attempt', () => {
      console.log('socket reconnect_attempt');
      this.instance.io.opts.query = {
        token: store.getState().auth.token,
      };
      this.instance.io.opts.transports = ['polling', 'websocket'];
    });
    this.errorHandler();
  }

  setIsConnected = (value) => {
    this.isConnected = value;
  }

  errorHandler = () => {
    this.instance.on('error', async error => {
      console.log('[SocketService] error', error);
      if (error === 'jwt expired' || error === 'invalid signature') {
        await RefreshTokenApi.refresh();
      } else {
        notifyService.showError('Connection error.');
      }
    });
  }

  disconnect = (callback) => {
    this.isConnected = false;
    if (this.instance) {
      console.log('[SocketService] disconnect');
      this.instance.disconnect(callback);
      this.instance = null;
    }
  }

  subscribe = (eventName, callback) => {
    if (this.instance) {
      this.instance.on(eventName, callback);
    } else {
      console.error(`[SocketService] Can't subscribe on ${eventName}, socket instance doesn't exist`);
    }
  }

  emit = (eventName, params = {}) => {
    if (this.instance) {
      this.instance.emit(eventName, params);
    } else {
      console.error(`[SocketService] Can't emit ${eventName}, socket instance doesn't exist`);
    }
  }
}

export default new SocketService();

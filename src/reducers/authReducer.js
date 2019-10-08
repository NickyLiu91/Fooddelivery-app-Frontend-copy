import { LOGIN_SUCCESS, LOGOUT } from 'constants/actions/auth';

const initialState = {
  authenticated: false,
  token: null,
  refreshToken: null,
  user: {},
  permissions: {
    root: null,
    admin: null,
    manager: null,
  },
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        token: payload.token,
        refreshToken: payload.refreshToken,
        authenticated: true,
      };
    case LOGOUT:
      return state;
    default:
      return state;
  }
};

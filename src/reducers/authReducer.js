import { LOGIN_SUCCESS, LOGOUT, SET_USER } from 'constants/actions/auth';

const initialState = {
  authenticated: false,
  token: null,
  refreshToken: null,
  user: {
    permissions: {
      role: null,
    },
  },
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        token: payload.token,
        refreshToken: payload.refreshToken,
      };
    case SET_USER:
      return {
        ...state,
        user: {
          ...payload.user,
          restaurantId: payload.user.restaurant.id,
        },
        authenticated: true,
      };
    case LOGOUT:
      return state;
    default:
      return state;
  }
};

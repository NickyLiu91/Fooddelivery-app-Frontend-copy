import { LOGIN_SUCCESS, LOGOUT, SET_USER, SET_RESTAURANT } from 'constants/actions/auth';

const initialState = {
  authenticated: false,
  token: null,
  refreshToken: null,
  user: {
    restaurantId: null,
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
          restaurantId: payload.user.restaurant ? payload.user.restaurant.id : null,
        },
        authenticated: true,
      };
    case SET_RESTAURANT:
      return {
        ...state,
        user: {
          ...state.user,
          restaurantId: payload.id,
        },
        authenticated: true,
      };
    case LOGOUT:
      return state;
    default:
      return state;
  }
};

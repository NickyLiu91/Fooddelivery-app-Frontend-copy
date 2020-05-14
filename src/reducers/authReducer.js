import { LOGIN_SUCCESS, LOGOUT, SET_USER, SET_RESTAURANT } from 'constants/actions/auth';
import { USER_ROLES } from 'constants/auth';
import { SET_ORDERING_ALLOWED } from 'constants/actions/restaurant';

const initialState = {
  authenticated: false,
  token: null,
  refreshToken: null,
  role: null,
  user: {
    restaurant: {
      id: null,
      name: null,
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
    case SET_USER: {
      let restaurant = { id: null, name: null };
      if (payload.user && payload.user.restaurant) {
        ({ restaurant } = payload.user);
      } else if (state.user && state.user.restaurant && payload.user.role === USER_ROLES.ROOT) {
        ({ restaurant } = state.user);
      }
      return {
        ...state,
        user: {
          ...payload.user,
          restaurant,
        },
        authenticated: true,
      };
    }
    case SET_RESTAURANT:
      return {
        ...state,
        user: {
          ...state.user,
          restaurant: payload,
        },
        authenticated: true,
      };
    case SET_ORDERING_ALLOWED:
      return {
        ...state,
        user: {
          ...state.user,
          restaurant: {
            ...state.user.restaurant,
            ordering_allowed: payload.isAllowed,
          },
        },
        authenticated: true,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

import { LOGIN_SUCCESS, LOGOUT, SET_USER, SET_RESTAURANT } from 'constants/actions/auth';

export const loginSuccess = (token, refreshToken) => ({
  type: LOGIN_SUCCESS,
  payload: { token, refreshToken },
});

export const setUser = user => ({
  type: SET_USER,
  payload: { user },
});

export const logout = () => ({
  type: LOGOUT,
});

export const setRestaurant = (restaurant) => ({
  type: SET_RESTAURANT,
  payload: restaurant,
});

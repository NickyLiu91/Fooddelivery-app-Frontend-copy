import { LOGIN_SUCCESS, LOGOUT } from 'constants/actions/auth';

export const loginSuccess = (token, refreshToken) => ({
  type: LOGIN_SUCCESS,
  payload: { token, refreshToken },
});

export const logout = () => ({
  type: LOGOUT,
});

import jwtDecode from 'jwt-decode';

import { LOGIN_SUCCESS, LOGOUT } from 'constants/actions/auth';

export const loginSuccess = (token, refreshToken) => {
  const user = jwtDecode(token);
  return {
    type: LOGIN_SUCCESS,
    payload: { token, refreshToken, user },
  };
};

export const logout = () => ({
  type: LOGOUT,
});

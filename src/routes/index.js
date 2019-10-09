import ROUTES from 'constants/routes';
import { USER_ROLES } from 'constants/auth';

import Login from 'components/Login/Login';

export const defaultRoutes = {
  [USER_ROLES.ROOT]: ROUTES.RESTAURANTS_LIST,
  [USER_ROLES.ADMIN]: ROUTES.RESTAURANTS_DASHBOARD,
  [USER_ROLES.MANAGER]: ROUTES.MANAGE_ORDERS,
};

const routes = [
  {
    path: ROUTES.LOGIN,
    exact: true,
    name: 'Login',
    component: Login,
    isProtected: false,
  },
  {
    path: ROUTES.RESTAURANTS_LIST,
    exact: true,
    name: 'Restaurants List',
    component: Login,
    permissions: [USER_ROLES.ROOT],
  },
  {
    path: ROUTES.RESTAURANTS_DASHBOARD,
    exact: true,
    name: 'Restaurants Dashboard',
    component: Login,
    permissions: [USER_ROLES.ROOT, USER_ROLES.ADMIN],
  },
  {
    path: ROUTES.MANAGE_ORDERS,
    exact: true,
    name: 'Manage orders',
    component: Login,
    permissions: [USER_ROLES.ROOT, USER_ROLES.ADMIN, USER_ROLES.MANAGER],
  },
  {
    path: '/',
    exact: true,
    name: 'main',
    component: Login,
  },
];

export default routes;


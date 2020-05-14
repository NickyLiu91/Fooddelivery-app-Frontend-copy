import ROUTES from 'constants/routes';
import { USER_ROLES } from 'constants/auth';

const menu = [
  {
    label: 'Dashboard',
    path: ROUTES.RESTAURANTS,
    permissions: {
      [USER_ROLES.ROOT]: true,
    },
  },
  {
    label: 'Restaurant Profile',
    getPath: user => `${ROUTES.RESTAURANTS}/${user.restaurant.id}/edit`,
    restaurantRequired: true,
    permissions: {
      [USER_ROLES.ROOT]: true,
      [USER_ROLES.ADMIN]: true,
    },
  },
  {
    label: 'Users',
    path: ROUTES.USERS_LIST,
    permissions: {
      [USER_ROLES.ROOT]: true,
      [USER_ROLES.ADMIN]: true,
    },
  },
  {
    label: 'Restaurant Hours',
    path: ROUTES.HOURS,
    restaurantRequired: true,
    permissions: {
      [USER_ROLES.ROOT]: true,
      [USER_ROLES.ADMIN]: true,
    },
  },
  {
    label: 'Delivery Boundary',
    path: ROUTES.BOUNDARIES,
    restaurantRequired: true,
    permissions: {
      [USER_ROLES.ROOT]: true,
      [USER_ROLES.ADMIN]: true,
    },
  },
  {
    label: 'Promotions',
    path: ROUTES.PROMOTIONS,
    restaurantRequired: true,
    permissions: {
      [USER_ROLES.ROOT]: true,
      [USER_ROLES.ADMIN]: true,
    },
  },
  {
    label: 'Orders',
    path: ROUTES.ORDERS,
    exact: false,
    notifyKey: 'orders',
    restaurantRequired: true,
    permissions: {
      [USER_ROLES.ROOT]: true,
      [USER_ROLES.ADMIN]: true,
      [USER_ROLES.MANAGER]: true,
    },
  },
  {
    label: 'Messages',
    path: ROUTES.MESSAGES,
    notifyKey: 'messages',
    exact: false,
    restaurantRequired: true,
    permissions: {
      [USER_ROLES.ADMIN]: true,
      [USER_ROLES.MANAGER]: true,
    },
  },
  {
    label: 'Menu',
    path: `${ROUTES.MENU}`,
    exact: false,
    restaurantRequired: true,
    permissions: {
      [USER_ROLES.ROOT]: true,
      [USER_ROLES.ADMIN]: true,
    },
  },
  {
    label: 'Settings',
    path: ROUTES.SETTINGS,
    restaurantRequired: true,
    permissions: {
      [USER_ROLES.ROOT]: true,
      [USER_ROLES.ADMIN]: true,
      [USER_ROLES.MANAGER]: true,
    },
  },
  {
    label: 'Reviews',
    path: ROUTES.REVIEWS,
    restaurantRequired: true,
    permissions: {
      [USER_ROLES.ROOT]: true,
      [USER_ROLES.ADMIN]: true,
    },
  },
  {
    label: 'Reports',
    path: ROUTES.REPORTS,
    exact: false,
    restaurantRequired: true,
    permissions: {
      [USER_ROLES.ROOT]: true,
      [USER_ROLES.ADMIN]: true,
    },
  },
  {
    label: 'Terms and Conditions',
    path: ROUTES.EDIT_TERMS_AND_CONDITIONS,
    restaurantRequired: true,
    permissions: {
      [USER_ROLES.ROOT]: true,
    },
  },
];

export const getMenu = user => menu
  .reduce((acc, item) => {
    if (item.permissions[user.role] && !(item.restaurantRequired && !user.restaurant.id)) {
      return [
        ...acc,
        {
          ...item,
          path: item.getPath ? item.getPath(user) : item.path,
        },
      ];
    }
    return acc;
  }, []);

import PropTypes, {
  shape,
  string,
  func,
  number,
  object,
  bool,
} from 'prop-types';

export const routerLocationType = shape({
  pathname: string.isRequired,
  search: string.isRequired,
  hash: string.isRequired,
  state: object,
});

export const routerHistoryType = shape({
  action: string.isRequired,
  block: func.isRequired,
  createHref: func.isRequired,
  go: func.isRequired,
  goBack: func.isRequired,
  goForward: func.isRequired,
  listen: func.isRequired,
  length: number.isRequired,
  push: func.isRequired,
  replace: func.isRequired,
  location: routerLocationType.isRequired,
});

export const routerMatchType = shape({
  isExact: bool.isRequired,
  path: string.isRequired,
  url: string.isRequired,
  params: PropTypes.object,
});

export const authType = shape({
  authenticated: bool.isRequired,
  token: string,
  refreshToken: string,
  user: shape({
    id: number,
    email: string,
    phone: string,
    firstName: string,
    lastName: string,
    order_sound: number,
    message_sound: number,
    permission: string,
    restaurant: shape({
      id: number,
      name: string,
      address: shape({
        location: shape({
          lat: number,
          lng: number,
        }),
        timezone_id: string,
      }),
    }),
  }),
});

export const materialClassesType = object;

import { SET_ORDERING_ALLOWED } from 'constants/actions/restaurant';

export const setOrderingIsAllowed = isAllowed => ({
  type: SET_ORDERING_ALLOWED,
  payload: { isAllowed },
});


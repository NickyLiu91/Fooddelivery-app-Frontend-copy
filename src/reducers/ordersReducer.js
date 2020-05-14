import { SET_COUNT_ORDERS, SET_NEW_ORDERS_FLAG, SET_ORDERS_CHANGED_FLAG } from 'constants/actions/orders';

const initialState = {
  pending: 0,
  confirmed: 0,
  scheduled: 0,
  history: 0,
  newOrdersFlag: false,
  ordersChangedFlag: false,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_COUNT_ORDERS:
      return {
        ...state,
        pending: payload.count.pending,
        confirmed: payload.count.confirmed,
        scheduled: payload.count.scheduled,
        history: payload.count.history,
        newOrdersFlag: payload.count.pending > 0,
      };
    case SET_NEW_ORDERS_FLAG:
      return {
        ...state,
        newOrdersFlag: payload,
      };
    case SET_ORDERS_CHANGED_FLAG:
      return {
        ...state,
        ordersChangedFlag: payload,
      };
    default:
      return state;
  }
};

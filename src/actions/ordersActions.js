import {
  SET_COUNT_ORDERS,
  SET_NEW_ORDERS_FLAG,
  SET_ORDERS_CHANGED_FLAG,
} from 'constants/actions/orders';
import { notifyService } from 'services';
import { NOTIFY_KEYS } from 'constants/notifier';

export const setCountOrders = count => {
  if (count.pending === 0) {
    notifyService.hide(NOTIFY_KEYS.ORDERS);
  }

  return {
    type: SET_COUNT_ORDERS,
    payload: { count },
  };
};

export const setNewOrdersFlag = value => ({
  type: SET_NEW_ORDERS_FLAG,
  payload: value,
});

export const setOrdersChangedFlag = value => ({
  type: SET_ORDERS_CHANGED_FLAG,
  payload: value,
});

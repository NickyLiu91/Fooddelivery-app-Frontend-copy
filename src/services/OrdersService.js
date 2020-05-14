import { OrdersApi } from 'sdk/api/';
import { store } from 'reducers/store';
import notifyService from './notifyService';
import { getErrorMessage } from 'sdk/utils';
import { setCountOrders, setNewOrdersFlag } from 'actions/ordersActions';

export class OrdersService {
  static async getList(restaurantId, params) {
    const { data } = await OrdersApi.getListForRestaurant(restaurantId, params);
    return data;
  }

  static async putOrderStatus(restaurantId, orderId, order) {
    await OrdersApi.putOrderStatus(restaurantId, orderId, order);
  }

  static async postRefund(restaurantId, orderId, refund) {
    await OrdersApi.postRefund(restaurantId, orderId, refund);
  }

  static async adjustOrder(restaurantId, orderId, data) {
    await OrdersApi.adjustOrder(restaurantId, orderId, data);
  }

  static setNewOrdersFlag(value) {
    store.dispatch(setNewOrdersFlag(value));
  }

  static async getNewOrdersCount() {
    try {
      const { id } = store.getState().auth.user.restaurant;
      const params = {
        limit: 10,
        offset: 0,
        sort_by: 'plannedFor',
        tab: 'pending',
        sort_order: 'asc',
      };
      const { data } = await OrdersApi.getListForRestaurant(id, params);
      store.dispatch(setCountOrders(data.total));
    } catch (error) {
      console.log('[getNewOrdersCount] error', error);
      notifyService.showError(getErrorMessage(error));
    }
  }
}

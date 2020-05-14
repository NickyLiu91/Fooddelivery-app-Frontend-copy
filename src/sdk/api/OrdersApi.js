import { Crud } from '.';
import HttpModel from './HttpModel';
import { RESTAURANTS_PATH, ORDERS_PATH } from 'constants/apiPaths';

class OrdersApi extends Crud {
  constructor() {
    super(ORDERS_PATH);
  }

  putOrderStatus = (restaurantId, orderId, order) => HttpModel.post(`${RESTAURANTS_PATH}/${restaurantId}${ORDERS_PATH}/${orderId}/status`, order);

  postRefund = (restaurantId, orderId, refund) => HttpModel.post(`${RESTAURANTS_PATH}/${restaurantId}${ORDERS_PATH}/${orderId}/refund`, refund);

  adjustOrder = (restaurantId, orderId, data) => HttpModel.put(`${RESTAURANTS_PATH}/${restaurantId}${ORDERS_PATH}/${orderId}`, data);
}

export default new OrdersApi();

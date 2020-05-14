import HttpModel from './HttpModel';
import { formQueryString } from 'sdk/utils';
import { RESTAURANTS_PATH } from 'constants/apiPaths';

export default class Crud {
  constructor(entinty) {
    this.entity = entinty;
  }

  getList = params => HttpModel.get(`${this.entity}${formQueryString(params)}`);

  getSingle = entityId => HttpModel.get(`${this.entity}/${entityId}`);

  create = data => HttpModel.post(`${this.entity}`, data);

  update = (entityId, data) => HttpModel.put(`${this.entity}/${entityId}`, data);

  delete = entityId => HttpModel.delete(`${this.entity}/${entityId}`);

  getListForRestaurant = (restaurantId, params) => HttpModel.get(`${RESTAURANTS_PATH}/${restaurantId}${this.entity}${formQueryString(params)}`);

  getSingleForRestaurant = (restaurantId, entityId) => HttpModel.get(`${RESTAURANTS_PATH}/${restaurantId}${this.entity}/${entityId}`);

  createForRestaurant = (restaurantId, data) => HttpModel.post(`${RESTAURANTS_PATH}/${restaurantId}${this.entity}`, data);

  updateForRestaurant = (restaurantId, entityId, data) => HttpModel.put(`${RESTAURANTS_PATH}/${restaurantId}${this.entity}/${entityId}`, data);

  deleteForRestaurant = (restaurantId, entityId) => HttpModel.delete(`${RESTAURANTS_PATH}/${restaurantId}${this.entity}/${entityId}`);
}

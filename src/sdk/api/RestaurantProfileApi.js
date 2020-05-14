import { Crud } from '.';
import HttpModel from './HttpModel';
import { RESTAURANTS_PATH } from 'constants/apiPaths';

class RestaurantProfileApi extends Crud {
  constructor() {
    super(RESTAURANTS_PATH);
  }

  postQuestion = (restaurantId, data) => HttpModel.post(`${RESTAURANTS_PATH}/${restaurantId}/questions`, data);

  deleteQuestion = (restaurantId, questionId) => HttpModel.delete(`${RESTAURANTS_PATH}/${restaurantId}/questions/${questionId}`);

  putQuestion = (restaurantId, questionId, question) => HttpModel.put(`${RESTAURANTS_PATH}/${restaurantId}/questions/${questionId}`, question);

  stopTakingOrders = (id, data) => HttpModel.put(`${RESTAURANTS_PATH}/${id}/stop-ordering`, data);

  resumeTakingOrders = (id) => HttpModel.put(`${RESTAURANTS_PATH}/${id}/resume-ordering`, {});
}

export default new RestaurantProfileApi();

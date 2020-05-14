import { RestaurantProfileApi } from 'sdk/api/';

export class RestaurantProfileService {
  static async getSingleRestaurant(id) {
    const { data } = await RestaurantProfileApi.getSingle(id);
    return data;
  }

  static async addRestaurant(data) {
    await RestaurantProfileApi.create(data);
  }

  static async updateRestaurant(id, data) {
    await RestaurantProfileApi.update(id, data);
  }

  static async postQuestion(restaurantId, question) {
    await RestaurantProfileApi.postQuestion(restaurantId, question);
  }

  static async deleteQuestion(restaurantId, questionId) {
    await RestaurantProfileApi.deleteQuestion(restaurantId, questionId);
  }

  static async putQuestion(restaurantId, questionId, question) {
    await RestaurantProfileApi.putQuestion(restaurantId, questionId, question);
  }

  static async stopTakingOrders(id, name, reason) {
    await RestaurantProfileApi.stopTakingOrders(id, { employee_name: name, reason });
  }

  static async resumeTakingOrders(id) {
    await RestaurantProfileApi.resumeTakingOrders(id);
  }
}

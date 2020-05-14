import { RestaurantsListApi } from 'sdk/api/';

export class RestaurantsListService {
  static async getRestaurantsList(params) {
    const { data } = await RestaurantsListApi.getRestaurantsList(params);
    return data;
  }

  static async deleteRestaurant(id) {
    await RestaurantsListApi.delete(id);
  }
}

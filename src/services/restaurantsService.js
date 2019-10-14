import { RestaurantsApi } from 'sdk/api/';

export class RestaurantsService {
  static async getRestaurantsList() {
    const { data } = await RestaurantsApi.getList();
    return data;
  }
}

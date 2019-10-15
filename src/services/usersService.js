import { UsersApi } from 'sdk/api/';

export class UsersListService {
  static async getUsersList(sortData) {
    const { data } = await UsersApi.getList(sortData);
    return data;
  }

  static async getUsersForRestaurant(restaurantId, sortData) {
    const { data } = await UsersApi.getUsersForRestaurant(restaurantId, sortData);
    return data;
  }
}

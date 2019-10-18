import { UsersApi } from 'sdk/api/';

export class UsersService {
  static async getUsersList(sortData) {
    const { data } = await UsersApi.getList(sortData);
    return data;
  }

  static async getUsersForRestaurant(restaurantId, sortData) {
    const { data } = await UsersApi.getUsersForRestaurant(restaurantId, sortData);
    return data;
  }

  static async getSingleUser(id) {
    const { data } = await UsersApi.getSingle(id);
    return data;
  }

  static async addUser(data) {
    await UsersApi.create(data);
  }

  static async updateUser(id, data) {
    await UsersApi.update(id, data);
  }

  static async deleteUser(id) {
    await UsersApi.delete(id);
  }
}

import { UsersApi } from 'sdk/api/';

export class UsersService {
  static async getUsersList(sortData) {
    const { data } = await UsersApi.getList(sortData);
    return data;
  }

  static async getUsersForRestaurant(restaurantId, sortData) {
    const { data } = await UsersApi.getListForRestaurant(restaurantId, sortData);
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

  static async updateProfile(data) {
    const { data: response } = await UsersApi.updateProfile(data);
    return response;
  }

  static async updateSettings(id, data) {
    const { data: response } = await UsersApi.updateSettings(id, data);
    return response;
  }

  static async deleteUser(id) {
    await UsersApi.delete(id);
  }
}

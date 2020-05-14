import { HoursApi } from 'sdk/api/';

export class HoursService {
  static async getHours(restaurantId) {
    const { data } = await HoursApi.getListForRestaurant(restaurantId);
    return data;
  }

  static async updateHours(restaurantId, data) {
    await HoursApi.update(restaurantId, data);
  }
}

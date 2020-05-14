import { MenuScheduleApi } from 'sdk/api/';

export class MenuScheduleService {
  static async getSchedules(restaurantId) {
    const { data } = await MenuScheduleApi.getListForRestaurant(restaurantId);
    return data;
  }
  static async getSchedule(restaurantId, scheduleId) {
    const { data } = await MenuScheduleApi.getSingleForRestaurant(restaurantId, scheduleId);
    return data;
  }
  static async postSchedule(restaurantId, schedule) {
    const { data } = await MenuScheduleApi.createForRestaurant(restaurantId, schedule);
    return data;
  }
  static async putSchedule(restaurantId, scheduleId, schedule) {
    const { data } = await MenuScheduleApi.updateForRestaurant(restaurantId, scheduleId, schedule);
    return data;
  }
  static async deleteSchedule(restaurantId, scheduleId) {
    const { data } = await MenuScheduleApi.deleteForRestaurant(restaurantId, scheduleId);
    return data;
  }
}

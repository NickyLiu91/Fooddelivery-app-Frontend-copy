import { ReviewsApi } from 'sdk/api/';

export class ReviewsService {
  static async getList(restaurantId, params) {
    const { data } = await ReviewsApi.getListForRestaurant(restaurantId, params);
    return data;
  }
}

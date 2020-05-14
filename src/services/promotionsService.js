import { PromotionsApi } from 'sdk/api';
import { store } from 'reducers/store';

export class PromotionsService {
  static async getPromotions() {
    const { id: restaurantId } = store.getState().auth.user.restaurant;
    const { data } = await PromotionsApi.getListForRestaurant(restaurantId);
    return data;
  }

  static async getPromotion(id) {
    const { id: restaurantId } = store.getState().auth.user.restaurant;
    const { data } = await PromotionsApi.getSingleForRestaurant(restaurantId, id);
    return data;
  }

  static async createPromotion(promotion) {
    const { id: restaurantId } = store.getState().auth.user.restaurant;
    const { data } = await PromotionsApi.createForRestaurant(restaurantId, promotion);
    return data;
  }

  static async updatePromotion(id, promotion) {
    const { id: restaurantId } = store.getState().auth.user.restaurant;
    const { data } = await PromotionsApi.updateForRestaurant(restaurantId, id, promotion);
    return data;
  }

  static async deletePromotion(id) {
    const { id: restaurantId } = store.getState().auth.user.restaurant;
    const { data } = await PromotionsApi.deleteForRestaurant(restaurantId, id);
    return data;
  }
}

import { ModifiersApi } from 'sdk/api';
import { store } from 'reducers/store';

export default class ModifiersService {
  static async getModifiersList(restaurantId) {
    const { data } = await ModifiersApi.getListForRestaurant(restaurantId);
    return data;
  }

  static async getModifier(restaurantId, id) {
    const { data } = await ModifiersApi.getSingleForRestaurant(restaurantId, id);
    return data;
  }

  static async addModifier(restaurantId, modifier) {
    const { data } = await ModifiersApi.createForRestaurant(restaurantId, modifier);
    return data;
  }

  static async editModifier(restaurantId, id, modifier) {
    const { data } = await ModifiersApi.updateForRestaurant(restaurantId, id, modifier);
    return data;
  }

  static async deleteModifier(restaurantId, id) {
    const { data } = await ModifiersApi.deleteForRestaurant(restaurantId, id);
    return data;
  }

  static async getMenuItems(id) {
    const { id: restaurantId } = store.getState().auth.user.restaurant;
    const { data } = await ModifiersApi.getMenuItems(restaurantId, id);
    return data;
  }

  static async deleteMenuItems(modifierId, itemsArray) {
    const { id: restaurantId } = store.getState().auth.user.restaurant;
    const queryParams = itemsArray.map(id => `ids[]=${id}`).join('&');
    await ModifiersApi.deleteMenuItems(restaurantId, modifierId, queryParams);
  }
}

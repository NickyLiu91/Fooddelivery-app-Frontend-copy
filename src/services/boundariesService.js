import { BoundariesApi } from 'sdk/api';
import { store } from 'reducers/store';

export class BoundariesService {
  static async getBoundaries() {
    const { id } = store.getState().auth.user.restaurant;
    const { data } = await BoundariesApi.getListForRestaurant(id);
    return data.result;
  }

  static async addBoundary(boundary) {
    const { id: restaurantId } = store.getState().auth.user.restaurant;
    const { data } = await BoundariesApi.createForRestaurant(restaurantId, boundary);
    return data;
  }

  static async updateBoundary(boundary) {
    const { id: restaurantId } = store.getState().auth.user.restaurant;
    const { data } = await BoundariesApi.updateForRestaurant(restaurantId, boundary.id, boundary);
    return data;
  }

  static async deleteBoundary(boundaryId) {
    const { id: restaurantId } = store.getState().auth.user.restaurant;
    const { data } = await BoundariesApi.deleteForRestaurant(restaurantId, boundaryId);
    return data;
  }

  static async addZone(boundaryId, zone) {
    const { id: restaurantId } = store.getState().auth.user.restaurant;
    const { data } = await BoundariesApi.createZone(restaurantId, boundaryId, zone);
    return data;
  }

  static async updateZone(boundaryId, zone) {
    const { id: restaurantId } = store.getState().auth.user.restaurant;
    const { data } = await BoundariesApi.updateZone(restaurantId, boundaryId, zone);
    return data;
  }

  static async deleteZone(boundaryId, zoneId) {
    const { id: restaurantId } = store.getState().auth.user.restaurant;
    const { data } = await BoundariesApi.deleteZone(restaurantId, boundaryId, zoneId);
    return data;
  }
}

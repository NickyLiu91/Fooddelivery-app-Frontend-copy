import { LabelsApi } from 'sdk/api/';

export class LabelsService {
  static async getLabelsList(restaurantId) {
    const { data } = await LabelsApi.getListForRestaurant(restaurantId);
    return data;
  }
  static async getLabel(restaurantId, labelId) {
    const { data } = await LabelsApi.getSingleForRestaurant(restaurantId, labelId);
    return data;
  }
  static async postLabel(restaurantId, label) {
    const { data } = await LabelsApi.createForRestaurant(restaurantId, label);
    return data;
  }
  static async putLabel(restaurantId, labelId, label) {
    const { data } = await LabelsApi.updateForRestaurant(restaurantId, labelId, label);
    return data;
  }
  static async deleteLabel(restaurantId, labelId) {
    const { data } = await LabelsApi.deleteForRestaurant(restaurantId, labelId);
    return data;
  }
  static async deleteSeveralLabels(restaurantId, labelsId) {
    await LabelsApi.deleteSeveralLabels(restaurantId, labelsId);
  }
}

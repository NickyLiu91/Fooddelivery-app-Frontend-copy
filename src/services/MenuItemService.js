import { MenuSectionsApi, MenuItemsApi } from 'sdk/api/';

export class MenuItemService {
  static async getSections(restaurantId) {
    const { data } = await MenuSectionsApi.getListForRestaurant(restaurantId);
    return data;
  }
  static async postSection(restaurantId, section) {
    const { data } = await MenuSectionsApi.createForRestaurant(restaurantId, section);
    return data;
  }
  static async deleteSection(restaurantId, sectionId) {
    const { data } = await MenuSectionsApi.deleteForRestaurant(restaurantId, sectionId);
    return data;
  }
  static async putSection(restaurantId, sectionId, section) {
    const { data } = await MenuSectionsApi.updateForRestaurant(restaurantId, sectionId, section);
    return data;
  }
  static async postArrangeSections(restaurantId, sectionId, section) {
    await MenuSectionsApi.postArrangeSections(restaurantId, sectionId, section);
  }
  static async postArrangeItems(restaurantId, sectionId, idemId, newId) {
    await MenuSectionsApi.postArrangeItems(restaurantId, sectionId, idemId, newId);
  }


  static async postItem(restaurantId, item) {
    const { data } = await MenuItemsApi.createForRestaurant(restaurantId, item);
    return data;
  }
  static async putItem(restaurantId, itemId, item) {
    const { data } = await MenuItemsApi.updateForRestaurant(restaurantId, itemId, item);
    return data;
  }
  static async getItems(restaurantId, sectionId) {
    const { data } = await MenuItemsApi.getItems(restaurantId, sectionId);
    return data;
  }
  static async deleteItem(restaurantId, sectionId, itemId) {
    await MenuItemsApi.deleteItem(restaurantId, sectionId, itemId);
  }
  static async deleteSeveralItems(restaurantId, sectionId, itemsId) {
    await MenuItemsApi.deleteSeveralItems(restaurantId, sectionId, itemsId);
  }
  static async updateSeveralItems(restaurantId, sectionId, itemsId, data) {
    await MenuItemsApi.updateSeveralItems(restaurantId, sectionId, itemsId, data);
  }
  static async getItemToEdit(restaurantId, sectionId, itemId) {
    const { data } = await MenuItemsApi.getItemToEdit(restaurantId, sectionId, itemId);
    return data;
  }

  static async deleteModifier(restaurantId, itemId, modifierId) {
    await MenuItemsApi.deleteModifier(restaurantId, itemId, modifierId);
  }
  static async reorderModifier(restaurantId, itemId, modifierId, position) {
    await MenuItemsApi.reorderModifier(restaurantId, itemId, modifierId, position);
  }
  static async addModifier(restaurantId, itemId, modifierId, position) {
    await MenuItemsApi.addModifier(restaurantId, itemId, modifierId, position);
  }
}

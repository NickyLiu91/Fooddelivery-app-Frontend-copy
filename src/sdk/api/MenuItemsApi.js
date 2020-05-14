import { Crud } from '.';
import { MENU_SECTIONS_PATH, RESTAURANTS_PATH, MENU_ITEMS_PATH, MODIFIERS_PATH } from 'constants/apiPaths';
import HttpModel from './HttpModel';

class MenuItemsApi extends Crud {
  constructor() {
    super(MENU_ITEMS_PATH);
  }

  getItems = (restaurantId, sectionId) => HttpModel.get(`${RESTAURANTS_PATH}/${restaurantId}${MENU_SECTIONS_PATH}/${sectionId}${MENU_ITEMS_PATH}`);

  deleteItem = (restaurantId, sectionId, itemId) => HttpModel.delete(`${RESTAURANTS_PATH}/${restaurantId}${MENU_SECTIONS_PATH}/${sectionId}${MENU_ITEMS_PATH}/${itemId}`);

  deleteSeveralItems = (restaurantId, sectionId, itemsId) => HttpModel.delete(`${RESTAURANTS_PATH}/${restaurantId}${MENU_SECTIONS_PATH}/${sectionId}${MENU_ITEMS_PATH}?${itemsId}`);

  updateSeveralItems = (restaurantId, sectionId, itemsId, data) => HttpModel.put(`${RESTAURANTS_PATH}/${restaurantId}${MENU_SECTIONS_PATH}/${sectionId}${MENU_ITEMS_PATH}?${itemsId}`, data);

  getItemToEdit = (restaurantId, sectionId, itemId) => HttpModel.get(`${RESTAURANTS_PATH}/${restaurantId}${MENU_SECTIONS_PATH}/${sectionId}${MENU_ITEMS_PATH}/${itemId}`);

  deleteModifier = (restaurantId, itemsId, modifierId) => HttpModel.delete(`${RESTAURANTS_PATH}/${restaurantId}${MENU_ITEMS_PATH}/${itemsId}${MODIFIERS_PATH}/${modifierId}`);

  reorderModifier = (restaurantId, itemsId, modifierId, position) => HttpModel.post(`${RESTAURANTS_PATH}/${restaurantId}${MENU_ITEMS_PATH}/${itemsId}${MODIFIERS_PATH}/${modifierId}/reorder`, position);

  addModifier = (restaurantId, itemsId, modifierId, position) => HttpModel.post(`${RESTAURANTS_PATH}/${restaurantId}${MENU_ITEMS_PATH}/${itemsId}${MODIFIERS_PATH}/${modifierId}`, position);
}

export default new MenuItemsApi();

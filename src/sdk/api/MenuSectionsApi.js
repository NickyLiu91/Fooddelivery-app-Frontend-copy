import { Crud } from '.';
import { MENU_SECTIONS_PATH, RESTAURANTS_PATH, MENU_ITEMS_PATH } from 'constants/apiPaths';
import HttpModel from './HttpModel';

class MenuSectionsApi extends Crud {
  constructor() {
    super(MENU_SECTIONS_PATH);
  }

  postArrangeSections = (restaurantId, sectionId, data) => HttpModel.post(`${RESTAURANTS_PATH}/${restaurantId}${MENU_SECTIONS_PATH}/${sectionId}/reorder`, data);

  postArrangeItems = (restaurantId, sectionId, itemId, data) => HttpModel.post(`${RESTAURANTS_PATH}/${restaurantId}${MENU_SECTIONS_PATH}/${sectionId}${MENU_ITEMS_PATH}/${itemId}/reorder`, data);
}

export default new MenuSectionsApi();

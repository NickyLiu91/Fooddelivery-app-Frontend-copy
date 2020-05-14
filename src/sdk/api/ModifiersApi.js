import { Crud } from '.';
import { MODIFIERS_PATH, RESTAURANTS_PATH } from 'constants/apiPaths';
import HttpModel from './HttpModel';

class ModifiersApi extends Crud {
  constructor() {
    super(MODIFIERS_PATH);
  }

   getMenuItems = async (restaurantId, id) => HttpModel.get(`${RESTAURANTS_PATH}/${restaurantId}${MODIFIERS_PATH}/${id}/menu-items`)

   deleteMenuItems = async (restaurantId, id, queryParams) => HttpModel.delete(`${RESTAURANTS_PATH}/${restaurantId}${MODIFIERS_PATH}/${id}/menu-items?${queryParams}`)
}

export default new ModifiersApi();

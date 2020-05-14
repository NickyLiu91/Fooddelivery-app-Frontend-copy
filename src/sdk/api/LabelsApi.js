import { Crud } from '.';
import { MENU_LABELS_PATH, RESTAURANTS_PATH } from 'constants/apiPaths';
import HttpModel from './HttpModel';

class LabelsApi extends Crud {
  constructor() {
    super(MENU_LABELS_PATH);
  }

  deleteSeveralLabels = (restaurantId, labelsId) => HttpModel.delete(`${RESTAURANTS_PATH}/${restaurantId}${MENU_LABELS_PATH}?${labelsId}`);
}

export default new LabelsApi();

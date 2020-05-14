import { Crud } from '.';
import HttpModel from './HttpModel';
import { HOURS_PATH, RESTAURANTS_PATH } from 'constants/apiPaths';

class HoursApi extends Crud {
  constructor() {
    super(HOURS_PATH);
  }

  update = (restaurantId, data) => HttpModel.post(`${RESTAURANTS_PATH}/${restaurantId}${HOURS_PATH}`, data);
}

export default new HoursApi();

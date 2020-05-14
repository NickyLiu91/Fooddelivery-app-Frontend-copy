import { Crud } from '.';
import { BOUNDARIES_PATH, RESTAURANTS_PATH, ZONES_PATH } from 'constants/apiPaths';
import HttpModel from './HttpModel';

class BoundariesApi extends Crud {
  constructor() {
    super(BOUNDARIES_PATH);
  }

  createZone = (restaurantId, boundaryId, zone) =>
    HttpModel.post(`${RESTAURANTS_PATH}/${restaurantId}${BOUNDARIES_PATH}/${boundaryId}${ZONES_PATH}`, zone);

  updateZone = (restaurantId, boundaryId, zone) =>
    HttpModel.put(`${RESTAURANTS_PATH}/${restaurantId}${BOUNDARIES_PATH}/${boundaryId}${ZONES_PATH}/${zone.id}`, zone);

  deleteZone = (restaurantId, boundaryId, zoneId) =>
    HttpModel.delete(`${RESTAURANTS_PATH}/${restaurantId}${BOUNDARIES_PATH}/${boundaryId}${ZONES_PATH}/${zoneId}`);
}

export default new BoundariesApi();

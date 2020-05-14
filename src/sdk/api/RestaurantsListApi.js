import { Crud } from '.';
import HttpModel from './HttpModel';
import { formQueryString } from 'sdk/utils';
import { RESTAURANTS_PATH } from 'constants/apiPaths';

class RestaurantsListApi extends Crud {
  constructor() {
    super(RESTAURANTS_PATH);
  }

    getRestaurantsList = (params) => HttpModel.get(`${RESTAURANTS_PATH}${formQueryString(params)}`);
}

export default new RestaurantsListApi();

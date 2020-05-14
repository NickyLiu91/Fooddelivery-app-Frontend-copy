import { Crud } from '.';
import { RESTAURANTS_PATH } from 'constants/apiPaths';

class RestaurantsApi extends Crud {
  constructor() {
    super(RESTAURANTS_PATH);
  }
}

export default new RestaurantsApi();

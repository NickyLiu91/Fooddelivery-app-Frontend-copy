import { Crud } from '.';

export const RESTAURANTS_PATH = 'restaurants';

class RestaurantsApi extends Crud {
  constructor() {
    super(RESTAURANTS_PATH);
  }
}

export default new RestaurantsApi();

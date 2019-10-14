import { Crud } from '.';

export const PATH = 'restaurants';

class RestaurantsApi extends Crud {
  constructor() {
    super(PATH);
  }
}

export default new RestaurantsApi();

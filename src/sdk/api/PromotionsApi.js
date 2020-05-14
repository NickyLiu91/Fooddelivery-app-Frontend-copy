import { Crud } from '.';
import { PROMOTION_PATH } from 'constants/apiPaths';

class PromotionsApi extends Crud {
  constructor() {
    super(PROMOTION_PATH);
  }
}

export default new PromotionsApi();

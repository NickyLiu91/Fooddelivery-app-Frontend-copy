import { Crud } from '.';
import { REVIEWS_PATH } from 'constants/apiPaths';

class ReviewsApi extends Crud {
  constructor() {
    super(REVIEWS_PATH);
  }
}

export default new ReviewsApi();

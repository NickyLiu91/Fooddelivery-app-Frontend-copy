import { Crud } from '.';
import { TERMS_AND_CONDOTIONS } from 'constants/apiPaths';

class TermsAndConditions extends Crud {
  constructor() {
    super(TERMS_AND_CONDOTIONS);
  }
}

export default new TermsAndConditions();

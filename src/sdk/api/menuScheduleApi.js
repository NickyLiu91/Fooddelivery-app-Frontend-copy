import { Crud } from '.';
import { MENU_SCHEDULE_PATH } from 'constants/apiPaths';

class MenuScheduleApi extends Crud {
  constructor() {
    super(MENU_SCHEDULE_PATH);
  }
}

export default new MenuScheduleApi();

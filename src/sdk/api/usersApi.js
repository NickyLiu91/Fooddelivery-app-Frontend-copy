import { Crud } from '.';

export const USERS_PATH = 'users';

class UsersApi extends Crud {
  constructor() {
    super(USERS_PATH);
  }
}

export default new UsersApi();

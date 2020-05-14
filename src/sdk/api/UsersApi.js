import { Crud } from '.';
import HttpModel from './HttpModel';
import { USERS_PATH, PROFILE_PATH } from 'constants/apiPaths';

class UsersApi extends Crud {
  constructor() {
    super(USERS_PATH);
  }

  getSelf = () => HttpModel.get(PROFILE_PATH);

  updateProfile = data => HttpModel.post(PROFILE_PATH, data);

  updateSettings = (id, data) => HttpModel.post(`${USERS_PATH}/${id}/settings`, data)
}

export default new UsersApi();

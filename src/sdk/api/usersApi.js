import { Crud } from '.';
import HttpModel from './HttpModel';
import { RESTAURANTS_PATH } from './restaurantsApi';
import { formQueryString } from 'sdk/utils';

export const USERS_PATH = 'users';

class UsersApi extends Crud {
  constructor() {
    super(USERS_PATH);
  }

  getUsersForRestaurant = (restaurantId, params) => HttpModel.get(`/${RESTAURANTS_PATH}/${restaurantId}/${USERS_PATH}${formQueryString(params)}`);
}

export default new UsersApi();
